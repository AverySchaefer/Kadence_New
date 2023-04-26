import nextConnect from 'next-connect';
import nodemailer from 'nodemailer';
import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
    /* Pulling information from register form as credentials */
    const credentials = {
        email: req.body.email,
    };

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
    const userHexString = findExistingUser._id.toHexString();
    const resetLink =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/resetPass?id='.concat(userHexString)
            : 'https://kadenceapp.com/resetPass?id='.concat(userHexString);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kadence.app.cs407@gmail.com',
            pass: 'fksjwtywuqlwttif',
        },
    });

    const mailOptions = {
        from: 'kadence.app.cs407@gmail.com',
        to: credentials.email,
        subject: `Password Recovery Link for ${username}`,
        text: `Reset your Kadence password here: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            console.log(`Email sent: ${info.response}`);
            res.status(200).send();
        }
    });
});

export default handler;
