import express from "express";
import helmet from "helmet";//Helps secure your Express app by setting various HTTP headers.
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session"
import passport from "passport";
import { Strategy } from "passport-local";
import http from 'http';
import { Server } from 'socket.io';
import Razorpay from "razorpay";


import customerRoutes from "./routes/customerRoutes.js"; 
import ownerRoutes from "./routes/ownerRoutes.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import usersRoutes from "./routes/usersRoutes.js"; 
import adminRoutes from "./routes/adminRoutes.js"; 
import payment from "./routes/paymentRoutes.js"; 

import { initDb } from "./config/mySqlDb.js";
import { aj  } from "./lib/arcjet.js";

import { verify } from "./controllers/authController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000


app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend
  credentials: true                // Allow cookies/session to be included
}));//cors ensures that only requests from your frontend (localhost:5173) are allowed.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());app.use(helmet());
app.use(morgan("dev")); // logs requests

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
        
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }
    // check for spoofed bots (pretend to be like browsers or users)
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }
    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,//this will store 'session' locally not on db(if stored on db then can retrieve even when we restart server)
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

//this should come only after session
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/customer", customerRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/", authRoutes);
app.use("/api/", usersRoutes);
app.use("/api/", payment);
/**
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
 */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials:true
  }
});

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

app.get("/", (req, res) => {
  res.send("Welcome to home page !!")
})
//passReqToCallback: true ensures that req is passed as the first parameter to your verify function.
passport.use("local", new Strategy({ 
    usernameField: 'username', 
    passwordField: 'password', 
    passReqToCallback: true 
  }, 
  verify));


passport.serializeUser((user, cb) => {
  const safeUser = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    type: user.type,
  };
  cb(null, { user: safeUser });
});

passport.deserializeUser((wrapped, cb) => {
  cb(null, wrapped.user);
});

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is running on " + PORT);
      import('./shedulers/payout.js');//This line executes the bookingStatus.js file at startup
      import('./shedulers/ownerTasks.js');
      import('./shedulers/notifications.js');
    });
  })
  .catch(() => {
    console.log("Server not started !");
  });



export { io, razorpay };
