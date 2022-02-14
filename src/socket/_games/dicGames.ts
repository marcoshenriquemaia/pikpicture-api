import catchingPlay from "./catching/play";
import catchingStart from "./catching/start";
import bulletPlay from "./bullet/play";
import bulletStart from "./bullet/start";

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