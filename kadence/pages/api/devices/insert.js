import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        uid: req.body.uid,
        deviceList: req.body.deviceList,
        selectedDeviceName: req.body.deviceName,
        selectedDeviceID: req.body.deviceID,
        tracking: req.body.tracking,
    };

    if (req.body.uid == null) {
        console.log('No UID sent in request');
        res.status(400).send();
        return;
    }

    const result = await req.db.collection('Devices').insertOne(doc);
    //console.log("A document with the ID: ${result.insertedID} has been added");
    //res.json(doc);
    if (result.acknowledged == false) {
        console.log('Request not acknowledged by database');
        res.status(500).send();
    } else {
        console.log('Document Created');
        res.status(200).send();
    }
});

export default handler;
