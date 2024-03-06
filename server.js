// Import the framework
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { duffleRoutes } from './routes/duffleRoutes.js';
import dotenv from 'dotenv';
import { amadeusRoutes } from './routes/amadeusRoutes.js';

// Instantiate Fastify with logger enabled
const fastify = Fastify({
  logger: true,
});

// Initialize dotenv
dotenv.config();

// Register the fastify-cors plugin with default options
// This will enable CORS for all routes and methods
fastify.register(fastifyCors, {
  // Here you can configure specific CORS options, for example:
  origin: "*", // Allow all origins
  // or a more restrictive setting:
  // origin: "https://example.com",
});

// Register your routes
fastify.register(duffleRoutes);
fastify.register(amadeusRoutes);


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
