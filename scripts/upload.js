const content0 = document.querySelector('.content-0');
const content1 = document.querySelector('.content-1');
const content2 = document.querySelector('.content-2');
const content3 = document.querySelector('.content-3');
const content4 = document.querySelector('.content-4');
const content5 = document.querySelector('.content-5');
const content6 = document.querySelector('.content-6');

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

const skipBtn3 = document.querySelector('.content-3 .skip');
const skipBtn5 = document.querySelector('.content-5 .skip');

const titleInput = document.querySelector('.content-0 textarea');
const descInput = document.querySelector('.content-1 textarea');
const gitInput = document.querySelector('.content-2 textarea');
const webInput = document.querySelector('.content-3 textarea');
const techInput = document.querySelector('.content-4 .display');
const techInputField = document.querySelector('.content-4 input');

let title = '';
let desc = '';
let github = '';
let website = '';
let tech = [];

continueBtn0.addEventListener('click', () => {
    if(titleInput.value === ''){
        titleInput.setAttribute('placeholder', 'please type in a unique title')
    }
    else {
        title = titleInput.value.replace(/\s+/g, ' ').trim();
        content0.classList.add('hidden');
        content1.classList.remove('hidden');
    }
})

continueBtn1.addEventListener('click', () => {
    if(descInput.value === ''){
        descInput.setAttribute('placeholder', 'please type in some description about your project.')
    }
    else {
        desc = descInput.value.replace(/\s+/g, ' ').trim();
        content1.classList.add('hidden');
        content2.classList.remove('hidden');
    }
})

continueBtn2.addEventListener('click', () => {
    if(gitInput.value === ''){
        gitInput.setAttribute('placeholder', 'please type in the github link for your code.')
    }
    else {
        github = gitInput.value.replace(/\s+/g, ' ').trim();
        content2.classList.add('hidden');
        content3.classList.remove('hidden');
    }
})

continueBtn3.addEventListener('click', () => {
    if(webInput.value === ''){
        webInput.setAttribute('placeholder', 'please type in the website link for your project.')
    }
    else {
        website = webInput.value.replace(/\s+/g, ' ').trim();
        content3.classList.add('hidden');
        content4.classList.remove('hidden');
    }
})

skipBtn3.addEventListener('click', () => {
    content3.classList.add('hidden');
    content4.classList.remove('hidden');
    website = '';
})

continueBtn4.addEventListener('click', () => {
    const techstack = techInput.querySelectorAll('.tech');

    techstack.forEach(text => {
        tech.push(text.textContent.replace(/\s+/g, ' ').trim());
    })

    if(tech.length === 0){
        techInputField.setAttribute('placeholder', 'please type in the tech stack for your project.')
    }
    else {
        content4.classList.add('hidden');
        content5.classList.remove('hidden');
    }
})

skipBtn5.addEventListener('click', () => {
    content5.classList.add('hidden');
    content6.classList.remove('hidden');
    saveProject();
})




backBtn0.addEventListener('click', () => {
    titleInput.value = '';
    title = ''
})

backBtn1.addEventListener('click', () => {
    content1.classList.add('hidden');
    content0.classList.remove('hidden');
    descInput.value = '';
    desc = '';
})

backBtn2.addEventListener('click', () => {
    content2.classList.add('hidden');
    content1.classList.remove('hidden');
    gitInput.value = '';
    github = '';
})

backBtn3.addEventListener('click', () => {
    content3.classList.add('hidden');
    content2.classList.remove('hidden');
    webInput.value = '';
    website = '';
})

backBtn4.addEventListener('click', () => {
    content4.classList.add('hidden');
    content3.classList.remove('hidden');
    techInput.innerHTML = '';
})

backBtn5.addEventListener('click', () => {
    content5.classList.add('hidden');
    content4.classList.remove('hidden');
    techInput.innerHTML = '';
    tech.length = 0;
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

async function saveProject() {
    await fetch('/saveProject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            desc: desc,
            github: github,
            website: website,
            tech: tech
        })
    })
}