import swaggerJsDoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web Apps Assignment REST API',
      version: '1.0.0',
      description: 'REST server including authentication using JWT',
    },
    servers: [{ url: 'http://localhost:8080' }, { url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // NOTE: your project keeps routers under `src/router/**`.
  // Keeping `src/routes/*.ts` too in case you add that folder later.
  apis: ['./src/routes/*.ts', './src/router/**/*.router.ts'],
};

export default swaggerJsDoc(options);

