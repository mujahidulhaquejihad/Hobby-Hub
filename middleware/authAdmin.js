const Users = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        // req.user is added by the 'auth' middleware which runs first
        const user = await Users.findOne({ _id: req.user.id });

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ msg: "Admin resources access denied." });
        }

        next();
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = authAdmin;
