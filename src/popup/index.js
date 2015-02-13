document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get('usage', function(result) {
		displayArrayAsTable('container', result.usage);
			//{'google.com': 10, 'apple.com':20});
	});
});

function displayArrayAsTable(containerId, arrayObject) {
	var container = document.getElementById(containerId);
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	for (var value in arrayObject) {
		console.log(value);
		var row = document.createElement('tr');
		var cell = document.createElement('td');
		cell.textContent = value;
	    row.appendChild(cell);
	    var cell = document.createElement('td');
	    cell.textContent = arrayObject[value];
	    row.appendChild(cell);
	    tbody.appendChild(row);
	}
	table.appendChild(tbody);
	container.appendChild(table);
}