
import "server-only";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY belum dikonfigurasi.");
}

const gemini = new GoogleGenAI({
  apiKey,
  httpOptions: {
    timeout: 60_000,
    retryOptions: {
      attempts: 1,
    },
  },
});

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1_000;

const CAMPAIGN_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    campaignTitle: { type: "string" },
    bigIdea: { type: "string" },
    objective: { type: "string" },
    keyMessage: { type: "string" },
    contentIdeas: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          format: { type: "string" },
          description: { type: "string" },
          hook: { type: "string" },
          concept: { type: "string" },
          keyPoints: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: { type: "string" },
          },
          visualDirection: { type: "string" },
          caption: { type: "string" },
          callToAction: { type: "string" },
        },
        required: [
          "title", "format", "description", "hook", "concept", "keyPoints",
          "visualDirection", "caption", "callToAction",
        ],
        additionalProperties: false,
      },
    },
    callToAction: { type: "string" },
    claimsToVerify: {
      type: "array",
      maxItems: 6,
      items: { type: "string" },
    },
  },
  required: [
    "campaignTitle", "bigIdea", "objective", "keyMessage", "contentIdeas",
    "callToAction", "claimsToVerify",
  ],
  additionalProperties: false,
};

export type GroundedSource = {
  title: string;
  url: string;
};

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        signal.reason ??
          new DOMException("Request dibatalkan.", "AbortError")
      );
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);

    function handleAbort() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
      reject(
        signal?.reason ??
          new DOMException("Request dibatalkan.", "AbortError")
      );
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function isTemporaryError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error
      ? Number(error.status)
      : undefined;

  return (
    [408, 429, 500, 502, 503, 504].includes(status ?? 0) ||
    /\b(408|429|500|502|503|504)\b/.test(message) ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|DEADLINE_EXCEEDED|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|fetch failed|network error/i.test(
      message
    )
  );
}

export async function generateAIText(
  prompt: string,
  signal?: AbortSignal,
  useGoogleSearch = false
): Promise<{
  text: string;
  sources: GroundedSource[];
  usage: { promptTokens?: number; responseTokens?: number };
}> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      throw (
        signal.reason ??
        new DOMException("Request dibatalkan.", "AbortError")
      );
    }

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          abortSignal: signal,
          maxOutputTokens: 16_384,
          responseMimeType: "application/json",
          responseJsonSchema: CAMPAIGN_RESPONSE_SCHEMA,
          ...(useGoogleSearch && { tools: [{ googleSearch: {} }] }),
        },
      });

      if (signal?.aborted) {
        throw (
          signal.reason ??
          new DOMException("Request dibatalkan.", "AbortError")
        );
      }

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini tidak menghasilkan teks.");
      }

      const sourceMap = new Map<string, GroundedSource>();

      for (const chunk of response.candidates?.[0]?.groundingMetadata
        ?.groundingChunks ?? []) {
        const url = chunk.web?.uri;

        if (!url) continue;

        try {
          const parsedUrl = new URL(url);

          if (parsedUrl.protocol !== "https:") continue;

          sourceMap.set(url, {
            title: chunk.web?.title?.trim() || parsedUrl.hostname,
            url,
          });
        } catch {
          // Abaikan sumber yang URL-nya tidak valid.
        }
      }

      return {
        text,
        sources: [...sourceMap.values()].slice(0, 8),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount,
          responseTokens: response.usageMetadata?.candidatesTokenCount,
        },
      };
    } catch (error) {
      if (signal?.aborted) {
        throw (
          signal.reason ??
          new DOMException("Request dibatalkan.", "AbortError")
        );
      }

      console.error(
        `[Gemini] Attempt ${attempt}/${MAX_ATTEMPTS} failed.`,
        error instanceof Error ? error.message : "Unknown error"
      );

      if (
        !isTemporaryError(error) ||
        attempt === MAX_ATTEMPTS
      ) {
        throw error;
      }

      const exponentialDelay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 500);
      await wait(exponentialDelay + jitter, signal);
    }
  }

  throw new Error("Gemini gagal setelah beberapa percobaan.");
}
