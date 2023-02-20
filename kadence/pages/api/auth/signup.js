import hash from 'bcryptjs';
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

/* User ID Generation algorithm */
/* The User ID will be based on the inputted username */
async function generateUserID(username) {
  return 0;
}

handler.post(async (req, res) => {
  console.log("Now, signing the user up!")
  /* Ensuring the request is of type POST */
  if (req.method !== 'POST') { return; }

  /* Pulling information from register form as credentials */
  const credentials = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
  };

  console.log(credentials);

  /* Checking the validity of credentials */
  if (!email || !password) {
    res.status(400).json({message: 'Invalid input - the email or password is blank.'})
    return;
  } else if (!confirmedPassword || confirmedPassword !== password) {
    res.status(400).json({message: 'Invalid input - the passwords do not match.'})
    return;
  } else if (!email.includes('@')) {
    res.status(400).json({message: 'Invalid input - the email is not valid.'})
    return;
  } else if (!verifyPasswordStrength(password)) {
    res.status(400).json({message: 'Invalid input - please enter a stronger password.'})
    return;
  }

  /* Checking if a user exists in the database with provided username */
  /* If one exists, respond with an error message */
  /* If not, create a new user and store the hashed password */
  const findExistingUser = await req.db
        .collection('Users')
        .findOne({username: credentials.username});

  if (findExistingUser == true) {
    res.status(400).json({message: 'User already exists with this username. Try another.'})
    return;
  } else {
     const enteredUsername = credentials.username;
     const enteredEmail = credentials.email;
     const hashedPassword = await hashPassword(password);

     /* INSERT NEW USER WITH HASHED PASSWORD HERE */
     const doc = {
      uid: generateUserID(username),
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