import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const filter = { uid: req.body.uid };
    const options = { upsert: true };
    const doc = {
        uid: req.body.uid,
        deviceList: req.body.deviceList,
        selectedDeviceName: req.body.deviceName,
        selectedDeviceID: req.body.deviceID,
        tracking: req.body.tracking
    };

    const result = await req.db.collection('Devices').updateOne(filter, doc, options);
    console.log("A document with the ID: ${result.insertedID} has been updated");
    res.json(doc);
})

export default handler;