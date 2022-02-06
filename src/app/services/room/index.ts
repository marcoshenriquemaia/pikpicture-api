import { Request } from "express"
import Repository from "../../../data/repositories/_abstract"
import { DepsTypes } from "../../../presentation/types"
import generageToken from "../../../utils/generateToken"
import fs from 'fs'
import path from 'path'
import { JoinPlayerProps } from "./types"

class RoomService {
  roomRepository: Repository
  deps: any
  cardList: any
  constructor (deps: DepsTypes) {
    this.roomRepository = new Repository({ model: deps.models.Room })
    this.deps = deps
    this.cardList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../mock/cardList.json'), {encoding:'utf8', flag:'r'}))
  }

  async create(req: Request) {
    const { playerName, userId } = req.body
    const hash = generageToken(6)

    const room = await this.roomRepository.create({
      hash,
      owner: { playerName, userId }
    })

    return room
  } 

  async joinPlayer ({ room, player }: JoinPlayerProps) {
    const currentRoom = await this.roomRepository.get({ room })
    
    if (currentRoom.playerList.some((item: any) => item.userId === player.userId)) return false

    return await this.roomRepository.update({
      hash: room,
    },
    {
      $push: { playerList: player }
    },
    {
      returnOriginal: true
    }
    )
  }

  async update(criteria: any, data: any) {
    return await this.roomRepository.update(criteria, data)
  }

  async get(storeId: string) {
    return await this.roomRepository.getById(storeId)
  }

  async list() {
    const newStore = await this.roomRepository.list()

    return newStore
  } 
}

export default RoomService