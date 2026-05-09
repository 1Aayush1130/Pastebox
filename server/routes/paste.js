const express = require('express');
const router = express.Router();
const File = require('../models/File');

// This route handles short link redirects (for direct link sharing)
// @GET /api/paste/:shortCode
router.get('/:shortCode', async (req, res) => {
  try {
    const file = await File.findOne({ shortCode: req.params.shortCode });
    if (!file) return res.status(404).json({ error: 'File not found or link expired' });
    if (file.expiresAt && new Date() > file.expiresAt)
      return res.status(410).json({ error: 'This link has expired' });

    // Redirect to client share page
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/share/${file.shortCode}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
