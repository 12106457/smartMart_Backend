async function shopIdGenerator(){
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    // Generate 3 random letters
    let shopId = "";
    for (let i = 0; i < 3; i++) {
        shopId += letters[Math.floor(Math.random() * letters.length)];
    }

    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
        shopId += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return shopId;
};

module.exports = shopIdGenerator;