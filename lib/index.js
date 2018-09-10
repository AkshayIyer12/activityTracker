const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, '..', 'public')))
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.get('/:id/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'))
})

app.post('/:id', (req, res) => {
  console.log(res.body)
})
app.listen(3000)
