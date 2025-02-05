import { Router } from 'express'
import { followers, following, saveFollow, testFollow, unfollow } from '../controllers/follow.js'
import { ensureAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/test-follow', testFollow)
router.post('/follow', ensureAuth, saveFollow)
router.post('/unfollow/:id', ensureAuth, unfollow)
router.get('/following/:id?/:page?', ensureAuth, following)
router.get('/followers/:id?/:page?', ensureAuth, followers)

export default router
