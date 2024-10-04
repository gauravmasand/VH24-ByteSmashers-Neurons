const express = require('express');
const { faceAuth, fingerAuth } = require('../controllers/specificalauth');
const router = express.Router();

router.post('/authenticate/face/:userId', async (req, res) => {
  try {
    const token = await faceAuth(req.params.userId);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/authenticate/finger/:userId', async (req, res) => {
  try {
    const token = await fingerAuth(req.params.userId);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
