import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Golden Drop E-Commerce API",
      version: "1.0.0",
      description:
        "Backend API documentation for the Golden Drop E-Commerce Platform",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
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

  apis: [
    "./src/modules/**/*.ts",
  ],
});