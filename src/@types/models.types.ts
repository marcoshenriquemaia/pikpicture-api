import { Date } from "mongoose";

export interface VictoryTypes {
  gameMode: string
  points: number
}

export interface RoomSchemaTypes {
  _id: string
  hash: string;
  playerList: any;
  started: boolean;
  gameMode: string;
  owner: any;
  currentCard: any
  finalTime: Date | undefined,
  matchDuration: number
  gameInfo: any
  createdAt: Date;
}

export interface UserSchemaTypes {
  _id: string
  deviceId: string
  avatar: string
  verified: boolean
  email: string
  name: string,
  victories: Array<VictoryTypes>
  createdAt: Date
}