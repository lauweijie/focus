chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// console.log('tabs.onUpdated');
	// console.log(tabId, changeInfo, tab);
	update();
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	// console.log('tabs.onActivated');
	// console.log(activeInfo);
	update();
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
	update();
});

var sites = [''];

var update = function() {
	console.log('Update triggered.');
	chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.windows.get(tab.windowId, function(window) {
        if(window.focused) {
        	// tab is active and window is focused
        	console.log(tab.url);
        	var parser = document.createElement('a');
        	parser.href = tab.url;
        	console.log(parser.hostname);
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