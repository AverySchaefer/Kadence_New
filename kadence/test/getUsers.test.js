// import handler from '../pages/api/users/getUsers';

// describe('GET /api/users/getUsers', () => {
//     let req;
//     let res;

//     beforeEach(() => {
//         req = {
//             query: {
//                 username: 'test-user',
//             },
//             db: {
//                 collection: jest.fn(() => ({
//                     findOne: jest.fn(() => ({
//                         id: '1',
//                         username: 'test-user',
//                     })),
//                 })),
//             },
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             send: jest.fn(),
//             json: jest.fn(),
//         };
//     });

//     it('should respond with a 400 status code if no username is provided in the request', async () => {
//         req.query.username = null;

//         await handler(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.send).toHaveBeenCalled();
//         expect(res.json).not.toHaveBeenCalled();
//     });

//     it('should respond with a 400 status code if the user cannot be found in the database', async () => {
//         req.db.collection().findOne.mockReturnValue(null);

//         await handler(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith(null);
//         expect(res.send).not.toHaveBeenCalled();
//     });

//     it('should respond with a 200 status code if the user is found in the database', async () => {
//         await handler(req, res);

//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//             id: '1',
//             username: 'test-user',
//         });
//         expect(res.send).not.toHaveBeenCalled();
//     });
// });
