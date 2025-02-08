const jsonwebtoken = require("jsonwebtoken");
function verifyToken(req, res, next) {
  try {
      const authHeader = req.headers.authorization;

      // Check if Authorization header is present
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).send({ status:false,message: "Access denied. No token provided." });
      }

      // Extract token
      const token = authHeader.split(" ")[1];

      // Verify token
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              return res.status(403).send({status:false, message: "Invalid or expired token." });
          }

          req.shopOwner = decoded; // Attach decoded token data to request
          next();
      });
  } catch (error) {
      console.error("Error in verifyToken middleware:", error);
      res.status(500).send({status:false, message: "Something went wrong with authentication." });
  }
}

module.exports = verifyToken;