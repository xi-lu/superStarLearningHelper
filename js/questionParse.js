/**
 * 新版学习通作业题目的解析
 * @param {questionElement} questionElement 
 */
function titleParseNew(questionElement) {
    try {
        let titleJQueryElement = $(questionElement).find(".mark_name");
        if (titleJQueryElement.length == 0) {
            throw "no element";
        }
		let str='';
		titleJQueryElement.contents().each((index,ele)=>{
			str+=index!=0 && index!=1 ?
				ele.nodeType==3?ele.nodeValue:ele.innerHTML:
				'';//省略序号题目型号
			
		});
		return str;
        //return titleJQueryElement.contents()[2].nodeValue?.trim();
    } catch (e) {
        //暂未发现错误
        return null;
    }
}

function typeParseNew(questionElement) {
    try {
        let typeJQueryElement = $(questionElement).find(".mark_name");
        if (typeJQueryElement.length == 0) {
            throw "no element";
        }
        return typeJQueryElement.contents()[1].innerText.match(/\(([^,\)]*)/)[1];
    } catch (e) {
        //暂未发现错误
        return null;
    }
}

function optionsParseNew(questionElement) {
    try {
        let optionsJQueryElement = $(questionElement).find(".mark_letter");
        if (optionsJQueryElement.length == 0 && optionsJQueryElement.children().length == 0) {
            throw "no options";
        }
        let options = {};
        let optionsArr = [];
        optionsJQueryElement.children().each((index, element) => {
            let defaultText = element.innerHTML;
            let textArr = defaultText.match(/([^\.]*)\.(.*)/);
            options[textArr[1]] = textArr[2].trim();
            optionsArr.push(textArr[2].trim());
        });
        return {
            options: options,
            optionsArr: optionsArr,
        };
    } catch (e) {
        //暂未发现错误
        return null;
    }
}

function answerParseNew(questionElement) {
    try {
        let answerJQueryElement = $(questionElement).find(".mark_key");
        if (answerJQueryElement.length == 0) {
            throw "no answer";
        }
        try {
            return answerJQueryElement.find(".colorGreen").contents()[1].nodeValue.trim();
        } catch (e) {
            return answerJQueryElement.find(".colorDeep").contents()[1].nodeValue.trim();
        }
    } catch (e) {
        try {
            let answerJQueryElement = $(questionElement).find(".mark_answer_key");
            if (answerJQueryElement.length == 0) {
                throw "no answer";
            }
            try {
                let answers = [];
                answerJQueryElement.find(".colorGreen").find("dd").each((index, element) => {
                    answers.push(element.innerHTML);
                });
                return answers;
            } catch (ee) {
                let answers = [];
                answerJQueryElement.find(".colorDeep").find("dd").each((index, element) => {
                    answers.push(element.innerHTML);
                });
                return answers;
            }
        } catch (eee) {
            try {
                let answerJQueryElement = $(questionElement).find(".mark_answer");
                if (answerJQueryElement.length == 0) {
                    throw "no answer";
                }
                try {
                    let answers = [];
                    answerJQueryElement.find(".colorGreen").find("dd").each((index, element) => {
                        answers.push(element.innerHTML.match(/\([0-9]*\)(.*)/)[1].trim());
                    });
                    return answers;
                } catch (ee) {
                    let answers = [];
                    answerJQueryElement.find(".colorDeep").find("dd").each((index, element) => {
                        answers.push(element.innerHTML.match(/\([0-9]*\)(.*)/)[1].trim());
                    });
                    return answers;
                }
            } catch (eeee) {
                return null;
            }
        }
    }
}