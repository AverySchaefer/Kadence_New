import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const { username } = req.query;
    const { enteredPW } = req.query;

    if (req.query.username == null) {
        console.log('No username sent in request');
        res.status(400).send();
        return;
    }
    if (req.query.enteredPW == null) {
        console.log('No password sent in request');
        res.status(400).send();
        return;
    }

    const doc = await req.db.collection('Users').findOne({ username });

    if (doc == null) {
        console.log('Login Unsuccessful');
        res.status(400).send(
            'Login unsuccessful, account could not be located'
        );
        return;
    }

    console.log(doc);

    if (enteredPW === doc.password) {
        console.log('Login Successful');
        res.status(200).json(doc);
    } else {
        console.log('Login Unsuccessful');
        res.status(401).send('Login unsuccessful, password incorrect');
    }
});

export default handler;
