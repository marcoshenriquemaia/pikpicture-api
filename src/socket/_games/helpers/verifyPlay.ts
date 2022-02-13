import { CardProps } from "../../../@types/env.types"
import { RoomSchemaTypes } from "../../../@types/models.types"

interface VerifyPlayProps {
  play: number
  currentCard: CardProps[]
  currentRoom: RoomSchemaTypes
}

const verifyPlay = ({ play, currentCard }: VerifyPlayProps) => {
  const hasSome = currentCard.some(card => card.category === play)

  return hasSome
}

export default verifyPlay