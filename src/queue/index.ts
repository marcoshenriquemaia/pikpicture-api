import Queue from 'queue-promise'

class RoomQueue {
  queueList: any;
  constructor(){
    this.queueList = {}
  }

  createQueue(hash: string){
    if (this.queueList[hash]) return

    this.queueList[hash] = new Queue({
      interval: 100,
      concurrent: 30
    })
  }
  
  enqueue(hash: string, func: Function){
    const queue = this.queueList[hash]

    if (!queue) return

    queue.enqueue(() => new Promise((resolver) => func(resolver)))
  }
}

export default RoomQueue