import fs from 'fs'
import path from 'path'

const cardList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../mock/cardList.json"), {
    encoding: "utf8",
    flag: "r",
  })
);

const getCard = ({ playerList }) => {
  
}

export default getCard