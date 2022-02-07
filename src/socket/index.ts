import http from 'http'
import { Server } from 'socket.io'
import { DepsTypes } from '../presentation/types'
import RoomQueue from '../queue'
import disconnect from './disconnect'
import disconnectRoom from './disconnectRoom'
import joinRoom from './joinRoom'
import readyStatusChange from './readyStatusChange'
import games from './_games'

const configureSocket = (app: any, deps: DepsTypes) => {
  const roomQueue = new RoomQueue()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.sockets.on('connection', socket => {
    socket.on('joinRoom', joinRoom(deps, socket, roomQueue, io))
    socket.on('readyStatusChange', readyStatusChange(deps, socket, roomQueue, io))
    socket.on('disconnect', disconnect(deps, socket, roomQueue, io))
    socket.on('leaveRoom', disconnectRoom(deps, socket, roomQueue, io))
    games(socket, deps, io)
  })
  
  return server
}

export default configureSocket