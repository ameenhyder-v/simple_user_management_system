const mongoose = require("mongoose");
const nocache = require("nocache");

mongoose.connect("mongodb://127.0.0.1:27017/user_managmentSystem");

const express = require("express");
const app = express();
app.use(nocache());

//!for user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

app.use(express.static("public"));

//!for admin route
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute)

app.listen(4800, function(){
    console.log("server is running on http://localhost:4800");
});

