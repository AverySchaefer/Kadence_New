import { hash } from 'bcryptjs';
import nextConnect from 'next-connect';
import getConfig from 'next/config';
import Password from '../../../lib/passwordStrength';
import middleware from '../../../middleware/database';

const jwt = require('jsonwebtoken');

const { serverRuntimeConfig } = getConfig();
const handler = nextConnect();
handler.use(middleware);

async function hashPassword(password) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
}

/* Add password strength algorithm here */
async function verifyPasswordStrength(password) {
    return Password.isStrong(password);
}

handler.post(async (req, res) => {
    console.log('Now, signing the user up!');

    /* Pulling information from register form as credentials */
    const credentials = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmedPassword: req.body.confirmedPassword,
    };

    console.log(credentials);

    /* Checking the validity of credentials */
    if (!credentials.email || !credentials.password) {
        res.status(400).send('Invalid input - the email or password is blank.');
        return;
    }
    if (
        !credentials.confirmedPassword ||
        credentials.confirmedPassword !== credentials.password
    ) {
        res.status(400).send('Invalid input - the passwords do not match.');
        return;
    }
    if (!credentials.email.includes('@')) {
        res.status(400).send('Invalid input - the email is not valid.');
        return;
    }
    if (!verifyPasswordStrength(credentials.password)) {
        res.status(400).send(
            'Invalid input - please enter a stronger password.'
        );
        return;
    }

    /* Checking if a user exists in the database with provided username */
    /* If one exists, respond with an error message */
    /* If not, create a new user and store the hashed password */
    const findExistingUser = await req.db
        .collection('Users')
        .findOne({ username: credentials.username });

    const findExistingEmail = await req.db
        .collection('Users')
        .findOne({ email: credentials.email });

    if (findExistingUser !== null) {
        res.status(400).send(
            'User already exists with this username. Try another.'
        );
    } else if (findExistingEmail !== null) {
        res.status(400).send(
            'User already exists under this email address. Try another.'
        );
    } else {
        const enteredUsername = credentials.username;
        const enteredEmail = credentials.email;
        const hashedPassword = await hashPassword(credentials.password);

        /* INSERT NEW USER WITH HASHED PASSWORD HERE */
        const doc = {
            username: enteredUsername,
            email: enteredEmail,
            password: hashedPassword,
            bio: '',
            profilePic: null,
            private: true,
            devices: null,
            musicPlatforms: null,
            musicPrefs: null,
            waitToSave: true,
            intervalShort: 0,
            intervalLong: 100,
            rampUpTime: 0,
            rampDownTime: 100,
            mood: '',
            zipCode: 0,
            friendRequests: [],
            friends: [],
            actions: [],
        };

        console.log(doc);

        const result = await req.db.collection('Users').insertOne(doc);
        // res.json(doc);
        if (result.acknowledged === false) {
            console.log('Request not acknowledged by database');
            res.status(500).send('Request not acknowledged by database');
        } else {
            console.log(
                `A document with the ID: ${result.insertedId} has been added`
            );
            const token = jwt.sign(
                { sub: doc.username },
                serverRuntimeConfig.secret,
                { expiresIn: '7d' }
            );
            res.status(200).json({ token });
        }
    }
});

export default handler;
