"use server";

import OpenAI from "openai";
import { requireAdmin } from "@/lib/auth/session";

export type AiAssistResult = {
  ok: boolean;
  message?: string;
  issues?: string[];
  suggestions?: string[];
  titleAlternatives?: string[];
};

export async function aiAssistAction(input: {
  title: string;
  excerpt: string;
  body: string;
  verdict: string;
  pros: string;
  cons: string;
}): Promise<AiAssistResult> {
  try {
    await requireAdmin();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        message:
          "OPENAI_API_KEY is not configured. Add it to your environment variables.",
      };
    }

    const client = new OpenAI({ apiKey });

    const prompt = `You are a product review editor. Analyze this product review draft and give structured feedback.

Title: ${input.title}
Excerpt: ${input.excerpt}
Verdict: ${input.verdict}
Pros: ${input.pros}
Cons: ${input.cons}
Body (first 1500 chars): ${input.body.slice(0, 1500)}

Respond with a JSON object with exactly these keys:
- issues: array of strings — things missing or wrong (e.g., "No verdict", "Pros list is empty", "Body is too short")
- suggestions: array of strings — specific improvement tips (max 5)
- titleAlternatives: array of 3 alternative title rewrites that are more SEO-friendly or compelling

Return only valid JSON, no markdown code blocks.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 600,
      temperature: 0.4,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      issues?: unknown;
      suggestions?: unknown;
      titleAlternatives?: unknown;
    };

    return {
      ok: true,
      issues: Array.isArray(parsed.issues)
        ? (parsed.issues as string[])
        : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? (parsed.suggestions as string[])
        : [],
      titleAlternatives: Array.isArray(parsed.titleAlternatives)
        ? (parsed.titleAlternatives as string[])
        : [],
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "AI check failed. Try again." };
  }
}
