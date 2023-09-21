let Editor = ace.edit("editor");
Editor.setTheme("ace/theme/eclipse");
Editor.setOption('enableLiveAutocompletion', true);
Editor.session.setMode("ace/mode/html");

const runBtn = document.querySelector('.run-btn');
const iframe = document.querySelector('iframe');

let cache = {
    html: '',
    css: '',
    javascript: ''
}

let prevlang = 'html';
let lang = 'html';

const tabs = document.querySelectorAll('.editor-tabs span');

document.addEventListener('DOMContentLoaded', async () => {
    await fetch('/clear-codeplay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    iframe.contentWindow.location.reload();
})

tabs.forEach(btn => {
    btn.addEventListener('click', (e) =>{
        prevlang = lang;
        const classNames = e.target.className.split(' ');
        lang = classNames[0];
        cache[prevlang] = Editor.getValue();

        tabs.forEach(tab => tab.classList.remove('tab-selected'));
        e.target.classList.add('tab-selected');
        Editor.session.setMode(`ace/mode/${lang}`);
        Editor.setValue(cache[lang])
    })
})

let debounceTimeout;

Editor.getSession().on('change', function() {
    cache[lang] = Editor.getValue();
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        handleRunBtn();
    }, 1000);
});

runBtn.addEventListener('click', handleRunBtn);

async function handleRunBtn() {
    // prettierReq(cache.html);
    // prettierReq(cache.css);
    // prettierReq(cache.javascript);
    
    await fetch('/handleRun-codeplay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            html: cache.html,
            css: cache.css,
            js: cache.javascript,
        })
    })

    iframe.contentWindow.location.reload();
}

async function prettierReq(code) {
    if(code) {
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
        cache[lang] = data;
        });
    }
}

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

const fullBtn = document.querySelector('.fullscreen-btn');
fullBtn.addEventListener('click', ()=> {
    if (!window.fullWindow || window.fullWindow.closed) {
        window.fullWindow = window.open('/preview', '_blank');
      } else {
        window.fullWindow.focus();
        fullWindow.location.reload();
      }
})

const saveBtn = document.querySelector('.submit-btn');
saveBtn.addEventListener('click', handleSaveBtn);

const title = document.querySelector('.title').textContent;

async function handleSaveBtn() {
    await fetch('/handleSave-codeplay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            html: cache.html,
            css: cache.css,
            js: cache.javascript,
        })
    })
}