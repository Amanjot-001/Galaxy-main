const createBtn = document.querySelector('.create-btn');
const exitBtn = document.querySelector('.exit i');
const popup = document.querySelector('.popup');

createBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
})

exitBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
})

const titleInput = document.querySelector('.title-name input');
const continueBtn = document.querySelector('.continue p');

continueBtn.addEventListener('click', async ()=> {
    console.log('clicked')
    if(titleInput.value === '') {
        titleInput.setAttribute('placeholder', 'Choose a title');
    }
    else {
        if(checkTitleUnique(titleInput.value))
            handleContinueBtn(titleInput.value);
        else {
            titleInput.value = '';
            titleInput.setAttribute('placeholder', 'title already exists')
        }
    }
})

async function handleContinueBtn(title) {
    const url = `/codePlay?title=${encodeURIComponent(title)}`;
    try {
        window.location.href = url;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function checkTitleUnique(title) {
    const response = await fetch('/checkTitle', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title
        })
    })

    if(response.status === 200) return true;
    else return false;
}