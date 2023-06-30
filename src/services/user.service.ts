import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { userReposytory } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return User.find().select("-password");
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    return userReposytory.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return User.findById(id);
  }
}

export const userService = new UserService();
