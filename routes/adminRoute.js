const express = require("express");
const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
const adminController = require("../controllers/adminController");
const auth = require("../middleware/adminAuth"); 

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.get("/", auth.isLogout, adminController.loadLogin);


admin_route.post("/", adminController.varifyLogin);
admin_route.get("/home", auth.isLogin , adminController.loadDashboard);
admin_route.get("/logout", auth.isLogin, adminController.logout);

admin_route.get("/dashboard", auth.isLogin, adminController.adminDashboard);

admin_route.get("/new-user", auth.isLogin, adminController.newUserLoad);
admin_route.post("/new-user", adminController.addUser);

admin_route.get("/edit-user", auth.isLogin, adminController.editUserLoad);
admin_route.post("/edit-user", auth.isLogin, adminController.updateUser);

admin_route.get("/deleteuser", auth.isLogin, adminController.deleteUser);

admin_route.get("/search", auth.isLogin, adminController.searchUser);



module.exports = admin_route;