import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import config from '../../config';
import models from '../../models/db';
import MarmoymError from '../../models/MarmoymError';
import ErrorType from '../../constants/ErrorType';

export const signInUser = async (userInfo) => {
  const User =  models.user;

  return await User
    .findOne({
      where: {
        username: userInfo.username
      }
    })
    .catch(() => {  // TODO: 이 catch 문은 차후 에러 오브젝트를 디자인하고 수정해야함
      throw new MarmoymError(ErrorType.USER_NOT_FOUND);
    })
    .then(res => {
      const user = res.dataValues;
      if (bcrypt.compareSync(userInfo.password, user.password)) {
        return jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email
          },
          config.auth.JWT_SECRET,
          {
            expiresIn: config.auth.TOKEN_EXPIRE_DURATION
          }
        );
      } else {
        throw new MarmoymError(ErrorType.USER_INCORRECT_PASSWORD);
      }
    });
}