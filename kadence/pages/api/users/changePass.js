import { hash } from 'bcryptjs';
import Password from '../../../lib/passwordStrength';
import nextConnect from 'next-connect';
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
  console.log("Updating the new password")
  /* Ensuring the request is of type POST */
  if (req.method !== 'POST') { return; }

  /* Pulling information from register form as credentials */
  const credentials = {
    username: req.body.username,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    newConfirmedPassword: req.body.newConfirmedPassword,
  };

  console.log(credentials);

  /* Checking the validity of credentials */
  if (credentials.oldPassword == credentials.newPassword || credentials.oldPassword == credentials.newConfirmedPassword) {
    res.status(400).json({message: 'Invalid input - the old and new passwords cannot be the same.'})
    return;
  } else if (!credentials.newConfirmedPassword || !credentials.newPassword) {
    res.status(400).json({message: 'Invalid input - the password(s) are blank.'})
    return;
  } else if (credentials.newConfirmedPassword !== credentials.newPassword) {
    res.status(400).json({message: 'Invalid input - the passwords do not match.'})
    return;
  } else if (!verifyPasswordStrength(credentials.newPassword)) {
    res.status(400).json({message: 'Invalid input - please enter a stronger password.'})
    return;
  }

  /* Checking if a user exists in the database with provided username */
  /* If one exists, respond with an error message */
  /* If not, create a new user and store the hashed password */
  const findExistingUser = await req.db
        .collection('Users')
        .findOne({username: credentials.username});

  if (findExistingUser == null) {
    res.status(400).json({message: 'User does not exist with this username. Cannot update password.'})
    return;
  } else {
    const enteredUsername = credentials.username;
    const newHashedPassword = await hashPassword(credentials.newPassword);

    const result = await req.db.collection('Users').updateOne({username: enteredUsername}, {$set: {password: newHashedPassword}});
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else {
        console.log('The password has been updated properly. Log-in again!');
        res.status(200).send();
    }
  }
});

export default handler;