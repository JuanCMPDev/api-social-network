import jwt from 'jwt-simple'
import moment from 'moment'

const secret = 'SECRETO_JWT_RED_SOCIAL'

const createToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    name: user.name,
    nick: user.nick,
    iat: moment().unix(),
    exp: moment().add(30, 'minutes').unix()
  }

  return jwt.encode(payload, secret)
}

export {
  secret,
  createToken
}
