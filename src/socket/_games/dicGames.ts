import catchingPlay from "./catching/play";

interface DicGamesProps {
  catching: Function
  [key: string]: Function
}

const dicGames: DicGamesProps = {
  catching: catchingPlay
}

export default dicGames