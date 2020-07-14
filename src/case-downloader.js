var https = require('https');
var fs = require('fs');
const CSVToJSON = require('csvtojson');
const gunzip = require('gunzip-file')
const cron = require('node-cron');

const fileToDownload = 'https://data.brasil.io/dataset/covid19/caso_full.csv.gz';

let saveDataInJSON = (data) => {
  fs.writeFile("./data/casos_sc.json", JSON.stringify(data), () => {
    console.info('JSON file created')
  })
}

let readCSV = () => {
  CSVToJSON().fromFile('./data/caso_full.csv')
    .then(data => {
      data = data.filter(d => d.state === 'SC')
      saveDataInJSON(data)
    }).catch(err => {
      console.log(err);
    });
}

let unzipFile = () => {

  console.info('zip file downloaded')

  return gunzip('./data/data.gz', './data/caso_full.csv', () => {
    console.info('file unzipped')
    readCSV()
  })
}


let downloadData = () => {
  https.get(fileToDownload, (res) => {
    if (res.statusCode < 300) {
      let prom = fs.createWriteStream('./data/data.gz')
      prom.on('close', unzipFile)
      res.pipe(prom)
    }
  })
}

downloadData()

cron.schedule('0 22 * * *', () => {
  downloadData()
  console.log(`${JSON.stringify(new Date())} - Rotina de busca automatica de dados executada`)
});
