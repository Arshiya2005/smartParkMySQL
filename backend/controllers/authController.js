import passport from "passport";
import bcrypt from "bcrypt";
import dotenv from "dotenv";


import { connection } from "../config/mySqlDb.js";
import {createRazorpayFundAccount} from "./paymentController.js"

dotenv.config();

export const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const today = new Date();
    
    if(type === "admin" && process.env.ADMIN_SECRET != req.body.secret) {
      return res.status(401).json({ error: "Unauthorised" });
    }
    
    const contact = type == "owner" ? req.body.contact : "NA";
    try {
      const [checkResult] = await connection.promise().query(
            'SELECT * FROM users WHERE username = ? AND type = ?',
            [username, type]
        );
      if (checkResult.length > 0) {
          console.log("Username already exist !! Try again.")
          return res.status(409).json({ error: "User already exists" });
      } else {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); 
        const [result] = await connection.promise().query(
            'INSERT INTO users (fname, lname, username, password, contact, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [fname, lname, username, hash, contact, type, today]
        );
        
        const [data] = await connection.promise().query(
            'SELECT * FROM users WHERE username = ? AND type = ?',
            [username, type]
        );
        
        if(type == "owner") {
          try {
            const { bank_account} = req.body;
            await createRazorpayFundAccount(data[0], bank_account);
          }catch (err) {
              console.error("Fund account creation failed, rolling back user...");
              await connection.promise().query(
                  'DELETE FROM users WHERE id = ?',
                  [data[0].id]
              );
              return res.status(500).json({ error: "Fund account creation failed" });
          }
        }
        return res.status(200).json({ message: "User registered successfully" });
      }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const login = async (req, res, next) =>  {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
          return res.status(401).json({ error: "user doesn't exist !!" });
        }
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ status: true, type : user.type});
        });
  })(req, res, next);
}

export const ensureAuthenticated = async (req, res) => {
  if (req.isAuthenticated()) {
    const { username, fname, lname, type } = req.user;
    return res.status(200).json({ username, fname, lname, type });
  }
  return res.status(401).json({ error: "Unauthorized: Please log in" });
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return next(); // user is logged in
  }
  return res.status(401).json({ error: "Unauthorized(from middleware): Please log in" });
};


export async function verify(req, username, password, done) {
    const type = req.body.type;
    try {
      const [result] = await connection.promise().query(
          'SELECT * FROM users WHERE username = ? AND type = ?',
          [username, type]
      );
      if (result.length > 0) {
        const user = result[0];
        const hash = user.password;
        bcrypt.compare(password, hash, async (err, res) => {
            if(err) {
              console.log(err.message);
              return done(err);
            }else {
              if(res) {
                  return done(null, user);
              }else {
                  return done("User Doesn't exist !! ", false, { message: "Incorrect password" });
              }
              
            }
        })
      } else {
        
          return done("User Doesn't exist !! ", false);
      }
    } catch (err) {
        return done(err);
    }
};