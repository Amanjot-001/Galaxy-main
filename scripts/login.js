const content0 = document.querySelector('.content-0');
const content1 = document.querySelector('.content-1');
const content2 = document.querySelector('.content-2');
const content3 = document.querySelector('.content-3');
const content4 = document.querySelector('.content-4');
const content5 = document.querySelector('.content-5');

const backBtn0 = document.querySelector('.content-0 .back-btn');
const backBtn1 = document.querySelector('.content-1 .back-btn');
const backBtn2 = document.querySelector('.content-2 .back-btn');
const backBtn3 = document.querySelector('.content-3 .back-btn');
const backBtn4 = document.querySelector('.content-4 .back-btn');


const nextBtn0 = document.querySelector('.content-0 .next');
const nextBtn1 = document.querySelector('.content-1 .next');
const nextBtn2 = document.querySelector('.content-2 .next');
const nextBtn3 = document.querySelector('.content-3 .next');
const nextBtn4 = document.querySelector('.content-4 .next');

let email = '';
let pass = '';
let rollNo = '';
let clg = '';
let userName = '';
let uName = '';

nextBtn0.addEventListener('click', async () => {
    let emailInput = document.querySelector('.content-0 #email');
    let emailInput2 = document.querySelector('.content-1 #email');
    let emailInput3 = document.querySelector('.content-4 #email');
    
    if (emailInput.value === '') {
      emailInput.placeholder = 'enter email';
    } else {
      email = emailInput.value;
      
      // Use await to wait for the result of checkEmail
      const emailExists = await checkEmail(email);
      
      if (!emailExists) {
        content0.classList.add('hidden');
        content1.classList.remove('hidden');
        emailInput2.value = email;
      } else {
        content0.classList.add('hidden');
        content4.classList.remove('hidden');
        emailInput3.value = email;
      }
    }
  });
  

nextBtn1.addEventListener('click', () => {
    let emailInput = document.querySelector('.content-1 #email');
    let passInput = document.querySelector('.content-1 #password');
    let confirmInput = document.querySelector('.content-1 #confirm');

    if (emailInput.value === '') {
        emailInput.placeholder = 'enter email';
    }
    else if(passInput.value === '') {
        passInput.placeholder = 'enter password';
    }
    else if(confirmInput.value === '') {
        confirmInput.placeholder = 'enter password';
    }
    else{
        if(passInput.value !== confirmInput.value) {
        passInput.value = '';
        passInput.placeholder = 'password does not match';
        confirmInput.value = '';
    }
    else {
        pass = passInput.value;
        email = emailInput.value;
        content1.classList.add('hidden');
        content2.classList.remove('hidden');
    }
} 
});

nextBtn2.addEventListener('click', () => {
    let userNameInput = document.querySelector('.content-2 #username');
    let nameInput = document.querySelector('.content-2 #name');

    if(userNameInput.value === ''){
        userNameInput.placeholder = 'Enter Username';
    }
    else if(nameInput.value === '') {
        nameInput.placeholder = 'Enter Name';
    }
    else {
        userName = userNameInput.value;
        uName = nameInput.value;
        content2.classList.add('hidden');
        content3.classList.remove('hidden');
    }
})

nextBtn3.addEventListener('click', async () => {
    let rollInput = document.querySelector('.content-3 #rollNo');
    let clgInput = document.querySelector('.content-3 #college');

    if(rollInput.value === ''){
        rollInput.placeholder = 'Enter Roll No';
    }
    else if(clgInput.value === '') {
        clgInput.placeholder = 'Enter College Name';
    }
    else {
        rollNo = rollInput.value;
        const checkRoll = await checkRollNO(rollNo);
        if(checkRoll) {
            rollInput.value = '';
            rollInput.placeholder = 'Roll No already exists';
        }
        else {
        clg = clgInput.value;
        content3.classList.add('hidden');
        content5.classList.remove('hidden');
        createUser();
        }
    }
})

nextBtn4.addEventListener('click', async () => {
    let emailInput = document.querySelector('.content-4 #email');
    let passInput = document.querySelector('.content-4 #pass');

    if(emailInput.value === ''){
        emailInput.placeholder = 'Enter email';
    }
    else if(passInput.value === '') {
        passInput.placeholder = 'Enter passwoerd';
    }
    else {
        email = emailInput.value;
        pass = passInput.value;

        const checkPass = await checkUsersPass(email, pass);
        
        if(checkPass){
            content4.classList.add('hidden');
            content5.classList.remove('hidden');
        }
        else {
            passInput.placeholder = 'Wrong Password';
            passInput.value = '';
        }
        
    }
})

backBtn1.addEventListener('click', () => {
    content1.classList.add('hidden');
    content0.classList.remove('hidden');
})

backBtn2.addEventListener('click', () => {
    content2.classList.add('hidden');
    content1.classList.remove('hidden');
})

backBtn3.addEventListener('click', () => {
    content3.classList.add('hidden');
    content2.classList.remove('hidden');
})

backBtn4.addEventListener('click', () => {
    content4.classList.add('hidden');
    content0.classList.remove('hidden');
})

async function createUser() {
    await fetch('/createUser', {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body : JSON.stringify({
        email: email,
        pass: pass,
        roll: rollNo,
        clg: clg,
        userName: userName,
        name: uName
       })
    })
}

async function checkEmail(email) {
    const res = await fetch('/checkUserExist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
    });

    if(res.status === 200) return true;
    else return false;
}

async function checkRollNO(roll) {
    const res = await fetch('/checkRollExist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll: roll,
        }),
    });

    if(res.status === 200) return true;
    else return false;
}

async function checkUsersPass(email, pass) {
    const res = await fetch('/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pass: pass
        }),
    });

    console.log(res.status);
    if(res.status === 200) return true;
    else return false;
}