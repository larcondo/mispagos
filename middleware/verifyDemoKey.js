require('dotenv').config();

function verifyDemoKey(req, res, next) {
  const { key } = req.query;

  if (!key) return res.sendStatus(401);
  if (key !== process.env.DEMO_API_KEY) return res.sendStatus(403);

  next();
}

module.exports = verifyDemoKey;