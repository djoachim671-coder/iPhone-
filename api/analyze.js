// Vercel Serverless Function — pwoksi sekirize pou apèl Anthropic API
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY pa konfigire sou Vercel. Ale nan Settings → Environment Variables." });
  }

  try {
    const { image, mimeType, prompt } = req.body || {};
    if (!image || !prompt) {
      return res.status(400).json({ error: "Paramèt manke: image ak prompt obligatwa." });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType || "image/jpeg", data: image } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data?.error?.message || "Erè API Anthropic" });
    }

    const text = data.content?.map((c) => c.text || "").join("") || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Erè sèvè: " + (e?.message || String(e)) });
  }
}
