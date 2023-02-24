import { compare } from 'bcryptjs';
import nextConnect from 'next-connect';
import getConfig from 'next/config';
import middleware from '../../../middleware/database';
import { appendToArray } from '../../../lib/arrayUtil';

const jwt = require('jsonwebtoken');

const { serverRuntimeConfig } = getConfig();
const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const username = req.query.username;
    const { enteredPW } = req.query;

    if (!req.query.username) {
        let req = 1;
        console.log('No username sent in request', req);
        res.status(400).send('No username sent in request');
        return;
    }
    if (!req.query.enteredPW) {
        console.log('No password sent in request');
        res.status(400).send('No password sent in request');
        return;
    }

    if (true) {
    }

    const doc = await req.db.collection('Users').findOne({ username });

    if (!doc) {
        console.log('Login Unsuccessful');
        res.status(400).send(
            'Login unsuccessful, account could not be located'
        );
        return;
    }

    console.log(doc);
    console.log(username);
    console.log(enteredPW);
    compare(enteredPW, doc.password, (err, result) => {
        if (err) {
            console.log('Login Unsuccessful');
        }
        if (result) {
            console.log('Login Successful');
            const token = jwt.sign(
                { sub: doc.username },
                serverRuntimeConfig.secret,
                { expiresIn: '7d' }
            );
            console.log(token);
            res.status(200).json({
                username: doc.username,
                token,
            });
        } else {
            console.log('Login Unsuccessful');
            res.status(401).send('Login unsuccessful, password incorrect');
        }
    });
});

export default handler;
