export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_ID;

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/getChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId }),
    });

    const data = await resp.json();
    const pinned = data.result?.pinned_message?.text || "";

    // Split pinned message into lines
    const lines = pinned.split('\n').filter(line => line.trim() !== '');

    // Regex to find all links with optional label before it
    const links = [];

    lines.forEach(line => {
      // Try to match label + url, label is any text before url
      const match = line.match(/^(.*?)(https?:\/\/\S+)/);
      if (match) {
        links.push({
          label: match[1].trim() || match[2].trim(), // if no label, use url as label
          url: match[2].trim(),
        });
      } else {
        // If line has url only (no label), try to extract urls
        const urlMatch = line.match(/(https?:\/\/\S+)/);
        if (urlMatch) {
          links.push({
            label: urlMatch[1],
            url: urlMatch[1],
          });
        }
      }
    });

    res.status(200).json({ links });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch pinned message.' });
  }
}
