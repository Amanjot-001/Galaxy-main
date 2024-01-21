// const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const helmet = require('helmet');
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
const bcrypt = require('bcryptjs');
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
// app.use(
//     helmet({
//         xFrameOptions: { action: "deny" },
//     })
// );

// const openai = new OpenAIApi(configuration);
mongoose.connect(process.env.MONGO_PROD_URL)
    .then(() => console.log('connected db'));


// const User = mongoose.model('User',  UserSchema);
const User = mongoose.model('User', UserSchema);
const UserQuestionsData = mongoose.model('UserQuestionsData', UserProjectsDataSchema);
const UserProjectsUpload = mongoose.model('UserProjectsUpload', ProjectUploadSchema);
const UserPersonalProjects = mongoose.model('UserPersonalProjects', PersonalProjectsData);
const UserTypingResult = mongoose.model('UserTypingResult', typingResults);

let sessionId;
let usr = '';

app.get('/logOut', (req, res) => {
    res.clearCookie('userId');
    sessionId = '';
    res.sendStatus(200);
})

app.use(async (req, res, next) => {
    sessionId = req.cookies.userId;
    if (sessionId) {
        if (usr === '')
            usr = await User.findOne({ _id: sessionId });

    }
    // console.log(usr);
    next();
})

app.get('/data', async (req, res) => {
    const data = await Projects.find({});
    res.send(data);
})

app.get('/ques', async (req, res) => {
    const data = await Projects.find({});
    res.render('ques', { data });
})



app.get('/:projectName/questions/:questionNumber', async (req, res) => {
    sessionId = req.cookies.userId;
    let user = '';
    if (usr === '')
        user = await User.findById(sessionId);
    else user = usr;
    let questionId = user.userQuestionsData;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";

    const questionsData = await UserQuestionsData.findById(questionId);

    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;
    res.render('ques', { data, questionsData, sessionId });
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

    function writeHtml() {
        fs.writeFile('./views/run.ejs', html, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Html File successfully written');
            }
        });
    }

    function writeCss() {
        fs.writeFile('./styles/run.css', css, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Css File successfully written');
            }
        });
    }

    function writeJs() {
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
    // const lang = req.body.lang;

    html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project</title>
        <link rel="stylesheet" href="../styles/codePlay-render.css">
        <script src="../scripts/codePlay-render.js"></script>
    </head>
    <body>` + html +
        `</body>
    </html>`;

    console.log("CSS Path:", './styles/codePlay-render.css');


    writeCss();
    writeJs();
    writeHtml();

    function writeHtml() {
        fs.writeFile('./views/codePlay-render.ejs', html, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Html File successfully written');
            }
        });
    }

    function writeCss() {
        fs.writeFile('./styles/codePlay-render.css', css, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Css File successfully written');
            }
        });
    }

    function writeJs() {
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

app.post('/clear-codeplay', async (req, res) => {
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

app.post('/loadData', async (req, res) => {
    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;

    res.json(data);
})

app.post('/createUser', async (req, res) => {

    let { email, pass, roll, clg, userName, name } = req.body;


    name = name.replace(/\s+/g, " ").trim();
    userName = userName.replace(/\s+/g, " ").trim();
    pass = pass.replace(/\s+/g, " ").trim();
    email = email.replace(/\s+/g, " ").trim();
    roll = roll.replace(/\s+/g, " ").trim();
    clg = clg.replace(/\s+/g, " ").trim();



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

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);

    const user = new User({
        username: userName,
        name: name,
        mail: email,
        pass: hash,
        college: clg,
        rollNo: roll,
        userQuestionsData: questionsId,
    });

    await user.save();
    // const U = await User.findById(user._id);
    const userId = user._id;

    res.cookie('userId', userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    sessionId = res.cookie.userId;

    res.sendStatus(200);
})

app.post('/checkUserExist', async (req, res) => {
    const checkEmail = await User.findOne({ mail: req.body.email });
    if (checkEmail) res.sendStatus(200);
    else res.sendStatus(404);
})

app.post('/checkRollExist', async (req, res) => {
    const checkRoll = await User.findOne({ rollNo: req.body.roll });
    if (checkRoll) res.sendStatus(200);
    else res.sendStatus(404);
})

app.post('/signIn', async (req, res) => {
    const { email, pass } = req.body;
    const user = await User.findOne({ mail: email });

    const validPassword = await bcrypt.compare(pass, user.pass);
    if (validPassword) {
        const userId = user._id;
        res.cookie('userId', userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        sessionId = res.cookie.userId;
        res.sendStatus(200);
    }
    else res.sendStatus(404);
})

// app.get('/delUser', async(req, res) => {
//     await UserProjectsUpload.deleteMany({});
//     res.clearCookie('userId'); 
//     res.sendStatus(200); 
// })


app.get('/find', async (req, res) => {
    // const user = await User.findOne({ _id: sessionId });
    const user = await User.find({});
    const typing = await UserTypingResult.find({});
    const questionsData = await UserQuestionsData.find({});
    const typin = await UserTypingResult.find({});
    const pro = await UserProjectsUpload.find({});
    // res.send(pro);
    // res.send(questionsData);
    res.send(typin);
    // res.send(user);
    // const personaldatas = await UserPersonalProjects.find({});
    // res.send(personaldatas)
})

app.post('/:projectName/questions/:questionNumber/submitData', async (req, res) => {
    const code = req.body.code;
    const lang = req.body.lang;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";

    const UserData = await User.findById(sessionId);
    const questionsId = UserData.userQuestionsData;

    const questionsData = await UserQuestionsData.findById(questionsId);

    let currQues = questionsData.projects[0].questions[quesNumber - 1];
    let nextQues = questionsData.projects[0].questions[quesNumber];
    currQues.editor[lang] = code;

    currQues.submissions.push(`${code}`);

    if (!nextQues) {
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
    // const filePath = path.join(__dirname, '/views/run.ejs');
    // res.sendFile(filePath);
    res.render('run');
});

app.get('/codePlay', async (req, res) => {
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

app.get('/preview', async (req, res) => {
    res.render('codePlay-render');
})

app.get('/signIn', (req, res) => {
    res.render('login');
})

app.get('/typing', (req, res) => {
    res.render('typing-test', { sessionId, usr });
})

app.post('/updateScore', async (req, res) => {
    if (sessionId === '') {
        res.sendStatus(200);
        return;
    }
    const user = await User.findOne({ _id: sessionId });
    // console.log(user);
    if (user.typingResults === undefined) {
        const typingResult = new UserTypingResult({
        });

        await typingResult.save();
        user.typingResults = typingResult._id;
    }

    const userTyping = await UserTypingResult.findOne({ _id: user.typingResults });

    let S = req.body.score;
    const A = req.body.accuracy;

    if (S == Infinity || S == null) {
        S = 0;
    }

    userTyping.score.push({
        wpm: S,
        accuracy: A
    });

    let tests = userTyping.testsTaken;
    tests++;
    userTyping.testsTaken = tests;

    let bestScore = userTyping.bestScore;
    if (S > bestScore)
        userTyping.bestScore = S;

    await userTyping.save();

    const users = await UserTypingResult.find({}).sort({ bestScore: -1 });

    let rank = 1;
    for (const user of users) {
        user.rank = rank;
        await user.save();
        rank++;
    }

    res.sendStatus(200);
})

app.get('/explore', (req, res) => {
    res.render('explore', { sessionId, usr });
})

app.post('/handleSave-codeplay', async (req, res) => {
    let projectTitle = req.body.title;
    const htmlCode = req.body.html;
    const cssCode = req.body.css;
    const jsCode = req.body.js;

    projectTitle = projectTitle.replace(/\s+/g, " ").trim();


    const UserData = await User.findById(sessionId);
    let PersonalProjectsId;

    if (UserData.PersonalProjectData === undefined) {
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
        PersonalProjectsId = UserData.PersonalProjectData;
        // console.log(PersonalProjectsId);
        const personalProjects = await UserPersonalProjects.findById(PersonalProjectsId);
        // console.log(personalProjects);

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


app.get('/create', async (req, res) => {
    // console.log(personalData.creations.length)
    res.render('create', { sessionId, usr });
})

app.post('/checkTitle', async (req, res) => {
    const projectTitle = req.body.title;
    const checkTitle = await UserPersonalProjects.findOne({ title: projectTitle })

    if (checkTitle) res.sendStatus(200);
    else res.sendStatus(404);
})

app.get('/upload', (req, res) => {
    res.render('upload', { sessionId, usr });
})

app.get('/projects', (req, res) => {
    res.render('projects', { sessionId, usr });
})

app.post('/saveProject', async (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const github = req.body.github;
    const website = req.body.website;
    const tech = req.body.tech;

    // console.log(title, desc, github, website, tech)

    sessionId = req.cookies.userId;
    const UserData = await User.findById(sessionId);
    let uploadsId = UserData.ProjectUploadData;

    if (uploadsId === undefined) {
        const ProjectUploads = new UserProjectsUpload({
            uploads: [
                {
                    title: title,
                    desc: desc,
                    github: github,
                    website: website,
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
        }

        // console.log(UserData)

        uploadData.uploads.push(newUpload);
        uploadData.save();
    }
    res.sendStatus(200);
})

app.get('/', (req, res) => {
    res.render('projects', { sessionId, usr });
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});