chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	update();
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	update();
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
	update();
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	update();
});

chrome.alarms.onAlarm.addListener(function(alarm){
	update();
});

chrome.alarms.create('', {periodInMinutes: 1});

var prevUpdate;

var update = function() {
	console.log('Update triggered.');

	if(prevUpdate) {
		var update = prevUpdate;
		prevUpdate = null;
		var timeDiff = Math.floor((new Date() - update.time) / 1000);
		var today = getToday();
    // only update store if timeDiff is not zero and host has a dot
		if(timeDiff > 0 && /.+\..+/.test(update.host)) {
			chrome.storage.local.get({usage: new Object()}, function(items) {
				var data = items.usage;
				if(!data[today]) {
					data[today] = new Object();
				}
				data[today][update.host] = (data[today][update.host] || 0) + timeDiff;
				chrome.storage.local.set({'usage': data});
				console.log(data);
			});
		}
	}

	chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.windows.get(tab.windowId, function(window) {
        if(window.focused) {
        	// tab is active and window is focused
        	var parser = document.createElement('a');
        	parser.href = tab.url;

        	prevUpdate = {
        		time: new Date(),
        		host: parser.hostname.replace(/^www./,'') // strip www from front of hostname
        	};

        }
      });
    });
	});
};


var periodicExecutor = function(fn, period) {
  fn();
  setTimeout(function() {
    periodicExecutor(fn, period);
  }, period);
};

periodicExecutor(update, 5000);

var getToday = function() {
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

// Open setup page for new installs

chrome.storage.local.get({installed: false}, function(items) {
  var installed = items.installed;
  if(!installed) {
    chrome.storage.local.set({'installed': new Date()});
    chrome.tabs.create({url: "src/setup/index.html"});
  }
});


	// chrome.notifications.create('', {
	// 	type: 'basic',
	// 	iconUrl: 'icons/icon48.png',
	// 	title: 'Hello world!',
	// 	message: 'Test!'
	// }, function() {});