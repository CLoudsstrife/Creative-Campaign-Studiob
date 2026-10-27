
import "server-only";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY belum dikonfigurasi.");
}

const gemini = new GoogleGenAI({
  apiKey,
  httpOptions: {
    timeout: 30_000,
  },
});

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1_000;

function wait(
  ms: number,
  signal?: AbortSignal
): Promise<void> {
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

    signal?.addEventListener("abort", handleAbort, {
      once: true,
    });
  });
}

function isTemporaryError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  return (
    /\b(429|500|502|503|504)\b/.test(message) ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|DEADLINE_EXCEEDED/i.test(
      message
    )
  );
}

export async function generateAIText(
  prompt: string,
  signal?: AbortSignal
): Promise<string> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (signal?.aborted) {
      throw (
        signal.reason ??
        new DOMException("Request dibatalkan.", "AbortError")
      );
    }

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          abortSignal: signal,
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

      return text;
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

      await wait(RETRY_DELAY_MS, signal);
    }
  }

  throw new Error("Gemini gagal setelah beberapa percobaan.");
}
