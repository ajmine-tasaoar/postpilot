import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { topic, audience, tone, goal, style, length, details } =
      await request.json();

    const prompt = `
You are an expert LinkedIn ghostwriter.

Generate EXACTLY 3 LinkedIn post variations.

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
- Strong hook
- Natural human writing
- Short paragraphs
- Different variation styles
- No fake statistics
- No robotic AI language
- End with thoughtful question
- Minimal emojis

FORMAT:

===POST 1===
(post)

===POST 2===
(post)

===POST 3===
(post)
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error?.message || "OpenRouter API failed",
        },
        { status: response.status }
      );
    }

    const text =
      data.choices?.[0]?.message?.content || "";

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