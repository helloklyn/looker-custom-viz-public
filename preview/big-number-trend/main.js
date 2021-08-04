// ANCHOR: Global Input Parameters
// NOTE: this is the naming to follow in .lkml
const inputDimensionNameLookML = "_date";

const visObject = {
  // HELP: Configuration options for your visualization.
  // all option value will be referred as config.chart_type for example
  // LINK: https://github.com/hongkuiw/visualization-api-examples/blob/master/docs/api_reference.md
  options: {
    chart_type: {
      type: "string",
      display: "select",
      label: "1. Select Line Chart Style",
      default: "line",
      values: [
        { Line: "line" },
        { Bar: "column" },
        { Spline: "spline" },
        { Area: "area" },
      ],
    },
    is_enable_marker: {
      type: "boolean",
      label: "1.1. Toggle for Marker",
      default: false,
    },
    line_color: {
      type: "string",
      display: "color",
      label: "2. Choose Primary Color",
      default: "#3259F9",
    },
    is_human_readable: {
      type: "boolean",
      label: "3. Toggle for Readable Number",
      default: false,
    },
    is_percentage_number: {
      type: "boolean",
      label: "4. Toggle for Percentage Number",
      default: false,
    },
    positive_is_bad: {
      type: "boolean",
      label: "5. Toggle for Positive Value is Bad or not?",
      default: false,
    },
    is_step_line: {
      type: "boolean",
      label: "6. Toggle for Step for Line Chart",
      default: false,
    },
    is_show_moving_average_line: {
      type: "boolean",
      label: "7. Toggle for Moving Average Line?",
      default: false,
    },
    line_color_secondary: {
      type: "string",
      display: "color",
      label: "7.1 Choose Secondary Color",
      default: "#85E0FF",
    },
    line_style_secondary: {
      type: "string",
      display: "select",
      label: "7.2 Choose Secondary Line Style",
      default: "Solid",
      values: [{ Solid: "Solid" }, { Dash: "Dash" }, { Dot: "Dot" }],
    },
    moving_average_window: {
      type: "string",
      display: "select",
      label: "7.3 Select window size for Moving Average Line",
      default: "7",
      values: [{ 3: "3" }, { 4: "4" }, { 6: "6" }, { 7: "7" }, { 14: "14" }, { 30: "30" }],
    },
    // is_show_reference_line: {
    //   type: "boolean",
    //   label: "8 Toggle for Reference Line",
    //   default: false,
    // },
    // value_reference_line: {
    //   type: "number",
    //   label: "8.1 Value of Reference Line",
    //   default: 0,
    // },
    // label_reference_line: {
    //   type: "string",
    //   label: "8.1 Label of Reference Line",
    //   default: "",
    // },
    // line_color_reference_line: {
    //   type: "string",
    //   display: "color",
    //   label: "8.2 Choose Reference Line Color",
    //   default: "#FF5722",
    // },
  },
  create: function (element, config) {
    // NOTE: define Style and HTML DOM
    element.innerHTML = `
      <style>
      .highcharts-figure #container{
        height: 90%;
        width: 90%;
        position: absolute;
        // fully responsiveness
      }
      .highcharts-figure #container:hover {
      }
      
      .highcharts-figure #container .highcharts-container {
        // border-radius: 20px;
        // filter: drop-shadow(2px 2px 2px #999999);
      }
      
      .highcharts-title {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 24px !important;
        margin-bottom: 10px;
      }
      
      .highcharts-metrics-value-latest {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 50px;
        font-weight: 600;
        line-height: 52px;
      }
      
      .highcharts-subtitle {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
      }

      .highcharts-subtitle text {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        color: "#181818";
        font-size: 14px;
        fill: #999999 !important;
      }
      
      .highcharts-axis-title {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
      }

      .highcharts-axis-labels .highcharts-yaxis-labels {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }

      .highcharts-axis-labels .highcharts-xaxis-labels {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        fill: #999999 !important;
      }
      
      .highcharts-subtitle .highcharts-metrics-growth-rate {
        font-family: "Circular Spotify Text", Helvetica, Arial, sans-serif;
        font-style: Bold !important;
        font-size: 16px !important;
        margin: 0px;
      }
      .highcharts-metrics-by {
        font-size: 14px;
        font-style: italic;
        fill: #999999 !important;
      }
      .highcharts-as-of-date {
        font-size: 12px;
        font-style: italic;
        fill: #999999 !important;
      }
      </style>
      <figure class="highcharts-figure">
      <div id="container"></div>
      </figure>
      `;
  },
  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // Error Handling
    // Clear any errors from previous updates.
    this.clearErrors();
    // Throw some errors and exit if the shape of the data isn't what this chart needs.
    var errorMessage = `
    Instructions🧭
    This viz package requires
    1 dimension in Date ISO format (yyyy-mm-dd)
    e.g.: 2021-01-03
    1 measure
    Please contact Hong Wu(@hongkuiw) if you still facing errors
    `;

    if (
      queryResponse.fields.dimensions.length == 0 ||
      (queryResponse.fields.dimensions.length == 1 && queryResponse.fields.measures.length > 1)
    ) {
      // this.addError($(".highcharts-description").html(errorMessage));
      // return;
      console.error(errorMessage);
      return;
    }

    // console.log(data);
    // console.log(element)
    // console.log(config)
    // console.log(queryResponse);
    // console.log(details)
    // console.log(done)

    // ANCHOR: 1.0 - Processing queryResponse

    function prepareChartInputParameters(data, queryResponse) {
      
      var dataRecords = generateDataRecords(data);
      
      // ANCHOR: 1.6 - Get DOM Metadata to dynamically handle width of Bars in Bar Chart
      var highchartsFigureWidth = document.getElementsByClassName("highcharts-figure")[0].offsetWidth;
      var pointWidthResponsive = parseInt((highchartsFigureWidth / dataRecords.length) * 0.8);
      
      // ANCHOR: 1.1 - Get Meta from queryResponse
      var viewName = queryResponse.fields.dimensions.length > 0 ? queryResponse.fields.dimensions[0].view : queryResponse.fields.measures[0].view;
      var measureName = queryResponse.fields.measures[0].name;
      measureMetaInfoValue = getFieldMetaInfoValue(queryResponse, measureName)
      
      // ANCHOR: 1.1.1 - Process date aggregations
      var xHeaderName = queryResponse.fields.dimensions[0].name;
      var xHeaderNameDate = viewName + "." + inputDimensionNameLookML + "_date";
      var xHeaderNameMonth = viewName + "." + inputDimensionNameLookML + "_month";
      // HELP: looker return format: 2021-05 → convert to 2021-05-01
      var xHeaderNameQuarter = viewName + "." + inputDimensionNameLookML + "_quarter";
      // HELP: looker return format: 2021-Q1 → convert to 2021-01-01, 2021-04-01
      var xHeaderNameWeek = viewName + "." + inputDimensionNameLookML + "_week";
      var xHeaderNameYear = viewName + "." + inputDimensionNameLookML + "_year";
      // HELP: looker return format: 2021 → convert to 2021-01-01
      
      // ANCHOR: 1.1.2 - Process dataRecords with different level of aggregation
      // HELP: convert them into yyyy-mm-dd ISO format then convert into unix timestamp
      switch (xHeaderName) {
        case xHeaderNameDate:
          dataRecords.forEach((d) => { d[xHeaderName] = Date.parse(d[xHeaderNameDate]) });
          break;
        case xHeaderNameWeek:
          dataRecords.forEach((d) => { d[xHeaderName] = Date.parse(d[xHeaderNameWeek]) });
          break;
        case xHeaderNameMonth:
          dataRecords.forEach((d) => { d[xHeaderName] = Date.parse(d[xHeaderNameMonth] + "-01") });
          break;
        case xHeaderNameQuarter:
          dataRecords.forEach((d) => { d[xHeaderName] = Date.parse(d[xHeaderNameQuarter] + "-01") });
          break;
        case xHeaderNameYear:
          dataRecords.forEach((d) => { d[xHeaderName] = Date.parse(d[xHeaderNameYear] + "-01-01") });
          break;
      }
  
      // ANCHOR: 1.2 - Sort Data for Latest Value
      var dataRecordsSorted = dataRecords.slice().sort((a, b) => d3.descending(a.xHeaderName, b.xHeaderName));
      // HELP: sort pick latest value
      dataHighCharts = generateHighChartsDataSeries(dataRecordsSorted);
  
      // ANCHOR: 1.3 - Get Charting MetaData
      var chartTitle = queryResponse.fields.measures[0].label_short;
      var asOfDate = data[0][xHeaderName]["value"];
      var asOfDateValue = dataRecordsSorted[0][measureName];
  
      // ANCHOR: 1.4 - Preparing Growth Comparison
      // HELP: generate 1D array
      var dataRecordsSorted1D = []
      dataHighCharts.forEach(d=>{ dataRecordsSorted1D.push(d[1]) })
      // console.log(dataRecordsSorted1D)
  
      switch (xHeaderName) {
        case xHeaderNameDate:
          growthRateArrayWoW = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 7)
          growthRateArrayMoM = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 30)
          growthRateArrayQoQ = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 90)
          growthRateArrayYoY = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 365)
          break;
        case xHeaderNameWeek:
          growthRateArrayWoW = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 1)
          growthRateArrayMoM = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 4)
          growthRateArrayQoQ = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 12)
          growthRateArrayYoY = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 52)
          break;
        case xHeaderNameMonth:
          growthRateArrayWoW = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayMoM = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 1)
          growthRateArrayQoQ = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 3)
          growthRateArrayYoY = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 12)
          break;
        case xHeaderNameQuarter:
          growthRateArrayWoW = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayMoM = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayQoQ = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 1)
          growthRateArrayYoY = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 4)
          break;
        case xHeaderNameYear:
          growthRateArrayWoW = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayMoM = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayQoQ = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 0)
          growthRateArrayYoY = calculateGrowthVsNPeriodAgo(dataRecordsSorted1D, 1)
          break;
      }
  
      // ANCHOR: 1.5 - Preparing Moving Avg Reference Line
      var measureArray = [];
      var dataHighChartsMovingWindowAvgLine = [];
  
      if (dataHighCharts.length > 7) {
        dataHighCharts.map((d) => { measureArray.push(d[1]) });
        var measureArrayMovingWindowAvg = movingAverage(measureArray,config.moving_average_window).slice(config.moving_average_window-1, -1);
        // NOTE: move array forward
        dataHighCharts.map((e, i) => { dataHighChartsMovingWindowAvgLine.push([e[0],measureArrayMovingWindowAvg[i]]) });
        // console.log(dataHighChartsMovingWindowAvgLine);
      }

      return {
        'measureMetaInfoValue': measureMetaInfoValue
        , 'chartTitle': chartTitle
        , 'xHeaderName': xHeaderName
        , 'asOfDateValue': asOfDateValue
        , 'asOfDate': asOfDate
        , 'growthRateArrayWoW': growthRateArrayWoW
        , 'growthRateArrayMoM': growthRateArrayMoM
        , 'growthRateArrayQoQ': growthRateArrayQoQ
        , 'growthRateArrayYoY': growthRateArrayYoY
        , 'dataHighCharts': dataHighCharts
        , 'dataHighChartsMovingWindowAvgLine': dataHighChartsMovingWindowAvgLine
        , 'pointWidthResponsive': pointWidthResponsive
      }
    }

    var chartInputParameters = prepareChartInputParameters(data, queryResponse)
    var measureMetaInfoValue = chartInputParameters.measureMetaInfoValue
    var chartTitle = chartInputParameters.chartTitle
    var xHeaderName = chartInputParameters.xHeaderName
    var asOfDateValue = chartInputParameters.asOfDateValue
    var asOfDate = chartInputParameters.asOfDate
    var growthRateArrayWoW = chartInputParameters.growthRateArrayWoW
    var growthRateArrayMoM = chartInputParameters.growthRateArrayMoM
    var growthRateArrayQoQ = chartInputParameters.growthRateArrayQoQ
    var growthRateArrayYoY = chartInputParameters.growthRateArrayYoY
    var dataHighCharts = chartInputParameters.dataHighCharts
    var dataHighChartsMovingWindowAvgLine = chartInputParameters.dataHighChartsMovingWindowAvgLine
    var pointWidthResponsive = chartInputParameters.pointWidthResponsive

    // ANCHOR: Actual Charting Function - Start
    Highcharts.chart("container", {
      chart: {
        zoomType: "x",
        panning: "true",
        panKey: "shift",
        type: config.chart_type,
        events: {
          load: function() {
            this.title.on('mouseover', e => {
              myLabel = this.renderer.label(measureMetaInfoValue[0]['description'], e.x, e.y, 'rectangle')
                .css({ color: '#FFFFFF'})
                .attr({
                    fill: "#181818"
                  , 'font-family': "Circular Spotify Text, Helvetica, Arial, sans-serif",
                })
                .add()
                .toFront();
            })
            this.title.on('mouseout', e => { if (myLabel) { myLabel.destroy(); }})
          }
        }
      },
      title: {
        text:
        chartTitle
        + '<br>' + '<p class="highcharts-metrics-by">by ' + (xHeaderName.split('.')[1]).split('_')[2] + '</p>'
          + '<br>'
          + '<br>'
          + '<br>'
          + '<p class="highcharts-metrics-value-latest">' + humanReadableNumber(percentageNumber(asOfDateValue.toFixed(2), config.is_percentage_number),config.is_human_readable) + "</p>",
        align: "left",
      },
      subtitle: {
        text:
            '<p class="highcharts-metrics-growth-rate" style="color:' + dynamicColor(growthRateArrayWoW[0], config.positive_is_bad) + '">' + (growthRateArrayWoW[3] + growthRateArrayWoW[1]) + "</p>" + " WoW" + ";    "
          + '<p class="highcharts-metrics-growth-rate" style="color:' + dynamicColor(growthRateArrayMoM[0], config.positive_is_bad) + '">' + (growthRateArrayMoM[3] + growthRateArrayMoM[1]) + "</p>" + " MoM" + "; <br>"
          + '<p class="highcharts-metrics-growth-rate" style="color:' + dynamicColor(growthRateArrayQoQ[0], config.positive_is_bad) + '">' + (growthRateArrayQoQ[3] + growthRateArrayQoQ[1]) + "</p>" + " QoQ" + ";    "
          + '<p class="highcharts-metrics-growth-rate" style="color:' + dynamicColor(growthRateArrayYoY[0], config.positive_is_bad) + '">' + (growthRateArrayYoY[3] + growthRateArrayYoY[1]) + "</p>" + " YoY" + "; <br>"
          + '<p class="highcharts-as-of-date"> as of ' + (xHeaderName.split('.')[1]).split('_')[2] + ": " + asOfDate + "</p>",
        align: "left",
        useHTML: false,
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: {
        title: {
          text: undefined,
          // remove yAxis label
        },
        // plotLines: [
        //   {
        //     value:
        //       config.is_show_reference_line == false ? null : parseFloat(config.value_reference_line),
        //     color:
        //       config.is_show_reference_line == false ? null : config.line_color_reference_line,
        //     width: config.is_show_reference_line == false ? 0 : 2,
        //     label: {
        //       formatter: function() {
        //         return config.is_show_reference_line == false ? null : config.label_reference_line + ": " + this.options.value;
        //       }
        //     },
        //   },
        // ],
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: [0, 0, 0, 200],
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba"),],
            ],
          },
          marker: {
            enabled: false,
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },

      series: [
        {
          // type: config.chart_type,
          id: "default",
          name: chartTitle,
          color: config.line_color,
          data: dataHighCharts,
          pointWidth: pointWidthResponsive,
          lineWidth: 3,
          step: config.is_step_line,
          marker: {
            enabled: config.is_enable_marker,
          },
        },
        {
          id: "movingWindowAvgLine",
          name: "Moving " + config.moving_average_window + ((xHeaderName.split('.')[1]).split('_')[2]).charAt(0) +" Avg. " + chartTitle,
          color: config.line_color_secondary,
          data: dataHighChartsMovingWindowAvgLine,
          pointWidth: pointWidthResponsive,
          lineWidth: 2,
          dashStyle: config.line_style_secondary,
          marker: {
            enabled: false,
          },
          visible: config.is_show_moving_average_line,
        },
      ],
    });

    //ANCHOR: Actual Charting Function - Ends
    done();
  },
};

looker.plugins.visualizations.add(visObject);
