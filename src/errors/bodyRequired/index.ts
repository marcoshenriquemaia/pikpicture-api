import AppError from "../AppError"

const bodyRequired = (body: any, ...props: any) => {
  const error = [...props].find(prop => !body[prop])

  if (error) throw new AppError(`${error} is required`)
}

export default bodyRequired