const express = require('express');
const cors = require('cors')
const routes = require('./routes')

require('./case-downloader')

const app = express();

var whitelist = ['https://matheusquadros.github.io']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(express.json())

app.use(routes)

app.listen(process.env.PORT || 3333)