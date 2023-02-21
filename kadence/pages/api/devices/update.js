import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.patch(async (req, res) => {
    if (!req.body.uid) {
        console.log('No UID sent in request');
        res.status(400).send('No UID sent in request');
        return;
    }

    const filter = { _id: new ObjectId(req.body.uid) };
    const options = { upsert: true };
    const doc = {
        deviceList: req.body.deviceList,
        selectedDeviceName: req.body.deviceName,
        selectedDeviceID: req.body.deviceID,
        tracking: req.body.tracking,
    };

    const result = await req.db
        .collection('Devices')
        .updateOne(filter, { $set: doc }, options);

    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else if (result.modifiedCount < 1 && result.matchedCount < 1) {
        console.log('Document could not be located');
        res.status(400).send('Document could not be located');
    } else {
        console.log('Device Document Updated');
        res.status(200).send();
    }
});

export default handler;
