const express = require('express')
const funcionesRouter = require('express').Router()
const fs = require('fs-extra')
const path = require('path')
const multer = require('multer')
const pdf = require('pdf-parse')

const upload = multer({ dest: 'uploads/' })
// const { isModuleNamespaceObject } = require('util/types')

// Ruta para servir archivos estáticos (PDFs)
funcionesRouter.use('/documentos', express.static(path.join(__dirname, 'pdfs')))

// Endpoint para listar nombres de los PDFs disponibles
funcionesRouter.get('/listar', async (req, res) => {
  try {
    const files = await fs.readdir('pdfs')
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf')
    res.json(pdfFiles)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al listar archivos PDF')
  }
})

// Endpoint para subir un PDF
funcionesRouter.post('/subir', upload.single('pdf'), async (req, res) => {
  try {
    const tempFilePath = req.file.path
    const targetPath = path.join(__dirname, '..', 'pdfs', req.file.originalname)
    await fs.move(tempFilePath, targetPath, { overwrite: true })
    res.send(`PDF ${req.file.originalname} subido correctamente`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al subir el archivo PDF')
  }
})

// Endpoint dinámico para leer el contenido de un PDF
funcionesRouter.get('/documentos/:nombrePDF', async (req, res) => {
  const { nombrePDF } = req.params
  const filePath = path.join(__dirname, '..', 'pdfs', nombrePDF)
  try {
    const dataBuffer = await fs.readFile(filePath)
    const data = await pdf(dataBuffer)
    console.log('data: ', data)
    res.send(data.text)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al leer el archivo PDF')
  }
})

// Endpoint para borrar un PDF según su nombre
funcionesRouter.get('/borrar/:nombrePDF', async (req, res) => {
  const { nombrePDF } = req.params
  const filePath = path.join(__dirname, '..', 'pdfs', nombrePDF)
  try {
    await fs.unlink(filePath)
    res.send(`PDF ${nombrePDF} eliminado correctamente`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al intentar borrar el archivo PDF')
  }
})

module.exports = funcionesRouter