// swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const API_PREFIX = process.env.VITE_API_BASE_URL;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "here",
      version: "1.0.0",
      description: "here API documentation",
    },
    servers: [
      {
        url: API_PREFIX,
        description: "here API Base URL",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./server/swagger/**/*.js"], // Adjust to your route file structure
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
