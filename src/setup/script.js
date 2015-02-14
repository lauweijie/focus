var step1El = document.getElementById('step1');
var step2El = document.getElementById('step2');
var step3El = document.getElementById('step3');

var nameEl = document.getElementById('name');
var emailEl = document.getElementById('email');

var selectAllBtnEl = document.getElementById('selectAllBtn');
var selectNoneBtnEl = document.getElementById('selectNoneBtn');
var siteSelectorListEl = document.getElementById('siteSelectorList');

var siteSelectorEls = document.getElementsByName('siteSelector');

var siteListEl = document.getElementById('siteList');

var backBtnEl = document.getElementById('backBtn');

// Create site list

siteData.forEach(function(siteObj) {
	var tdEl = document.createElement('td');
	tdEl.innerHTML = '<input type="checkbox" name="siteSelector" id="site-' + siteObj.id + '" value="' + siteObj.site + '"><label for="site-' + siteObj.id + '"><img src="img/' + siteObj.id + '.png"><p>' + siteObj.name + '</p></label>';
	siteSelectorListEl.appendChild(tdEl);
});

// Populate fields

var populate = function() {

	chrome.storage.local.get({name: ''}, function(items) {
		nameEl.value = items.name;
		update1();
	});

	chrome.storage.local.get({email: ''}, function(items) {
		emailEl.value = items.email;
		update1();
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

var update1 = function() {
	step1El.disabled = true;
	if(nameEl.value !== '' && emailEl.value !== '' && isEmail(emailEl.value)) {
		step1El.disabled = false;
	}
};

update1();

nameEl.addEventListener('keyup', update1);
nameEl.addEventListener('change', update1);
nameEl.addEventListener('mouseout', update1);

emailEl.addEventListener('keyup', update1);
emailEl.addEventListener('change', update1);
emailEl.addEventListener('mouseout', update1);


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
    site = site.replace(/^www./,''); // strips www from front of hostname
		if(site != '' && sites.indexOf(site) === -1) {
			sites.push(site);
		}
  });

	chrome.storage.local.set({'sites': sites});

});

// Step 4 - Repopulate when back button pressed

backBtnEl.addEventListener('click', populate);