import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  nick: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'role_user'
  },
  image: {
    type: String,
    default: 'default.png'
  },
  date: {
    type: String,
    default: Date.now
  }
})

userSchema.plugin(mongoosePaginate)

export default model('User', userSchema, 'users')
