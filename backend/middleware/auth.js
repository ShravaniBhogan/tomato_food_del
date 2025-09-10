import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
  console.log("Headers:", req.headers);   // 👀 check what arrives

  let token = req.headers["authorization"];  
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    token = token.split(" ")[1];
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;   // better than mutating body
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying token" });
  }
};


export default authMiddleware;