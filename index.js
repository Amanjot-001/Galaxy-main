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

// const configuration = new Configuration({
//     apiKey: process.env.API_KEY
// });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/utility", express.static(__dirname + "/utility"));

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

app.get('/:projectName/questions/:questionNumber', async(req,res) => {
    // const projectName = req.params.projectName; 
    const quesNumber = req.params.questionNumber;
    const projectName = "Calculator";
    // const quesNumber = "1";

    let data = await Projects.findOne(
        { 'project.name': projectName },
        { 'project.questions': { $slice: [quesNumber - 1, 1] } }
    );
    data = data.project[0].questions;
    // res.send(data)
    res.render('ques', {data});
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
                name: "Calculator"
            }
        ]
    })

    // await userData.save();

    const dataId = await UserProjectsData.find({});
    console.log(dataId._id)
    
    const user = new User({
        username: "aman",
        name: "amanjot",
        mail: "aman",
        pass: "1234",
        college: "mietGANDU",
        projects: dataId._id
    })

    // await user.save();
    const temp = await UserProjectsData.findById(dataId._id);
    res.send(temp);
})

app.listen(8080, () => {
    console.log('Server is running on port 3000');
});