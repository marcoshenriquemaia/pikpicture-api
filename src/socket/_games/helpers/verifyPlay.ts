import { CardProps } from "../../../@types/env.types"

interface VerifyPlayProps {
  play: CardProps
  currentCard: CardProps[]
}

const verifyPlay = ({ play, currentCard }: VerifyPlayProps) => {
  return currentCard.some(card => card.category === play.category)
}

export default verifyPlay