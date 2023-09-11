let editor = ace.edit("editor");
editor.setTheme("ace/theme/eclipse");
editor.setOption('enableLiveAutocompletion', true);
editor.session.setMode("ace/mode/html");

let exEditor = ace.edit("ex-editor");
exEditor.setTheme("ace/theme/dracula");
exEditor.setReadOnly(true);

let solEditor = ace.edit("sol-editor");
solEditor.setTheme("ace/theme/dracula");
solEditor.setReadOnly(true);

// editor.setValue(`<div class="calculator-card">\n\t<div class="display">\n\t</div>\n\t<div class="buttons">\n\t</div>\n</div>`);

exEditor.session.setMode(`ace/mode/${data[0].lang}`);
exEditor.setValue(data[0].example);
    
solEditor.setValue(data[0].solution);
solEditor.session.setMode(`ace/mode/${data[0].lang}`);
    
exEditor.clearSelection();
exEditor.renderer.$cursorLayer.element.style.opacity = 0;
solEditor.clearSelection();
solEditor.renderer.$cursorLayer.element.style.opacity = 0


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
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    let quesNumber = parts[parts.length - 1];

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
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    let quesNumber = parts[parts.length - 1];

    const lastIndex = currentURL.lastIndexOf('/');
    const str = currentURL.substring(0, lastIndex);

        const newurl = str + `/${++ quesNumber}`;
        window.location.href = newurl;
}

const lang = data[0].lang;

let cache = "";
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
        codeToSend = editor.getValue();

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
        const classNames = e.target.className.split(' ');
        type = classNames[0];
        editor.session.setMode(`ace/mode/${type}`);
        if(type != lang) {
            if(cacheFlag)
                cache = editor.getValue();
            cacheFlag = false;
            editor.setValue(userData.type);
        }
        else{
            editor.setValue(cache);
            cacheFlag=true;
        }
    })
})