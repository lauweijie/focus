var saveEl = document.getElementById('save');
var sitesEl = document.getElementById('sites');
var statusEl = document.getElementById('status');
var advancedLinkEl = document.getElementById('advancedLink');
var advancedSettingsEl = document.getElementById('advancedSettings');
var clearHistoryLinkEl = document.getElementById('clearHistoryLink');

saveEl.addEventListener('click', function() {
	var sites = [];
	sitesEl.value.split("\n").forEach(function(site) {
		site = site.toLowerCase();
		site = site.replace(/^[a-z]+:\/\//, ''); // strips protocol
		site = site.replace(/\/.*$/, ''); // strips path
		site = site.replace(/\s/g, ''); // strips whitespace
		if(site != '' && sites.indexOf(site) === -1) {
			sites.push(site);
		}
	});
	chrome.storage.local.set({'sites': sites});
	sitesEl.value = sites.join("\n");
	statusEl.innerHTML = 'Settings Saved!';
});

advancedLinkEl.addEventListener('click', function() {
	advancedLinkEl.style.display = 'none';
	advancedSettingsEl.style.display = 'inherit';
});

clearHistoryLinkEl.addEventListener('click', function() {
	chrome.storage.local.set({'usage': new Object()}, function() {
		statusEl.innerHTML = 'Saved history successfully cleared!';
	});
});

chrome.storage.local.get({sites: []}, function(items) {
	sitesEl.value = items.sites.join("\n");
});