import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const FollowSchema = Schema({
  following_user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  followed_user: {
    type: Schema.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

FollowSchema.index({ following_user: 1, followed_user: 1 }, { unique: true })

FollowSchema.plugin(mongoosePaginate)

export default model('Follow', FollowSchema, 'follows')
