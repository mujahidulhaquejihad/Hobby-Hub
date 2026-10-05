/**
 * Sprint 1: Auth over PostgreSQL (Users table).
 * Used when DATABASE_URL is set. Same API shape as authCtrl for frontend compatibility.
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, mapUserRow } = require("../database/db");
const authQueries = require("../database/queries/auth");

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

const cookieOptions = {
  httpOnly: true,
  path: "/api/refresh_token",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function sendUser(res, access_token, userRow, msg) {
  const user = mapUserRow(userRow);
  if (!user) return res.status(500).json({ msg: "Failed to map user." });
  user.password = "";
  user.password_hash = undefined;
  res.cookie("refreshtoken", createRefreshToken({ id: userRow.id }), cookieOptions);
  res.json({ msg: msg || "Success", access_token, user });
}

const authCtrlPg = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, gender } = req.body;
      const newUserName = String(username || "").toLowerCase().replace(/\s/g, "");
      if (!newUserName || !email || !password) {
        return res.status(400).json({ msg: "Username, email and password are required." });
      }
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
      }

      const existingEmail = await authQueries.findUserByEmail(email, "user");
      if (existingEmail) {
        return res.status(400).json({ msg: "This email is already registered." });
      }
      const existingUser = await authQueries.findUserByUsername(newUserName);
      if (existingUser) {
        return res.status(400).json({ msg: "This username is already taken." });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = await authQueries.createUser({
        username: newUserName,
        email,
        passwordHash,
        fullname: fullname || newUserName,
      });

      const access_token = createAccessToken({ id: newUser.id });
      sendUser(res, access_token, newUser, "Registered Successfully!");
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).json({ msg: "Username or email already taken." });
      }
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userRow = await authQueries.findUserByEmail(email, "user");
      if (!userRow) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      const isMatch = await bcrypt.compare(password, userRow.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      const access_token = createAccessToken({ id: userRow.id });
      sendUser(res, access_token, userRow, "Logged in Successfully!");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userRow = await authQueries.findUserByEmail(email, "admin");
      if (!userRow) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      const isMatch = await bcrypt.compare(password, userRow.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      const access_token = createAccessToken({ id: userRow.id });
      sendUser(res, access_token, userRow, "Logged in Successfully!");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logged out Successfully." });
  },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(400).json({ msg: "Please login again." });
      }
      const result = new Promise((resolve, reject) => {
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
      const decoded = await result;
      const user = await authQueries.findUserByIdWithFollowCounts(decoded.id);
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }
      const access_token = createAccessToken({ id: decoded.id });
      res.json({ access_token, user });
    } catch (err) {
      return res.status(400).json({ msg: "Please login again." });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userRow = await authQueries.findUserById(req.user.id);
      if (!userRow) {
        return res.status(400).json({ msg: "User not found." });
      }
      const isMatch = await bcrypt.compare(oldPassword, userRow.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: "Your password is wrong." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
        newHash,
        req.user.id,
      ]);
      res.json({ msg: "Password updated successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  registerAdmin: async (req, res) => {
    try {
      const { fullname, username, email, password, gender, role } = req.body;
      const newUserName = String(username || "").toLowerCase().replace(/\s/g, "");
      if (!newUserName || !email || !password) {
        return res.status(400).json({ msg: "Username, email and password are required." });
      }
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
      }
      const existingEmail = await authQueries.findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ msg: "This email is already registered." });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      await query(
        `INSERT INTO users (username, email, password_hash, fullname, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [newUserName, email.toLowerCase(), passwordHash, fullname || newUserName, role || "admin"]
      );
      res.json({ msg: "Admin Registered Successfully." });
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).json({ msg: "Username or email already taken." });
      }
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = authCtrlPg;
