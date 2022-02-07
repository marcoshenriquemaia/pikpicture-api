import { Request } from "express";
import Repository from "../../../data/repositories/_abstract";
import { DepsTypes } from "../../../presentation/types";
import generageToken from "../../../utils/generateToken";
import { Catching_wonProps, changeReadyStatusPlayer, JoinPlayerProps } from "./types";
import { PlayerProps } from "../../../@types/env.types";

class RoomService {
  roomRepository: Repository;
  deps: any;
  constructor(deps: DepsTypes) {
    this.roomRepository = new Repository({ model: deps.models.Room });
    this.deps = deps;
  }

  async create(req: Request) {
    const { playerName, userId } = req.body;
    const hash = generageToken(6);

    const room = await this.roomRepository.create({
      hash,
      owner: { playerName, userId },
    });

    return room;
  }

  async catching_won({ socketId }: Catching_wonProps) {
    console.log(socketId)
  }
  
  async disconnectPlayer(socketId: string) {
    const roomList = await this.roomRepository.list();

    const room = roomList.find((room) => {
      return room.playerList.some((player: PlayerProps) => {
        return player.socketId === socketId;
      });
    });

    if (!room) return;

    const updatedRoom: any = await this.roomRepository.update(
      {
        hash: room?.hash,
      },
      {
        playerList: room.playerList?.filter(
          (player: PlayerProps) => player.socketId !== socketId
        ),
      },
      {
        returnOriginal: false,
      }
    );

    return updatedRoom;
  }

  async startGame(newRoom: any) {
    const room = await this.roomRepository.update(
      { hash: newRoom.hash },
      { ...newRoom},
      { returnOriginal: false }
    );

    return room
  }

  async changeReadyStatusPlayer({
    status,
    playerId,
    room,
  }: changeReadyStatusPlayer) {
    const currentRoom = await this.roomRepository.get({ hash: room });
    const newPlayerList = currentRoom.playerList.map((player: PlayerProps) => {
      if (player.userId !== playerId) return player;
      return {
        ...player,
        ready: status,
      };
    });

    const updatedRoom = await this.roomRepository.update(
      { hash: room },
      {
        playerList: newPlayerList,
      },
      {
        returnOriginal: false,
      }
    );

    return updatedRoom;
  }

  async joinPlayer({ room, player, returnCurrent }: JoinPlayerProps) {
    const currentRoom = await this.roomRepository.get({ hash: room });

    if (!currentRoom) return false

    if (
      currentRoom.playerList.some((item: any) => item.userId === player.userId)
    )
      return false;

    if (returnCurrent) return currentRoom

    return await this.roomRepository.update(
      {
        hash: room,
      },
      {
        playerList: [...currentRoom.playerList, {...player, ready: false}],
      },
      {
        returnOriginal: false,
      }
    );
  }

  async update(criteria: any, data: any) {
    return await this.roomRepository.update(criteria, data);
  }

  async getByHash(hash: string) {
    return await this.roomRepository.get({ hash });
  }

  async get(storeId: string) {
    return await this.roomRepository.getById(storeId);
  }

  async list() {
    const newStore = await this.roomRepository.list();

    return newStore;
  }
}

export default RoomService;
