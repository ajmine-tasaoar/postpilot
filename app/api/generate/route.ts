import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { topic, audience, tone, goal, style, length, details } =
      await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const makePrompt = (variationName: string) => `
You are an expert LinkedIn ghostwriter.

Write ONE LinkedIn post.

Variation style: ${variationName}
Target audience: ${audience}
Tone: ${tone}
Goal: ${goal}
Selected style: ${style}
Length: ${length}
Topic: ${topic}
User details: ${details}

Rules:
- Write for general LinkedIn users, not only founders
- Start with a strong hook
- Use short paragraphs
- Use natural human English
- Avoid fake statistics
- Avoid robotic AI phrases
- Avoid too many emojis
- End with a thoughtful question
- No hashtags unless necessary
- Return only the post text

Length guide:
Short = 80 to 130 words
Medium = 130 to 220 words
Long = 220 to 320 words
`;

    async function generateOnePost(title: string) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: makePrompt(title) }],
              },
            ],
          }),
        }
      );

      const data = await geminiResponse.json();

      if (!geminiResponse.ok) {
        throw new Error(data.error?.message || "Gemini API failed");
      }

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No post generated. Please try again."
      );
    }

    const [post1, post2, post3] = await Promise.all([
      generateOnePost("Clear and Professional"),
      generateOnePost("Story Driven"),
      generateOnePost("Conversation Starter"),
    ]);

    return NextResponse.json({
      posts: [
        {
          title: "Variation 1 - Clear and Professional",
          content: post1,
        },
        {
          title: "Variation 2 - Story Driven",
          content: post2,
        },
        {
          title: "Variation 3 - Conversation Starter",
          content: post3,
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error while generating posts" },
      { status: 500 }
    );
  }
}