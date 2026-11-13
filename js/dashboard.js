document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {

    try {

        const response = await fetch("/api/admin/data");

        if (response.status === 401) {
            window.location.href = "admin.html";
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load dashboard.");
        }

        displayRecords("donations-container", data.donations);
        displayRecords("sponsorships-container", data.sponsorships);
        displayRecords("wishlist-container", data.wishlist);

    }
    catch (error) {

        console.error(error);

        document.getElementById("donations-container").textContent =
            "Unable to load donations.";

        document.getElementById("sponsorships-container").textContent =
            "Unable to load sponsorships.";

        document.getElementById("wishlist-container").textContent =
            "Unable to load wishlist.";

    }
}

function displayRecords(containerId, records) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    if (!records || records.length === 0) {
        container.textContent = "No records available.";
        return;
    }

    records.forEach(record => {

        const card = document.createElement("div");
        card.className = "supply-card";

        Object.entries(record).forEach(([key, value]) => {

            const paragraph = document.createElement("p");

            paragraph.textContent =
                `${key.replaceAll("_", " ")}: ${value ?? "N/A"}`;

            card.appendChild(paragraph);

        });

        container.appendChild(card);

    });
}
const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {

        const response = await fetch("/api/admin/logout", {
            method: "POST"
        });

        if (response.ok) {
            window.location.href = "admin.html";
        } else {
            alert("Unable to logout. Please try again.");
        }

    });
}