import { CardProps } from "../../../@types/env.types"

interface VerifyPlayProps {
  play: number
  currentCard: CardProps[]
}

const verifyPlay = ({ play, currentCard }: VerifyPlayProps) => {
  return currentCard.some(card => card.category === play)
}

export default verifyPlay