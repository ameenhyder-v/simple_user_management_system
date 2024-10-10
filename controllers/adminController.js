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

const loadLogin = async (req, res) => {
  try {
    return res.render("login");
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

      if (!passwordMatch) {
        return res.render("login", { message: "Incorrect Password!" });
      } else {
        if (userData.is_admin === 0) {
          return res.render("login", { message: "Admin Not-Found!" });
        } else {
          req.session.user_id = userData._id;
          return res.redirect("/admin/home");
        }
      }
    } else {
      return res.render("login", { message: "User Not-Found!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    return res.render("home", { admin: userData });
  } catch (error) {
    console.log("error from loadDashboard: " + error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const adminDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 });
    res.render("dashboard", { Users: usersData });
  } catch (error) {
    console.log("error from adminDashboard route" + error.message);
  }
};

const newUserLoad = async (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log("error from nweUserLoad  " + error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mno = req.body.mno;
    const password = req.body.password;

    const secPassword = await securePassword(password);

    const user = new User({
      name: name,
      email: email,
      mobile: mno,
      password: secPassword,
    });
    const userData = await user.save();

    if (userData) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "Something went wrong!!" });
    }
  } catch (error) {
    console.log("error from the addUser admin fn  " + error.message);
  }
};

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (!userData) {
      return res.redirect("/admin/ashboard");
    } else {
      return res.render("edit-user", { user: userData });
    }
  } catch (error) {
    console.log("error from the editUserLoad  " + error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mno,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log("Error from updateuser  :  " + error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log("error from delete user :  " + error.message);
  }
};

const searchUser = async (req, res) => {
  try {
    let users = [];
    if (req.query.search) {
      users = await User.find({
        name: { $regex: req.query.search, $options: "i" },
      });
    } else {
      users = await User.find();
    }
    res.render("dashboard", { Users: users });
  } catch (error) {
    console.log("error from search user :  " + error.message);
  }
};

module.exports = {
  loadLogin,
  varifyLogin,
  loadDashboard,
  logout,
  adminDashboard,
  newUserLoad,
  addUser,
  editUserLoad,
  updateUser,
  deleteUser,
  searchUser,
};
