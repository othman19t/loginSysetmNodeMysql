const validate = require("validator");
const bcrypt = require("bcrypt");

const db = require("../models/db");
const date = require("../functions/date");

/* ========================== SingUp implementation  ======================*/
const singUp = async (req, res) => {
  /* ========================== Validations  ======================*/
  // check if values are undefined
  if (req.body.firstName === undefined || req.body.lastName === undefined) {
    return res.status(400).json({
      success: false,
      message: "First Name and Last name are required.",
    });
  }

  if (
    req.body.email === undefined ||
    req.body.password === undefined ||
    req.body.confirmPassword === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Email Address, Password and Confirm Password  are required.",
    });
  }

  if (req.body.dateOfBirth === undefined || req.body.gender === undefined) {
    return res.status(400).json({
      success: false,
      message: "Gender and Date Of Birth are required.",
    });
  }
  // trim data and assign to variables
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const confirmPassword = req.body.confirmPassword.trim();
  const dateOfBirth = req.body.dateOfBirth.trim();
  const gender = req.body.gender.trim();

  // check if value empty and if passwords match and email if valid
  const emptyFirstName = validate.isEmpty(firstName);
  const emptyLastName = validate.isEmpty(lastName);
  const emptyEmail = validate.isEmpty(email);
  const emptyPassword = validate.isEmpty(password);
  const emptyConfirmPassword = validate.isEmpty(confirmPassword);
  const emptyDateOdBirth = validate.isEmpty(dateOfBirth);
  const emptyGender = validate.isEmpty(gender);

  const validEmail = validate.isEmail(email);
  const passwordsMatch = validate.equals(password, confirmPassword);

  if (emptyFirstName || emptyLastName) {
    return res.status(400).json({
      success: false,
      message: "First Name and Last name are required.",
    });
  }

  if (emptyEmail || emptyPassword || emptyConfirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Email Address, Password and Confirm Password  are required.",
    });
  }
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email Address.",
    });
  }
  if (!passwordsMatch) {
    return res.status(400).json({
      success: false,
      message: "Passwords don't match.",
    });
  }

  if (emptyDateOdBirth || emptyGender) {
    return res.status(400).json({
      success: false,
      message: "Gender and Date Of Birth are required.",
    });
  }
  // TODO: do all the following
  //hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const now = date.nowDate();
  const profileImg = gender + "_img";
  const never = "never modified";
  // check if email address exist in db
  try {
    const result = await db.query(
      "SELECT email FROM users WHERE email =" + db.escape(email) + "LIMIT 1"
    );
    if (result[0].length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email Address already in used.",
      });
    } else if (result[0].length === 0) {
      // user data to insert
      const user = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        date_of_birth: dateOfBirth,
        gender,
        account_active: true,
        attempt_times: 0,
        profile_img: profileImg,
        created_at: now,
        last_modified_at: never,
        user_position: "",
        user_status: "",
      };
      // log result[0] to see info about query result
      const result = await db.query("INSERT INTO  users set ?", user);
      if (result[0].affectedRows > 0) {
        return res.status(201).json({
          success: true,
          message: "Account successfully created.",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Internal server error occurred.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred.",
    });
  }
};

module.exports = singUp;
