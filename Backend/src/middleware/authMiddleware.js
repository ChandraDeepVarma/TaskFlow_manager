import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header:", authHeader); // 👀 debug

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretKey", (error, decoded) => {
    if (error) {
      console.error("JWT Error:", error.message); // 👀 see exact reason

      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = decoded;
    next();
  });
}
