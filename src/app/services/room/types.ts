import { PlayerProps } from "../../../@types/env.types";
import { RoomSchemaTypes } from "../../../@types/models.types";

export interface JoinPlayerProps {
  room: string
  player: PlayerProps
  returnCurrent?: boolean
}

export interface changeReadyStatusPlayer {
  status: boolean
  playerId: string
  room: string
}

export interface Catching_wonProps {
  socketId: string
  room: RoomSchemaTypes
}