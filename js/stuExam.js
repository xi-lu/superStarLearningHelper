function run() {
    let functionInfo = {
        name: "stuExamQuery",
        desc: "查询考试成绩",
        since: "1.0.1"
    };
    if (commandList && commandList[functionInfo["name"]] && commandList[functionInfo["name"]]["isAllowed"]) {
        let clazzId = $(`#enc-clazzId`).val();
        let courseId = $(`#enc-courseId`).val();
        let cpi = $(`#enc-cpi`).val();
        let ut = $(`#enc-ut`).val();
        ajaxStudentWorkList({
            clazzId: clazzId,
            courseId: courseId,
            cpi: cpi,
            ut: ut,
            pageNum: 1
        });
    }
    function ajaxStudentWorkList(data) {
        request({
            url: "/exam-stastics/stu-exams",
            data: {
                "page": data["pageNum"],
                "pageSize": 999,
                "courseid": data["courseId"],
                "clazzid": data["clazzId"],
                "cpi": data["cpi"],
                "personId": data["cpi"],
                "ut": data["ut"]
            },
            callback: function (result) {
                $("#studentWorkTable").empty();
                let content = "";
                let dataArray = result.data;
                console.log(dataArray);
                let page = result.page;
                for (let i = 0; i < dataArray.length; i++) {
                    let obj = dataArray[i];
                    let status = obj.status;
                    let statusDesc = "<td>未查看</td>";
                    if (4 == status) {
                        statusDesc = "<td>待批阅</td>";
                    }
                    if (3 == status) {
                        statusDesc = "<td>已完成<span class=\"grey\">分数: " + obj.stuOriginScore + "分</span></td>";
                    }
                    if (5 == status) {
                        statusDesc = "<td class=\"color-red\">待重做</td>";
                    }
                    content += '<tr>'
                        + '<td class="tr-title overHidden1">' + obj.title + '</td>'
                        + '<td>' + obj.startTime + '</td>'
                        + '<td>' + obj.endTime + '</td>'
                        + '<td>' + obj.totalScore + '分</td>'
                        + '<td>' + obj.markPerson + '</td>'
                        + statusDesc
                }
                $("#studentWorkTable").html(content);
                let totalPage = result.totalPage;
                if (totalPage > 1) {
                    $("#studentWorkPage").show();
                    $("#studentWorkPage").paging({
                        nowPage: page, // 当前页码
                        pageNum: totalPage, // 总页码
                        buttonNum: 9, //要展示的页码数量
                        callback: function (num) { //回调函数
                            ajaxStudentWorkList(num);
                        }
                    });
                }
            }
        });
    }

    function request(options) {
        if (!options.url) {
            return;
        }
        $.ajax(
            $.extend(true, {
                type: 'GET',
                data: options.data,
                dataType: 'json',
                success: function (result) {
                    options.callback(result);
                }
            }, options)
        );
    }
}