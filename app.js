//jshint esversion:6

require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const  userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);  // Now we can start adding users


app.get("/", function (req, res) {
    res.render("home", {});
});


app.route("/login")
    .get(function (req, res) {
        res.render("login", {});
    })
    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}, function (err, foundUser) {
            if (!err){
                if (foundUser){
                    if (foundUser.password === password) {
                        console.log("Successfully logged in!")
                        res.render("secrets");
                    } else {
                        console.log("Wrong Password");
                    }
                } else {
                    console.log("User not found!");
                }
            } else {
                console.log(err);
            }
        });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register", {});
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (!err){
                console.log("Successfully added new user.")
                res.render("secrets");
            } else {
                console.log(err);
                res.redirect("/register");
            }
        })
    });

app.route("/submit")
    .get(function (req, res) {
        res.render("submit", {});
    })
    .post(function (req, res) {
        res.redirect("/");
    });


app.get("/logout", function (req, res) {
    res.redirect("/");
});











let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

app.listen(port, function (){
    console.log("Server is listening on port: " + port)
});