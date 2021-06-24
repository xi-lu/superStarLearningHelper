let commandList = {};
chrome.runtime.sendMessage({
    type: "init"
}, (response) => {
    console.log(response);
    commandList = response["commandList"];
    run();
});