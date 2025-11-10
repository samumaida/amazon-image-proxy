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
    const match = html.match(/<meta property="og:image" content="(.*?)"/);

    return res.status(200).json({
      image: match ? match[1] : null
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
