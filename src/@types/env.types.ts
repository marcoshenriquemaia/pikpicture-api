export interface EnvTypes {
  PORT: number | undefined | string
  DB_CONNECTION: undefined | string
}

export interface CardProps {
  image: string
  _id: string
  category: number
}

export interface PlayerProps {
  playerName: string
  userId: string
  card?: CardProps[]
  points: number
  ready: boolean
  socketId: string
  punishmentTime?: Date 
  punishmentTimeInSecond?: number 
  avatar: number
  roundsWon: Array<number>
}

export interface GameInfoProps {
  round?: number,
  roundWinners?: Array<PlayerProps>
}