const generateUniqueNumbers = (quantity: number, limit: number) => {
  const numberList: any[] = []

  while(numberList.length < quantity) {
    const randomNumber = Math.floor(Math.random() * limit) + 1

    if (!numberList.includes(randomNumber)) numberList.push(randomNumber)
  }

  return numberList
}

export default generateUniqueNumbers