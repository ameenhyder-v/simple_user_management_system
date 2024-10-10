const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHashed = await bcrypt.hash(password, 10);
    return passwordHashed;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
   try {
    if (req.body.email) {
      const isExistingUser = await User.findOne({ email: req.body.email });
      if (/^\s*$/.test(req.body.name)) {
        return res.render("registration", {
          message: "invalid name",
        });
      } else {
        if (isExistingUser) {
          return res.render("registration", {
            message: "This email has already been taken",
          });
        } else {
          const hashedPassword = await securePassword(req.body.password);
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: hashedPassword,
            is_admin: 0,
          });
          const userData = await user.save();
          if (userData) {
            res.render("registration", {
              message: "your registration has succesfull.",
            });
            // console.log(userData);
          } else {
            res.render("registration", {
              message: "your registration has failed",
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const varifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("login", { message: "Incorrect Password" });
      }
    } else {
      res.render("login", { message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });

    res.render("home", { user: userData }); 
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

//user profile edit and update
const editLoad = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await User.findById(id);

    if (userData) {
      res.render("edit", { user: userData });
    } else {
      res.redirect("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.user_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mno,
        },
      }
    );
    res.redirect("/home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  varifyLogin,
  loadHome,
  userLogout,
  editLoad,
  updateProfile,
};
