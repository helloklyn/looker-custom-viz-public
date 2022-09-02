// NOTE: DEPENDENCIES

// https://code.jquery.com/jquery-2.2.4.min.js,
// https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js,
// https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js,
// https://cdnjs.cloudflare.com/ajax/libs/d3-annotation/2.5.1/d3-annotation.min.js,
// https://cdn.jsdelivr.net/npm/d3-array@3.0.1/dist/d3-array.min.js,
// https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js,
// https://code.highcharts.com/highcharts.js,
// https://code.highcharts.com/modules/data.js,
// https://code.highcharts.com/modules/exporting.js,
// https://code.highcharts.com/modules/export-data.js,
// https://code.highcharts.com/modules/accessibility.js,
// https://code.highcharts.com/highcharts-more.js

// ANCHOR: Gloal 


const visObject = {
  // Configuration options for your visualization.
  // all option value will be referred as config.chart_type for example
  // LINK: https://github.com/hongkuiw/visualization-api-examples/blob/master/docs/api_reference.md
  options: {
    accordion_body_01: {
      type: "string",
      display: "text",
      label: "01. Body Text for Introduction",
      default: "introduction text, `pre` [link](), **blod text** highlight"
    },
    accordion_body_02: {
      type: "string",
      display: "text",
      label: "02. Body Text for Contact Support",
      default: " "
    },
    accordion_body_03: {
      type: "string",
      display: "text",
      label: "03. Body Text for Ideas or Feedbacks",
      default: " "
    },
    accordion_body_04: {
      type: "string",
      display: "text",
      label: "04. Body Text for Change History",
      default: " "
    },
    accordion_body_05: {
      type: "string",
      display: "text",
      label: "05. Body Text for Links & Share",
      default: " "
    },
  },
  create: function (element, config) {
    element.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>
      //ANCHOR: define your CSS style here
      .card {
        border: 1px solid red;
      }
      
      .card-title {
        font-size: 18px;
      }
      
      .card-text {
        font-size: 12px;
      
      }
      
      .btn {
        background-color: #1ed760 !important;
        border: none;
        color: #000000 !important;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 500px;
      }
      .card-img-top {
        // width: 50%;
        // height: 50%;
        // position:absolute;
        // clip:rect(0,200px,300px,0);
        max-width: 100%;
        height: auto;
        object-fit: cover;
      }

      </style>

      <div class="card" style="">
        <img id="event-image" src="" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 id="event-title" class="card-title"></h5>
          <p id="event-information" class="card-text"></p>
          <a id="event-url" href="" class="btn btn-primary">Find Tickets</a>
        </div>
      </div>
      
      `;
  },
  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    done
  ) {
    // Error Handling
    // Clear any errors from previous updates.
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs.
    // if (queryResponse.fields.dimensions.length == 0) {
    //   this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
    //   return;
    // }

    console.log(data)
    console.log(element)
    console.log(config)
    console.log(queryResponse)
    console.log(details)
    console.log(done)

    // https://getbootstrap.com/docs/5.2/getting-started/introduction/
    const BASE_URL = "https://tickets.spotify.com/api/public/v1/events/"
    eventId = "	cfbbb88b-f70a-41c9-85dc-7d6c205094dd"
    // "02a4621e-5e30-4fe2-8034-c705f3fa6fa7"

    var FETCH_URL = BASE_URL + eventId
    console.log(FETCH_URL)

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    eventData = JSON.parse(httpGet(FETCH_URL))
    console.log(eventData)

    eventName = eventData['name']

    promoImageUrl = eventData['promo_image_url']
    ticketsSpotifyComUrl = eventData['url']
    venueName = eventData['venue']['name']


    console.log(eventName)
    console.log(promoImageUrl)
    console.log(ticketsSpotifyComUrl)

    var eventArtistNames = []

    eventData['artists'].forEach(d=>{
      console.log(d['artist']['name'])
      eventArtistName = d['artist']['name']
      eventArtistNames.push(eventArtistName)
    })

    console.log(eventArtistNames)

    var eventArtistNamesString = eventArtistNames.toString()
    console.log(eventArtistNamesString)


    var eventImage = document.getElementById("event-image")
    eventImage.src = promoImageUrl

    var eventTitle = document.getElementById("event-title")
    eventTitle.innerHTML = '<span class="material-symbols-outlined">local_activity</span>' + " " + eventName

    var eventUrl = document.getElementById("event-url")
    eventUrl.href = ticketsSpotifyComUrl

    var eventInformation = document.getElementById("event-information")
    eventInformation.innerHTML = '<span class="material-symbols-outlined">mic_external_on</span>' + " " + eventArtistNamesString
    

    done();
  },
};

looker.plugins.visualizations.add(visObject);