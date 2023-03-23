import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { Permit } from 'permitio';

// Initialize Permit SDK with token from the .env file
const permit = new Permit({
  token: process.env.PERMIT_SDK_TOKEN,
  pdp: 'https://cloudpdp.api.permit.io'
});

export const withPermitMiddleware = async (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const { headers: { user = '' }, body: attributes, routerPath, method: action } = req;

  // Take user from the header, in a real world scenario this would be a JWT token
  const identity = (Array.isArray(user) ? user[0] : user);

  // Split the path to get the resource type
  const type = routerPath.split('/')[1]

  // Build the resource object. If the request body is empty, we only need the type
  const resource = attributes ? { type, attributes } : type;

  // Check if the user is allowed to perform the action on the resource
  const allowed = await permit.check(identity, action.toLowerCase(), resource);

  // If the user is not allowed, return a 403
  if (!allowed) {
    reply.code(403).send({ error: 'Forbidden' });
  }
};
