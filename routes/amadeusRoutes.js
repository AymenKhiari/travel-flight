import { getLocations } from "../controller/amadeus.js";

export async function amadeusRoutes(fastify, options) {
  fastify.get('/amadeus', async function handler(request, reply) {
    return {
      hello: 'amadeus'
    };
  });
  fastify.get('/amadeus/geolocation', (request, reply) => getLocations(request, reply));
}


