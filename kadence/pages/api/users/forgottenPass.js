import nextConnect from 'next-connect';
import nodemailer from 'nodemailer';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
    console.log('Sending an email to change the password.');
    /* Ensuring the request is of type POST */
    if (req.method !== 'POST') {
        return;
    }

    /* Pulling information from register form as credentials */
    const credentials = {
        email: req.body.email,
    };

    console.log(credentials);

    /* Checking if a user exists in the database with provided username */
    /* If one exists, respond with an error message */
    /* If not, create a new user and store the hashed password */
    const findExistingUser = await req.db
        .collection('Users')
        .findOne({ email: credentials.email });

    if (findExistingUser == null) {
        res.status(400).json({
            message:
                'User does not exist with this email. Cannot recover password.',
        });
        return;
    }
    const { username } = findExistingUser;
    const resetLink =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/resetPass'
            : 'https://kadenceapp.com/resetPass';
    console.log(username);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jackrosenberg17@gmail.com',
            pass: 'kzakelglsvhsijik',
        },
    });

    const mailOptions = {
        from: 'jackrosenberg17@gmail.com',
        to: credentials.email,
        subject: `Password Recovery Link for ${username}`,
        text: `Reset your Kadence password here: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
});

export default handler;
