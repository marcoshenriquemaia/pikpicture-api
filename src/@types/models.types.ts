import { Date } from "mongoose";

export interface RoomSchemaTypes {
  hash: string;
  playerList: any;
  started: boolean;
  gameMode: string;
  owner: any;
  currentCard: any
  createdAt: Date;
}
