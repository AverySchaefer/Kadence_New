import { compare } from 'bcryptjs';
import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    let username = req.query.username;
    let enteredPW = req.query.enteredPW;

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

    let doc = await req.db.collection('Users').findOne({ username: username });

    if (doc == null) {
        console.log('Login Unsuccessful');
        res.status(400).send(
            'Login unsuccessful, account could not be located'
        );
        return;
    }

    console.log(doc);

    console.log(enteredPW);
    console.log(doc.password);

    compare(enteredPW, doc.password, function(err, result) {
        if (err) {
            console.log('Login Unsuccessful');
        }
        if (result == true) {
            console.log('Login Successful');
            res.status(200).json(doc);
            //res.status(200).send('Login Successful!');
        } else {
            console.log('Login Unsuccessful');
            res.status(401).send('Login unsuccessful, password incorrect');
        }
    });
});

export default handler;
