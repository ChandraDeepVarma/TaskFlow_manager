import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let users = [];
let userId = 1;

export const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exist." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = { id: userId++, name, email, password: hashedPassword, role };
  users.push(newUser);

  const userResponse = { ...newUser };
  delete userResponse.password;

  res
    .status(201)
    .json({ message: "Signup was Successful", user: userResponse });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email == email);

  if (!user) {
    return res.status(401).json({ message: "Invalid Email/Password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json("Invalid Email/Password");
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secretKey", {
    expiresIn: "1h",
  });

  const userResponse = { ...user };
  delete userResponse.password;

  res.json({ message: "Login Successful", token, user: userResponse });
};
