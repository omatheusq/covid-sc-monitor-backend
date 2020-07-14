const express = require('express')
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

module.exports = routes;