// const { addCommentsInHtml, addCommentsInCss, addCommentsInJs } = require('E:\Galaxy-main\comments.js')

let Editor = ace.edit("editor");
Editor.setTheme("ace/theme/eclipse");
Editor.setOption('enableLiveAutocompletion', true);
Editor.session.setMode("ace/mode/html");

let exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/dracula");
exEditor.setReadOnly(true);

let solEditor = ace.edit("sol-editor");
solEditor.setTheme("ace/theme/dracula");
solEditor.setReadOnly(true);

const currentURL = window.location.href;
const parts = currentURL.split('/');
let quesNumber = parts[parts.length - 1];
const lang = data[0].lang;
console.log(userData);
const preCode = userData.projects[0].questions[quesNumber-1].editor;

console.log(preCode.html)

// if(lang == 'html') {
//     editor.setValue(preCode.html);
// }
// else if(lang == 'css') {
//     editor.setValue(preCode.css);
// }
// else {
//     editor.setValue(preCode.js);
// }

Editor.setValue(preCode[lang]);
Editor.session.setMode(`ace/mode/${data[0].lang}`);
Editor.clearSelection();
const startingCode = Editor.getValue();

exEditor.session.setMode(`ace/mode/${data[0].lang}`);
exEditor.setValue(data[0].example);
    
solEditor.setValue(data[0].solution);
solEditor.session.setMode(`ace/mode/${data[0].lang}`);
    
exEditor.clearSelection();
exEditor.renderer.$cursorLayer.element.style.opacity = 0;
solEditor.clearSelection();
solEditor.renderer.$cursorLayer.element.style.opacity = 0


document.addEventListener('DOMContentLoaded', async () => {
    let playerSubmissionLen = (userData.projects[0].questions[quesNumber-1].submissions).length;
    let code = '';

    var commentFunctions = {
        html: addCommentsInHtml,
        css: addCommentsInCss,
        js: addCommentsInJs
    };   

    if(lang == 'html')
        code = commentFunctions[lang](userData.projects[0].questions[quesNumber-1].editor[lang], data[0].selectedClassForHtml, playerSubmissionLen);
    else if(lang == 'css')
        code = commentFunctions[lang](userData.projects[0].questions[quesNumber-1].editor[lang], playerSubmissionLen);
    else {
        code = commentFunctions.js(userData.projects[0].questions[quesNumber-1].editor[lang], playerSubmissionLen);

    }
    prettierReq(code);
})


async function prettierReq(code) {
    await fetch('/p', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            lang: lang
        })
    })
    .then(response => response.json())
    .then(data => {
    Editor.setValue(data);
    });
}

const btnHeight = document.querySelector('.example-btn').offsetHeight;

function showDiv(id) {
    const divs = document.querySelectorAll('.inner-1 .medium>div');
    divs.forEach(btn => {
        btn.classList.add('hidden');
        btn.style.animation = 'none';
    });

    document.querySelector(`.${id}`).classList.remove('hidden');
    // document.querySelector(`.${id}`).style.animation = 'pinchin 0.5s ease';
}

const btns = document.querySelectorAll('.btns>div');
btns.forEach(btn => {
    btn.addEventListener('mouseover', handleHover);
});

function handleHover(event) {
    const btns = document.querySelectorAll('.btns div');
    btns.forEach(btn => btn.classList.remove('btn-selected'));
    event.target.classList.add('btn-selected');
    const index = event.target.getAttribute('data-value');
    updatearrow(index);
}

function updatearrow(index) {
    const rowNumber = parseInt(index);
    const rowElement = document.querySelector(`.r${rowNumber}`);

    const arrow = document.querySelector('.arrow');
    arrow.style.transition = 'transform 0.2s ease-in-out';
    arrow.style.transform = `translateY(${rowElement.offsetTop - arrow.parentElement.offsetTop}px)`;
}

const prevBtn = document.querySelector('.move-btns span:first-child');
prevBtn.addEventListener('click', handlePrevBtn)
function handlePrevBtn() {

    const lastIndex = currentURL.lastIndexOf('/');
    const str = currentURL.substring(0, lastIndex);

    if(quesNumber != 1){
        // quesNumber--;
        const newurl = str + `/${-- quesNumber}`;
        window.location.href = newurl;
    }
}

const nextBtn = document.querySelector('.move-btns span:last-child');
nextBtn.addEventListener('click', handleNextBtn);
function handleNextBtn() {
    // const currentURL = window.location.href;
    // const parts = currentURL.split('/');
    // let quesNumber = parts[parts.length - 1];

    const lastIndex = currentURL.lastIndexOf('/');
    const str = currentURL.substring(0, lastIndex);

        const newurl = str + `/${++ quesNumber}`;
        window.location.href = newurl;
}


let cache = Editor.getValue();
let type=lang;

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', handleSubmitBtn);

async function handleSubmitBtn() {
    const path = window.location.href;
    const parts = path.split('/');
    const project = parts[3];
    const questionNumber = parts[5];
    console.log(parts);
    let codeToSend;
    if(type !== lang)
        codeToSend = cache;
    else
        codeToSend = Editor.getValue();

    console.log(codeToSend);
    await fetch(`/${project}/questions/${questionNumber}/submitData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: codeToSend,
            lang: lang
        })
    })
}

let cacheFlag = true;
const tabs = document.querySelectorAll('.editor-tabs span');
tabs.forEach(btn => {
    btn.addEventListener('click', (e)=> {
        tabs.forEach(tab => tab.classList.remove('tab-selected'));
        e.target.classList.add('tab-selected');
        const classNames = e.target.className.split(' ');
        type = classNames[0];
        Editor.session.setMode(`ace/mode/${type}`);
        if(type != lang) {
            if(cacheFlag)
                cache = Editor.getValue();
            cacheFlag = false;
            Editor.setValue(userData.projects[0].questions[quesNumber-1].editor[type]);
            Editor.setReadOnly(true);
        }
        else{
            Editor.setValue(cache);
            cacheFlag=true;
            Editor.clearSelection();
        }
    })
})







function addCommentsInHtml(str, Sclass, playerSubmissionLen) {
    if(Sclass && playerSubmissionLen == 0) {
        str = removeCommentsinHtml(str);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `${str}`;
        // console.log(Sclass)
        // console.log(tempDiv.innerHTML);
        const selectedClass = tempDiv.querySelector(`.${Sclass}`);
        if(selectedClass)
            selectedClass.innerHTML = '\n<!-- Write your code here -->\n';
        // console.log(tempDiv.innerHTML);
        return `<body>  ${tempDiv.innerHTML} </body>`;
    }
    else
        return str;
}

function addCommentsInCss(str, playerSubmissionLen) {
    if(playerSubmissionLen == 0) {
        str = removeCommentsInCss(str);
        str = ` ${str} \n\n/* Write your code here */ \n`;
        return str;
    }
    else 
        return str;
}

function addCommentsInJs(str, playerSubmissionLen) {
    if(playerSubmissionLen == 0) {
        console.log("in")
        str = removeCommentsInJs(str);
        str = ` ${str} \n\n/* Write your code here */ \n`;
        return str;
    }
    else
        return str;
}

function removeCommentsinHtml(str) {
    const regex = /<!--\s*Write your code here\s*-->/g;
    return str.replace(regex, '');
}

function removeCommentsInCss(str) {
    const regex = /\/\*[\s\S]*?\*\//g;
    return str.replace(regex, '');
}

function removeCommentsInJs(str) {
    const regex = /\/\/.*?$|\/\*[\s\S]*?\*\//gm;
    return str.replace(regex, '');
}

const run = document.querySelector('.run-btn');
const iframe = document.querySelector('iframe');

run.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    let code = Editor.getValue();
    if(code) {
        prettierReq(code);
    
        let htmlCode = '', cssCode = '', jsCode = '';
        if(lang == 'html') {
            htmlCode = Editor.getValue();
            console.log(userData.projects[0].questions[quesNumber-1].editor['css'])
            cssCode = userData.projects[0].questions[quesNumber-1].editor['css'];
            jsCode = userData.projects[0].questions[quesNumber-1].editor['js'];
        }
        else if(lang == 'css') {
            htmlCode = userData.projects[0].questions[quesNumber-1].editor['html'];
            cssCode = Editor.getValue();
            jsCode = userData.projects[0].questions[quesNumber-1].editor['js'];
        }
        else {
            htmlCode = userData.projects[0].questions[quesNumber-1].editor['html'];
            cssCode = userData.projects[0].questions[quesNumber-1].editor['css'];
            jsCode = Editor.getValue();
        }
    
        await fetch('/handleRunBtn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quesNo: quesNumber-1,
                lang: lang,
                html: htmlCode,
                css: cssCode,
                js: jsCode,
            })
        })
    
        iframe.contentWindow.location.reload();
    }
}

const reloadBtn = document.querySelector('.reload');
reloadBtn.addEventListener('click', () => [
    Editor.setValue(startingCode)
])

const copyBtn = document.querySelector('.copy');
copyBtn.addEventListener('click', () => {
    let textToCopy = Editor.getValue();
    let tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
})