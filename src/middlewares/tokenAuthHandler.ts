import { NextFunction, Request, Response } from 'express';

import ApiError from '@@models/ApiError';
import { expressLog } from '@@modules/Log';
import marmoymConfig from '@@config/marmoymConfig';
import ResponseType from '@@models/ResponseType';
import Token from '@@modules/Token';

export default function tokenAuthHandler(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['auth-token'];
  expressLog.info(`Token auth handle: %s`, token);

  if (token) {
    Token.decode({
      token,
    })
      .then((tokenDecoded) => {
        res.locals['username-decoded'] = tokenDecoded['username'];
        next();
      })
      .catch((err) => {
        throw ApiError.of({
          args: [],
          responseType: ResponseType.TOKEN_INVALID,
        });  
      });
  } else {
    throw ApiError.of({
      args: [ req.cookies ],
      responseType: ResponseType.TOKEN_VOID,
    });
  }
};
