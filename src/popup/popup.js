var getToday = function() {
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

var processDataForDay = function(daysAgo, usage, sites) {
  var day = new Date(getToday() - 86400000 * daysAgo);
  if(usage[day]) {
    var timeWasted = 0;
    for(var site in usage[day]) {
      var isBlackhole = sites.indexOf(site) !== -1;
      if (isBlackhole) {
        timeWasted += usage[day][site];
      }
    }
    return {
      timeWasted: timeWasted
    };
  } else {
    return false;
  }
};

var updateData = function() {

  chrome.storage.local.get({sites: [], usage: new Object()}, function(items) {
    var today = processDataForDay(0, items.usage, items.sites);
    if(today) {
      document.getElementById('timeWasted').innerHTML = (today.timeWasted / 60).toFixed(1);
    }
  });

};

updateData();

chrome.storage.onChanged.addListener(updateData);

document.getElementById('timeWastedContainer').addEventListener('click', function(){
  chrome.tabs.create({
      url: "src/main/index.html"
  });
});