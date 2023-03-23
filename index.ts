require('dotenv').config();

import Fastify from 'fastify';
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { withPermitMiddleware } from './plugins/authorize';

// Create server
const server: FastifyInstance = Fastify({ logger: true });

// Mock handlers
const mockPublic = async (_req: FastifyRequest, _reply: FastifyReply) => ({ hello: 'public' });
const mockPrivate = async (_req: FastifyRequest, _reply: FastifyReply) => ({ hello: 'private' });
const authenticate = async () => ({ hello: 'authenticate' });

// Scoped private routes
const privateRoutes = async (fastify: FastifyInstance, _opts: any) => {
    // Mock authentication
    fastify.register(authenticate);

    // Add authorization middleware
    fastify.addHook('preHandler', withPermitMiddleware);

    fastify.post('/post', mockPrivate);
    fastify.put('/post', mockPrivate);
    fastify.delete('/post', mockPrivate);
    fastify.post('/comment', mockPrivate);
    fastify.put('/comment', mockPrivate);
    fastify.delete('/comment', mockPrivate);
    fastify.post('/author', mockPrivate);
    fastify.put('/author', mockPrivate);
    fastify.delete('/author', mockPrivate);
};

// Scoped public routes
const publicRoutes = async (fastify: FastifyInstance, _opts: any) => {
    fastify.get('/post', mockPublic);
    fastify.get('/comment', mockPublic);
    fastify.get('/author', mockPublic);
}

// Register scoped routes
server.register(privateRoutes);
server.register(publicRoutes);

// Start server
(async () => {
    try { await server.listen({ port: 3000 }); } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
