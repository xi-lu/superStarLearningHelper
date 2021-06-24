let cookies = [];
let helper = {};
chrome.cookies.getAll({
    domain: ".chaoxing.com"
}, (getCookies) => {
    cookies = getCookies;
});
reqHttp("https://mooc.xxcheng.top/app/api/query/notice.php?from=miniapp&version=2.0.1", "GET", {}, null, res=>{
	document.querySelector('#notice').innerHTML=res.text;
	console.log(res.text);
});
$("#backButton").on("click", (e) => {
    $("#backButton").css("display", "none");
    $(helper["isActiveBox"]).css("display", "none");
    $(".course-list").css("display", "block");
    anime({
        targets: ".course-list",
        top: 0,
        duration: 1500
    });
    document.documentElement.scrollTop = helper["scrollTop"];
});
$(() => {
    doReqSimple("http://i.chaoxing.com/settings/info", "GET", null, (data) => {
        doReqSimple("http://mooc1-1.chaoxing.com/visit/interaction", "GET", null, (t) => {
            if (!t["header"]["status"]) {
                window.open("https://passport2.chaoxing.com/login?fid=&newversion=true");
                return;
            }
        });
        if (data["header"]["status"]) {
            userPageBuild(data["text"]);
            $("#wait").css("display", "none");
            $("#userBox").css("display", "block");
        } else {
            window.open("https://passport2.chaoxing.com/login?fid=&newversion=true");
        }
    });
});

function userPageBuild(html) {
    let dom = $(new DOMParser().parseFromString(html, "text/html"));
    $(".user-img").attr("src", dom.find("#mainphoto").attr("src"));
    $(".user-name").text(dom.find("#resetRealnamespac").text());
    $(".user-phone").text(dom.find("#resetphonespac").text());
    $(".user-id").text(dom.find("#resetIDspac").text());
    //查询接口
    let userDetail = new FormData();
    userDetail.append("usid",md5(`dom.find("#resetRealnamespac").text()_dom.find("#resetIDspac").text()`));
    reqHttp("https://mooc.xxcheng.top/app/api/query/index.php","POST",{},userDetail,e=>{
        console.log(e);
    })
    loadingUserCourse();
}

function loadingUserCourse() {
    doReqSimple("https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&rss=1", "GET", null, (data) => {
        if (data["header"]["status"]) {
            let result = JSON.parse(data["text"]);
            if (result["channelList"].length > 0) {
                let index = 0;
                for (let currentCourse of result["channelList"]) {
                    if( currentCourse["content"]["roletype"]!=3 ){
                        //防止角色不同产生的意外错误
                        continue;
                    }
                    index++;
                    let courseInfo = {
                        cover: currentCourse["content"]["course"]["data"][0]["imageurl"],
                        name: currentCourse["content"]["course"]["data"][0]["name"],
                        teacher: currentCourse["content"]["course"]["data"][0]["teacherfactor"],
                        class: currentCourse["content"]["name"],
                        cpi: currentCourse["content"]["cpi"],
                        courseId: currentCourse["content"]["course"]["data"][0]["id"],
                        classId: currentCourse["content"]["id"],
                        count: currentCourse["content"]["studentcount"]
                    };
                    courseInfo["shortName"] = courseInfo["name"].length > 7 ? courseInfo["name"].substring(0, 7) + "..." : courseInfo["name"];
                    courseInfo["shortTeacher"] = courseInfo["teacher"].length > 7 ? courseInfo["teacher"].substring(0, 7) + "..." : courseInfo["teacher"];
                    courseInfo["shortClass"] = courseInfo["class"].length > 7 ? courseInfo["class"].substring(0, 7) + "..." : courseInfo["class"];
                    $(".course-list").append(`
                        <li class="course-child">
                            <div class="course-left">
                                <img class="course-cover" id="course-cover-${index}" src="${courseInfo["cover"]}" alt="${courseInfo["name"]}-封面" title="打开课程主页" width="150" height="100" link="https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${courseInfo["courseId"]}&clazzid=${courseInfo["classId"]}&cpi=${courseInfo["cpi"]}&pageHeader=0"/>
                            </div>
                            <div class="course-right course-move">
                                <div class="course-right-top moveBox" id="course-moveBox-${index}">
                                    <!--<p>
                                        <span class="deepColor course-text">课程主页：</span>
                                        <span class="course-text courseIndexPage" link="https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${courseInfo["courseId"]}&clazzid=${courseInfo["classId"]}&cpi=${courseInfo["cpi"]}&pageHeader=0">打开主页</span>
                                    </p>-->
                                    <p>
                                        <span class="deepColor course-text">课程名称：</span>
                                        <span class="course-text">${courseInfo["shortName"]}</span>
                                    </p>
                                    <p>
                                        <span class="deepColor course-text">任课教师：</span>
                                        <span class="course-text" style="overflow-x: auto;">${courseInfo["shortTeacher"]}</span>
                                    </p>
                                    <p>
                                        <span class="deepColor course-text">所在班级：</span>
                                        <span class="course-text" style="overflow-x: auto;">${courseInfo["shortClass"]}</span>
                                    </p>
                                    <p>
                                        <span class="deepColor course-text">班级人数：</span>
                                        <span class="course-text" style="overflow-x: auto;">${courseInfo["count"]}人</span>
                                    </p>
                                    <!--<p>
                                        <span class="deepColor course-text">考试：</span>
                                        <span class="course-text" style="overflow-x: auto;">导出考试</span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <span class="course-text" style="overflow-x: auto;">查看分数</span>
                                    </p>-->
                                </div>
                                <div class="course-right-bottom moveBox-bottom" data-classId="${courseInfo["classId"]}" data-courseId="${courseInfo["courseId"]}" data-cpi="${courseInfo["cpi"]}">
                                    <p>
                                        <span class="deepColor course-text" style="font-size:18px;">更多功能：</span>
                                    </p>
                                    <p>
                                        <i class="course-icon" style="background-position: -144px -24px;"></i>
                                        <span class="exportQuestion course-text backTwo">导出作业题目</span>
                                    </p>
                                    <p>
                                        <i class="course-icon" style="background-position: -168px -24px;"></i>
                                        <span class="exportExamQuestion course-text backTwo">导出考试题目</span>
                                    </p>
                                    <p>
                                        <i class="course-icon" style="background-position: -288px -24px;"></i>
                                        <span class="queryExamSocre course-text backTwo">查看考试成绩</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    `);
                }
                $(".course-cover").on("click", e => {
                    window.open(e["target"].getAttribute("link"));
                });
                $(".course-move").on("mousemove mouseup", e => {
                    if (parseInt($(e["currentTarget"]).find(".moveBox").css("top")) == 0) {
                        let target = $(e["currentTarget"]).find(".moveBox").attr("id");
                        anime({
                            targets: `#${target}`,
                            top: -120,
                            duration: 300,
                            easing: "easeInOutSine"
                        });
                        $(e["currentTarget"]).on("mouseleave", (ee) => {
                            anime({
                                targets: `#${target}`,
                                top: 0,
                                duration: 300,
                                easing: "easeInOutSine"
                            });
                        });
                    }
                });
                $(".course-cover").on("mousemove mouseup", e => {
                    let target = $(e["currentTarget"]).attr("id");
                    anime({
                        targets: `#${target}`,
                        width: 180,
                        height: 120,
                        left: -15,
                        top: -10,
                        duration: 300
                    });
                    $(e["currentTarget"]).on("mouseleave", (ee) => {
                        anime({
                            targets: `#${target}`,
                            width: 150,
                            height: 100,
                            left: 0,
                            top: 0,
                            duration: 1000
                        });
                    });
                });
                $(".queryExamSocre,.exportExamQuestion,.exportQuestion").on("click", e => {
                    anime({
                        targets: '.course-list',
                        top: -document.body.scrollHeight,
                        duration: 1500
                    });
                });
                $(".queryExamSocre").on("click", e => {
                    setTimeout(() => {
                        helper["scrollTop"] = document.documentElement.scrollTop;
                        document.documentElement.scrollTop = 0;
                        $(".course-list").css("display", "none");
                        $("#backButton").css("display", "block");
                        $(".exam-list").css("display", "block");
                    }, 500);
                    helper["isActiveBox"] = ".exam-list";
                    let parentElement = $(e["currentTarget"]).parent().parent();
                    let classId = parentElement.attr("data-classId");
                    let courseId = parentElement.attr("data-courseId");
                    let cpi = parentElement.attr("data-cpi");
                    queryExam({
                        classId: classId,
                        courseId: courseId,
                        cpi: cpi
                    });
                });
                $(".exportExamQuestion").on("click", e => {
                    setTimeout(() => {
                        helper["scrollTop"] = document.documentElement.scrollTop;
                        document.documentElement.scrollTop = 0;
                        $(".course-list").css("display", "none");
                        $("#backButton").css("display", "block");
                        $(".exam-export-list").css("display", "block");
                    }, 500);
                    helper["isActiveBox"] = ".exam-export-list";
                    let parentElement = $(e["currentTarget"]).parent().parent();
                    let classId = parentElement.attr("data-classId");
                    let courseId = parentElement.attr("data-courseId");
                    let cpi = parentElement.attr("data-cpi");
                    queryExamQuestion({
                        classId: classId,
                        courseId: courseId,
                        cpi: cpi
                    });
                });
                $(".exportQuestion").on("click", e => {
                    setTimeout(() => {
                        helper["scrollTop"] = document.documentElement.scrollTop;
                        document.documentElement.scrollTop = 0;
                        $(".course-list").css("display", "none");
                        $("#backButton").css("display", "block");
                        $(".work-export-list").css("display", "block");
                    }, 500);
                    helper["isActiveBox"] = ".work-export-list";
                    let parentElement = $(e["currentTarget"]).parent().parent();
                    let classId = parentElement.attr("data-classId");
                    let courseId = parentElement.attr("data-courseId");
                    let cpi = parentElement.attr("data-cpi");
                    queryWorkQuestion({
                        classId: classId,
                        courseId: courseId,
                        cpi: cpi
                    });
                    /*
                    let parentElement = $(e["currentTarget"]).parent().parent();
                    let classId = parentElement.attr("data-classId");
                    let courseId = parentElement.attr("data-courseId");
                    let cpi = parentElement.attr("data-cpi");
                    window.open(`https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${courseId}&clazzid=${classId}&cpi=${cpi}&pageHeader=8`);
                    */
                })
            }
        }
    });
}

function queryWorkQuestion(data) {
    doReqSimple(`https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&pageHeader=8`, "GET", null, opencResult => {
        data["enc"] = opencResult["text"].match(/enc\=([^\"]*)/)[1];
        doReqSimple(`https://mooc1.chaoxing.com/mooc2/work/list?courseId=${data["courseId"]}&classId=${data["classId"]}&cpi=${data["cpi"]}&enc=${data["enc"]}&status=2`, "GET", null, (result) => {
            let html = result["text"];
            let workIdMap = html.matchAll(/workId\=([^&]*)/g);
            let answerIdMap = html.matchAll(/answerId\=([^&]*)/g);
            let encMap = html.matchAll(/enc\=([^\"]*)/g);
            let TitleMap = html.matchAll(/overHidden2\s*fl\"\>([^\<]*)/g);
            let workList = [];
            for (let work of workIdMap) {
                workList.push({
                    workId: parseInt(work[1])
                });
            }
            let index = 0;
            for (let answer of answerIdMap) {
                workList[index++]["answerId"] = answer[1];
            }
            index = 0;
            for (let enc of encMap) {
                if( workList.length==index ){
                    break;
                }
                workList[index++]["enc"] = enc[1];
            }
            index = 0;
            for (let title of TitleMap) {
                workList[index++]["title"] = title[1];
            }
            $(".work-export-list").empty();
            if (workList.length == 0) {
                $(".work-export-list").append(`
                    <li class="exam-export-child">
                        <p class="exam-export-text">
                            <span class="exam-export-title deepColor" style="font-size: 22px;line-height: 120px;">未查找到可被导出的作业😞😞😞</span>
                        </p>
                    </li>
                `);
                return false;
            }
            for (let work of workList) {
                work["title"] = work["title"].length > 15 ? work["title"].substring(0, 15) + "..." : work["title"];
                $(".work-export-list").append(`
                    <li class="exam-child">
                        <p class="exam-text">
                            <span class="exam-title deepColor">试卷名称：</span>
                            <span>${work["title"]}</span>
                            <span class="exportButton" data-workId="${work["workId"]}" data-answerId="${work["answerId"]}" data-enc="${work["enc"]}">导出<span>
                        </p>
                    </li>
                `);
            }
            $(".exportButton").on("click", e => {
                $("body").append(`
                    <div id="loadingBox" class="loading-bg" style="height:${document.documentElement.clientHeight}px;width:${document.documentElement.clientWidth}px">
                        <div class="loading-spin" style="margin:${(document.documentElement.clientHeight - 50) / 2}px auto;display:block;"></div>
                    </div>
                `);
                data["workId"] = $(e["currentTarget"]).attr("data-workId");
                data["answerId"] = $(e["currentTarget"]).attr("data-answerId");
                data["enc"] = $(e["currentTarget"]).attr("data-enc");
                parseQuestion(`https://mooc1.chaoxing.com/mooc2/work/view?courseId=${data["courseId"]}&classId=${data["classId"]}&cpi=${data["cpi"]}&workId=${data["workId"]}&answerId=${data["answerId"]}&enc=${data["enc"]}`,()=>{
                    coco({
                        title: "错误提示",
                        text: "很抱歉，我们无法成功的为你自动导出题目，这可能是你长时间没有操作这么课程的缘故，你可以尝试打开对应的作业地址尝试手动导出。选择【确定】按钮，我们将自动为你打开作业地址，便于尝试手动导出",
                        width: '300px',
                        top: '15vh',
                        okText: '确定',
                        cancelText: '取消'
                    }).onClose((cc, ok, done) => {
                        if (cc) {
                            window.open(`https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&pageHeader=8`);
                        }
                        done();
                    });
                });
            })
        });
    });
}

function queryExamQuestion(data) {
    doReqSimple(`https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&pageHeader=8`, "GET", null, opencResult => {
        data["enc"] = opencResult["text"].match(/enc\=([^\"]*)/)[1];
        doReqSimple(`https://mooc1.chaoxing.com/mooc2/exam/exam-list?courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&status=2`, "GET", null, (result) => {
            let html = result["text"];
            let examListMap = html.matchAll(/viewPaper\(\'([^\']+)/g);
            let examListTitleMap = html.matchAll(/overHidden2\s*fl\"\>([^\<]*)/g);
            let examList = [];
            for (let exam of examListMap) {
                examList.push({
                    id: parseInt(exam[1])
                });
            }
            let index = 0;
            for (let title of examListTitleMap) {
                examList[index++]["title"] = title[1];
            }
            let examListAfter = [];
            for (let exam of examList) {
                if (!isNaN(exam["id"])) {
                    examListAfter.push(exam);
                }
            }
            $(".exam-export-list").empty();
            if (examListAfter.length == 0) {
                $(".exam-export-list").append(`
                    <li class="exam-export-child">
                        <p class="exam-export-text">
                            <span class="exam-export-title deepColor" style="font-size: 22px;line-height: 120px;">未查找到可被导出的考试😞😞😞</span>
                        </p>
                    </li>
                `);
                return false;
            }
            for (let exam of examListAfter) {
                exam["title"] = exam["title"].length > 15 ? exam["title"].substring(0, 15) + "..." : exam["title"];
                $(".exam-export-list").append(`
                    <li class="exam-child">
                        <p class="exam-text">
                            <span class="exam-title deepColor">试卷名称：</span>
                            <span>${exam["title"]}</span>
                            <span class="exportButton" data-id="${exam["id"]}">导出<span>
                        </p>
                    </li>
                `);
            }
            $(".exportButton").on("click", e => {
                $("body").append(`
                    <div id="loadingBox" class="loading-bg" style="height:${document.documentElement.clientHeight}px;width:${document.documentElement.clientWidth}px">
                        <div class="loading-spin" style="margin:${(document.documentElement.clientHeight - 50) / 2}px auto;display:block;"></div>
                    </div>
                `);
                data["paperId"] = $(e["currentTarget"]).attr("data-id");
                parseQuestion(`https://mooc1.chaoxing.com/exam/test/reVersionPaperMarkContentNew?courseId=${data["courseId"]}&classId=${data["classId"]}&cpi=${data["cpi"]}&p=1&id=${data["paperId"]}&ut=s&newMooc=true&openc=${data["openc"]}`, () => {
                    coco({
                        title: "错误提示",
                        text: "很抱歉，我们无法成功的为你自动导出题目，这可能是你长时间没有操作这么课程的缘故，你可以尝试打开对应的考试地址尝试手动导出。选择【确定】按钮，我们将自动为你打开考试地址，便于尝试手动导出",
                        width: '300px',
                        top: '15vh',
                        okText: '确定',
                        cancelText: '取消'
                    }).onClose((cc, ok, done) => {
                        if (cc) {
                            window.open(`https://mooc2-ans.chaoxing.com/mycourse/stu?courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&pageHeader=9`);
                        }
                        done();
                    });
                });
            })
        });
    });
}

function queryExam(data) {
    doReqSimple(`https://stat2-ans.chaoxing.com/exam-stastics/stu-exams?page=1&pageSize=999&courseid=${data["courseId"]}&clazzid=${data["classId"]}&cpi=${data["cpi"]}&personId=${data["cpi"]}`, "GET", null, (examResult) => {
        let examList = JSON.parse(examResult["text"]);
        $(".exam-list").empty();
        if (examList["data"].length == 0) {
            $(".exam-list").append(`
                <li class="exam-child">
                    <p class="exam-text">
                        <span class="exam-title deepColor" style="font-size: 28px;line-height: 120px;">未查找到考试😞😞😞</span>
                    </p>
                </li>
            `);
            return false;
        }
        for (let exam of examList["data"]) {
            exam["title"] = exam["title"].length > 15 ? exam["title"].substring(0, 15) + "..." : exam["title"];
            exam["markPerson"] = exam["markPerson"].length > 15 ? exam["markPerson"].substring(0, 15) + "..." : exam["markPerson"];
            exam["totalScore"] = exam["totalScore"].length > 15 ? exam["totalScore"].substring(0, 15) + "..." : exam["totalScore"];
            exam["stuOriginScore"] = exam["title"].length > 15 ? exam["stuOriginScore"].substring(0, 15) + "..." : exam["stuOriginScore"];
            $(".exam-list").append(`
                <li class="exam-child">
                    <p class="exam-text">
                        <span class="exam-title deepColor">试卷名称：</span>
                        <span>${exam["title"]}</span>
                    </p>
                    <p class="exam-text">
                        <span  class="exam-title deepColor">批阅教师：</span>
                        <span>${exam["markPerson"]}</span>
                    </p>
                    <p class="exam-text">
                        <span  class="exam-title deepColor">卷面总分：</span>
                        <span>${exam["totalScore"]}</span>
                    </p>
                    <p class="exam-text">
                        <span  class="exam-title deepColor">最终得分：</span>
                        <span>${exam["stuOriginScore"]}</span>
                    </p>
                    <p class="exam-text">
                        <span  class="exam-title deepColor">开始时间：</span>
                        <span>${exam["startTime"]}</span>
                    </p>
                    <p class="exam-text">
                        <span  class="exam-title deepColor">结束时间：</span>
                        <span>${exam["submitTime"]}</span>
                    </p>
                </li>
            `);
        }
    });
}

function parseQuestion(url, errCallback) {
    doReqSimple(url, "GET", null, (result) => {
        let html = result["text"];
        let dom = $(new DOMParser().parseFromString(html, "text/html"));
        let questionElements = [];
        let questionList = [];
        $(dom).find(".questionLi").each((index, element) => {
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
            let exportQuestionList = [];
            for (let question of questionList) {
                let questionObject = {
                    id: 0,
                    name: question["type"],
                    content: question["title"]?.trim(),
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
            let fdata = new FormData();
            fdata.append("qjson", JSON.stringify(exportQuestionList));
            reqHttp("https://mooc.xxcheng.top/app/api/export.php?form=miniapp&verion=2.0.1", "POST", {}, fdata, res => {
                if (res["header"]["status"] == 200) {
                    let downResult = JSON.parse(res["text"]);
                    if (downResult["status"]) {
                        window.open(downResult["url"]);
                    } else {
                        alert(downResult["msg"]);
                    }
                }
            });
        } else {
            errCallback();
        }
        $("#loadingBox").remove();
    });
}

async function doReqSimple(url, method, body, callback, headers = false, refuseRedirect = true) {
    reqHttp(url, method, headers != false ? headers : {
        "Cookie": (() => {
            let cookieStr = "";
            for (let cookie of cookies) {
                if (cookie["domain"] == ".chaoxing.com") {
                    cookies += `${cookie["name"]}=${cookie["value"]};`;
                }
            }
            return cookieStr;
        })(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
        "Cache-Control": " max-age=0",
        "Connection": "keep-alive",
        "Host": "mooc1.chaoxing.com",
        "Sec-Fetch-Dest": "iframe",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": " ?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "ozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        "Referer": "https://mooc1.chaoxing.com/"
    }, body, callback, refuseRedirect);
}

async function reqHttp(url, method, headers, body, callback, refuseRedirect = false) {
    let response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
        redirect: refuseRedirect ? "manual" : "follow"
    });
    let text = await response.text();
    let header = {}
    response.headers.forEach((value, key) => {
        header[key] = value;
    });
    header["status"] = response.status;
    callback({ text: text, header: header });
}
