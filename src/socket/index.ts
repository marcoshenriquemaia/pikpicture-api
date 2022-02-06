import http from 'http'
import { Server } from 'socket.io'
import { DepsTypes } from '../presentation/types'
import RoomQueue from '../queue'
import joinRoom from './joinRoom'

const configureSocket = (app: any, deps: DepsTypes) => {
  const roomQueue = new RoomQueue()
  const server = http.createServer(app)
  const io = new Server(server, { 
    cors: {
      origin: '*'
    }
  }) 

  io.sockets.on('connection', socket => {
    socket.on('joinRoom', joinRoom(deps, socket, roomQueue))
  })
   
  return server
}

export default configureSocket