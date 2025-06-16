import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_GROUP_ID env variables" },
      { status: 400 }
    );
  }

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/getChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId }),
    });

    const data = await resp.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: "Telegram API error", details: data },
        { status: 500 }
      );
    }

    const pinned = data.result?.pinned_message?.text || "";

    if (!pinned) {
      return NextResponse.json(
        { error: "No pinned message found" },
        { status: 404 }
      );
    }

    const lines = pinned.split("\n").filter((line) => line.trim() !== "");

    const links = [];

    lines.forEach((line) => {
      const match = line.match(/^(.*?)(https?:\/\/\S+)/);
      if (match) {
        links.push({
          label: match[1].trim() || match[2].trim(),
          url: match[2].trim(),
        });
      } else {
        const urlMatch = line.match(/(https?:\/\/\S+)/);
        if (urlMatch) {
          links.push({
            label: urlMatch[1],
            url: urlMatch[1],
          });
        }
      }
    });

    if (links.length === 0) {
      return NextResponse.json(
        { error: "No links found in pinned message", raw: pinned },
        { status: 404 }
      );
    }

    return NextResponse.json({ links }, { status: 200 });
  } catch (err) {
    console.error("ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch pinned message." },
      { status: 500 }
    );
  }
}
