var sitesEl = document.getElementById('sites');
var statusEl = document.getElementById('status');

document.getElementById('save').addEventListener('click', function() {
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

chrome.storage.local.get({sites: []}, function(items) {
	sitesEl.value = items.sites.join("\n");
});