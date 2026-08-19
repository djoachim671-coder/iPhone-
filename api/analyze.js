// Vercel Serverless Function — pwoksi sekirize pou apèl OpenAI API
// Kle API a rete SEKRÈ nan sèvè a, li pa janm vizib nan navigatè kliyan an.
// Chemen: POST /api/analyze

export default async function handler(req, res) {
  // Sèlman POST otorize
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS — pèmèt sit ou a rele fonksyon sa a
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY pa konfigire sou Vercel. Ale nan Settings → Environment Variables." });
  }

  try {
    const { image, mimeType, prompt } = req.body || {};
    if (!image || !prompt) {
      return res.status(400).json({ error: "Paramèt manke: image ak prompt obligatwa." });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1200,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${image}` } },
          ],
        }],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: data?.error?.message || "Erè API OpenAI" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Erè sèvè: " + (e?.message || String(e)) });
  }
}
