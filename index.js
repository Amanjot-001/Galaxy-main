// const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const prettier = require("prettier");
const fs = require('fs');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const { 
    Projects, 
    UserSchema, 
    UserProjectsDataSchema, 
    ProjectUploadSchema,
    PersonalProjectsData,
    typingResults 
    } = require('./db');


// const configuration = new Configuration({
//     apiKey: process.env.API_KEY
// });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/utility", express.static(__dirname + "/utility"));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// const openai = new OpenAIApi(configuration);
mongoose.connect(process.env.MONGO_PROD_URL)
    .then(() => console.log('connected db'));


// const User = mongoose.model('User',  UserSchema);
const User = mongoose.model('User',  UserSchema);
const UserQuestionsData = mongoose.model('UserQuestionsData', UserProjectsDataSchema);
const UserProjectsUpload = mongoose.model('UserProjectsUpload', ProjectUploadSchema);
const UserPersonalProjects = mongoose.model('UserPersonalProjects', PersonalProjectsData);
const UserTypingResult = mongoose.model('UserTypingResult', typingResults);

let sessionId;

app.get('/data', async (req,res) => {
    const data = await Projects.find({});
    res.send(data);
})

app.get('/ques', async(req, res) => {
    const data = await Projects.find({});
    res.render('ques', {data});
})

app.get('/delete', async(req, res) => {
    await Projects.deleteMany({});
    res.sendStatus(200)
})

app.get('/:projectName/questions/:questionNumber', async(req,res) => {
    sessionId = req.cookies.userId;
    const user = await User.findById(sessionId);
    let questionId = user.userQuestionsData;
    const quesNumber = req.params.questionNumber; 
    const projectName = "Calculator";

    const questionsData = await UserQuestionsData.findById(questionId);

    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;
    res.render('ques', {data, questionsData});
})

app.post('/p', async (req, res) => {
    let code = req.body.code;
    let lang = req.body.lang;
    // if(lang == 'javascript') lang = 'js';
    const formattedCode = await prettier.format(code, {
        parser: lang,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 80,
        htmlWhitespaceSensitivity: 'ignore',
        embeddedLanguageFormatting: 'off',
    });
    // console.log(formattedCode);
    res.json(formattedCode);
});

app.post('/handleRunBtn', async (req, res) => {
    const quesNo = req.body.quesNo;
    let html = req.body.html;
    const css = req.body.css;
    const js = req.body.js;
    const lang = req.body.lang;

    html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project</title>
        <link rel="stylesheet" href="/styles/run.css">
        <script src="/scripts/run.js"></script>
    </head>` + html + `</html>`;

    writeHtml();
    writeCss();
    writeJs();

    function writeHtml () {
        fs.writeFile('./run.html', html, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Html File successfully written');
            }
        });
    }

    function writeCss () {
        fs.writeFile('./styles/run.css', css, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Css File successfully written');
            }
        });
    }

    function writeJs () {
        fs.writeFile('./scripts/run.js', js, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Js File successfully written');
            }
        });
    }
    res.sendStatus(200);
})

app.post('/handleRun-codeplay', async (req, res) => {
    let html = req.body.html;
    const css = req.body.css;
    const js = req.body.js;

    html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project</title>
        <link rel="stylesheet" href="/styles/codePlay-render.css">
        <script src="/scripts/codePlay-render.js"></script>
    </head>
    <body>` + html + 
    `</body>
    </html>`;

    writeHtml();
    writeCss();
    writeJs();

    function writeHtml () {
        fs.writeFile('./views/codePlay-render.ejs', html, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Html File successfully written');
            }
        });
    }

    function writeCss () {
        fs.writeFile('./styles/codePlay-render.css', css, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Css File successfully written');
            }
        });
    }

    function writeJs () {
        fs.writeFile('./scripts/codePlay-render.js', js, (err) => {
            if (err) {
            console.error(err);
            } else {
            console.log('Js File successfully written');
            }
        });
    }
    res.sendStatus(200);
})

app.post('/clear-codeplay', async(req, res) => {
    clearHtml();
    clearCss();
    clearJs();

    function clearHtml() {
        fs.writeFile('./views/codePlay-render.ejs', '', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`html successfully cleared`);
            }
        });
    }
    
    function clearCss() {
        fs.writeFile('./styles/codePlay-render.css', '', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`css successfully cleared`);
            }
        });
    }
    
    function clearJs() {
        fs.writeFile('./scripts/codePlay-render.js', '', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`js successfully cleared`);
            }
        });
    }

    res.sendStatus(200);
})

app.post('/loadData', async(req, res) => {
    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;

    res.json(data);
})

app.post('/createUser', async(req, res) => {

    let email = req.body.email;
    let pass = req.body.pass;
    let rollNo = req.body.roll;
    let clg = req.body.clg;
    let userName = req.body.userName;
    let uName = req.body.name;

    const questionsData = new UserQuestionsData({
        projects: [
            {
                name: 'Calculator',
                questions: [
                    {
                        editor: {
                            html: '<!-- Write your code here -->',
                            css: '',
                            js: ''
                        },
                        submissions: []
                    }
                ]
            }
        ]
    })

    await questionsData.save();
    const questionsId = questionsData._id;
    
    const user = new User({
        username: userName,
        name: uName,
        mail: email,
        pass: pass,
        college: clg,
        rollNo: rollNo,
        userQuestionsData: questionsId,
        PersonalProjectData: '',
        ProjectUploadData: ''
    });
    
    await user.save();
    // const U = await User.findById(user._id);
    const userId = user._id;
    
    res.cookie('userId', userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    sessionId = req.cookies.userId;
    res.sendStatus(200);
})

app.get('/delUser', async(req, res) => {
    await User.deleteMany({});
    res.clearCookie('userId'); 
    res.sendStatus(200); 
})

app.get('/delProjectsData', async(req, res)=> {
    const projectData = new Projects({
        project: [
            {
                name: "Calculator",
                questions: [
                    {
                        quesNumber: 1,
                        heading: "Creating a simple Calculator card.",
                        info: `
                        In this task, your goal is to create a user interface for a simple calculator by utilizing
                        HTML. The calculator will be presented as a card, structured with a main <code class="tag-name" style="white-space: nowrap;">div</code> element having the class name <code class="class-name" style="white-space: nowrap;">"calculator-card"</code>. Within this card, you will need to include
                        two additional <code class="tag-name" style="white-space: nowrap;">div</code> elements to organize the content. <br><br>
                        
                        <ul>
                            <li> The first inner <code class="tag-name">div</code>, with the class name <code class="class-name">"display"</code> and insert "0" as
                                default content in this div, this will serve as a container for the calculator's
                                input field. This field will be used to display the numbers and results of
                                calculations to the user.
                            </li> <br>
                            <li> The second inner <code class="tag-name">div</code>, with the class name <code class="class-name">"buttons"</code>, will act as a
                                container for the calculator's buttons. These buttons will enable users to perform
                                basic mathematical operations such as addition, subtraction, multiplication, and
                                division.
                            </li>
                        </ul>
                        `,
                        example: '\n<!-- How to create nested divs -->\n<div class="class-name">\n\t<div class="nested-class">\n\t</div>\n</div>',
                        solution: '\n<!-- This is how you can go about implementing this-->\n<div class="calculator-card">\n\t<div class="display">\n\t</div>\n\t<div class="buttons">\n\t</div>\n</div>',
                        difficulty: 'Easy',
                        preview: false,
                        lang: 'html',
                        like: 0,
                        dislike: 0
                    },
                    {
                        quesNumber: 2,
                        heading: 'Adding buttons in Calculator.',
                        info:
                            `<p> As part of the calculator card creation, you are required to initialize and include 20 button elements inside the <code>div</code> element with the class name "buttons". These buttons will provide functionality for various operations and numerical inputs in the calculator.
                            Each button should have a specific content associated with it. The content of the buttons should be initialized in the following order:</p><br><br>
                            <ul>
                                <li>"AC" - Represents the clear all (reset) functionality.</li>
                                <li>"DEL" - Represents the delete (backspace) functionality.</li>
                                <li>"%" - Represents the percentage functionality.</li>
                                <li>"/" - Represents the division operation.</li>
                                <li>"7" - Represents the number 7.</li>
                                <li>"8" - Represents the number 8.</li>
                                <li>"9" - Represents the number 9.</li>
                                <li>"*" - Represents the multiplication operation.</li>
                                <li>"4" - Represents the number 4.</li>
                                <li>"5" - Represents the number 5.</li>
                                <li>"6" - Represents the number 6.</li>
                                <li>"-" - Represents the subtraction operation.</li>
                                <li>"1" - Represents the number 1.</li>
                                <li>"2" - Represents the number 2.</li>
                                <li>"3" - Represents the number 3.</li>
                                <li>"+" - Represents the addition operation.</li>
                                <li>"^" - Represents the exponentiation (power) operation.</li>
                                <li>"0" - Represents the number 0.</li>
                                <li>"." - Represents the decimal point.</li>
                                <li>"=" - Represents the calculation (equal) operation.</li>
                            </ul> 
                            <p>By including these 20 button elements within the "buttons" <code>div</code>, you will provide users with a comprehensive set of options to perform various mathematical operations and numerical inputs on the calculator interface.</p>`,
                        example: '\n<!-- How to create button elements -->\n<button> AC </button>',
                        solution: '\n<!-- This is how you can go about implementing this-->\n<div class="buttons">\n\t<button> AC </button>\n\t<button> DEL </button>\n\t<button> % </button>\n\t<button> / </button>\n\t<button> 7 </button>\n\t<button> 8 </button>\n\t<button> 9 </button>\n\t<button> * </button>\n\t<button> 4 </button>\n\t<button> 5 </button>\n\t<button> 6 </button>\n\t<button> - </button>\n\t<button> 1 </button>\n\t<button> 2 </button>\n\t<button> 3 </button>\n\t<button> + </button>\n\t<button> ^ </button>\n\t<button> 0 </button>\n\t<button> . </button>\n\t<button> = </button>\n</div>',
                        difficulty: 'Easy',
                        preview: false,
                        lang: 'html',
                        selectedClassForHtml: 'buttons',
                        like: 0,
                        dislike: 0
                    },
                    {
                        quesNumber: 3,
                        heading: 'Center the Calculator card.',
                        info: ` <p>For the time being, the HTML is finished. <br>
                        You constructed a <code>div</code> with the class calculator-card in the previous questions to hold the Calculator. Now that you're done, we want it to look decent, so you must center the calculator and give the <code>body</code> a background color. <br>
                        In order to do so, you need to apply the styling to the <code>body</code>.</p>`,
                        example: '\n<!-- How to set css properties -->\nbody {\n\tbackground-color: #000;\n}',
                        solution: `\n<!-- This is how you can go about implementing this-->\nbody {\n\tbackground-color: #000;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tmin-height: 100vh;\n}`,
                        difficulty: 'Easy',
                        previewCode: {
                            html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                            css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }',
                        },
                        preview: true,
                        lang: 'css',
                    },
                    {
                        quesNumber: 4,
                        heading: 'Styling the Buttons',
                        info: `<p>Now is the moment to style the <code>buttons</code> to improve their appearance because they are now stacked in a single column. <br>
                        We must arrange the buttons within the <code>div</code> with the class "buttons" in a <code>grid</code> with four equal-sized columns and five equal-sized rows. <br>
                        To make it look more appealing, you can also add additional styling such as gap, padding, margin, text-color, background-color, border-radius, etc.</p>`,
                        hint: 'Use grid',
                        example: '\n<!-- How to set css properties -->\n.buttons {\n' +
                            '\tcolor: white;\n' +
                            '\tbackground-color: #333;\n' +
                            '\tborder-radius: 5px;\n' +
                            '}',
                        solution: '\n<!-- This is how you can go about implementing this-->\n.buttons {\n' +
                            '\tdisplay: grid;\n' +
                            '\tgrid-template-columns: repeat(4, 1fr);\n' +
                            '\tgap: 15px;\n' +
                            '\tmargin-top: 20px;\n' +
                            '\tcolor: white;\n' +
                            '\tbackground-color: #333;\n' +
                            '\tpadding: 10px;\n' +
                            '\tborder-radius: 5px;\n' +
                            '}',
                        difficulty: 'Medium',
                        Html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                        Css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; } .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; color: white; background-color: #333; padding: 10px; border-radius: 5px; }',
                        preview: true,
                        lang: 'css',
                    },
                    {
                        quesNumber: 5,
                        heading: "Finishing the calculator's overall design",
                        info: `<p>You need to add some specific styling to the calculator <code>buttons</code> and the <code>divs</code> with class of "calculator-card" and "display" in order to improve the calculator's overall appearance. <br>
                                You can use font-size, cursor-style, padding, background-color, border-radius, text-color, and more.</p>`,
                        example: '\n<!-- How to set css properties -->\nbutton {\n' +
                                '\tcursor: pointer;\n' +
                                '}\n\n' +
                                '.display {\n' +
                                '\ttext-align: end;\n' +
                                '}\n\n' +
                                '.calculator-card {\n' +
                                '\tbackground-color: #222;\n' +
                                '}',
                        solution: '\n<!-- This is how you can go about implementing this-->\n.display {\n' +
                            '\tfont-size: 1.2rem;\n' +
                            '\tpadding: 5px 15px;\n' +
                            '\ttext-align: end;\n' +
                            '\tcolor: white;\n' +
                            '}\n\n' +
                            '.buttons button {\n' +
                            '\tfont-size: 0.7rem;\n' +
                            '\tpadding: 2.5px;\n' +
                            '\tbackground-color: #555;\n' +
                            '\tborder-radius: 5px;\n' +
                            '\tcursor: pointer;\n' +
                            '}\n\n' +
                            '.calculator-card {\n' +
                            '\tpadding: 0.8rem;\n' +
                            '\tbackground-color: #222;\n' +
                            '\tborder-radius: 10px;\n' +
                            '}',
                        difficulty: 'Easy',
                        Html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><link rel="stylesheet" href="ex.css"></head><body><div class="calculator-card"><div class="display">0</div><div class="buttons"><button>AC</button><button>DEL</button><button>%</button><button>/</button><button>7</button><button>8</button><button>9</button><button>*</button><button>4</button><button>5</button><button>6</button><button>-</button><button>1</button><button>2</button><button>3</button><button>+</button><button>^</button><button>0</button><button>.</button><button>=</button></div></div><script src="ex.js"></script></body></html>',
                        Css: '* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; } .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; color: white; background-color: #333; padding: 10px; border-radius: 5px; } .display { font-size: 1.2rem; padding: 5px 15px; text-align: end; color: white; } .buttons button { font-size: 0.7rem; padding: 2.5px; background-color: #555; border-radius: 5px; cursor: pointer; } .calculator-card{padding:0.8rem;background-color:#222;border-radius:10px;}',
                        difficulty: 'Easy',
                        preview: true,
                        lang: 'css',
                    },
                    {
                        quesNumber: 6,
                        heading: "Selecting elements for DOM manipulation.",
                        info: `<p>To make your calculator interactive with JavaScript, your task is to carefully select the <code>display</code> and all the <code>button</code> elements from the <code>html</code> you wrote previously.<br>
                        By targeting and manipulating these elements, you can achieve dynamic functionality for your calculator later. <br>
                        This can be achieved by using javascript's DOM selectors. <br>
                        <b>NOTE:</b> <i>You need to select all the <code>buttons</code>.</i> </p>`,
                        example: "\n<!-- How to select elements in javascript -->\nconst variableName = document.querySelector('.class-name');",
                        solution: "\n<!-- This is how you can go about implementing this-->\nconst input = document.querySelector('.display');\n"+
                        "const buttons = document.querySelectorAll('button');",
                        lang: 'javascript',
                        difficulty: 'Easy',
                        preview: true,
                    },
                    {
                        quesNumber: 7,
                        heading: "Adding Event-Listener for Buttons",
                        info: `<p>You have a calculator with multiple buttons representing digits, operators, and other functionalities. Each <code>button</code> needs to be assigned a <code>click</code> event listener to perform specific actions when clicked.<br>
                            Your task is to write JavaScript code that accomplishes this functionality. Here are the steps you can follow:
                            <ul>
                                <li>Iterate through each <code>button</code> using appropriate method.</li>
                                <li>Add a <code>click</code> event listener to each button.</li>
                                <li>When a <code>button</code> is clicked, capture its displayed value.</li>
                                <li>Pass the captured value to a function, such as <code>handleClickedButtons()</code></li>
                            </ul>
                        </p>`,
                        example: "\n<!-- How to add event listeners in javascript -->\nelement.addEventListener('click', functionName);",
                        solution: "\n<!-- This is how you can go about implementing this-->\nbuttons.forEach(button => {\n" +
                                "\tbutton.addEventListener('click', () => {\n" +
                                "\t\tlet value = button.innerText;\n" +
                                "\t\thandleClickedButtons(value);\n" +
                                "\t})\n" +
                                "})",
                        lang: 'javascript',
                        difficulty: 'Medium',
                        preview: true
                    },
                    {
                        quesNumber: 8,
                        heading: "Defining handleClickButton() function",
                        info: ` <p>In the question, you called a function in the event listener for each <code>button</code>, now you need to define that function. <br>
                        The function should perform these functionalities: 
                        <ul>
                            <li>If value is "AC", it calls <code>handleAcButton(args)</code></li>
                            <li>If value is "DEL", it calls <code>handleDelButton(args)</code></li>
                            <li>If value is "=", it calls <code>calculate(args)</code></li>
                            <li>Otherwise, it calls <code>handleRestOfTheButtons(args)</code></li>
                        </ul>
                        </p>`,
                        example: "\n<!-- How to create functions in javascript -->\nfunction functionName(args){\n"+
                           "\tif(condition) secondFunction(args);\n"+
                            "\t else thirdFunction(args);\n"+
                        "}",
                        solution: "\n<!-- This is how you can go about implementing this-->\nfunction handleClickedButtons(value) {\n" +
                        "\tif (value === 'AC') {\n" +
                        "\t\thandleAcButton();\n" +
                        "\t}\n" +
                        "\telse if (value === 'DEL') {\n" +
                        "\t\thandleDelButton();\n" +
                        "\t}\n" +
                        "\telse if (value === '=') {\n" +
                        "\t\tcalculate();\n" +
                        "\t}\n" +
                        "\telse {\n" +
                        "\t\thandleRestOfTheButtons(value);\n" +
                        "\t}\n" +
                        "}",
                        preview: true,
                        lang: 'javascript',
                        difficulty: 'Easy',
                    },
                    {
                        quesNumber: 9,
                        heading: "Defining the handleAcButton() function",
                        info: `<p>In the previous question, you called a function in the conditional statement for the <code>AC</code> button. Now you need to define that function. <br>
                        The function should simulate the functionality of the "AC" button in a calculator. <br>
                        Your task is to implement this function, which will reset the calculator's display to <code>0</code>.</p>`,
                        example: "\n<!-- How to create functions in javascript -->\nfunction handleAcButton() {\n" +
                            "\t//statements\n" +
                            "}",
                        solution: "\n<!-- This is how you can go about implementing this-->\nfunction handleAcButton() {\n" +
                            "\tinput.innerText = '0';\n" + 
                            "}",
                        lang: 'javascript',
                        preview: true,
                        difficulty: 'Easy'
                    },
                    {
                        quesNumber: 10,
                        heading: "Defining the handleDelButton() function",
                        info: `<p>In the 8th question, you called a function in the conditional statement for the <code>DEL</code> button. Now you need to define that function. <br>
                        The function should simulate the functionality of the "DEL" button in a calculator. <br>
                        The function should perform these functionalities:
                        <ul>
                            <li>It should remove the last digit or character from the current display and update the display accordingly.
                            </li>
                            <li>It should be able to handle various scenarios, such as deleting a single digit, removing the decimal point, or eliminating an entire character. It should also account for cases where the display is already empty or contains only a single digit or character.</li>
                        </ul></p>`,
                        example: "\n<!-- How to create functions in javascript -->\nfunction handleDelButton() {\n" +
                        "\t//statements\n" +
                        "}",
                        solution: "\n<!-- This is how you can go about implementing this-->\nfunction handleDelButton() {\n" +
                            "\tlet currentText = input.innerText;\n" +
                            "\tif (currentText !== '0') {\n" +
                                "\t\tinput.innerText = currentText.slice(0, -1);\n" +
                                "\t\tif (input.innerText === '') {\n" +
                                    "\t\t\tinput.innerText = '0';\n" +
                                "\t\t}\n" +
                            "\t\}\n" +
                        "}",
                        lang: 'javascript',
                        preview: true,
                        difficulty: 'Medium'
                    },
                    {
                        quesNumber: 11,
                        heading: "Defining the calculate() function",
                        info: `<p>In the 8th question, you called a function in the conditional statement for the <code>=</code> button. Now you need to define that function. <br>
                        The function should simulate the functionality of the "=" button in a calculator. <br>
                        The function should use the expression present on the <code>display</code>, parse and evaluate it according to the standard mathematical rules, and display the computed result.<br>
                        <b>Follow up:</b><i> Can you do this without using inbuilt functions.</i>
                       </p>`,
                       example: "\n<!-- How to create functions in javascript -->\nfunction calculate() {\n" +
                        "\t//statements\n" +
                        "}",
                        solution: "\n<!-- This is how you can go about implementing this-->\nfunction calculate() {\n" +
                        "\ttry {\n" +
                        "\t\tinput.innerText = eval(input.innerText);\n" +
                        "\t}\n" +
                        "\tcatch (error) {\n" +
                        "\t\tinput.innerText = 'Invalid Expression';\n" +
                        "\t}\n" +
                        "}",
                        difficulty: 'Hard',
                        lang: 'javascript',
                        preview: true,
    
                    },
                    {
                        quesNumber: 12,
                        heading: "Defining the handleRestOfTheButtons() function",
                        info: `<p>In the 8th question, you called a function in the conditional statement for rest of the buttons. Now you need to define that function. <br>
                        The function should simulate the functionality of all the buttons other than <code>AC</code>, <code>DEL</code>, <code>=</code> in a calculator. <br>
                        The function should perform these functionalities:
                        <ul>
                            <li>It should update the display by concating the expression at display with the value of pressed button.</li>
                            <li>If the current expression of display is <code>0</code> then it should replace it with the value of the pressed button.</li>
                        </ul>
                       </p>`,
                       example: "\n<!-- How to create functions in javascript -->\nfunction handleRestOfTheButtons() {\n" +
                       "\t//statements\n" +
                       "}",
                       solution: "\n<!-- This is how you can go about implementing this-->\nfunction handleRestOfTheButtons(value) {\n" +
                       "\tif (input.innerText === '0') {\n" +
                           "\t\tinput.innerText = value;\n" +
                       "\t} else {\n" +
                           "\t\tinput.innerText += value;\n" +
                       "\t}\n" +
                   "}",
                   difficulty: 'Easy',
                   lang: 'javascript',
                   preview: true,
                    }
                ]
            }
        ]
    })

    await projectData.save();
    res.sendStatus(200);
})

app.get('/find', async(req, res) => {
    const user = await User.find({});
    const questionsData = await UserQuestionsData.findById("650ae77124925ddbcd092c18");
    const personalData = await UserPersonalProjects.findById("650c0c89387f1a2f7396ce2d");

    const personaldatas = await UserPersonalProjects.find({});
    const uploads = await UserProjectsUpload.find({})
    // res.send(personaldatas)
    res.send(uploads)
    // res.send(questionsData);
    // res.send(personalData)
    // res.send(user)
})

app.post('/:projectName/questions/:questionNumber/submitData', async (req, res) => {
    const code = req.body.code;
    const lang = req.body.lang;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";

    const UserData = await User.findById(sessionId);
    const questionsId = UserData.userQuestionsData;

    const questionsData = await UserQuestionsData.findById(questionsId);

    let currQues = questionsData.projects[0].questions[quesNumber-1];
    let nextQues = questionsData.projects[0].questions[quesNumber];
    currQues.editor[lang] = code;

    currQues.submissions.push(`${code}`);

    if(!nextQues) {
        const newQuestion = {
            editor: {
                html: "",
                css: "",
                js: ""
            }
        } 

        newQuestion.editor.html = currQues.editor.html;
        newQuestion.editor.css = currQues.editor.css;
        newQuestion.editor.js = currQues.editor.js;

        questionsData.projects[0].questions.push(newQuestion);
    }

    await questionsData.save();
    res.sendStatus(200);
})

app.get('/run', (req, res) => {
    const filePath = path.join(__dirname, 'run.html');
    res.sendFile(filePath);
});

app.get('/codePlay', async(req, res) => {
    let title = req.query.title;
    title = title.replace(/\s+/g, " ").trim();
    res.render('codePlay', { title });
})

app.get('/Calculator/Questions', (req, res) => {
    res.render('viewQues');
})

app.get('/codePlay-run', (req, res) => {
    res.render('codePlay-render')
})

app.post('/handleSave-codeplay', async(req, res) => {
    let projectTitle = req.body.title;
    const htmlCode = req.body.html;
    const cssCode = req.body.css;
    const jsCode = req.body.js;

    projectTitle = projectTitle.replace(/\s+/g, " ").trim();

    sessionId = req.cookies.userId;
    const UserData = await User.findById(sessionId);
    let PersonalProjectsId = UserData.PersonalProjectData;

    if(PersonalProjectsId === '') {
        const personalProjects = new UserPersonalProjects({
            creations: [
                {
                    title: projectTitle,
                    code: {
                        html: htmlCode,
                        css: cssCode,
                        js: jsCode
                    }
                }
            ]
        })

        personalProjects.save();

        PersonalProjectsId = personalProjects._id;
        UserData.PersonalProjectData = personalProjects._id;
        UserData.save();
    }
    else {
        const personalProjects = await UserPersonalProjects.findById(PersonalProjectsId);

        const newCreation = {
            title: projectTitle,
            code: {
                html: '',
                css: '',
                js: ''
            }
        }

        newCreation.code.html = htmlCode;
        newCreation.code.css = cssCode;
        newCreation.code.js = jsCode;

        personalProjects.creations.push(newCreation);
        personalProjects.save();
    }
    res.sendStatus(200);
})

app.get('/preview', async(req, res)=> {
    res.render('codePlay-render');
})

app.get('/login', (req,res) => {
    res.render('login');
})

app.get('/create', async(req, res) => {
    sessionId = req.cookies.userId;
    const user = await User.findById((sessionId));
    const personalId = user.PersonalProjectData;
    const personalData = await UserPersonalProjects.findById(personalId);

    // console.log(personalData.creations.length)
    res.render('create-page', {personalData});
})

app.post('/checkTitle', async(req, res) => {
    const projectTitle = req.body.title;
    const checkTitle = await UserPersonalProjects.findOne({ title: projectTitle})

    if(checkTitle) res.sendStatus(200);
    else res.sendStatus(404);
})

app.get('/upload', async(req, res) => {
    res.render('upload-form');
})

app.post('/saveProject', async (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const github = req.body.github;
    const website = req.body.website;
    const tech = req.body.tech;

    sessionId = req.cookies.userId;
    const UserData = await User.findById(sessionId);
    let uploadsId = UserData.ProjectUploadData;

    if(uploadsId === '') {
        const ProjectUploads = new UserProjectsUpload({
            uploads: [
                {
                    title: title,
                    desc: desc,
                    github: github,
                    website: website,
                    tech: tech
                }
            ]
        })

        ProjectUploads.save();

        uploadsId = ProjectUploads._id;
        UserData.ProjectUploadData = uploadsId;
        UserData.save();
    }
    else {
        const uploadData = await UserProjectsUpload.findById(uploadsId);

        const newUpload = {
            title: title,
            desc: desc,
            github: github,
            website: website,
            tech: tech
        }

        uploadData.uploads.push(newUpload);
        uploadData.save();
    }
    res.sendStatus(200);
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});