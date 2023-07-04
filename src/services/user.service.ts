import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { userReposytory } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(data: IUser): Promise<IUser> {
    return await userReposytory.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneByIdOrTrow(id);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getOneByIdOrTrow(userId);

    return await User.findOneAndUpdate(
      { _id: userId },
      { ...dto },
      { returnDocument: "after" }
    );
  }

  public async deleteById(userId: string): Promise<void> {
    await this.getOneByIdOrTrow(userId);

    await User.deleteOne({ _id: userId });
  }

  private async getOneByIdOrTrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not foundt", 422);
    }
    return user;
  }
}

export const userService = new UserService();
