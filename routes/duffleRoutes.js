import { createUniqueDestinationOfferRequest } from "../controller/duffle.js";

export async function duffleRoutes(fastify, options) {
  fastify.get('/duffle', async function handler(request, reply) {
    return {
      hello: 'duffle'
    };
  });
  fastify.post('/duffle/search', (request, reply) => createUniqueDestinationOfferRequest(request, reply));
}


