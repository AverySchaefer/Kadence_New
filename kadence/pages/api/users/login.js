import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const username = req.query.username;
    const enteredPW = req.query.enteredPW;
    console.log(username, enteredPW);

    if (!username) {
        console.log('No username sent in request');
        res.status(400).send('No username sent in request');
        return;
    }
    if (!enteredPW) {
        console.log('No password sent in request');
        res.status(400).send('No password sent in request');
        return;
    }

    res.json({ yay: 'You did it!' });
    return;

    let doc = await req.db.collection('Users').findOne({ username: username });

    if (doc == null) {
        console.log('Login Unsuccessful');
        res.status(400).send(
            'Login unsuccessful, account could not be located'
        );
        return;
    }

    if (enteredPW == doc.body.password) {
        console.log('Login Successful');
        res.status(200).send('Login Successful!');
    } else {
        console.log('Login Unsuccessful');
        res.status(401).send('Login unsuccessful, password incorrect');
    }
});

export default handler;
