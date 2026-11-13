const loginForm = document.getElementById("admin-login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData(loginForm);

    const data = Object.fromEntries(formData.entries());

    try {

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok) {
            loginMessage.textContent =
                result.error || "Login failed.";
            return;
        }

        loginMessage.textContent = result.message;

        window.location.href = "dashboard.html";

    }
    catch(error) {

        loginMessage.textContent =
            "Unable to connect to server.";

    }

});