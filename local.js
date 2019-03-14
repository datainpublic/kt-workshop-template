var queryDict = {stop: 3010007, dir: 1, message: false}
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

moment.updateLocale('en', {
    relativeTime : {
        future: "%s",
        past:   "Nå",
        s  : 'Nå',
        ss : 'Nå',
        m:  "1min",
        mm: "%dmin",
        h:  "an hour",
        hh: "%d hours",
        nd:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }});

var n = moment([2031, 0, 1])
var day = n.diff(moment(), 'years', true);
var di = n.diff(moment());

var duration = moment.duration(di);

if (queryDict.message != false) {
  $("#message").html(decodeURIComponent(queryDict.message));
}

$(".prependto").append("<li id='xkcd'><marquee>1.5˚ Climate Crisis " + day.toFixed(1) + " years <span class='part'>" + duration.minutes() + "</span> min</marquee></li>")

function foo() {
  $.getJSON( "http://reisapi.ruter.no/StopVisit/GetDepartures/" + queryDict.stop, function( data ) {
    var items = [];
    var lol = 0;
    $.each( data, function( key, val ) {
      if (val.MonitoredVehicleJourney.DirectionRef == queryDict.dir && lol < 1) {
        lol++;
        items.push( "<li  class='derp' id='yo" + key + "'><span class='busn'>" + val.MonitoredVehicleJourney.LineRef + "</span> <span class='destination'>" + val.MonitoredVehicleJourney.DestinationName + "</span> <span class='time'>" + moment(val.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime).fromNow() + "</span></li>" );
      } else if (val.MonitoredVehicleJourney.DirectionRef == null && lol < 1)  {
        lol++;
        items.push( "<li  class='derp' id='yo" + key + "'><span class='busn'>" + val.MonitoredVehicleJourney.LineRef + "</span> <span class='destination'>" + val.MonitoredVehicleJourney.DestinationName + "</span> <span class='time'>" + moment(val.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime).fromNow() + "</span></li>" );
      }
    });

    day = n.diff(moment(), 'years', true);
    di = n.diff(moment());
    duration = moment.duration(di);

    $('.part').replaceWith("<span id='part'>" + duration.minutes() + "</span>");

    $('.derp').remove();
    $(".prependto").prepend(items);
  });

}

foo();

setInterval(foo, 10000);


function toggleFullscreen() {
  var elem = document.querySelector("#wrapper");

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
