const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("config");
const db = require("../models/db");
const date = require("../functions/date");
/* ========================== login implementation  ======================*/
const login = async (req, res) => {
  // validated if is data undefined
  if (req.body.email === undefined || req.body.password === undefined) {
    return res.status(400).json({success: false,message: "Email Address and Password are required.",});
  }

  //get body data
  const validEmail = validate.isEmail(req.body.email);
  const emailEmpty = validate.isEmpty(req.body.email);
  const passEmpty = validate.isEmpty(req.body.password);
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  // validated data
  if (!validEmail || emailEmpty) {
    return res.status(400).json({ success: false, message: "Invalid Email Address." });
  } else if (passEmpty) {
    return res.status(400).json({ success: false, message: "Password is required." });
  }

  try {
    //check email exist
    const sql = "SELECT id, email, password, attempt_times, account_active FROM users WHERE  email = ? LIMIT 1";
    const result = await db.query(sql, [email]);

   
    // check passwords match after making sure email exist in db
    if (result[0].length > 0){
      const id =  await result[0][0].id;
      const dbPassword = await result[0][0].password;
      const attemptTimes = await  result[0][0].attempt_times + 1;
      const accountActive = result[0][0].account_active;
      const correctPassword = await bcrypt.compare(password, dbPassword);

      // check if account disabled or locked
      if(!accountActive){
        return res.status(401).json({success: false,message: "Account is disabled.",});
      }
      if(attemptTimes > 3){
        return res.status(401).json({success: false,message: "Account is locked.",});
      }
      // if password wrong increase attempt times and send 401
      if (!correctPassword){
        const sql = "UPDATE users SET attempt_times = ? WHERE id = ?"
        const increaseAttempt = await db.query(sql, [attemptTimes, id]);
        return res.status(401).json({success: false,message: "Invalid Email Address or Password.",});
      }else{
        // check if attempt times not zero then update it to zero
        if(attemptTimes !== 1){
          const sql = "UPDATE users SET attempt_times = ? WHERE id = ?"
          await db.query(sql, [0, id]);
        }
        
        //generate tokens and expiry dates
        const tokens = {
          userId: id,
          accessToken: await jwt.sign({ id },config.get("accessTokenSecret")),
          refreshToken: await jwt.sign({ id },config.get("refreshTokenSecret")),
          accessTokenExpiry: parseInt(date.nowMillis()) + 1200000, //1200000  20 mins from now
          refreshTokenExpiry: parseInt(date.nowMillis()) + 864000000, // 10 days from now
          createdAt: date.nowDate(),
          lastModifiedAt: "never modified"
        }
        //save tokens in db and send it to client with 201
        const result = await db.query("INSERT INTO  tokens set ?", tokens);
        if (result[0].affectedRows > 0) {
          return res.status(201).json({success: true,message: "User is logged in successfully!", tokens});
        }
      }
    }else{
      return res.status(401).json({success: false,message: "Invalid Email Address or Password.",});
    }

  } catch (err) {
    return res.status(500).json({success: false, message: "Internal server error occurred."});
  }
};

module.exports = login;
