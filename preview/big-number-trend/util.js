var generateDataRecords = (dataIndexFormat) => {
  //HELP: convert looker response data into common records format
  //NOTE: used by metrics-widget__big-number
  var dataRecords = []
  dataIndexFormat.forEach(d=>{
    obj = {}
    var headerName = Object.keys(d);
    headerName.forEach(h=>{
      obj[h] = d[h].value
    });
    dataRecords.push(obj)
  })
  return dataRecords  
}

function generateHighChartsDataSeries(dataRecordsInput) {
  //HELP: convert DataRecords into HighChart DataSeries without Header/Column Name
  //NOTE: used by metrics-widget__big-number
  dataHighCharts = []
  dataRecordsInput.forEach(function(d) {
    var rowValueOnly = []
    var columnNames = Object.keys(d);
    // console.log(columnNames);
    columnNames.forEach(function(c) {
      rowValueOnly.push(d[c])
    })
    dataHighCharts.push(rowValueOnly)
  });
  return dataHighCharts;
}

var calculateGrowthVsNPeriodAgo = (inputDataArraySortBasedOnTimeDescending, nPeriodAgo) => {
  // HELP: 
  // @inputDataArraySortBasedOnTimeDescending: 1D sorted array
  // @LatestValue: numeric value
  // @nPeriodAgo: Int, number of periods look back
  // LINK: https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js,
  if (inputDataArraySortBasedOnTimeDescending.length > nPeriodAgo && nPeriodAgo != 0) {
    var valueCurrent = parseFloat(inputDataArraySortBasedOnTimeDescending[0])
    var valueNPeriodAgo = parseFloat(inputDataArraySortBasedOnTimeDescending[nPeriodAgo])
    var valueGrowth = valueCurrent - valueNPeriodAgo
    var valueGrowthFormatted = "(" + numeral(valueGrowth).format('0.00a') + ")"
    var valueGrowthRate = valueNPeriodAgo != 0 ? valueGrowth / valueNPeriodAgo : 1.0
    var valueGrowthRateFormatted = (valueGrowth < 0 ? "↘" : "↗") + (valueGrowthRate*100).toFixed(2) + "%"
    return [valueGrowth, valueGrowthFormatted, valueGrowthRate, valueGrowthRateFormatted]
  } else {
    return [NaN, NaN, NaN, NaN]
  }
}

// NOTE: using the following function
// when you sort date ascending your moving average window move forward
// when you sort date descending your moving average window move backward
//NOTE: used by metrics-widget__big-number
function movingAverage(values, N) {
  //HELP: here values should be an 1D array
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i] = sum / N;
    sum -= values[i - N + 1];
  }
  return means;
}

var dynamicColor = (value, positive_is_bad) => {
  if (positive_is_bad == false) {
    if (value <= 0) {
      return "#FF5722";
    } else {
      return "#1db954";
    }
  } else {
    if (value <= 0) {
      return "#1db954";
    } else {
      return "#FF5722";
    }
  }
} 

function humanReadableNumber(value, is_human_readable) {
  if (is_human_readable == true) {
    return numeral(value).format("0.00a")
  } else {
    return value
  }
}

function percentageNumber(value, is_percentage_number) {
  if (is_percentage_number == true) {
    return numeral(value).format("0.00%")
  } else {
    return value
  }
}

function getFieldMetaInfoValue(queryResponse, fieldName) {
  //HELP: look up meta info of looker fields
  // @queryResponse: looker Response
  // @fieldName: viewName.fieldTechicalName
  // @return: array of metainfo of this field
  // const queryResponseFieldsDimensions = queryResponse.fields.dimensions
  const queryResponseFieldsMeasures = queryResponse.fields.measures

  // f_dimension = queryResponseFieldsDimensions.filter(d=>{
  //   return d.name == fieldName
  // })

  f_measure = queryResponseFieldsMeasures.filter(d=>{
    return d.name == fieldName
  })

  return f_measure
}


// ANCHOR: retired
// function calculateGrowthRate(dayLengthInput, datasetInput, metricsValueLatest) {
//   //HELP: calculate growth rate PoP, here 7, 31, could be just distance between each items in an array
//   //NOTE: used by metrics-widget__big-number
//   if (dayLengthInput >= 7 && dayLengthInput < 31) {
//     var metricsValueLatestBefore7d = null || datasetInput[6][1];
//     var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
//     var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "↘" : "↗") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
//     return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, null, 'N/A', null, 'N/A', null, 'N/A']
//   } else if (dayLengthInput >=31 && dayLengthInput < 91) {
//     var metricsValueLatestBefore7d = null || datasetInput[6][1];
//     var metricsValueLatestBefore30d = null || datasetInput[29][1];
//     var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
//     var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "↘" : "↗") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
//     var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
//     var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "↘" : "↗") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
//     return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, null, 'N/A', null, 'N/A']
//   } else if (dayLengthInput >= 91 && dayLengthInput < 366) {
//     var metricsValueLatestBefore7d = null || datasetInput[6][1];
//     var metricsValueLatestBefore30d = null || datasetInput[29][1];
//     var metricsValueLatestBefore90d = null || datasetInput[89][1];
//     var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
//     var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "↘" : "↗") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
//     var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
//     var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "↘" : "↗") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
//     var metricsMetaComparisonQoQ = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore90d)) / parseFloat(metricsValueLatestBefore90d);
//     var metricsMetaComparisonQoQFormatted = (metricsMetaComparisonQoQ < 0 ? "↘" : "↗") + (metricsMetaComparisonQoQ * 100).toFixed(2) + "%";
//     return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, metricsMetaComparisonQoQ, metricsMetaComparisonQoQFormatted, null, 'N/A']
//   } else if (dayLengthInput >= 366) {
//     var metricsValueLatestBefore7d = null || datasetInput[6][1];
//     var metricsValueLatestBefore30d = null || datasetInput[29][1];
//     var metricsValueLatestBefore90d = null || datasetInput[89][1];
//     var metricsValueLatestBefore365d = null || datasetInput[364][1];
//     var metricsMetaComparisonWoW = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore7d)) / parseFloat(metricsValueLatestBefore7d);
//     var metricsMetaComparisonWoWFormatted = (metricsMetaComparisonWoW < 0 ? "↘" : "↗") + (metricsMetaComparisonWoW * 100).toFixed(2) + "%";
//     var metricsMetaComparisonMoM = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore30d)) / parseFloat(metricsValueLatestBefore30d);
//     var metricsMetaComparisonMoMFormatted = (metricsMetaComparisonMoM < 0 ? "↘" : "↗") + (metricsMetaComparisonMoM * 100).toFixed(2) + "%";
//     var metricsMetaComparisonQoQ = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore90d)) / parseFloat(metricsValueLatestBefore90d);
//     var metricsMetaComparisonQoQFormatted = (metricsMetaComparisonQoQ < 0 ? "↘" : "↗") + (metricsMetaComparisonQoQ * 100).toFixed(2) + "%";
//     var metricsMetaComparisonYoY = (parseFloat(metricsValueLatest) - parseFloat(metricsValueLatestBefore365d)) / parseFloat(metricsValueLatestBefore365d);
//     var metricsMetaComparisonYoYFormatted = (metricsMetaComparisonYoY < 0 ? "↘" : "↗") + (metricsMetaComparisonYoY * 100).toFixed(2) + "%";
//     return [metricsMetaComparisonWoW, metricsMetaComparisonWoWFormatted, metricsMetaComparisonMoM, metricsMetaComparisonMoMFormatted, metricsMetaComparisonQoQ, metricsMetaComparisonQoQFormatted, metricsMetaComparisonYoY, metricsMetaComparisonYoYFormatted]
//   } else {
//     return [null, 'N/A', null, 'N/A', null, 'N/A', null, 'N/A']
//   }
// }

// function dynamicColor(value, positive_is_bad) {
//   if (positive_is_bad == false) {
//     if (value <= 0) {
//       return "#ff5722";
//     } else {
//       return "#1db954";
//     }
//   } else {
//     if (value <= 0) {
//       return "#1db954";
//     } else {
//       return "#ff5722";
//     }
//   }
// }