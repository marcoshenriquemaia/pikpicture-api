import { connect, Schema, model, Model } from "mongoose";
import { EnvTypes } from "../@types/env.types";
import { RoomSchemaTypes, UserSchemaTypes } from "../@types/models.types";

export interface ModelsType {
  ENV: EnvTypes;
}

export interface DataBaseType {
  Room: Model<RoomSchemaTypes>;
  User: Model<UserSchemaTypes>;
}

const configureDatabase = async ({
  ENV,
}: ModelsType): Promise<DataBaseType> => {
  const url = `${ENV.DB_CONNECTION}`;

  await connect(url);

  const RoomSchema = new Schema<RoomSchemaTypes>({
    hash: { type: String, required: true },
    playerList: { type: Array, default: [] },
    started: { type: Boolean, default: false },
    gameMode: { type: String, default: "catching" },
    owner: { type: Object, require: true },
    currentCard: { type: Array, default: [] },
    finalTime: { type: Date, default: undefined },
    matchDuration: { type: Number, default: 1000 * 60 * 3 },
    gameInfo: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now },
  });

  const UserSchema = new Schema<UserSchemaTypes>({
    avatar: { type: String, default: () => String(Math.floor(Math.random() * 11)) },
    deviceId: { type: String, required: true },
    email: { type: String },
    victories: [
      new Schema({
        gameMode: { type: String },
        points: { type: Number },
      }),
    ],
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

  const Room = model<RoomSchemaTypes>("Room", RoomSchema);
  const User = model<UserSchemaTypes>("User", UserSchema);

  return { Room, User };
};

export default configureDatabase;
