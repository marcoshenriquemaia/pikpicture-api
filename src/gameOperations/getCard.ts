import fs from "fs";
import path from "path";
import { PlayerProps } from "../@types/env.types";
import { RoomSchemaTypes } from "../@types/models.types";
import catchingPlay from "../socket/_games/catching/play";

const { cardList } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../mock/cardList.json"), {
    encoding: "utf8",
    flag: "r",
  })
);

const getCard = (room: RoomSchemaTypes) => {
  return new Promise((resolver) => {
    const roomCards = [
      room.currentCard,
      ...room.playerList.map((player: PlayerProps) => player.card),
    ];
    let found = false;
    let foundedCard: any;

    while (!found) {
      const randomNumber = Math.floor(Math.random() * cardList.length);
      const card = cardList[randomNumber];
      const foundEqual = roomCards.some((item) => {
        const cardListStringfy = JSON.stringify(
          item.map((c: any) => c.category)
        );

        return (
          JSON.stringify(card.map((c: any) => c.category)) === cardListStringfy
        );
      });

      if (!foundEqual) {
        foundedCard = card;
        found = true;
      }
    }

    resolver(foundedCard);
  });
};

export default getCard;
