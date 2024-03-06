import { createUniqueDestinationOfferRequest } from "../controller/duffle.js";

export async function duffleRoutes(fastify, options) {
  fastify.get('/defful', async function handler(request, reply) {
    return {
      hello: 'duffle'
    };
  });
  fastify.post('/search', (request, reply) => createUniqueDestinationOfferRequest(request, reply));
}


