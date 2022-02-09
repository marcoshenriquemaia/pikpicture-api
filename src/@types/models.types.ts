import { Date } from "mongoose";

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
  createdAt: Date;
}
