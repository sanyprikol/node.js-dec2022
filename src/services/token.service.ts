import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ApiError } from "../errors";
import { ITokenPair, ITokenPayload } from "../types/token.tupes";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, configs.JWT_ACCESS_SECRET) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
