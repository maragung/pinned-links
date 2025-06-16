export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_ID;

  const chatRes = await fetch(
    `https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`
  );
  const chatData = await chatRes.json();
  const pinnedMsg = chatData?.result?.pinned_message;

  if (!pinnedMsg?.text) {
    return Response.json({ links: [], error: 'No pinned message text found' });
  }

  const text = pinnedMsg.text;

  const regex = /([^\n]*?)\s+(https?:\/\/[^\s]+)/g;
  const links = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const label = match[1].trim();
    const url = match[2].trim();
    if (label && url) links.push({ label, url });
  }

  return Response.json({ links });
}
