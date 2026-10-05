const jwt = require('jsonwebtoken');

const usePg = !!process.env.DATABASE_URL;
const Users = usePg ? null : require('../models/userModel');
const authQueries = usePg ? require('../database/queries/auth') : null;
const mapUserRow = usePg ? require('../database/db').mapUserRow : null;

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(400).json({ msg: 'You are not authorized' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(400).json({ msg: 'You are not authorized' });
    }

    if (usePg && authQueries) {
      const userRow = await authQueries.findUserById(decoded.id);
      if (!userRow) {
        return res.status(400).json({ msg: 'User not found.' });
      }
      const user = mapUserRow(userRow);
      user.id = userRow.id;
      req.user = user;
    } else {
      const user = await Users.findOne({ _id: decoded.id });
      if (!user) {
        return res.status(400).json({ msg: 'User not found.' });
      }
      req.user = user;
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
