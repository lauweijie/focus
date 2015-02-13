var updateData = function() {
  document.getElementById('data').innerHTML = '';
  chrome.storage.local.get({usage: new Object()}, function(items) {
    var data = items.usage;
    for(var day in items.usage) {
      var divEl = document.createElement('div');
      var h2El = document.createElement('h2');
      var daysAgo = Math.floor((new Date() - new Date(day)) / 86400000);
      h2El.innerHTML = day + ' (' + daysAgo + ' days ago)';
      divEl.appendChild(h2El);
      var ulEl = document.createElement('ul');
      for(var site in items.usage[day]) {
        var liEl = document.createElement('li');
        liEl.innerHTML = site + ' (' + items.usage[day][site] + 's)';
        ulEl.appendChild(liEl);
      }
      divEl.appendChild(ulEl);
      document.getElementById('data').appendChild(divEl);
    }
  });
};

chrome.storage.onChanged.addListener(updateData);

updateData();