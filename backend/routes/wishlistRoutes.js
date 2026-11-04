const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all wishlist items
router.get("/", (req, res) => {
    const sql = "SELECT * FROM wishlist_items";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Add a new wishlist item
router.post("/", (req, res) => {
    const { item_name, description, quantity } = req.body;

    if (!item_name || !quantity || Number(quantity) <= 0) {
        return res.status(400).json({
            error: "Please provide an item name and a valid quantity."
        });
    }

    const sql = `
        INSERT INTO wishlist_items (item_name, description, quantity)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [item_name, description || null, Number(quantity)], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Wishlist item added successfully!",
            id: result.insertId
        });
    });
});

module.exports = router;