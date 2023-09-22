const coninueBtn0 = document.querySelector('.content-0 .continue');
const coninueBtn1 = document.querySelector('.content-1 .continue');
const coninueBtn2 = document.querySelector('.content-2 .continue');
const coninueBtn3 = document.querySelector('.content-3 .continue');
const coninueBtn4 = document.querySelector('.content-4 .continue');
const coninueBtn5 = document.querySelector('.content-5 .continue');








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