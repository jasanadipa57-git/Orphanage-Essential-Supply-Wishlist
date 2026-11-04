const express = require("express");
const path = require("path");
const session = require("express-session");

const db = require("./config/db");

const wishlistRoutes = require("./routes/wishlistRoutes");
const donationRoutes = require("./routes/donationRoutes");
const sponsorshipRoutes = require("./routes/sponsorshipRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin session
app.use(session({
    secret: process.env.SESSION_SECRET || "orphanage-demo-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}));

// Serve website files
app.use(express.static(path.join(__dirname, "..")));

// API routes
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);
app.use("/api/admin", adminRoutes);

// Test backend
app.get("/api/test", (req, res) => {
    res.json({
        message: "Orphanage Website Backend is Working!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});