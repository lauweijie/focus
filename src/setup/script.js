var step1El = document.getElementById('step1');
var step2El = document.getElementById('step2');
var step3El = document.getElementById('step3');

var nameEl = document.getElementById('name');
var emailEl = document.getElementById('email');

var selectAllBtnEl = document.getElementById('selectAllBtn');
var selectNoneBtnEl = document.getElementById('selectNoneBtn');

var siteSelectorEls = document.getElementsByName('siteSelector');

var siteListEl = document.getElementById('siteList');

var backBtnEl = document.getElementById('backBtn');

// Populate fields

var populate = function() {

	chrome.storage.local.get({name: ''}, function(items) {
		nameEl.value = items.name;
	});

	chrome.storage.local.get({email: ''}, function(items) {
		emailEl.value = items.email;
	});

	chrome.storage.local.get({sites: []}, function(items) {
		var sites = items.sites;
	  var checkboxes = siteSelectorEls;
	  for(var i = 0; i < checkboxes.length; i++) {
	  	var match = sites.indexOf(checkboxes[i].value);
	  	if(match !== -1) {
	  		checkboxes[i].checked = true;
	  		sites.splice(match, 1);
	  	}
	  }
	  siteListEl.value = sites.join("\n");
	});

};

populate();

// Step 1 - Validate

var isEmail = function(email) {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

var update = function() {
	step1El.disabled = true;
	if(nameEl.value !== '' && emailEl.value !== '' && isEmail(emailEl.value)) {
		step1El.disabled = false;
	}
};

update();

nameEl.addEventListener('keyup', update);
nameEl.addEventListener('change', update);
nameEl.addEventListener('mouseout', update);

emailEl.addEventListener('keyup', update);
emailEl.addEventListener('change', update);
emailEl.addEventListener('mouseout', update);


// Step 2 - Respond to select all and select none buttons

selectAllBtnEl.addEventListener('click', function() {
  var checkboxes = siteSelectorEls;
  for(var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
  }
});

selectNoneBtnEl.addEventListener('click', function() {
  var checkboxes = siteSelectorEls;
  for(var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
});


// Step 3 - Save form data

step3El.addEventListener('click', function() {

	chrome.storage.local.set({'name': nameEl.value});
	chrome.storage.local.set({'email': emailEl.value});

  var checkboxes = siteSelectorEls;
  var sites = [];
  for(var i = 0; i < checkboxes.length; i++) {
    if(checkboxes[i].checked) {
    	sites.push(checkboxes[i].value);
    }
  }

  siteListEl.value.split("\n").forEach(function(site) {
		site = site.toLowerCase();
		site = site.replace(/^[a-z]+:\/\//, ''); // strips protocol
		site = site.replace(/\/.*$/, ''); // strips path
		site = site.replace(/\s/g, ''); // strips whitespace
		if(site != '' && sites.indexOf(site) === -1) {
			sites.push(site);
		}
  });

	chrome.storage.local.set({'sites': sites});

});

// Step 4 - Repopulate when back button pressed

backBtnEl.addEventListener('click', populate);