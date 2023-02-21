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
  console.log("Posting the new password")
  /* Ensuring the request is of type POST */
  if (req.method !== 'POST') { return; }

  /* Pulling information from register form as credentials */
  const credentials = {
    email: req.body.email,
    username: req.body.username,
    newPassword: req.body.newPassword,
    newConfirmedPassword: req.body.newConfirmedPassword,
  };

  console.log(credentials);

  /* Checking the validity of credentials */
  if (!credentials.newConfirmedPassword || !credentials.newPassword) {
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

  if ((findExistingUser == null)) {
    res.status(400).json({message: 'User does not exist with this username. Cannot update password.'})
    return;
  } else {
     const enteredUsername = credentials.username;
     const enteredEmail = credentials.email;
     const hashedPassword = await hashPassword(credentials.password);

     /* INSERT NEW USER WITH HASHED PASSWORD HERE */
     const doc = {
      uid: generateUserID(enteredUsername),
      username: enteredUsername,
      email: enteredEmail,
      password: hashedPassword,
      bio: "",
      profilePic: null,
      private: true,
      devices: [],
      selectedDevice: null,
      musicPlatforms: [],
      selectedMusic: null,
      musicPrefs: [],
      waitToSave: true,
      intervalShort: 0,
      intervalLong: 100,
      rampUpTime: 0,
      rampDownTime: 100,
      mood: "",
      zipCode: 0,
      friendRequests: [],
      friends: [],
      actions: [],
    };

    console.log(doc);

    const result = await req.db.collection('Users').insertOne(doc);
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else {
        console.log('A document with the ID: ${result.insertedID} has been added');
        res.status(200).send();
    }
  }
});

export default handler;