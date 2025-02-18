function generateOrderId() {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return Number(`${timestamp}${randomNum}`); // Concatenate and return as a number
}

module.exports = generateOrderId;