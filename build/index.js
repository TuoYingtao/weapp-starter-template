const scriptEnv = require('./plugins/script.env');
const scriptRouter = require('./plugins/script.router');
const getFutureTask = require('../utils/futureTask');

const futureTask = getFutureTask();
futureTask
  .addWorker(
    () => scriptEnv(),
    () => scriptRouter()
  )
  .execut();
