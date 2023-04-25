import { compare } from 'bcryptjs';
import nextConnect from 'next-connect';
import getConfig from 'next/config';
import middleware from '@/middleware/database';

const jwt = require('jsonwebtoken');

const { serverRuntimeConfig } = getConfig();
const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const { username, enteredPW } = req.query;

    if (!req.query.username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }
    if (!req.query.enteredPW) {
        console.log('No password sent in request');
        res.status(400).send('No password sent in request');
        return;
    }

    const doc = await req.db.collection('Users').findOne({ username });

    if (!doc) {
        console.log('Login Unsuccessful');
        res.status(400).send(
            'Login unsuccessful, account could not be located'
        );
        return;
    }

    compare(enteredPW, doc.password, (err, result) => {
        if (err) {
            console.log('Login Unsuccessful');
            res.status(401).send('Login Unsuccessful');
            return;
        }
        if (result) {
            console.log('Login Successful');
            const token = jwt.sign(
                { sub: doc.username },
                serverRuntimeConfig.secret,
                { expiresIn: '7d' }
            );
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
