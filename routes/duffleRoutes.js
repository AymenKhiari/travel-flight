import { createUniqueDestinationOfferRequest } from "../controller/duffle.js";

export async function duffleRoutes(fastify, options) {
  fastify.get('/', async function handler(request, reply) {
    return {
      hello: 'world'
    };
  });
  fastify.post('/duffle', (request, reply) => createUniqueDestinationOfferRequest(request, reply));
}