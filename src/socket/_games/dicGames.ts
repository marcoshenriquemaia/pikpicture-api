import catchingPlay from "./modes/catching/play";
import catchingStart from "./modes/catching/start";
import bulletPlay from "./modes/bullet/play";
import bulletStart from "./modes/bullet/start";

interface DicGamesProps {
  catching: Function
  bullet: Function
  [key: string]: Function
}

interface DicGameStartProps {
  catching: Function
  bullet: Function
  [key: string]: Function
}

const dicGames: DicGamesProps = {
  catching: catchingPlay,
  bullet: bulletPlay
}

export const dicGameStart: DicGameStartProps = {
  catching: catchingStart,
  bullet: bulletStart
}

export default dicGames