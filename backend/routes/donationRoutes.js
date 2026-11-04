const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit a donation
router.post("/", (req, res) => {
    const { donor_name, email, item_name, quantity, message } = req.body;

    if (!donor_name || !email || !item_name || !quantity || Number(quantity) <= 0) {
        return res.status(400).json({
            error: "Please fill all required fields."
        });
    }

    const sql = `
        INSERT INTO donations
        (donor_name, email, item_name, quantity, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        donor_name,
        email,
        item_name,
        Number(quantity),
        message || null
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Donation submitted successfully!"
        });
    });
});
console.log("Donation router type:", typeof router);

module.exports = router;
console.log("Donation export check:", typeof module.exports);