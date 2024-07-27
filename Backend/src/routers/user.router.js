import { Router } from "express";
import bcrypt from "bcryptjs";
import { connection } from "../server.js";
import { generateTokenResponse } from "../TOKEN/Token.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import admin from "../MiddleWare/admin.mid.js";
import handler from "express-async-handler";
import { BAD_REQUEST } from "../Constants/httpStatus.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password, address, admin } = req.body;

  const isAdminBool = admin === "true" ? 1 : 0;

  try {
    let user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(name, email, hashedPassword, address, isAdminBool);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await findUserByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tokenResponse = generateTokenResponse(user);

    if (!tokenResponse || !tokenResponse.token) {
      throw new Error("Token generation failed");
    }

    res.cookie("token", tokenResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: tokenResponse.token,
      id: user.id,
      name: user.name,
      address: user.address,
      emailId: user.email,
      admin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ Status: "User not found" });
    }

    const generateToken = generateTokenResponse(user);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Karthivishva45@gmail.com",
        pass: "csqv cxin rjlf ntxx",
      },
    });

    let mailOptions = {
      from: "Karthivishva45@gmail.com",
      to: email,
      subject: "Reset your password",
      text: `http://localhost:3000/reset-password/${user.id}/${generateToken.token}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        res.json({
          id: user.id,
          token: generateToken.token,
          message: "Mail sent successfully",
        });
      }
    });
  } catch (error) {
    console.error("Error in forgot-password endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/getAll/:searchTerm?",
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    try {
      let query;
      let values;

      if (searchTerm) {
        query = "SELECT * FROM users WHERE name LIKE ?";
        values = [`%${searchTerm}%`];
      } else {
        query = "SELECT * FROM users";
      }

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Error displaying users:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.json(results);
      });
    } catch (error) {
      console.error("Error displaying users:", error);
      res.status(500).json({ error: "Server error" });
    }
  })
);

router.put(
    "/toggleBlock/:userId",
    admin,
    handler(async (req, res) => {
      const { userId } = req.params;

      const loggedInUserId = req.user.id.toString();

      if (userId === loggedInUserId) {
        return res.status(BAD_REQUEST).send("Can't block yourself!");
      } 
      
      try {
       
          const user = await findUserById(userId);
      
          if (!user) {
            return res.status(404).send("User not found");
          }
      
          const newIsBlocked = !user.isBlock;
          const query = "UPDATE users SET isBlock = ? WHERE id = ?";
          const values = [newIsBlocked, userId];
      
          connection.query(query, values, (err, results) => {
            if (err) {
              console.error("Error toggling block status:", err);
              return res.status(500).json({ error: "Server error" });
            }
      
            res.json(newIsBlocked);
          });
      } catch (error) {
        console.error("Error toggling block status:", error);
        res.status(500).json({ error: "Server error" });
      }
      
    })
  );

router.get("/getById/:userId", admin, handler(async(req,res) => {
    const { userId } = req.params;

    const user = await findUserById(userId);
    res.json(user);

}))

router.put('/update', admin, handler(async (req, res) => {
  const { id, name, email, address, isAdmin } = req.body;

  try {
    const query = 'UPDATE users SET name = ?, email = ?, address = ?, isAdmin = ?  WHERE id = ?';
    const values = [name, email, address, isAdmin , id];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ status: 'User updated successfully' });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));
  

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error("Error with token:", err);
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query = "UPDATE users SET password = ? WHERE id = ?";
      connection.query(query, [hashedPassword, id], (err, results) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.json({ status: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

async function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

async function findUserById(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

async function createUser(name, email, password, address, admin) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (name, email, password, address, isAdmin) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, address, admin],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

export default router;
