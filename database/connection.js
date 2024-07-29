import { connect } from 'mongoose'

const connection = async () => {
  try {
    await connect('mongodb://localhost:27017/db_socialnet')
    console.log('conexion a base de datos exitosa')
  } catch (error) {
    console.log(error)
    throw new Error('conexion a base de datos fallida')
  }
}

export default connection
