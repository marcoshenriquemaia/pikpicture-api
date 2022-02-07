import { PlayerProps } from "../../../@types/env.types";

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
}