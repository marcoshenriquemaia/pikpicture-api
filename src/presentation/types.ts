import { DataBaseType } from '../data/index'
import RoomQueue from '../queue';

export interface DepsTypes {
  models: DataBaseType
  roomQueue: RoomQueue
}