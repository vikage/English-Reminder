document.addEventListener("DOMContentLoaded", function(event) { 
	const url = chrome.runtime.getURL('data/categories.json');
	fetch(url).then((response) => response.json()).then((json) => configCategories(json));
});

async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

async function configCategories(json) {
	var selectedOptionValue = window.localStorage.getItem('selectedOption');

	var subjectSelect = document.getElementById("subjectSelect");
	var categories = json["categories"];
	for (var i = 0; i < categories.length; i++) {
		var category = categories[i];
		var option = document.createElement('option');
		option.value = category.value;

		if (category.value === selectedOptionValue) {
			option.selected = "selected";
		}

		option.appendChild(document.createTextNode(category.name));

		subjectSelect.appendChild(option);
	};

	subjectSelect.onchange = function() {
		var subjectSelect = document.getElementById("subjectSelect");
		var selectedOption = subjectSelect[subjectSelect.selectedIndex].value;
		window.localStorage.setItem('selectedOption', selectedOption);
	}

	return true;
}