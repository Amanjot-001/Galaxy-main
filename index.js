const { Projects, UserProjectsData } = require('E:/editor page/db.js');
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
const cookieParser = require('cookie-parser');

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



    const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: [true, 'Username cannot be blank']
        },
        name: {
            type: String,
            required: [true, 'Name cannot be blank']
          },
        mail: {
            type: String,
            required: [true, 'mail cannot be blank']
          },
        pass: {
            type: String,
            required: [true, 'password cannot be blank']
          },
        college: {
            type: String,
            required: [true, 'college name cannot be blank']
          },
        mentor: String,
        team: String,
        work: String,
        projects: [
            {
                name: String,
                questions: [
                    {
                        editor: {
                            html: String,
                            css: String,
                            js: String
                        },
                        submissions: [
                            {
                                type: String
                            }
                        ]
                    }
                ]
            }
        ]
    })

    const User = mongoose.model('User',  UserSchema);

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

let sessionId;

app.get('/:projectName/questions/:questionNumber', async(req,res) => {
    sessionId = req.cookies.userId;
    const user = await User.findById(sessionId);
    // let projectID = user.projects;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";
    // const userData = await UserProjectsData.findOne(
    //     { _id: projectID, "projects.name": projectName },
    //     { "projects.questions": { $slice: [quesNumber - 1, 1] } }
    // );
    // let userData = await UserProjectsData.findOne(
    //     {
    //       _id: projectID,
    //       "projects.name": projectName
    //     }
    // );    
    // const projectName = req.params.projectName; 
    // const quesNumber = "1";

    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;
    // userData = userData.projects[0].questions[quesNumber-1];
    // res.send(userData.projects[0].questions[quesNumber-1])
    res.render('ques', {data, user});
})

app.post('/p', async (req, res) => {
    let code = req.body.code;
    let lang = req.body.lang;
    if(lang == 'javascript') lang = 'js';
    const formattedCode = await prettier.format(code, {
        parser: lang,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 80, // Set the desired line width for indentation
        htmlWhitespaceSensitivity: 'ignore', // Ignore HTML indentation rules
        embeddedLanguageFormatting: 'off', // Disable formatting for embedded languages
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


app.post('/loadData', async(req, res) => {
    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;

    res.json(data);
})

app.get('/createUser', async(req, res) => {
    
    const user = new User({
        username: "aman",
        name: "amanjot",
        mail: "aman",
        pass: "1234",
        college: "mietGANDU",
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
    });
    
    await user.save();
    const U = await User.findById(user._id);

    
    res.cookie('userId', U._id, { maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.sendStatus(200);
})

app.get('/delUser', async(req, res) => {
    await User.deleteMany({});
    res.clearCookie('userId'); 
    res.sendStatus(200); 
})

app.get('/find', async(req, res) => {
    const user = await User.find({});
    // const userData = await UserProjectsData.find({})
    res.send(user);
})

app.post('/:projectName/questions/:questionNumber/submitData', async (req, res) => {
    const code = req.body.code;
    const lang = req.body.lang;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";
    // console.log(code);
    // console.log(quesNumber);

    const UserData = await User.findOne({name: "amanjot"});

    console.log(UserData);
    // console.log(UserDataData);
    let currQues = UserData.projects[0].questions[quesNumber-1];
    console.log(currQues);
    let nextQues = UserData.projects[0].questions[quesNumber];
    currQues.editor[lang] = code;
    // console.log(UserDataData)
    // currQues.lang = code;
    currQues.submissions.push(`${code}`);
    // console.log(currQues.submissions);

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

        UserData.projects[0].questions.push(newQuestion);
    }

    await UserData.save();
    res.sendStatus(200);
})

app.get('/run', (req, res) => {
    const filePath = path.join(__dirname, 'run.html');
    res.sendFile(filePath);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});