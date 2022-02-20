import { Request } from "express";
import Repository from "../../../data/repositories/_abstract";
import { DepsTypes } from "../../../presentation/types";
import generageToken from "../../../utils/generateToken";
import {
  Catching_wonProps,
  ChangeMainCardProps,
  changeReadyStatusPlayer,
  JoinPlayerProps,
  SetGameRoundProps,
  SetPlayerWonRoundProps,
} from "./types";
import { PlayerProps } from "../../../@types/env.types";
import getCard from "../../../gameOperations/getCard";
import AppError from "../../../errors/AppError";
import { RoomSchemaTypes } from "../../../@types/models.types";
import RoomQueue from "../../../queue";

class RoomService {
  roomRepository: Repository;
  deps: any;
  constructor(deps: DepsTypes) {
    this.roomRepository = new Repository({ model: deps.models.Room });
    this.deps = deps;
  }

  async create(req: Request, roomQueue: RoomQueue) {
    const { playerName, userId, gameMode } = req.body;
    const hash = generageToken(6);

    const room = await this.roomRepository.create({
      hash,
      gameMode,
      owner: { playerName, userId },
    });

    roomQueue.createQueue(`play_${hash}`, { concurrent: 1, interval: 100 });
    roomQueue.createQueue(`readyStatusChange_${hash}`);
    roomQueue.createQueue(`joinRoom_${hash}`);

    return room;
  }

  async changeGameMode(req: Request) {
    const { room, gameMode } = req.body

    return await this.roomRepository.update(
      {
        hash: room
      },
      {
        gameMode,
      },
      {
        returnOriginal: false
      }
    );
  }

  async restartGame(room: RoomSchemaTypes) {
    const newPlayerList = room.playerList.map((player: PlayerProps) => {
      return {
        ...player,
        card: [],
        points: 0,
        ready: false,
        roundsWon: [],
      };
    });

    const restartedRoom = await this.roomRepository.update(
      {
        hash: room.hash,
      },
      {
        playerList: newPlayerList,
        started: false,
        currentCard: [],
        finalTime: undefined,
      },
      {
        returnOriginal: false,
      }
    );

    return restartedRoom;
  }

  async miss({ socketId, room }: Catching_wonProps) {
    const newPlayerList = room.playerList.map((player: PlayerProps) => {
      if (player.socketId != socketId) return player;
      return {
        ...player,
        punishmentTime: new Date(new Date().getTime() + 3000),
        punishmentTimeInSecond: 3,
      };
    });

    return await this.roomRepository.update(
      {
        _id: room._id,
      },
      {
        playerList: newPlayerList
          .sort((a: PlayerProps, b: PlayerProps) => {
            return a.points - b.points;
          })
          .reverse(),
      },
      {
        returnOriginal: false,
      }
    );
  }

  async changeMainCard({
    room,
  }: ChangeMainCardProps): Promise<RoomSchemaTypes> {
    return await this.roomRepository.update(
      {
        hash: room.hash,
      },
      {
        currentCard: await getCard(room),
      },
      {
        returnOriginal: false,
      }
    );
  }

  async setGameRound({ room, round }: SetGameRoundProps) {
    return await this.roomRepository.update(
      {
        hash: room.hash,
      },
      {
        gameInfo: {
          ...room.gameInfo,
          round,
        },
      },
      {
        returnOriginal: true,
      }
    );
  }

  async setPlayerWonRound({ room, socketId, round }: SetPlayerWonRoundProps) {
    const newPlayerList = room.playerList.map((player: PlayerProps) => {
      if (player.socketId != socketId) return player;
      return {
        ...player,
        roundsWon: [...player.roundsWon, round],
      };
    });

    return await this.roomRepository.update(
      {
        hash: room.hash,
      },
      {
        playerList: newPlayerList,
      },
      {
        returnOriginal: false,
      }
    );
  }

  async won({
    socketId,
    room,
    keepCurrentCard,
    keepPlayerCard,
    gameInfo,
  }: Catching_wonProps) {
    const newPlayerList = room.playerList.map((player: PlayerProps) => {
      if (player.socketId != socketId) return player;
      return {
        ...player,
        points: player.points + 1,
        card: keepPlayerCard ? player.card : room.currentCard,
        gameInfo: gameInfo ? gameInfo : {},
      };
    });

    return await this.roomRepository.update(
      {
        _id: room._id,
      },
      {
        currentCard: keepCurrentCard ? room.currentCard : await getCard(room),
        playerList: newPlayerList
          .sort((a: PlayerProps, b: PlayerProps) => {
            return a.points - b.points;
          })
          .reverse(),
      },
      {
        returnOriginal: false,
      }
    );
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
        playerList: room.playerList
          ?.filter((player: PlayerProps) => player.socketId !== socketId)
          .sort((a: PlayerProps, b: PlayerProps) => {
            return a.points - b.points;
          })
          .reverse(),
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
      { ...newRoom },
      { returnOriginal: false }
    );

    return room;
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

    if (!currentRoom) throw new AppError("Not found", 404);

    if (currentRoom.started)
      throw new AppError("The game is already started", 401);
    if (currentRoom.playerList.length >= 100)
      throw new AppError("Full room", 403);

    if (
      currentRoom.playerList.some((item: any) => item.userId === player.userId)
    )
      return false;

    if (returnCurrent) return currentRoom;

    return await this.roomRepository.update(
      {
        hash: room,
      },
      {
        playerList: [...currentRoom.playerList, { ...player, ready: false }],
      },
      {
        returnOriginal: false,
      }
    );
  }

  async delete(_id: string) {
    return await this.roomRepository.delete(_id);
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
