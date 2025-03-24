const jsonwebtoken = require("jsonwebtoken");
function TokenGenerator(phone) {
    // Generate JWT token
        const token = jsonwebtoken.sign(
            { phone: phone }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" } // Token expires in 7 days
        );
    return token
}

module.exports = TokenGenerator;