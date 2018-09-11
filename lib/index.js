const express = require('express')
const app = express()
const path = require('path')
const db = require("./db")
const bodyParser = require("body-parser")
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(bodyParser.json())
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
app.put('/:id', (req, res) => {
  let { key, objectId, value } = req.body;
  db.updateCounter(req.params.id, objectId, key, value)
    .then(data => res.json({ success: data, error: null }))
    .catch(err => res.json({ success: null, error: err.message }))
})
app.get('/:id/admin', (req, res) => {
  db.getCounter(req.params.id)
  .then(v => {
    let obj = v[0][req.params.id]
    let tableValues = Object.keys(obj).reduce((accum, key, index) => {
      accum += `

        <tr>
          <td>${key}</td>
          <td>${obj[key].click}</td>
          <td>${obj[key].hover}</td>
        </tr>

      `
      return accum
    }, '')
    let table = `
    <table>
      <tr>
        <td>Image</td>
        <td>Click</td>
        <td>Hover</td>
      ${tableValues}
    </table>
    `
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
      </style>
      </head>
      <body>
        <h2>Admin Table</h2>
          ${table}
      </body>
    </html>
`;
    res.send(html)
  })
  .catch(err => console.error(err))
})

app.post('/:id', (req, res) => {
  db.createCounter(req.body)
    .then(data => res.json({ success: data, error: null }))
    .catch(err => res.json({ success: null, error: err.message }))
  console.log(res.body)
})
app.listen(3000)
