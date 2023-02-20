const expressJwt = require('express-jwt');
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = expressJwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            // Public routes that don't require authentication
            '/api/users/login'
        ]
    });

    return util.promisify(middleware)(req, res);
}