class FutureTask {
  constructor(workerSize) {
    this.queue = []; // 队列
    this.workerSize = workerSize ?? 2; // 并行任务数
    this.worker = new Array(this.workerSize); // 正在执行的任务
  }

  /**
   * 执行一个任务
   * @param { number } index
   * @param { Function } fn: 执行的函数
   * @param { Array } args: 传递给执行函数的参数
   */
  *executionFunc(index, fn, ...args) {
    const _this = this;
    yield fn.call(...args).then(function () {
      // 任务执行完毕后，再次分配任务并执行任务
      _this.worker[index] = undefined;
      _this.execut();
    });
  }

  /**
   * 添加到任务队列
   * @param { Array<any[]> } list: 任务队列
   */
  _addQueue(list) {
    list
      .map(callback => {
        return (...args) =>
          new Promise(resolve => {
            callback.call(...args);
            resolve({ callback: callback });
          });
      })
      .forEach(callbackfu => this.queue.unshift(callbackfu));
  }

  addWorker(...args) {
    const _this = this;
    _this._addQueue(args);
    return _this;
  }

  /**
   * 执行函数
   */
  execut() {
    const runIndex = [];
    for (let i = 0; i < this.workerSize; i++) {
      const queueSize = this.queue.length;
      if (!this.worker[i] && queueSize > 0) {
        // 需要执行的任务
        this.worker[i] = this.executionFunc(i, this.queue[queueSize - 1]);
        runIndex.push(i);
        // 从任务队列内删除任务
        this.queue.pop();
      }
    }
    // 执行任务
    for (const index of runIndex) {
      this.worker[index].next();
    }
  }
}

module.exports = function (workerSize) {
  return new FutureTask(workerSize);
};
