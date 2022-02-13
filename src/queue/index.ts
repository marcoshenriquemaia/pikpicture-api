import Queue from "queue-promise";

interface SpecsProps {
  interval?: number;
  concurrent?: number;
  start?: boolean;
}

class RoomQueue {
  queueList: Map<any, any>;
  constructor() {
    this.queueList = new Map();
  }

  createQueue(hash: string, specs?: SpecsProps) {
    if (this.queueList.has(hash)) return;

    const formatedSpecs = specs ?? {};

    this.queueList.set(
      hash,
      new Queue({
        interval: 1,
        concurrent: 1,
        ...formatedSpecs,
      })
    );
  }

  enqueue(hash: string, func: Function) {
    const queue = this.queueList.get(hash);
    
    if (!queue) return;

    console.log('hash', queue.tasks.size)

    queue.enqueue(
      () => new Promise((resolver) => func(resolver, queue.tasks.size + 1))
    );
  }

  removeQueue(hash: string) {
    this.queueList.delete(hash)
  }
}

export default RoomQueue;
