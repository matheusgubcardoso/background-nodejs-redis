import Queue from 'bull';
import redisConfig from '../config/redis';

import * as jobs from '../jobs';

const queue = Object.values(jobs).map(job => ({
    bull: new Queue(jobs.key, redisConfig),
    name: job.key,
    handle: job.handle,
    options: job.options,
}));

export default {
    queue,
    add(name, data){
        const queue = this.queue.find(queue => queue.name == name);
    
        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queue.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job, err) => {
                console.log('Job failed', queue.key, job.data);
                console.log(err);

            })
        })
    }
}