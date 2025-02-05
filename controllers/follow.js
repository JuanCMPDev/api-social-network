/* eslint-disable camelcase */
import Follow from '../models/follow.js'
import User from '../models/user.js'
import { followUserIds } from '../services/followServices.js'

export const testFollow = (req, res) => {
  return res.status(200).send({
    message: 'mensaje enviado desde el controlador follow.js'
  })
}

export const saveFollow = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { followed_user } = req.body
    const identity = req.user

    if (!identity || !identity.userId) {
      return res.status(400).json({
        staus: 'error',
        message: 'No se ha proporcionado el usuario para seguir'
      })
    }

    if (identity.userId === followed_user) {
      return res.status(400).json({
        staus: 'error',
        message: 'No puedes seguirte a ti mismo'
      })
    }
    const followedUser = await User.findById(followed_user)

    if (!followedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'El usuario que intentas seguir no existe'
      })
    }

    const existingFollow = await Follow.findOne({
      following_user: identity.userId,
      follower_user: followedUser
    })

    if (existingFollow) {
      return res.status(400).json({
        status: 'error',
        message: 'ya estás siguiendo a este usuario'
      })
    }

    const newFollow = new Follow({
      following_user: identity.userId,
      followed_user
    })

    const followStored = await newFollow.save()

    if (!followStored) {
      return res.status(400).json({
        status: 'error',
        message: 'Error al almacenar follow'
      })
    } else {
      const followedUserDetails = await User.findById(followed_user).select('name last_name')

      if (!followedUserDetails) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario seguido no encontrado'
        })
      }

      const combinedFollowData = {
        ...followStored.toObject,
        followedUser: {
          name: followedUserDetails.name,
          last_name: followedUserDetails.last_name
        }
      }

      return res.status(200).json({
        status: 'success',
        identity: req.user,
        follow: combinedFollowData
      })
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya estás siguiendo a este usuario'
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error interno al seguir usuario'
    })
  }
}

export const unfollow = async (req, res) => {
  try {
    const userId = req.user.userId

    const followedId = req.params.id

    const followDeleted = await Follow.findOneAndDelete({
      following_user: userId,
      followed_user: followedId
    })

    if (!followDeleted) {
      return res.status(404).send({
        status: 'error',
        message: 'No se encontró el seguimiento a eliminar.'
      })
    }

    return res.status(200).send({
      status: 'success',
      message: 'Dejaste de seguir al usuario correctamente.'
    })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'Error al dejar de seguir al usuario.'
    })
  }
}

export const following = async (req, res) => {
  try {
    // Obtener el ID del usuario identificado
    let userId = req.user && req.user.userId ? req.user.userId : undefined

    // Comprobar si llega el ID por parámetro en la url (este tiene prioridad)
    if (req.params.id) userId = req.params.id

    // Asignar el número de página
    const page = req.params.page ? parseInt(req.params.page, 10) : 1

    // Número de usuarios que queremos mostrar por página
    const itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 5

    // Configurar las opciones de la consulta
    const options = {
      page,
      limit: itemsPerPage,
      populate: {
        path: 'followed_user',
        select: '-password -role -__v -email'
      },
      lean: true
    }

    // Buscar en la BD los seguidores y popular los datos de los usuarios
    const follows = await Follow.paginate({ following_user: userId }, options)

    // Listar los seguidores de un usuario, obtener el array de IDs de los usuarios que sigo
    const followUsers = await followUserIds(req)

    // Devolver respuesta
    return res.status(200).send({
      status: 'success',
      message: 'Listado de usuarios que estoy siguiendo',
      follows: follows.docs,
      total: follows.totalDocs,
      pages: follows.totalPages,
      page: follows.page,
      limit: follows.limit,
      users_following: followUsers.following,
      user_follow_me: followUsers.followers
    })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'Error al listar los usuarios que estás siguiendo.'
    })
  }
}

export const followers = async (req, res) => {
  try {
    // Obtener el ID del usuario identificado
    let userId = req.user && req.user.userId ? req.user.userId : undefined

    // Comprobar si llega el ID por parámetro en la url (este tiene prioridad)
    if (req.params.id) userId = req.params.id

    // Asignar el número de página
    const page = req.params.page ? parseInt(req.params.page, 10) : 1

    // Número de usuarios que queremos mostrar por página
    const itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 5

    // Configurar las opciones de la consulta
    const options = {
      page,
      limit: itemsPerPage,
      populate: {
        path: 'following_user',
        select: '-password -role -__v -email'
      },
      lean: true
    }

    // Buscar en la BD los seguidores y popular los datos de los usuarios
    const follows = await Follow.paginate({ followed_user: userId }, options)

    // Listar los seguidores de un usuario, obtener el array de IDs de los usuarios que sigo
    const followUsers = await followUserIds(req)

    // Devolver respuesta
    return res.status(200).send({
      status: 'success',
      message: 'Listado de usuarios que me siguen',
      follows: follows.docs,
      total: follows.totalDocs,
      pages: follows.totalPages,
      page: follows.page,
      limit: follows.limit,
      users_following: followUsers.following,
      user_follow_me: followUsers.followers
    })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'Error al listar los usuarios que me siguen.'
    })
  }
}
