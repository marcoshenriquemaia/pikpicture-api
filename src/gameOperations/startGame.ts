import fs from 'fs'
import path from 'path'
import { PlayerProps } from '../@types/env.types';
import generateUniqueNumbers from '../utils/generateUniqueNumbers';
import { StartGameProps } from './@types';

const { cardList } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../mock/cardList.json"), {
    encoding: "utf8",
    flag: "r",
  })
);

const startGame = ({ room }: StartGameProps) => {
  const cardIndexList = generateUniqueNumbers(room.playerList.length + 1, cardList.length - 1)
  const updatedPlayers = room.playerList.map((player: PlayerProps, index: number) => {
    return {
      ...player,
      card: cardList[cardIndexList[index + 1]]
    }
  })

  return {
    playerList: updatedPlayers,
    startGame: true,
    currentCard: cardList[cardIndexList[0]],
    hash: room.hash
  }
}

export default startGame