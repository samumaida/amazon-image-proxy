import fetch from "node-fetch";

export default async function handler(req, res) {
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing url" });
  }

  // Scarica la pagina HTML del prodotto
  const response = await fetch(productUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await response.text();

  // Estrae la URL dell'immagine OG
  const match = html.match(/<meta property="og:image" content="(.*?)"/);

  if (match && match[1]) {
    return res.status(200).json({ image: match[1] });
  }

  return res.status(404).json({ error: "Image not found" });
}
