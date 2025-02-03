const expressListEndpoints = require("express-list-endpoints");

const generateSwaggerSpec = (app) => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Auto-generated API Docs",
      version: "1.0.0",
      description: "Swagger-документация автоматически сгенерирована из Express маршрутов",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    apis: ['../app.js']
  };
};

module.exports = generateSwaggerSpec;
