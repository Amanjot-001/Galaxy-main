const main = document.querySelector('main');


let initialPositions = [];
const data = {
    arr:
    [
        {
            img: '/utility/images/img0.jpg',
            name: 'P-1',
            info: 'hehe',
        },
        {
            img: '/utility/images/img1.jpg',
            name: 'P-2',
            info: 'hehe',
        },
        {
            img: '/utility/images/img2.jpg',
            name: 'P-3',
            info: 'hehe',
        },
        {
            img: '/utility/images/img3.jpg',
            name: 'P-4',
            info: 'hehe',
        },
        {
            img: '/utility/images/img4.jpg',
            name: 'P-5',
            info: 'hehe',
        },
        {
            img: '/utility/images/img0.jpg',
            name: 'P-6',
            info: 'hehe',
        },
        {
            img: '/utility/images/img1.jpg',
            name: 'P-7',
            info: 'hehe',
        },
        {
            img: '/utility/images/img2.jpg',
            name: 'P-8',
            info: 'hehe',
        },
        {
            img: '/utility/images/img3.jpg',
            name: 'P-9',
            info: 'hehe',
        },
        {
            img: '/utility/images/img4.jpg',
            name: 'P-10',
            info: 'hehe',
        }
    ]
}

const colms = [2,0,3,1,2,0,3,1,2,0]

createProjectRows();

function createProjectRows() {
    for(let i=0; i<10; i++){
        let mainContainer = document.createElement('div');
        mainContainer.className = `main-row row-${i}`;

        let firstRow = document.createElement('div');
        firstRow.className = `first-row first-row-${i}`;

        let smallRow = document.createElement('div');
        smallRow.className = `small-row small-row-${i}`;

        for (let j = 0; j <= 4; j++) {
            let smallDiv = document.createElement('div');
            let bigDiv = document.createElement('div');
            smallDiv.className = `small small-0${i}${j}`;
            if(j==4){
                smallRow.appendChild(smallDiv);
                continue;
            } 
            bigDiv.className = `big large-0${i}${j}`;
            smallRow.appendChild(smallDiv);
            smallRow.appendChild(bigDiv);
        }


        firstRow.appendChild(smallRow);

        let secondRow = document.createElement('div');
        secondRow.className = `second-row second-row-${i}`;

        let largeRow = document.createElement('div');
        largeRow.className = `large-row large-row-${i}`;

        for (let j = 0; j <= 4; j++) {
            let smallDiv = document.createElement('div');
            let bigDiv = document.createElement('div');
            smallDiv.className = `small small-1${i}${j}`;
            if(j==4){
                largeRow.appendChild(smallDiv);
                continue;
            } 
            bigDiv.className = `big large-1${i}${j}`;
            largeRow.appendChild(smallDiv);
            largeRow.appendChild(bigDiv);
        }

        secondRow.appendChild(largeRow);

        mainContainer.appendChild(firstRow);
        mainContainer.appendChild(secondRow);

        main.appendChild(mainContainer);
    }
    fillRowsWithProjects();
    const clickables = document.querySelectorAll('.clickable');
    handleEyeClick(clickables);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillRowsWithProjects() {
     for(let i=0, j=1; i<10; i++,j++){
        const randomBigCol = colms[i]; 
        let bigCol = document.querySelector(`.large-1${i}${randomBigCol}`);
        let smallCol = document.querySelector(`.large-0${i}${randomBigCol}`);
        let smallEyeCol;
        if(randomBigCol > 1) smallEyeCol = document.querySelector(`.small-0${i}${randomBigCol}`);
        else smallEyeCol = document.querySelector(`.small-0${i}${randomBigCol+1}`);

        bigCol.classList.add('clickable');
        smallCol.classList.add('clickable');
        smallEyeCol.classList.add('clickable');
        bigCol.style.backgroundImage = `url(${data.arr[i].img})`;
        bigCol.style.backgroundRepeat = 'no-repeat';
        bigCol.style.backgroundSize = 'cover';
        // insertVideo(bigCol);
        console.log(data.arr[i].img);
        smallCol.textContent = data.arr[i].name;
        smallEyeCol.textContent = 'e';

        initialPositions.push([i,randomBigCol]);
     }
}

function insertVideo(bigCol) {
    bigCol.style.backgroundColor = 'rgba(210, 180, 140, 1)';
    bigCol.style.display = 'flex';
    bigCol.style.justifyContent = 'center';

    const video = document.createElement('video');
    video.src = `videos/video0.mp4`;
    video.controls = false;
    video.muted = true;
    video.style.width = '90%';
    video.style.height = '100%';
    video.autoplay = true;
    video.loop = true;
    bigCol.appendChild(video);
}

let crossClick;

function handleEyeClick(clickables) {
    clickables.forEach((element) => {
        element.addEventListener('click', () => {
            const classNames = element.className.split(' ');
            console.log('Class names:', classNames);
            let rowCol = classNames[1];
            let r = rowCol[7];
            let c = rowCol[8];
    
            let row = document.querySelector(`.row-${r}`)
            let smallRow = document.querySelector(`.small-row-${r}`);
            let largeRow = document.querySelector(`.large-row-${r}`);
    
            smallRow.innerHTML = '';
            largeRow.innerHTML = '';
    
            console.log(r,c);
    
            for(let j=0; j<3; j++){
                let smallDiv = document.createElement('div');
                let bigDiv = document.createElement('div');
                smallDiv.className = `small small-0${r}${j}`;
                if(j==2){
                    smallRow.appendChild(smallDiv);
                    continue;
                } 
                bigDiv.className = `big large-0${r}${j}`;
                smallRow.appendChild(smallDiv);
                smallRow.appendChild(bigDiv);
            }
    
            for (let j = 0; j <3; j++) {
                let smallDiv = document.createElement('div');
                let bigDiv = document.createElement('div');
                smallDiv.className = `small small-1${r}${j}`;
                if(j==2){
                    largeRow.appendChild(smallDiv);
                    continue;
                } 
                bigDiv.className = `big large-1${r}${j}`;
                largeRow.appendChild(smallDiv);
                largeRow.appendChild(bigDiv);
            }
    
                     
            const cross = document.querySelector(`.small-0${r}1`)
            cross.textContent = 'C';
            cross.classList.add('cross-click');
            gsap.to(row, {
                duration: 0.75,
                height: '105vh',
                onComplete: () => {
                  fillInfoAfterExpanding(r, c);
                }
              }); 
            // row.style.height = '100vh';
            if (c<2) {
                smallRow.style.gridTemplateColumns = '1.5% 72.375% 1.5% 23.125% 1.5%';
                largeRow.style.gridTemplateColumns = '1.5% 72.375% 1.5% 23.125% 1.5%';
                const bigCol = document.querySelector(`.large-1${r}0`)
                const bigColTop = document.querySelector(`.large-0${r}0`);
                bigCol.classList.add('cross-click');
                bigColTop.classList.add('cross-click');
                bigCol.style.backgroundImage = `url(${data.arr[r].img})`;
                bigCol.style.backgroundRepeat = 'no-repeat';
                // insertVideo(bigCol);
                gsap.to(bigCol, {duration: 0.5, backgroundSize: '100%'});
                gsap.to(bigColTop, {duration: 1, backgroundColor: '#212121'});

            }
            else {
                smallRow.style.gridTemplateColumns = '1.5% 23.125% 1.5% 72.375% 1.5%';
                largeRow.style.gridTemplateColumns = '1.5% 23.125% 1.5% 72.375% 1.5%';
                const bigCol = document.querySelector(`.large-1${r}1`);
                const bigColTop = document.querySelector(`.large-0${r}1`);
                bigCol.classList.add('cross-click');
                bigColTop.classList.add('cross-click');
                bigCol.style.backgroundImage = `url(${data.arr[r].img})`;
                bigCol.style.backgroundRepeat = 'no-repeat';
                // insertVideo(bigCol);
                gsap.to(bigCol, {duration: 0.5, backgroundSize: '100%'});
                gsap.to(bigColTop, {duration: 1, backgroundColor: '#212121'});

            }

            
            // fillInfoAfterExpanding(r,c);
    
            crossClick = document.querySelectorAll('.cross-click');
            handleCrossClick();
        });
    });
    
}

function fillInfoAfterExpanding(r,c) {
    let largeCol;
    let largeColTop
    if(c<2) {
        largeCol = document.querySelector(`.large-1${r}${1}`);
        largeColTop = document.querySelector(`.large-0${r}${1}`);
    }
    else {
        largeCol = document.querySelector(`.large-1${r}${0}`);
        largeColTop = document.querySelector(`.large-0${r}${0}`);
    }

    const desc = document.createElement('div');
    const descInfo = document.createElement('div');
    const seeQuesBtn = document.createElement('div');

    descInfo.textContent = 'Designed and developed a sleek portfolio website to showcase creative work. Created a user-friendly interface, integrated social media links, and ensured optimal loading speed for an engaging user experience.';
    seeQuesBtn.textContent = 'SEE QUESTIONS';

    descInfo.classList.add('desc-info');
    seeQuesBtn.classList.add('see-ques-btn');
    desc.classList.add('desc');

    desc.appendChild(descInfo);
    desc.appendChild(seeQuesBtn);

    const status = document.createElement('div');
    const statusTop = document.createElement('div');
    const statusBottom = document.createElement('div');

    const div00 = document.createElement('div');
    const div01 = document.createElement('div');
    div00.textContent = 'STATUS';
    div01.textContent = 'COMPLETED';

    const div10 = document.createElement('div');
    const div11 = document.createElement('div');
    const div12 = document.createElement('div');
    const div13 = document.createElement('div');
    div10.textContent = "YOU'LL LEARN";
    div11.textContent = 'HTML';
    div12.textContent = 'CSS';
    div13.textContent = 'JAVASCRIPT';

    statusTop.appendChild(div00);
    statusTop.appendChild(div01);

    statusBottom.appendChild(div10);
    statusBottom.appendChild(div11);
    statusBottom.appendChild(div12);
    statusBottom.appendChild(div13);

    statusTop.classList.add('status-top');
    statusBottom.classList.add('status-bottom');
    status.classList.add('status');

    status.appendChild(statusTop);
    status.appendChild(statusBottom);

    const iframeBox = document.createElement('div');
    iframeBox.classList.add('iframebox');
    status.appendChild(iframeBox);

    largeCol.appendChild(desc);
    largeCol.appendChild(status);

    largeCol.classList.add('info-grid');

    largeColTop.textContent = 'INFO';
    largeColTop.classList.add('info-top');
    

}

function handleCrossClick() {
    crossClick.forEach((element) => {
        element.addEventListener('click', () => {
            const classNames = element.className.split(' ');
            console.log('Class names:', classNames);
            let rowCol = classNames[1];
            let r = rowCol[7];
            let c = rowCol[8];

            let row = document.querySelector(`.row-${r}`)
            let smallRow = document.querySelector(`.small-row-${r}`);
            let largeRow = document.querySelector(`.large-row-${r}`);

            smallRow.innerHTML = '';
            largeRow.innerHTML = '';

            for (let j = 0; j <= 4; j++) {
                let smallDiv = document.createElement('div');
                let bigDiv = document.createElement('div');
                smallDiv.className = `small small-0${r}${j}`;
                if(j==4){
                    smallRow.appendChild(smallDiv);
                    continue;
                } 
                bigDiv.className = `big large-0${r}${j}`;
                smallRow.appendChild(smallDiv);
                smallRow.appendChild(bigDiv);
            }

            for (let j = 0; j <= 4; j++) {
                let smallDiv = document.createElement('div');
                let bigDiv = document.createElement('div');
                smallDiv.className = `small small-1${r}${j}`;
                if(j==4){
                    largeRow.appendChild(smallDiv);
                    continue;
                } 
                bigDiv.className = `big large-1${r}${j}`;
                largeRow.appendChild(smallDiv);
                largeRow.appendChild(bigDiv);
            }

            smallRow.style.gridTemplateColumns = '1.5% 23.125% 1.5% 23.125% 1.5% 23.125% 1.5% 23.125% 1.5%';
            largeRow.style.gridTemplateColumns = '1.5% 23.125% 1.5% 23.125% 1.5% 23.125% 1.5% 23.125% 1.5%';
            gsap.to(row, {duration: 0, height: '35vh'});

            fillRowAfterClick(r,c);
        })
    })
}

function fillRowAfterClick(r,c) { 
    c = initialPositions[r][1];
    let bigCol = document.querySelector(`.large-1${r}${c}`);
    let smallCol = document.querySelector(`.large-0${r}${c}`);
    let smallEyeCol;
    if(c > 1) smallEyeCol = document.querySelector(`.small-0${r}${c}`);
    else smallEyeCol = document.querySelector(`.small-0${r}${c}`);

    bigCol.classList.add('clickable');
    smallCol.classList.add('clickable');
    smallEyeCol.classList.add('clickable');

    // insertVideo(bigCol);
    bigCol.style.backgroundImage = `url(${data.arr[r].img})`;
    bigCol.style.backgroundRepeat = 'no-repeat';
    bigCol.style.backgroundSize = 'cover';
    console.log(data.arr[r].img);
    smallCol.textContent = data.arr[r].name;
    smallEyeCol.textContent = 'e';

    const clickables = document.querySelectorAll('.clickable');
    handleEyeClick(clickables);
}


