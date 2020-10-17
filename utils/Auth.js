const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { SECRET } = require("../config");
const User = require("../models/User");

/**
 * @DESC To register the user(ADMIN,SUPER_ADMIN,USER)
 */

const userRegister = async (userDets, role, res) => {
  try {
    //  validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res
        .status(400)
        .json({ message: "Username already exists!", success: false });
    }
    // validate the email
    let emailNotTaken = await validateEmail(userDets.email);
    if (!emailNotTaken) {
      return res
        .status(400)
        .json({ message: "Email already registered!", success: false });
    }

    // check password length
    if (userDets.password.length < 6) {
      return res.status(400).json({
        message: "Password length must be greater than 6 digits!",
        success: false,
      });
    }

    //   hash the password
    const hashedpassword = await bcrypt.hash(userDets.password, 10);

    // create new user
    const newUser = new User({
      ...userDets,
      password: hashedpassword,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: `New ${role} created`,
      success: true,
    });
  } catch (err) {
    //   logger function (winston,morgan)
    return res
      .status(500)
      .json({ message: "Unable to create account!", success: false });
  }
};

/**
 * @DESC To login the users(ADMIN,SUPER_ADMIN,USER)
 */

const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  // check username is in db
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Username not found .Invalid login Credentials!" });
  }

  //   if user found
  if (role != user.role) {
    return res
      .status(403)
      .json({ message: "Please make sure you are login from right portal." });
  }

  // check for password
  bcrypt.compare(password, user.password).then((isMatched) => {
    if (isMatched) {
      const token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        SECRET,
        { expiresIn: "7 days" }
      );

      let result = {
        username: user.username,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168,
      };
      return res.status(200).json({
        ...result,
        message: "Sucessfully logged in",
        success: true,
      });
    } else {
      res.status(403).json({ message: "Invalid Password!", success: false });
    }
  });
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */

const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Serialize user
 */

const serializeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Check User role
 */
const checkRole = (role) => (req, res, next) => {
  if (role.includes(req.user.role)) {
    next();
  } else {
    res.status(500).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

module.exports = {
  checkRole,
  serializeUser,
  userAuth,
  userRegister,
  userLogin,
};
