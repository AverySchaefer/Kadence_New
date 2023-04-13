import nextConnect from 'next-connect';
import { compare } from 'bcryptjs';

import { serverSideHash } from '@/lib/passwordUtils';
import middleware from '@/middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
    /* Pulling information from register form as credentials */
    const credentials = {
        username: req.body.username,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        newConfirmedPassword: req.body.newConfirmedPassword,
    };

    /* Checking the validity of credentials */
    if (
        credentials.oldPassword === credentials.newPassword ||
        credentials.oldPassword === credentials.newConfirmedPassword
    ) {
        res.status(400).json({
            message:
                'Invalid input - the old and new passwords cannot be the same.',
        });
        return;
    }
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

    /* Checking if a user exists in the database with provided username */
    /* If one exists, respond with an error message */
    /* If not, create a new user and store the hashed password */
    const findExistingUser = await req.db
        .collection('Users')
        .findOne({ username: credentials.username });

    if (findExistingUser === null) {
        res.status(400).json({
            message:
                'User does not exist with this username. Cannot update password.',
        });
        return;
    }

    const enteredUsername = credentials.username;
    const newHashedPassword = await serverSideHash(credentials.newPassword);

    compare(
        credentials.oldPassword,
        findExistingUser.password,
        async (err, result) => {
            if (err) {
                res.status(401).send('Old password incorrect!');
                return;
            }
            if (result) {
                const updateResult = await req.db
                    .collection('Users')
                    .updateOne(
                        { username: enteredUsername },
                        { $set: { password: newHashedPassword } }
                    );
                if (updateResult.acknowledged === false) {
                    res.status(500).send(
                        'Request not acknowledged by database'
                    );
                } else {
                    console.log(
                        'The password has been reset properly. Log-in again!'
                    );
                    res.status(200).send();
                }
            } else {
                res.status(401).send('Old password incorrect!');
            }
        }
    );
});

export default handler;
