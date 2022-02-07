import { connect, Schema, model, Model } from 'mongoose'
import { EnvTypes } from '../@types/env.types'
import { RoomSchemaTypes } from '../@types/models.types'

export interface ModelsType{
  ENV: EnvTypes
}

export interface DataBaseType{
  Room: Model<RoomSchemaTypes>
}

const configureDatabase = async ({ ENV }: ModelsType): Promise<DataBaseType>  => {
  const url = `${ENV.DB_CONNECTION}`

  await connect(url)

  const RoomSchema = new Schema<RoomSchemaTypes>({
    hash: { type: String, required: true },
    playerList: { type: Array, default: [] },
    started: { type: Boolean, default: false },
    gameMode: { type: String, default: 'catching' },
    owner: { type: Object, require: true },
    currentCard: { type: Array, default: [] },
    finalTime: { type: Date, default: Date.now },
    matchDuration: { type: Number, default: 1000 * 60 * 2 },
    createdAt: { type: Date, default: Date.now }
  })

  const Room = model<RoomSchemaTypes>('Room', RoomSchema)

  return { Room }
}

export default configureDatabase