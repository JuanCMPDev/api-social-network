import jwt from 'jwt-simple'
import moment from 'moment'
import { secret } from '../services/jwt.js'

export const ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({
      status: 'error',
      message: 'la petición no tiene cabezera de autenticación'
    })
  }

  const token = req.headers.authorization.replace(/["']+/g, '')

  try {
    const payload = jwt.decode(token, secret)

    if (payload.exp < moment().unix()) {
      return res.status(401).send({
        status: 'error',
        message: 'El token ha expirado'
      })
    }

    req.user = payload
  } catch (error) {
    return res.status(404).send({
      status: 'error',
      message: 'El token no es valido'
    })
  }

  next()
}
