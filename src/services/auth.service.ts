import { EEmailActions } from "../enums/email.enum";
import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { ICredentials, ITokenPair } from "../types/token.tupes";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(data.password);

      await User.create({ ...data, password: hashedPassword });
      await emailService.sendMail(data.email, EEmailActions.WELCOME, {
        name: data.name,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }
      const tokensPair = await tokenService.generateTokenPair({
        _id: user._id,
      });

      await Token.create({
        ...tokensPair,
        _userId: user._id,
      });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
