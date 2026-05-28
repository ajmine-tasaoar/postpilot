import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { topic, audience, tone, goal, style, length, details } =
      await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert LinkedIn ghostwriter.

Generate EXACTLY 3 different LinkedIn posts.

TOPIC:
${topic}

AUDIENCE:
${audience}

TONE:
${tone}

GOAL:
${goal}

STYLE:
${style}

LENGTH:
${length}

DETAILS:
${details}

RULES:
- Each variation should feel different
- Strong hook
- Natural human writing
- Short readable paragraphs
- No fake statistics
- No robotic AI phrases
- End with thoughtful engagement question
- Minimal emojis
- No hashtags unless necessary

FORMAT STRICTLY LIKE THIS:

===POST 1===
(post here)

===POST 2===
(post here)

===POST 3===
(post here)
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message || "Gemini API failed",
        },
        { status: geminiResponse.status }
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const splitPosts = text.split("===POST");

    const posts = splitPosts
      .slice(1)
      .map((section: string, index: number) => {
        const cleaned = section
          .replace(`${index + 1}===`, "")
          .trim();

        return {
          title: `Variation ${index + 1}`,
          content: cleaned,
        };
      });

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Server error while generating posts",
      },
      { status: 500 }
    );
  }
}