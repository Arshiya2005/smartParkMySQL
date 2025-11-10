import arcjet, { tokenBucket, shield, detectBot,  protectSignup } from "@arcjet/node";

import "dotenv/config";//shorthand for import and config

//mode: "DRY_RUN" ->  Logs and records suspicious activity without actually blocking any requests.
//mode: "LIVE" -> Actively blocks suspicious or malicious requests (e.g. SQL injection, bots).


//if protectSignup will be written here it will check on every request (other than signup also)
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects your app from common attacks e.g. SQL injection, XSS, CSRF attacks
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      // block all bots except search engines
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        'POSTMAN'
        // see the full list at https://arcjet.com/bot-list
      ],
    }),
    // rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
});


export const ajSignup = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [],
      },
      rateLimit: {
        mode: "LIVE",
        interval: "10m",
        max: 10,
      },
    }),
  ],
});

export const protectSignupMiddleware = async (req, res, next) => {
  const email = req.body.username; // assuming username is your email

  try {
    const decision = await ajSignup.protect(req, { email: req.body.username });

    if (decision.isDenied()) {
        //console.log(decision);
      if (decision.reason.isEmail()) {
        return res.status(400).json({ error: "Invalid email", reason: decision.reason });
      } else if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Signup Attempts protectSignupMiddleware" });
      } else if (decision.reason.isBot()) {
        if (req.get("User-Agent")?.includes("Postman")) {
            return next(); // allow Postman requests during development
        }
        return res.status(403).json({ error: "Bot access denied protectSignupMiddleware" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    next();
  } catch (error) {
    console.error("protectSignupMiddleware error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};