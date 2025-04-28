import jwt from "jsonwebtoken"

const requireAuth = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded JWT in middleware:", decoded)
    req.user = decoded
    next()
  } catch (err) {
    console.error("Auth error:", err)
    res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}

export default requireAuth
