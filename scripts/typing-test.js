const typingArea = document.querySelector('.typing-area');
const str = document.querySelector(".given-text");
const input = document.querySelector("#myInput");
const caret = document.querySelector(".caret");
const timerSet = document.querySelectorAll(".timer-options>li");
const stopWatch = document.querySelector('.live-time>div>p');
const score = document.querySelector('.score>p>span');
const accuracy = document.querySelector('.accuracy>p>span');
const inputArea = document.querySelector('.own-text');
const popup = document.querySelector('.popups');
const inputOwnTextWrapper = document.querySelector('.inputOwnTextWrapper');
const inputText = document.querySelector('.input-text');


let originalString = str.textContent.replace(/\s+/g, " ").trim();

let clock = 0;
let clockActive = false;
let liActiveValue = 0;
let inputStarted = false;
let clockHover = false;
let intervalId = null;
let timerIntervalId = null;

let totalWords = 1;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let currentWordTyping = 0;
let timerForScore = true;
let cnt = 0;
let ended = false;
let normalTimer = true;
let S = 0;
let A = 0;

let backspaced = false;
let line = 0;
let scrollDistance = 0;
let flag = false;
let totalLines = 0;
let nextLineTop = 78;
let maxLines = 0;

const width = window.innerWidth || document.documentElement.clientWidth;
const height = typingArea.getBoundingClientRect().height;
maxLines = Math.floor((height - 35) / 36) - 3;

input.style.height = '0';
input.style.width = '0';
input.style.border = '0';
input.style.padding = '0';

window.addEventListener('resize', () => {
    location.reload();
})

typingArea.addEventListener('click', () => {
    input.focus();
})

document.addEventListener('DOMContentLoaded', function () {

    const defaultTimer = document.querySelector('[value="30"]');

    clockActive = true;
    clockHover = false;
    defaultTimer.style.color = "#ffd700";
    clock = defaultTimer.getAttribute("value");
    liActiveValue = defaultTimer.getAttribute("value");
    stopWatch.innerText = clock;
});

makeHtml(originalString);
function makeHtml(originalString) {
    str.innerHTML = "";
    for (let i = 0; i < originalString.length; i++) {
        const span = document.createElement("span");
        span.textContent = originalString[i];
        span.classList.add(`span${i}`);
        str.insertAdjacentElement("beforeend", span);
    }
    for (let i = 0; i < originalString.length - 2; i++) {
        let index = document.querySelector(`p.given-text span.span${i}`);
        let afterIndex = document.querySelector(`p.given-text span.span${i + 1}`);
        if (index.getBoundingClientRect().top != afterIndex.getBoundingClientRect().top) {
            totalLines++;
        }
    }
}

let firstWordLeft = document.querySelector(`.span0`).getBoundingClientRect().left;
let firstWordTop = document.querySelector(".span0").getBoundingClientRect().top;


input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Backspace") {
        e.preventDefault();
        return;
    }
    let ptr = input.value;
    if (ptr.length < 1) {
        return;
    }

    if (e.key === "Backspace") {
        let once = true;
        let top = false;
        let index = document.querySelector(
            `p.given-text span.span${ptr.length - 1}`
        );
        while (index.classList.contains("notTyped")) {
            if (once) {
                let afterIndex = document.querySelector(
                    `p.given-text span.span${ptr.length}`
                );
                let beforeIndex = document.querySelector(
                    `p.given-text span.span${ptr.length - 2}`
                );
                let beforeIndexTop = beforeIndex.getBoundingClientRect().top;
                let afterIndexTop = afterIndex.getBoundingClientRect().top;
                if (index.getBoundingClientRect().top != afterIndexTop) {
                    top = true;
                    moveCaretBack(index);
                } else if (index.getBoundingClientRect().top != beforeIndexTop) {
                    top = true;
                    moveCaretBack(beforeIndex);
                    input.value = input.value.slice(0, -1);
                }
                once = false;
            }
            index.classList.remove("notTyped");
            index.innerText = originalString[ptr.length - 1];
            ptr = ptr.slice(0, -1);
            index = document.querySelector(
                `p.given-text span.span${ptr.length - 1}`
            );
            flag = true;
        }
        if (flag) {
            input.value = ptr;
            input.value += originalString[ptr.length - 1];
            let caretLeft = index.getBoundingClientRect().left - firstWordLeft + index.getBoundingClientRect().width;
            caret.style.left = `${caretLeft}px`;
            if (!top) {
                let caretTop = index.getBoundingClientRect().top - firstWordTop + 35;
                caret.style.top = `${caretTop}px`;
            }
            flag = false;
            return;
        } else {
            index.classList.remove("right");
            index.classList.remove("wrong");
            let caretLeft = index.getBoundingClientRect().left - firstWordLeft;
            caret.style.left = `${caretLeft}px`;
            let caretTop = index.getBoundingClientRect().top - firstWordTop + 35;
            caret.style.top = `${caretTop}px`;
        }
        if (ptr.length == 1) {
            caret.style.left = "0px";
        }

        let afterIndex = document.querySelector(
            `p.given-text span.span${ptr.length}`
        );
        let beforeIndex = document.querySelector(
            `p.given-text span.span${ptr.length - 2}`
        );
        let beforeIndexTop = beforeIndex.getBoundingClientRect().top;
        let afterIndexTop = afterIndex.getBoundingClientRect().top;
        if (index.getBoundingClientRect().top != afterIndexTop) {
            moveCaretBack(index);
        } else if (index.getBoundingClientRect().top != beforeIndexTop) {
            moveCaretBack(beforeIndex);
            input.value = input.value.slice(0, -1);
        }
        backspaced = true;
    }
});

input.addEventListener("input", (e) => {
    if (clockActive && clock === 0) {
        input.value = input.value.slice(0, -1);
        return;
    }

    inputStarted = true;
    let p = input.value;

    if (p.length < 1) {
        return;
    }

    if (input.value.length > 0 && clockActive === true && clock !== 0) {
        clockActive = false;
        normalTimer = false;
        startTimerForClock();
    }

    if (input.value.length > 0 && timerForScore === true) {
        timerForScore = false;
        timer();
    }

    let index = document.querySelector(`p.given-text span.span${p.length - 1}`);
    if (backspaced) {
        backspaced = false;
        return;
    }
    if (p[0] == " ") {
        p = "";
        input.value = "";
        return;
    }
    if (p.length > 1 && p[p.length - 1] == " " && p[p.length - 2] == " ") {
        input.value = input.value.slice(0, -1);
        return;
    }
    if (originalString[p.length - 1] === p[p.length - 1]) {
        index.classList.add("right");
        if (p[p.length - 1] === ' ')
            currentWordTyping++;
    }
    else {
        if (p[p.length - 1] == " ") {
            currentWordTyping++;
            input.value = input.value.slice(0, -1);
            for (let i = p.length - 1; i < originalString.length; i++) {
                if (originalString[p.length - 1] == " ") break;
                index.classList.add("notTyped");
                if (p.length < originalString.length)
                    p += originalString[i];
                if (input.value.length < originalString.length)
                    input.value += originalString[i];
                index = document.querySelector(
                    `p.given-text span.span${p.length - 1}`
                );
            }
            if (input.value.length < originalString.length)
                input.value += " ";
            if (index)
                index.classList.add("notTyped");
            let afterIndex = document.querySelector(
                `p.given-text span.span${p.length}`
            );
            if (afterIndex) {
                let afterIndexTop = afterIndex.getBoundingClientRect().top;
                if (index.getBoundingClientRect().top !== afterIndexTop) {
                    moveCaretDown(afterIndex, index);
                } else {
                    moveCaret(index);
                }
                return;
            }
            if (currentWordTyping >= totalWords) {
                final();
                ended = true;
                return;
            }
            return;
        }
        if (originalString[p.length - 1] == " " && p[p.length - 1] != " ") {
            input.value = input.value.slice(0, -1);
            return;
        }
        index.classList.add("wrong");
    }
    let afterIndex = document.querySelector(
        `p.given-text span.span${p.length}`
    );
    if (afterIndex) {
        let afterIndexTop = afterIndex.getBoundingClientRect().top;
        if (index.getBoundingClientRect().top !== afterIndexTop) {
            moveCaretDown(afterIndex, index);
        } else {
            moveCaret(index);
        }
    }
    caret.style.animationName = "none";

    if (input.value.length >= originalString.length) {
        final();
        ended = true;
        return;
    }
});


function final() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    input.blur();
    Words();
    S = ((correctCharsTyped / 5) / (cnt / 60)).toFixed(2);
    A = ((correctCharsTyped / totalCharsTyped) * 100).toFixed(2);
    score.textContent = `${S} wpm`;
    accuracy.textContent = `${A} %`;
    // timeSpent.textContent = `${(cnt / 60).toFixed(2)} min`;
    // typingArea.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    str.style.opacity = '0.3';
    caret.style.display = 'none';
    // info();
    // afterText.classList.remove('hidden');
    str.innerHTML = '';
    str.style.display = 'none';
    // focusPopup.removeEventListener('click', focusPopupClickHandler);
    // document.removeEventListener('click', documentClickHandler);

    inputArea.removeEventListener('click', clickHandler);
    updateScoreDb();
    inputArea.removeEventListener('click', clickHandler)
}

function moveCaret(index) {
    let caretLeft =
        index.getBoundingClientRect().left - firstWordLeft + index.getBoundingClientRect().width;
    caret.style.left = `${caretLeft}px`;
    let caretTop = index.getBoundingClientRect().top - firstWordTop + 36;
    caret.style.top = `${caretTop}px`;
}

function moveCaretDown(afterIndex, index) {
    line++;
    let caretLeft = 0;
    caret.style.left = `${caretLeft}px`;
    let caretTop = afterIndex.getBoundingClientRect().top - firstWordTop + 36;
    caret.style.top = `${caretTop}px`;
    if (line > 2) {
        if (line == 3) scrollDistance = 65;
        else scrollDistance += 36;
        if (totalLines - line <= maxLines) {
        } else {
            caret.style.top = `${nextLineTop}px`;
            typingArea.scrollTop = scrollDistance;
        }
    }
}

function moveCaretBack(index) {
    if (line != 0) line--;
    let caretLeft = index.getBoundingClientRect().left - firstWordLeft;
    caret.style.left = `${caretLeft}px`;
    let caretTop = index.getBoundingClientRect().top - firstWordTop + 36;
    caret.style.top = `${caretTop}px`;
    if (line >= 2) {
        if (line == 2) scrollDistance = 29;
        else scrollDistance -= 36;
        if (totalLines - line <= maxLines) {
        } else {
            caret.style.top = `${nextLineTop}px`;
            typingArea.scrollTop = scrollDistance;
        }
    }
}

inputArea.addEventListener('click', clickHandler)

function clickHandler() {
    popup.style.display = 'flex';
    typingArea.style.opacity = '0';
    inputText.textContent = '';
    inputText.focus();
    console.log('hi')
    // focusPopup.removeEventListener('click', focusPopupClickHandler);
    // document.removeEventListener('click', documentClickHandler);
}

popup.addEventListener('click', (event) => {
    if (!inputOwnTextWrapper.contains(event.target)) {
        popup.style.display = 'none';
        typingArea.style.opacity = '1';
        // focusPopup.addEventListener('click', focusPopupClickHandler);
        // document.addEventListener('click', documentClickHandler);
    }
});

function handlePopupInputButton() {
    input.blur();
    let ownInputText = inputText.textContent;
    if (ownInputText.length == 0) {
        inputText.textContent = "Please input some text";
    }
    else if (inputText.textContent === "Please input some text") {
        inputText.textContent = "";
    }
    else {
        originalString = ownInputText.replace(/\s+/g, " ").trim();
        input.value = '';
        caret.style.left = '0';
        makeHtml(originalString);
        popup.style.display = 'none';
        typingArea.style.opacity = '1';
        input.focus();
        input.textContent = '';
        // focusPopup.addEventListener('click', focusPopupClickHandler);
        // document.addEventListener('click', documentClickHandler);
        reset();
    }
}

function reset() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    clock = 0;
    cnt = 0;
    stopWatch.innerText = '0';
    inputStarted = false;
    clockActive = false;
    clockHover = true;
    timerForScore = true;
    liActiveValue = 0;
    ended = false;
    normalTimer = true;
    // time.style.color = 'var(--main-text-color)';
    timerSet.forEach((item) => {
        item.style.color = 'orangered';
    });
    currentWordTyping = 0;
    totalWords = 1;
    totalWordsInText(originalString);
}


function startTimerForClock() {
    timerIntervalId = setInterval(() => {
        if (ended === true) {
            clearInterval(timerIntervalId);
            return;
        }
        clock--;
        stopWatch.innerText = clock;
        stopWatch.classList.remove('liveTimeEffects');
        if (clock === 3 || clock === 2 || clock === 1) {
            stopWatch.classList.add('liveTimeEffects');
        }
        if (clock === 0) {
            if (ended === false) {
                final();
            }
        }
    }, 1000);
}

timerSet.forEach((item) => {
    item.addEventListener("click", () => {
        if (inputStarted === false) {
            if (clockActive && clock === 0) {
                item.style.color = "#ffd700";
                clock = item.getAttribute("value");
                liActiveValue = item.getAttribute("value");
                stopWatch.innerText = clock;
            }
            else if (clockActive && liActiveValue === item.getAttribute("value")) {
                item.style.color = 'var(--main-text-color)';
                clock = 0;
                stopWatch.innerText = clock;
            }
            else if (clockActive && clock !== 0 && liActiveValue !== item.getAttribute("value")) {
                clock = item.getAttribute("value");
                liActiveValue = item.getAttribute("value");
                stopWatch.innerText = clock;
                timerSet.forEach((items) => {
                    items.style.color = 'var(--main-text-color)';
                })
                item.style.color = "#ffd700";
            }
        }
    });
});

totalWordsInText(originalString);
function totalWordsInText(originalString) {
    for (let i = 0; i < originalString.length; i++) {
        if (originalString[i] === ' ')
            totalWords++;
    }
}

function Words() {
    for (let i = 0; i < input.value.length; i++) {
        let index = document.querySelector(`p.given-text span.span${i}`)
        if (input.value[i] === originalString[i] && !index.classList.contains('notTyped'))
            correctCharsTyped++;
    }
    totalCharsTyped = input.value.length;
}

function timer() {
    intervalId = setInterval(() => {
        cnt++;
        if (normalTimer)
            stopWatch.innerText = cnt;
    }, 1000);
}

async function updateScoreDb() {
    try {
        const response = await fetch('/updateScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: S,
                accuracy: A
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update score');
        }
    } catch (error) {
        // console.error(error);
    }
}