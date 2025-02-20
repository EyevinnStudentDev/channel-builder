import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // Folder for API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Next Swagger API',
        version: '1.0'
      },
      components: {},
      security: []
    }
  });
  console.log('Spec was created:', JSON.stringify(spec, null, 2));
  return spec;
};
