import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"]
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 15,
    }),
  ],
});

export const arcjetMiddleware = async (req, res, next) => {
   const allowedOrigins = [
    "https://x-clone-frontend.vercel.app", 
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || origin?.includes("localhost")) {
    return next();
  }
  
  try {
    const decision = await aj.protect(req);
    // If blocked:
    if (decision.isDenied()) {
      // for example if rate limit
      if (decision.reason.isRateLimit && decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      }
      return res.status(403).json({ error: "Request blocked by Arcjet" });
    }
    // allowed
    next();
  } catch (err) {
    console.error("Arcjet error:", err);
    next(); // or fail safe
  }
};
