const { Projects, User, UserProjectsData } = require('E:/editor page/db.js');
// const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
// const prettier = require("prettier");
// const fs = require('fs');
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
    let projectID = user.projects;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";
    // const userData = await UserProjectsData.findOne(
    //     { _id: projectID, "projects.name": projectName },
    //     { "projects.questions": { $slice: [quesNumber - 1, 1] } }
    // );
    let userData = await UserProjectsData.findOne(
        {
          _id: projectID,
          "projects.name": projectName
        }
    );    
    // const projectName = req.params.projectName; 
    // const quesNumber = "1";

    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;
    userData = userData.projects[0].questions[quesNumber-1];
    // res.send(userData.projects[0].questions[quesNumber-1])
    res.render('ques', {data, userData});
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
    const userData = new UserProjectsData({
        projects: [
            {
                name: "Calculator",
                questions: [
                    {
                        html: '<!-- Write your code here -->'
                    }
                ]
            }
        ]
    })

    await userData.save();

    const dataId = await UserProjectsData.findById(userData._id);
    console.log(dataId._id)
    
    const user = new User({
        username: "aman",
        name: "amanjot",
        mail: "aman",
        pass: "1234",
        college: "mietGANDU",
        projects: dataId._id
    })

    await user.save();
    const U = await User.findById(user._id);

    res.clearCookie('userId'); 
    res.cookie('userId', U._id, { maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.sendStatus(200);
})

app.get('/delUser', async(req, res) => {
    await User.deleteMany({});
    await UserProjectsData.deleteMany({});
    res.sendStatus(200); 
})

app.get('/find', async(req, res) => {
    const user = await User.find({});
    const userData = await UserProjectsData.find({})
    res.send(userData);
})

app.post('/:projectName/questions/:questionNumber/submitData', async(req, res) => {
    const code = req.body.code;
    const lang = req.body.lang;
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";
    console.log(quesNumber);

    const user = await User.findById(sessionId);
    let projectID = user.projects;
    let userData = await UserProjectsData.findOne(
        {
          _id: projectID,
          "projects.name": projectName
        });
    let currQues = userData.projects[0].questions[quesNumber-1];
    let nextQues = userData.projects[0].questions[quesNumber];
    currQues.lang = code;
    currQues.submissions.push(code);

    if(!nextQues) {
        const newQuestion = {
            editor: {
                html: currQues.html,
                css: currQues.css,
                js: currQues.js
            },
            submissions: [],
        }

        userData.projects[0].questions.push(newQuestion);
    }

    
    await userData.save();
    res.sendStatus(200);
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});