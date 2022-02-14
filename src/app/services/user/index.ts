import { Request } from "express";
import Repository from "../../../data/repositories/_abstract";
import { DepsTypes } from "../../../presentation/types";

class UserService {
  userRepository: Repository;
  deps: DepsTypes;
  constructor(deps: DepsTypes) {
    this.userRepository = new Repository({ model: deps.models.User });
    this.deps = deps;
  }

  async upsert(req: Request) {
    const { deviceId } = req.body

    const user = await this.userRepository.get({ deviceId })

    if (user) return user

    const newUser = await this.userRepository.create(req.body)

    return newUser
  }
}

export default UserService