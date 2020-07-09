const express = require('express')
const routes = express.Router();

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


let last_reports = cases.filter(c => c.isLastReport )

console.log(cases.length)
console.log(last_reports.length)


routes.get('/', (req, res) => res.send('Hello World!'))


routes.get('/city', (req, res) => {
  res.json(last_reports);
})

routes.get('/city/:id', (req, res) => {
  let cityIbgeCode = req.params.id;
  let city = last_reports.find(c => c.cityIbgeCode == cityIbgeCode)

  res.json(city);
})

module.exports = routes;