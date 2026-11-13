// ==========================================
// 1. ESSENTIAL SUPPLY SELECTION
// ==========================================

function selectSupply(item, price, inputId, maximum) {

    const quantityInput = document.getElementById(inputId);
    const result = document.getElementById("supply-result");

    if (!quantityInput || !result) {
        return;
    }

    const quantity = Number(quantityInput.value);

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > maximum
    ) {
        result.textContent =
            `Please enter a quantity between 1 and ${maximum}.`;
        return;
    }

    const total = quantity * price;

    result.textContent =
        `${quantity} ${item} selected. Estimated total: ₹${total}.`;
}


// ==========================================
// 2. BIRTHDAY MEAL PRICE CALCULATION
// ==========================================

const mealPackage = document.getElementById("meal-package");
const mealGuests = document.getElementById("meal-guests");
const mealTotal = document.getElementById("meal-total");

function updateMealTotal() {

    if (!mealPackage || !mealGuests || !mealTotal) {
        return;
    }

    const price = Number(mealPackage.value);
    const guests = Number(mealGuests.value);

    if (
        !mealPackage.value ||
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > 500
    ) {
        mealTotal.textContent = "₹0";
        return;
    }

    const total = price * guests;

    mealTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;
}

if (mealPackage && mealGuests) {

    mealPackage.addEventListener("change", updateMealTotal);

    mealGuests.addEventListener("input", updateMealTotal);
}


// ==========================================
// 3. DONATION AND SPONSORSHIP FORM SUBMISSION
// ==========================================

document.querySelectorAll("form").forEach((form) => {

    form.addEventListener("submit", async function (event) {

        const donorName =
            form.querySelector('[name="donor_name"]');

        const sponsorName =
            form.querySelector('[name="sponsor_name"]');

        let apiUrl = "";

        if (donorName) {
            apiUrl = "/api/donations";
        }
        else if (sponsorName) {
            apiUrl = "/api/sponsorships";
        }
        else {
            return;
        }

        event.preventDefault();

        const formData = new FormData(form);

        const data = Object.fromEntries(formData.entries());

        try {

            const response = await fetch(apiUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            if (!response.ok) {

                alert(result.error || "Something went wrong.");

                return;
            }

            alert(result.message);

            form.reset();

        }
        catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");

        }

    });

});


// ==========================================
// 4. LOAD WISHLIST ITEMS FROM MYSQL
// ==========================================

async function loadWishlist() {

    const wishlistContainer =
        document.getElementById("supply-container");

    if (!wishlistContainer) {
        return;
    }

    try {

        const response = await fetch("/api/wishlist");

        if (!response.ok) {
            throw new Error("Unable to load wishlist.");
        }

        const items = await response.json();

        wishlistContainer.innerHTML = "";

        if (items.length === 0) {

            wishlistContainer.textContent =
                "No wishlist items available.";

            return;
        }

        items.forEach((item) => {

            const card = document.createElement("div");

            card.className = "wishlist-card";

            const heading = document.createElement("h3");
            heading.textContent = item.item_name;

            const description = document.createElement("p");
            description.textContent = item.description || "";

            const quantity = document.createElement("p");
            quantity.textContent =
                `Quantity needed: ${item.quantity}`;

            card.appendChild(heading);
            card.appendChild(description);
            card.appendChild(quantity);

            wishlistContainer.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);

        wishlistContainer.textContent =
            "Unable to load wishlist items.";

    }
}


// ==========================================
// 5. INITIALIZE WISHLIST
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadWishlist();

});