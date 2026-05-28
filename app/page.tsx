"use client";

import React, { useState } from "react";

const audiences = [
  "Job seeker",
  "Student",
  "Freelancer",
  "Founder",
  "Creator",
  "Corporate professional",
  "Career switcher",
  "Small business owner",
  "General networking",
];

const tones = [
  "Professional",
  "Friendly",
  "Inspirational",
  "Confident",
  "Storytelling",
  "Casual",
  "Educational",
];

const goals = [
  "Get more connections",
  "Build personal brand",
  "Share a lesson",
  "Announce achievement",
  "Ask for advice",
  "Find job opportunities",
  "Promote service",
  "Start a discussion",
];

const styles = [
  "Balanced",
  "Viral hook",
  "Storytelling",
  "Recruiter-friendly",
  "Thought leadership",
  "Short and clean",
];

const lengths = ["Short", "Medium", "Long"];

type GeneratedPost = {
  title: string;
  content: string;
};

export default function Home() {
  const [topic, setTopic] = useState("How to build better LinkedIn connections");
  const [audience, setAudience] = useState("Job seeker");
  const [tone, setTone] = useState("Professional");
  const [goal, setGoal] = useState("Get more connections");
  const [style, setStyle] = useState("Balanced");
  const [length, setLength] = useState("Medium");
  const [details, setDetails] = useState("I want to share useful thoughts and connect with professionals in my field.");
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy post");

  const selectedPost = posts[selectedPostIndex]?.content || "";

  async function generatePost() {
    setLoading(true);
    setError("");
    setPosts([]);
    setSelectedPostIndex(0);
    setCopyLabel("Copy post");
  
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          audience,
          tone,
          goal,
          style,
          length,
          details,
        }),
      });
  
      const text = await response.text();
  
      console.log("RAW API RESPONSE:", text);
  
      let data;
  
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("API did not return valid JSON. Check terminal.");
      }
  
      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }
  
      if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        setPosts(data.posts);
        setSelectedPostIndex(0);
        return;
      }
  
      if (data.post) {
        setPosts([
          {
            title: "Generated LinkedIn Post",
            content: data.post,
          },
        ]);
        setSelectedPostIndex(0);
        return;
      }
  
      throw new Error("API returned no posts.");
    } catch (err: any) {
      console.error("GENERATE ERROR:", err);
      setError(err.message || "Failed to generate post");
    } finally {
      setLoading(false);
    }
  }

  async function copyPost() {
    if (!selectedPost) return;
    await navigator.clipboard.writeText(selectedPost);
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy post"), 1600);
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white">
              P
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">PostPilot</h1>
              <p className="text-sm text-slate-500">LinkedIn growth writing assistant</p>
            </div>
          </div>

          <button className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
            Try Free
          </button>
        </nav>

        <div className="grid gap-10 py-14 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              AI LinkedIn writing for everyday professionals
            </div>

            <h2 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-7xl">
              Write LinkedIn posts that create better opportunities.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Generate polished LinkedIn posts for networking, job search, personal branding, achievements, lessons, and professional growth.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Feature title="3 variations" text="Choose the best draft." />
              <Feature title="Style modes" text="Viral, story, career." />
              <Feature title="Copy ready" text="Post in seconds." />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="mb-6">
              <h3 className="text-2xl font-black">Create your post</h3>
              <p className="mt-1 text-slate-500">Fill the fields. Gemini will generate 3 drafts.</p>
            </div>

            <div className="grid gap-4">
              <Input label="Post topic" value={topic} setValue={setTopic} placeholder="Example: What I learned from my first internship" />

              <div className="grid gap-4 md:grid-cols-3">
                <Select label="Audience" value={audience} setValue={setAudience} options={audiences} />
                <Select label="Tone" value={tone} setValue={setTone} options={tones} />
                <Select label="Goal" value={goal} setValue={setGoal} options={goals} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Post style" value={style} setValue={setStyle} options={styles} />
                <Select label="Length" value={length} setValue={setLength} options={lengths} />
              </div>

              <Textarea label="Your details" value={details} setValue={setDetails} placeholder="Write your story, achievement, lesson, opinion, or context." />

              <button
                onClick={generatePost}
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-6 py-4 font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Generating 3 posts..." : posts.length ? "Regenerate Posts" : "Generate LinkedIn Posts"}
              </button>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 pb-16 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-black">Post variations</h3>
            <p className="mt-1 text-sm text-slate-500">Generate first, then choose the version you like.</p>

            <div className="mt-5 space-y-3">
              {loading && <LoadingCard />}
              {!loading && posts.length === 0 && (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                  Your 3 generated post options will appear here.
                </div>
              )}

              {posts.map((post, index) => (
                <button
                  key={post.title}
                  onClick={() => setSelectedPostIndex(index)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    selectedPostIndex === index
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <p className="font-black text-slate-950">{post.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{post.content.length} characters</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-black">Generated post</h3>
                <p className="text-sm text-slate-500">
                  {selectedPost ? `${selectedPost.length} characters` : "Your selected result will appear here"}
                </p>
              </div>

              <button
                onClick={copyPost}
                disabled={!selectedPost}
                className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {copyLabel}
              </button>
            </div>

            <div className="min-h-[420px] whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-5 leading-8 text-slate-800">
              {loading
                ? "Gemini is writing your posts..."
                : selectedPost || "Your LinkedIn post will appear here after you click Generate."}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, setValue, placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Textarea({ label, value, setValue, placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({ label, value, setValue, options }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
