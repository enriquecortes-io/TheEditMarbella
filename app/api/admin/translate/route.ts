import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang } = await req.json();

    const targets = ["es", "en", "fr", "ru"].filter(l => l !== sourceLang);
    const translations: Record<string, string> = { [sourceLang]: text };

    for (const target of targets) {
      const langNames: Record<string, string> = {
        es: "Spanish", en: "English", fr: "French", ru: "Russian"
      };

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Translate the following real estate text from ${langNames[sourceLang]} to ${langNames[target]}. Return ONLY the translation, no explanations:\n\n${text}`
          }]
        }),
      });

      const data = await response.json();
      translations[target] = data.content[0].text.trim();
    }

    return NextResponse.json({ translations });
  } catch (e) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
