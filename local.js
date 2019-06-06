var queryDict = {stop: 400153, dir: 1, message: false}
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

// Add a message below the display if needed.
if (queryDict.message != false) {
  $("#message").html(decodeURIComponent(queryDict.message));
}

// Configure the display of time.
moment.updateLocale('en', {
  relativeTime : {
    future: "%s",
    past:   "Now",
    s  : 'Now',
    ss : 'Now',
    m:  "1min",
    mm: "%dmin",
    h:  "an hour",
    hh: "%dhours",
    nd:  "a day",
    dd: "%d days",
    M:  "a month",
    MM: "%d months",
    y:  "a year",
    yy: "%d years"
  }});





/*
 *
 * Set your own date in the future here.
 *
 **/

const time_to_event = moment([2031, 0, 1]);

/******/

var years_to_event = time_to_event.diff(moment(), 'years', true).toFixed(1);
var months_to_event = time_to_event.diff(moment(), 'months', true).toFixed(1);
var days_to_event = time_to_event.diff(moment(), 'days', true).toFixed(1);

var between_now_and_event = time_to_event.diff(moment());
var duration = moment.duration(between_now_and_event).minutes();


/*
 *
 * Adjust the message below to reflect what you want to say.
 *
 **/

const marquee_message =
  `<li id="xkcd"><marquee>

  1.5˚ Climate Crisis ${years_to_event} years <span id="minutes" class='part'>${duration}</span>min

  </marquee></li>`;

/*******/







$(".prependto").append(marquee_message);

/* RENDER THE CHANGE */

var render_page = function(latest) {

  var items = [];

  items.push( "<li  class='remove' id='yo" + 0 + "'><span class='busn'>" +
    latest.PublishedLineName[0] + "</span> <span class='destination'>" +
    latest.DestinationName + "</span> <span class='time'>" +
    moment(latest.MonitoredCall.ExpectedArrivalTime).fromNow() + "</span></li>" );

  let between_now_and_event = time_to_event.diff(moment());
  let duration = moment.duration(between_now_and_event).minutes();

  $('#minutes').replaceWith("<span id='part'>" + duration + "</span>");

  $('.remove').remove();
  $(".prependto").prepend(items);

}

/* QUERY THE API */

const key = "a407ac8f-a1ec-4ce2-a1db-39dcbf47f2ee";

var query_stop_data = function() {
  const request_url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${key}&version=2&MonitoringRef=${queryDict.stop}&StopMonitoringDetailLevel=minimum`;

  $.getJSON( request_url, function( data ) {
    var latest = null;
    const monitored = data["Siri"]["ServiceDelivery"]["StopMonitoringDelivery"][0]["MonitoredStopVisit"];

    $.each(monitored, function(key, val) {
      const current = val["MonitoredVehicleJourney"];
      const current_time = moment(current["MonitoredCall"]["ExpectedArrivalTime"]);

      if (current["MonitoredCall"]["ExpectedArrivalTime"]) {
        if (latest) {
          if (moment(latest["MonitoredCall"]["ExpectedArrivalTime"]).diff(current_time) > 0) {
            latest = current;
          }
        } else {
          latest = current;
        }
      }

    });

    render_page(latest);

  });
}

query_stop_data();

setInterval(query_stop_data, 20000);

function toggleFullscreen() {
  var elem = document.querySelector("html");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().then({}).catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

$("body").on( "click", function( event ) {
  toggleFullscreen();
});
