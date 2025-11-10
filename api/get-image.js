const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  try {
    const productUrl = req.query.url;

    if (!productUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Scarica l’HTML della pagina Amazon
    const response = await fetch(productUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // Estrazione dell’immagine dal tag Open Graph
    const match = html.match(/<meta property="og:image" content="(.*?)"/);

    return res.status(200).json({
      image: match ? match[1] : null
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
