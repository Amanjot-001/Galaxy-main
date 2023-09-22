const content0 = document.querySelector('.content-0');
const content1 = document.querySelector('.content-1');
const content2 = document.querySelector('.content-2');
const content3 = document.querySelector('.content-3');
const content4 = document.querySelector('.content-4');
const content5 = document.querySelector('.content-5');

const continueBtn0 = document.querySelector('.content-0 .continue');
const continueBtn1 = document.querySelector('.content-1 .continue');
const continueBtn2 = document.querySelector('.content-2 .continue');
const continueBtn3 = document.querySelector('.content-3 .continue');
const continueBtn4 = document.querySelector('.content-4 .continue');
const continueBtn5 = document.querySelector('.content-5 .continue');

const backBtn0 = document.querySelector('.content-0 .back i');
const backBtn1 = document.querySelector('.content-1 .back i');
const backBtn2 = document.querySelector('.content-2 .back i');
const backBtn3 = document.querySelector('.content-3 .back i');
const backBtn4 = document.querySelector('.content-4 .back i');
const backBtn5 = document.querySelector('.content-5 .back i');

const titleInput = document.querySelector('.content-0 textarea');
const descInput = document.querySelector('.content-1 textarea');
const gitInput = document.querySelector('.content-2 textarea');
const webInput = document.querySelector('.content-3 textarea');


let title = '';
let desc = '';
let github = '';
let website = '';

continueBtn0.addEventListener('click', () => {
    if(titleInput.value === ''){
        titleInput.setAttribute('placeholder', 'please type in a unique title')
    }
    else {
        title = titleInput.value;
        content0.classList.add('hidden');
        content1.classList.remove('hidden');
    }
})

continueBtn1.addEventListener('click', () => {
    if(descInput.value === ''){
        descInput.setAttribute('placeholder', 'please type in some description about your project.')
    }
    else {
        desc = descInput.value;
        content1.classList.add('hidden');
        content2.classList.remove('hidden');
    }
})

continueBtn2.addEventListener('click', () => {
    if(gitInput.value === ''){
        gitInput.setAttribute('placeholder', 'please type in the github link for your code.')
    }
    else {
        git = gitInput.value;
        content2.classList.add('hidden');
        content3.classList.remove('hidden');
    }
})

continueBtn3.addEventListener('click', () => {
    if(webInput.value === ''){
        webInput.setAttribute('placeholder', 'please type in the website link for your project.')
    }
    else {
        website = webInput.value;
        content3.classList.add('hidden');
        content4.classList.remove('hidden');
    }
})







const input = document.querySelector('.add input');
const addBtn = document.querySelector('.add-btn');
const display = document.querySelector('.display');

addBtn.addEventListener('click', () => {
    if(input.value === '') {
        input.setAttribute('placeholder', 'please type');
    }
    else {
        addTech(input.value.replace(/\s+/g, ' ').trim());
        input.value = '';
        input.setAttribute('placeholder', 'type tech');
    }
})

function addTech(str) {
    const entry = document.createElement('div');
    entry.classList.add('entry');
    entry.innerHTML = `<div class="tech">${str}</div>
    <i class="fa-solid fa-trash-can del" style="color: #fff;"></i>`;
    display.appendChild(entry);
}

display.addEventListener('click', (event) => {
    if (event.target.classList.contains('del')) {
        event.target.parentElement.remove();
    }
})