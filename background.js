var createdAlarm = false;
chrome.runtime.onStartup.addListener(function() {
	createAlarmIfNeed();
});

chrome.runtime.onInstalled.addListener(function() {
	createAlarmIfNeed();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  getWords();
});

function createAlarmIfNeed() {
	if (createdAlarm == false) {
		createdAlarm = true;
		chrome.alarms.create("myAlarm", {periodInMinutes: 5} );
	};
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getWords() {
	var selectedCategory = window.localStorage.getItem('selectedOption');
	if (selectedCategory == null) {
		selectedCategory = "words";
	};
	
	var urlString = 'data/'+selectedCategory+".json";
	const url = chrome.runtime.getURL(urlString);
	fetch(url).then((response) => response.json()).then((json) => processJson(json));
}

function processJson(json) {
	var words = json["words"];
	randomWords(words);
}

function randomWords(words) {
	var index = getRndInteger(0, words.length - 1);
	var word = words[index];
	showNotification(word);
}

function showNotification(word) {
	var title = word.word + " • /" + word.pronunciation + "/";
	var message = "(" + word.category + ") • " + word.mean;
	chrome.notifications.clear('EnglishReminder',function(){
		console.log("Notification clear");
	});
	
	chrome.notifications.create('EnglishReminder', {
        type: 'basic',
        iconUrl: 'icons/icon.png',
        title: title,
        message: message,
        requireInteraction: true
     }, function(notificationId) {});
}