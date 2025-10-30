const express = require("express");
const {
  shopOwnerLogin,
  shopOwnerRegister,
  updatedProfileDetails,
  createCustomer,
} = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new shop owner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Shop owner registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", shopOwnerRegister);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a shop owner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 8074322007
 *               password:
 *                 type: string
 *                 example: Sai123
 *     responses:
 *       200:
 *         description: Login successful (returns JWT token)
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", shopOwnerLogin);

/**
 * @swagger
 * /auth/update/profile/{OwnerId}:
 *   put:
 *     summary: Update shop owner profile
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: OwnerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop owner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Shop owner not found
 */
router.put("/update/profile/:OwnerId", updatedProfileDetails);

/**
 * @swagger
 * /auth/customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Customer One
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 */
router.post("/customer", createCustomer);

module.exports = router;
