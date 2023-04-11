import { compare, hash } from 'bcryptjs';
import nextConnect from 'next-connect';
import Password from '../../../lib/passwordStrength';
import middleware from '../../../middleware/database';

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
    console.log('Updating the new password');
    /* Ensuring the request is of type POST */
    if (req.method !== 'POST') {
        return;
    }

    /* Pulling information from register form as credentials */
    const credentials = {
        id: req.body.id,
        username: req.body.username,
        newPassword: req.body.newPassword,
        newConfirmedPassword: req.body.newConfirmedPassword,
    };

    console.log(credentials);

    /* Checking the validity of credentials */
    if (!credentials.newConfirmedPassword || !credentials.newPassword) {
        res.status(400).json({
            message: 'Invalid input - the password(s) are blank.',
        });
        return;
    }
    if (credentials.newConfirmedPassword !== credentials.newPassword) {
        res.status(400).json({
            message: 'Invalid input - the passwords do not match.',
        });
        return;
    }
    if (!verifyPasswordStrength(credentials.newPassword)) {
        res.status(400).json({
            message: 'Invalid input - please enter a stronger password.',
        });
        return;
    }

    /* Checking if a user exists in the database with provided username */
    /* If one exists, respond with an error message */
    /* If not, create a new user and store the hashed password */
    const findExistingUser = await req.db
        .collection('Users')
        .findOne({ username: credentials.username });

    if (findExistingUser == null) {
        res.status(400).json({
            message:
                'User does not exist with this username. Cannot update password.',
        });
        return;
    }
    if (credentials.id !== findExistingUser._id.toHexString()) {
        res.status(403).json({
            message:
                'Cannot update password for this user. Permission not granted.',
        });
        return;
    }
    const enteredUsername = credentials.username;
    const newHashedPassword = await hashPassword(credentials.newPassword);

    compare(
        credentials.newPassword,
        findExistingUser.password,
        async (err, result) => {
            if (err) {
                console.log('Error during old password comparison.');
            }
            if (result === false) {
                const updateResult = await req.db
                    .collection('Users')
                    .updateOne(
                        { username: enteredUsername },
                        { $set: { password: newHashedPassword } }
                    );
                if (updateResult.acknowledged === false) {
                    console.log('Request not acknowledged by database');
                    res.status(500).send();
                } else {
                    console.log(
                        'The password has been reset properly. Log-in again!'
                    );
                    res.status(200).send();
                }
            } else {
                console.log('User inputted old password. Try a new one!');
                res.status(401).send('User inputted old password.');
            }
        }
    );
});

export default handler;
