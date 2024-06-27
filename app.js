// Rama de DESARROLLO

// const config = require('./utils/config')
// const initializarCollections = require('./utils/initializarCollections')

// NUCLEO DE APP //////////////////////////////////
const express = require('express')
const app = express()
///////////////////////////////////////////////////

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'))

const funcionesRouter = require('./controllers/funciones')

const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')

// Importamos los Middlewares personales
const cleanerConsole = require('./middlewares/cleanerConsole')
const unknowEndpoint = require('./middlewares/unknowEndpoint')
const errorHandler = require('./middlewares/errorHandler')

// MIDDLEWARES
// app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(cleanerConsole)
morgan.token('bodyRequest', (request, response)=>{
  return JSON.stringify(request.body)
})
// Y llamamos al middleware Morgan con un mensaje formateado con los tokkens que queremos
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyRequest'))

// Enrutadores
app.use('/api/funciones', funcionesRouter)


// Control de errores
app.use(unknowEndpoint)
app.use(errorHandler)


module.exports = app