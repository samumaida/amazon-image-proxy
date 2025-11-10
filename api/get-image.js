export const config = {
  runtime: "nodejs"
};

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const productUrl = req.query.url;

    if (!productUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const response = await fetch(productUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html = await response.text();

    let image = null;

    // 1) og:image
    let match = html.match(/<meta property="og:image" content="(.*?)"/);
    if (match) image = match[1];

    // 2) data-old-hires
    if (!image) {
      match = html.match(/"data-old-hires"\s*:\s*"([^"]+)"/);
      if (match) image = match[1];
    }

    // 3) hiRes
    if (!image) {
      match = html.match(/"hiRes":"(.*?)"/);
      if (match) image = match[1];
    }

    return res.status(200).json({ image });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
