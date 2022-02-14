import { GameInfoProps, PlayerProps } from "../../../@types/env.types";
import { RoomSchemaTypes } from "../../../@types/models.types";

export interface JoinPlayerProps {
  room: string;
  player: PlayerProps;
  returnCurrent?: boolean;
}

export interface changeReadyStatusPlayer {
  status: boolean;
  playerId: string;
  room: string;
}

export interface Catching_wonProps {
  socketId: string;
  room: RoomSchemaTypes;
  keepCurrentCard?: boolean;
  keepPlayerCard?: boolean;
  gameInfo?: GameInfoProps;
}

export interface ChangeMainCardProps {
  room: RoomSchemaTypes;
}

export interface SetPlayerWonRoundProps {
  room: RoomSchemaTypes;
  socketId: string;
  round: number;
}

export interface SetGameRoundProps {
  room: RoomSchemaTypes
  round: number
}