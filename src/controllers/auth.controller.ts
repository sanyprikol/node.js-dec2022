import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPair } from "../types/token.tupes";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const tokenPair = await authService.login(req.body, req.res.locals.user);

      return res.status(200).json({
        ...tokenPair,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
