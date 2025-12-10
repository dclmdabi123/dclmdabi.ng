function showRegister() {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
}

function register() {
    let user = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("regEmail").value,
        phone: document.getElementById("phone").value
    };

    // Send user info to backend server
    fetch("https://your-backend.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        alert("Verification code sent to your email!");
        document.getElementById("registerBox").classList.add("hidden");
        document.getElementById("verifyBox").classList.remove("hidden");
    })
    .catch(err => alert("Error connecting to server."));
}

function verifyCode() {
    let code = document.getElementById("verifyCode").value;

    fetch("https://your-backend.com/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Account verified! You may now log in.");
            showLogin();
            document.getElementById("verifyBox").classList.add("hidden");
        } else {
            alert("Invalid code, try again.");
        }
    });
}

function login() {
    alert("Login logic goes here (backend required).");
}


const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

let savedCode = null;

app.post("/register", async (req, res) => {
    const { email } = req.body;

    // generate 6-digit code
    savedCode = Math.floor(100000 + Math.random() * 900000);

    // nodemailer
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-app-password"
        }
    });

    await transporter.sendMail({
        to: email,
        subject: "Your Verification Code",
        text: `Your code is: ${savedCode}`
    });

    res.json({ success: true });
});

app.post("/verify", (req, res) => {
    if (parseInt(req.body.code) === savedCode) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => console.log("Server running"));
