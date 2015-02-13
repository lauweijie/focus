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

var storage = [];

var update = function() {
	console.log('Update triggered.');

	if(prevUpdate) {
		var update = prevUpdate;
		prevUpdate = null;
		var timeDiff = Math.floor((new Date() - update.time) / 1000);
		if(timeDiff > 0) {
			chrome.storage.local.get('usage', function(items) {
				var data = items.usage;
				if(typeof data !== 'object') {
					console.log('asd');
					data = new Object();
				}
				data[update.host] = (data[update.host] || 0) + timeDiff;
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
        		host: parser.hostname
        	};

        }
      });
    });
	});
};


	// chrome.notifications.create('', {
	// 	type: 'basic',
	// 	iconUrl: 'icons/icon48.png',
	// 	title: 'Hello world!',
	// 	message: 'Test!'
	// }, function() {});