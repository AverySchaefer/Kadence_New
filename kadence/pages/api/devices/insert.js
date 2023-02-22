import nextConnect from 'next-connect';
import middleware from '../../../middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const doc = {
        deviceList: req.body.deviceList,
        selectedDeviceName: req.body.deviceName,
        selectedDeviceID: req.body.deviceID,
        tracking: req.body.tracking,
    };

    const result = await req.db.collection('Devices').insertOne(doc);
    if (result.acknowledged === false) {
        console.log('Request not acknowledged by database');
        res.status(500).send('Request not acknowledged by database');
    } else {
        console.log('Document Created');
        res.status(200).json({ id: result.insertedId });
    }
});

export default handler;
