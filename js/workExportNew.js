chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    switch( request["type"] ){
        case "download_word":
            if( request["data"]["status"] ){
                window.open(request["data"]["url"]);
            }else{
                alert(request["data"]["msg"]);
            }
            $("#loadingBox").remove();
            break;
    }
    sendResponse(true);
});
async function run() {
    let functionInfo = {
        name: "QuestionExportNew",
        desc: "新版学习通作业导出",
        since: "1.0.1"
    };
    if (commandList && commandList[functionInfo["name"]] && commandList[functionInfo["name"]]["isAllowed"]) {
		let questionElements = [];
        let questionList = [];
        $(".questionLi").each((index, element) => {
            questionElements.push(element);
        });
        for (let questionElement of questionElements) {
            let question = {};
            question["title"] = titleParseNew(questionElement);
            question["type"] = typeParseNew(questionElement);
            let optionsAll = optionsParseNew(questionElement);
            question["options"] = optionsAll ? optionsAll["options"] : optionsAll;
            question["optionsArr"] = optionsAll ? optionsAll["optionsArr"] : optionsAll;

            question["answer"] = answerParseNew(questionElement);
            questionList.push(question);
        }
        if (questionList.length > 0) {
            $("body").append(`
                <div class="helperBox" id="helperBox">
                    <div class="contentBox">
                        <table border="1" class="questionListTable" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr>
                                    <td colspan="4" id="helper_notic"></td>
                                </tr>
                                <tr>
                                    <th style="width: 25px; min-width: 25px;">题号</th>
                                    <th style="width: 60%; min-width: 130px;">题目</th>
                                    <th style="min-width: 130px;">答案</th>
                                    <th style="min-width: 50px;">题型</th>
                                </tr>
                            </thead>
                            <tbody id="helperTableMain">
                            </tbody>
                        </table> 
                    </div>
                </div>
            `);
            let index = 1;
            for (let question of questionList) {
                if( ["单选题","多选题","判断题","填空题","简答题"].includes(question["type"]) ){
                    $("#helperTableMain").append(`
                        <tr style="cursor: pointer;">
                            <td >${index++}</td>
                            <td>${question["title"]}</td>
                            <td>${question["answer"]}</td>
                            <td>${question["type"]}</td>
                        </tr>
                    `);
                }
            }
            let exportQuestionList = [];
            for (let question of questionList) {
                let questionObject = {
                    id: 0,
                    name: question["type"],
                    content: question["title"],
                    analysis: "无",
                };
                if (question["type"] == "单选题" || question["type"] == "多选题") {
                    questionObject["type"] = question["type"] == "单选题" ? 0 : 1;
                    let tmpAnswer = [];
                    for (let key in question["options"]) {
                        tmpAnswer.push({
                            content: question["options"][key],
                            isanswer: question["answer"].includes(key),
                            name: key
                        });
                    }
                    questionObject["answer"] = tmpAnswer;
                } else if (question["type"] == "填空题") {
                    questionObject["type"] = 2;
                    let tmpAnswer = [];
                    for (let answer of question["answer"]) {
                        tmpAnswer.push({
                            content: answer,
                            name: tmpAnswer.length + 1
                        });
                    }
                    questionObject["answer"] = tmpAnswer;
                } else if (question["type"] == "判断题") {
                    questionObject["type"] = 3;
                    questionObject["answer"] = [{
                        answer: "对正确√".includes(question["answer"])
                    }];
                } else if (question["type"] == "简答题") {
                    questionObject["type"] = 4;
                    let tmpAnswer = [];
                    for (let key in question["answer"]) {
                        tmpAnswer.push({
                            answer: question["answer"][key]
                        });
                    }
                    questionObject["answer"] = tmpAnswer;
                } else {
                    continue;
                }
                exportQuestionList.push(questionObject);
            }
            if (exportQuestionList.length > 0) {
                $("#helperTableMain").prepend(`
                    <tr>
                        <td colspan="4">
                            <button id="download_word" class="helperButton helperButtonHoverChange" style="float: left; display: block;">点击下载Word文档</button>
                        </td>
                    </tr>
                `);
                $("#download_word").click(() => {
                    $("body").append(`
                        <div id="loadingBox" class="loading-bg" style="height:${document.documentElement.clientHeight}px;width:${document.documentElement.clientWidth}px">
                            <div class="loading-spin" style="margin:${(document.documentElement.clientHeight-50)/2}px auto;display:block;"></div>
                        </div>
                    `);
                    chrome.runtime.sendMessage({
                        type: "download_word",
                        data:exportQuestionList
                    });
                });
            }
            $("body").append(`
                <div class="middle-button-box" id="middle-button-box-1">
                    <button id="middle-button-text-1" class="middle-button-text" data-isHidden="false" data-toggle="展示题目列表">隐藏题目列表</button>
                </div>
            `);
            $(".middle-button-box").css("right",-145);
            $(".middle-button-box").css("top",(document.documentElement.clientHeight-50)/2);
            let isOver=false;
            $("#middle-button-box-1").on("mousemove mouseup",e=>{
                if( !isOver ){
                    anime({
                        targets: "#middle-button-box-1",
                        right:-18,
                        duration: 500,
                        easing: "easeInOutExpo"
                    });
                    $("#middle-button-box-1").on("mouseleave",e=>{
                        isOver=false;
                        anime({
                            targets: "#middle-button-box-1",
                            right:-145,
                            duration: 500,
                            easing: "easeInOutExpo"
                        });
                    });
                }
                isOver=true;
                
            });
            $("#middle-button-box-1").on("click",e=>{
                let middle=$("#middle-button-text-1").text();
                $("#middle-button-text-1").text($("#middle-button-text-1").attr("data-toggle"));
                $("#middle-button-text-1").attr("data-toggle",middle);
                if( $("#middle-button-text-1").attr("data-isHidden")=="true" ){
                    middle=0;
                    $("#middle-button-text-1").attr("data-isHidden","false");
                }else{
                    middle=-400;
                    $("#middle-button-text-1").attr("data-isHidden","true");
                }
                anime({
                    targets: "#helperBox",
                    right:middle,
                    duration: 500,
                    easing: "easeInOutExpo"
                });
            });
        }
        console.log(questionList);
    }
}