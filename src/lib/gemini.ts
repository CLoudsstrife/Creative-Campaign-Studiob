
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY belum dikonfigurasi.");
}

const gemini = new GoogleGenAI({ apiKey });

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAIText(prompt: string): Promise<string> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini tidak menghasilkan teks.");
      }

      return text;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      const isTemporaryError =
        /\b(503|429|500|502|504)\b/.test(message) ||
        /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|DEADLINE_EXCEEDED/i.test(
          message
        );

      if (!isTemporaryError || attempt === maxAttempts) {
        throw error;
      }

      // Jeda 2 detik, lalu 4 detik sebelum percobaan berikutnya.
      await wait(2000 * 2 ** (attempt - 1));
    }
  }

  throw new Error("Gemini gagal setelah beberapa percobaan.");
}
