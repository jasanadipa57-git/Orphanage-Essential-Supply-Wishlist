const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../config/db");

// Admin login
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Please enter username and password."
        });
    }

    const sql = "SELECT * FROM admins WHERE username = ?";

    db.query(sql, [username], async (err, results) => {

        if (err) {
            return res.status(500).json({
                error: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid username or password."
            });
        }

        const admin = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid username or password."
            });
        }

        req.session.adminId = admin.id;

        res.json({
            message: "Admin login successful!"
        });

    });

});

// Protect admin data
router.get("/data", (req, res) => {

    if (!req.session.adminId) {
        return res.status(401).json({
            error: "Please login first."
        });
    }

    const queries = [
        "SELECT * FROM donations ORDER BY id DESC",
        "SELECT * FROM sponsorships ORDER BY id DESC",
        "SELECT * FROM wishlist_items ORDER BY id DESC"
    ];

    db.query(queries[0], (err, donations) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(queries[1], (err, sponsorships) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(queries[2], (err, wishlist) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    donations,
                    sponsorships,
                    wishlist
                });
            });
        });
    });

});
// Admin Logout
router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to logout."
            });
        }

        res.json({
            message: "Logged out successfully!"
        });

    });

});
module.exports = router;