const express = require('express')
const moment = require('moment')

const routes = express.Router();


let getCases = () => {
  let cases = require('../data/casos_sc.json')

  cases = cases.map(c => (
    {
      city: c.city,
      cityIbgeCode: c.city_ibge_code,
      date: c.date,
      epidemiologicalWeek: c.epidemiological_week,
      newConfirmed: c.new_confirmed,
      newDeaths: c.new_deaths,
      caseCount: c.last_available_confirmed,
      deathCount: c.last_available_deaths,
      isLastReport: c.is_last == 'True'
    }
  ))

  return cases;
}

let getLatestReports = () => {
  let cases = getCases()
  return cases.filter(c => c.isLastReport)
}

routes.get('/', (req, res) => res.send('Hello World!'))


routes.get('/city', (req, res) => {
  let last_reports = getLatestReports()
  res.json(last_reports);
})

routes.get('/city/:id', (req, res) => {
  let last_reports = getLatestReports()

  let cityIbgeCode = req.params.id;

  let city = last_reports.find(c => c.cityIbgeCode == cityIbgeCode)

  res.json(city);
})

routes.get('/city/:id/history', (req, res) => {
  let cityIbgeCode = req.params.id;

  let cases = getCases()


  const groups = cases.filter(c=> c.cityIbgeCode == cityIbgeCode).reduce((acc, c) => {

    // create a composed key: 'year-week' 
    const yearWeek = `${moment(c.date).year()}-${moment(c.date).week()}`;
    
    // add this key as a property to the result object
    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }
    
    // push the current date that belongs to the year-week calculated befor
    acc[yearWeek].push(c);
  
    return acc;
  
  }, {});

  let data = []
  for(key in groups){
    let items = groups[key]
    data.push(items[items.length - 1])
  }

  cases = data
    .map(c=> ({
      cases: parseInt(c.caseCount),
      deaths: parseInt(c.deathCount),
      date: c.date
    }))
  res.json(cases);
})

module.exports = routes;