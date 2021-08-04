const BASE_URL_PUBLIC_PERSONAL = "https://cdn.jsdelivr.net/gh/helloklyn/looker-custom-viz-public/external-dependencies/"
const BASE_URL_PUBLIC_SPOTIFY = ""
const BASE_URL_LOCAL = "https://cdn.jsdelivr.net/gh/helloklyn/looker-custom-viz-public/big-number-trend/"

const packagesDependenciesExternal = [
  'jquery-2.2.4.min.js'
  , 'd3-4.13.0.js'
  , 'd3-array.min-3.0.1.js'
  , 'underscore-min-1.9.1.js'
  , 'numeral.min-2.0.6.js'
  , 'highcharts-9.1.2.js'
  , 'highcharts-accessibility-9.1.2.js'
  , 'highcharts-data-9.1.2.js'
  , 'highcharts-export-data-9.1.2.js'
  , 'highcharts-exporting-9.1.2.js'
  , 'highcharts-more-9.1.2.js'
  , 'tidy.min-2.4.2.js'
  , 'highcharts-treemap-9.1.2.js'
]

const packageDependenciesLocal = [
  'util.js'
  , 'main.js'
]

var dependenciesAdded = []
packagesDependenciesExternal.forEach(p=>{
  l = BASE_URL_PUBLIC_PERSONAL + p
  // console.log(l)
  dependenciesAdded.push(l)
})
console.log(dependenciesAdded)