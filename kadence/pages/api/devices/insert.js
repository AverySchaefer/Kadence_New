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
        tracking: req.body.tracking
    }

    const result = await req.db.collection('Devices').insertOne(doc);
    console.log("A document with the ID: ${result.insertedID} has been added");
    res.json(doc);
})

export default handler;