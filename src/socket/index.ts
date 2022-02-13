import http from 'http'
import { Server } from 'socket.io'
import { ROOM } from '../mock/events'
import { DepsTypes } from '../presentation/types'
import RoomQueue from '../queue'
import disconnect from './disconnect'
import disconnectRoom from './disconnectRoom'
import joinRoom from './joinRoom'
import readyStatusChange from './readyStatusChange'
import games from './_games'

const configureSocket = (app: any, deps: DepsTypes) => {
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.sockets.on('connection', socket => {
    socket.on(ROOM.JOIN, joinRoom(deps, socket, deps.roomQueue, io))
    socket.on(ROOM.STATUS, readyStatusChange(deps, socket, deps.roomQueue, io))
    socket.on(ROOM.LEAVE, disconnectRoom(deps, socket, deps.roomQueue, io))
    socket.on('disconnect', disconnect(deps, socket, deps.roomQueue, io))
    games(socket, deps, io, deps.roomQueue)
  })
  
  return server
}

export default configureSocket