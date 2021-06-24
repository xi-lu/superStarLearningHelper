chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	let response = {};
	switch (request["type"]) {
		case "init":
			response = init();
			break;
		case "loading":
			getCurrentTabId(tabId => {
				chrome.tabs.insertCSS(tabId, { file: "./css/helperBox.css" });
			});
			break;
		case "download_word":
			response = goDown(request["data"]);
			// response={status:true};
			break;
	}
	sendResponse(response);
});

function sendMessageToContentScript(message, callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
			if (callback) callback(response);
		});
	});
}

function init() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://static.mooc.xxcheng.top/config.json?${Date.now()}`, false);
	xhr.send();
	return JSON.parse(xhr.responseText);
}

function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

async function goDown(qjson) {
	let fdata = new FormData();
	fdata.append("qjson", JSON.stringify(qjson));
	let response = await fetch("https://mooc.xxcheng.top/export/api/toWord.php", {
		method: "POST",
		headers: {
			// "content-type": "application/x-www-form-urlencoded;charset=utf-8",
		},
		body: fdata
	});

	let data = await response.json();
	sendMessageToContentScript({
		type: "download_word",
		data: data
	}, function (res) {
		console.log("来自content的回复：" + res);
	});
}

function storageDeal(data) {

}