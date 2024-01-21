const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');

mongoose.connect(process.env.MONGO_PROD_URL)
    .then(() => console.log('connected db2'));

const ProjectsSchema = new mongoose.Schema({
    project: [
        {
            name: String,
            questions: [
                {
                    quesNumber: Number,
                    heading: String,
                    info: String,
                    example: String,
                    preview: Boolean,
                    lang: String,
                    solution: String,
                    like: Number,
                    dislike: Number,
                    difficulty: String,
                    hint: String,
                    selectedClassForHtml: String
                }
            ]
        }
    ]
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    name: {
        type: String,
        required: [true, 'Name cannot be blank']
      },
    mail: {
        type: String,
        unique: true,
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
    rollNo: {
        type: String,
        unique: true,
        required: [true, 'Roll number cannot be blank']
    },
    userQuestionsData: String,
    ProjectUploadData: String,
    PersonalProjectData: String,
    typingResults: String
})

const UserProjectsDataSchema = new mongoose.Schema({
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

const ProjectUploadSchema = new mongoose.Schema({
    uploads: [
        {
            title: {
                type: String,
                unique: true
            },
            desc: {
                type: String,
                maxlength: 200,
              },
            github: String,
            website: String,
            date: {
                type: String,
                default: moment().format('YYYY MM DD')
            },
            team: {
                type: [{
                    username: String,
                }],
                // validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
                maxItems: 4, 
            },
            tech: [
                {
                    name: String
                }
            ],
            mentor: {
                type: [{
                    username: String,
                }],
                // validate: [arrayLimit, '{PATH} exceeds the limit of 2'],
                maxItems: 2,
            }
        }
    ]
})

const PersonalProjectsData = new mongoose.Schema({
    creations: [
        {
            title: {
                type: String,
                unique: true
            },
            code: {
                html: String,
                css: String,
                js: String
            },
            date: {
                type: String,
                default: moment().format('YYYY MM DD')
            },
            likes: {
                type: Number,
                default: 0
            }
        }
    ]
})

const typingResults = new mongoose.Schema({
    score: [
        {
          wpm: {
            type: String
          },
          accuracy: {
            type: String
          },
          date: {
            type: String,
            default: moment().format('YYYY MM DD')
          }
        }
    ],
    bestScore: {
        type: Number,
        default: 0
    },
    testsTaken: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    }
})


const Projects = mongoose.model('Projects', ProjectsSchema);
// const User = mongoose.model('User',  UserSchema);
// const UserProjectsData = mongoose.model('UserProjectsData', UserProjectsDataSchema);

// UserProjectsData.updateMany({})


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
                    HTML. The calculator will be presented as a card, structured with a main <code class="tag-name">div</code>
                    element having the class name <code class="class-name">"calculator-card"</code>. Within this card, you will need to include
                    two additional <code class="tag-name">div</code> elements to organize the content. <br><br>
                    
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

// projectData.save();  

module.exports = {
    Projects,
    UserSchema,
    UserProjectsDataSchema,
    ProjectUploadSchema,
    PersonalProjectsData,
    typingResults
  };