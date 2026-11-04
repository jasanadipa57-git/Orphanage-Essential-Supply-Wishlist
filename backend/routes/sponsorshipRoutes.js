const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit birthday meal sponsorship
router.post("/", (req, res) => {

    const {
        sponsor_name,
        email,
        child_name,
        meal_date,
        meal_package,
        quantity,
        message
    } = req.body;

    // Validate required fields
    if (
        !sponsor_name ||
        !email ||
        !meal_date ||
        !meal_package ||
        !quantity ||
        Number(quantity) < 1
    ) {
        return res.status(400).json({
            error: "Please fill all required fields."
        });
    }

    const sql = `
        INSERT INTO sponsorships
        (
            sponsor_name,
            email,
            child_name,
            meal_date,
            meal_package,
            quantity,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            sponsor_name,
            email,
            child_name || null,
            meal_date,
            Number(meal_package),
            Number(quantity),
            message || null
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Unable to submit sponsorship."
                });
            }

            res.status(201).json({
                message: "Sponsorship submitted successfully!",
                id: result.insertId
            });

        }
    );

});

module.exports = router;