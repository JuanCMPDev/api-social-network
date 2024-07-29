import express, { json, urlencoded } from 'express'
import cors from 'cors'
import connection from './database/connection.js'
import userRoutes from './routes/user.js'
import followRoutes from './routes/follow.js'
import publicationRoutes from './routes/publication.js'

connection()

const port = 4000
const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/api/user', userRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/publication', publicationRoutes)

app.get('/test-route', (req, res) => {
  return res.status(200).json({
    id: '1',
    name: 'juan carlos',
    username: 'prodigy'
  })
})

app.listen(port, () => {
  console.log(`Servidor montado en el puerto ${port}`)
})
