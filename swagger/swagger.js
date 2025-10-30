const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SmartMart API Documentation",
      version: "1.0.0",
      description: "This is the API documentation for the SmartMart backend project.",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local Dev" },
      { url: "https://smart-mart-backend.vercel.app", description: "Staging" },
    ],
    tags: [
      { name: "Authentication", description: "Auth & User Management" },
      { name: "Shop", description: "Shop Management APIs" },
      { name: "Orders", description: "Order Management APIs" },
      { name: "Notifications", description: "Notifications APIs" },
      { name: "Customer", description: "Customer related APIs" },
      { name: "FAQ", description: "Frequently Asked Questions" },
      { name: "Mail", description: "Email related APIs" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Use: Authorization: Bearer <token>
        },
      },
    },
    // Do NOT apply security globally if you only want it for specific routes
  },
  // Relative paths from project root
  apis: [
    "./routes/*.js",
    "./routes/customerApplicationRoute/*.js",
  ],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
