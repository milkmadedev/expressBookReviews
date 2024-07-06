const express = require('express');
const session = require('express-session');
const { regd_users } = require('./router/auth_users.js');
const { general } = require('./router/general.js');

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer", regd_users);
app.use("/", general);

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running"));