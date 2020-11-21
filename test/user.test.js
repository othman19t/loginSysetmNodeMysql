const request = require('supertest'); // npm i supertest --save-dev

const app = require("../app");
const db = require("../src/models/db")


// user data to insert
const user = {
    first_name: "othma",
    last_name: "othma",
    email: "othman19t@gmail.com ",
    password: "$2b$10$h06669BFNyz1ZAp9NEmNP.cm/m7oUI012FA53WsOeYzJ/u9Zrtx9C", // password is the password
    date_of_birth: "othman",
    gender: "male",
    account_active: true,
    attempt_times: 0,
    profile_img: "male__img",
    created_at: "now",
    last_modified_at: "never",
    user_position: "",
    user_status: "",
  };

const userOne = {
    firstName: " othma ",
    lastName: " othma ",
    email: " othman4@gmail.com ",
    password: " password ",
    confirmPassword: " password ",
    gender: " male ",
    dateOfBirth:" othman "
}

beforeEach(async()=>{
    await db.query("DELETE FROM users WHERE id > 0 ");
    await db.query("INSERT INTO  users set ?", user);
})

// just to lett you know that this exit if you need it!!
afterEach(()=>{
    console.log("afterEach");
})

test("Sign Up", async () =>{
    await request(app).post("/user/signup").send(userOne).expect(201);
})
test("Log In", async () =>{
    await request(app).post("/user/login").send({email: "othman19t@gmail.com", password: "password"}).expect(201)
})

test("Me", async () =>{
    await request(app).get("/user/me").set({"x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcsImlhdCI6MTYwNTkyMTc1OH0.bTDju5-JaA8jyn_I3lO5ktlwrwEua9Aqa4ehdoKZihs", "x-access-token-expiry": "1605922958956"}).send().expect(200)
})