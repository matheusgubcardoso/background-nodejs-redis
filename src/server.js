import 'dotenv/config';    //6K (gzipped: 2.5k)
import express from 'express'; //Calculating...
import BullBoard from 'bull-board';

import UserController from './app/controllers/UserController';
import Queue from './app/lib/Queue';

const app = express();

BullBoard.setQueues(Queue.queues.map(queue => queue.bill));

app.use(express.json());

app.post('/users', UserController.store);

app.use('/admin/queues', BullBoard.UI);

app.listen(process.env.PORT, () => {
    console.log('Server running on the ${process.env.PORT}')
});
