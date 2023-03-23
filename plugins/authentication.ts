import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions } from "fastify";

export const authenticate: FastifyPluginCallback = (instance, opts, done) => {
    done();
};
