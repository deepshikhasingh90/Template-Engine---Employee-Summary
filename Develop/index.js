const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
let teamSize;
let name;
let email;
let role;
let id;

async function init(){

    console.log("Lets build your team!!");

    await inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of your manager",
            name: "name",
            validate: answer =>{
                if(answer!=""){
                    return true;
                }
                return "Please enter a valid name.";
            }
        },
        {
            type: "input",
            message: "Please Enter the Manager's ID",
            name: "id",
            validate: answer =>{
                if(answer !=""){
                  return true;
                }
                return "please enter a valid ID";
            }
        },
        {
            type: "input",
            message:"please enter Managers Email ID!",
            name:"email",
            validate: answer =>{
                const validEmail = answer.match(
                    /\S+@\S+\.\S+/
                );
                if(validEmail){
                    return true;    
                }
                return "please enter a valid Email ID"
            }
        },
        {
            type: "number",
            message: "Please enter manager's Office Number!",
            name:"officeNo",
            validate: answer =>{
                if(!isNaN(answer)){
                    return true;
                }
                return "please enter a valid Number"
            }
        }

    ]).then((data) =>{

        const manager = new Manager(data.name,data.id,data.email,data.officeNo);
        teamMembers.push(manager);
    })
    await inquirer.prompt({
        type:"number",
        message: "How many members are in your team",
        name: "numberOfTeamMembers"

    }).then((data) => {
        teamSize = data.numberOfTeamMembers + 1;
    })
    if(teamSize===0){
        console.log("Seems like you dont have a team!!");
        return;
     }
    for(let i=1; i < teamSize; i++){
        await inquirer.prompt([
            {
                type: "input",
                message: `Please Enter the name of Employee-${i}.`,
                name: "name",
                validate: answer=>{
                    if(answer !=""){
                        return true;
                    }
                    return `Employee Name cannot be empty. Please Enter a name`
                }
            },
            {
                type:"input",
                message:`Please enter Employee-${i} ID`,
                name:"id",
                validate: answer=>{
                    if(answer !=""){
                        return true;
                    }
                    return `Employee Name cannot be empty. Please Enter a name`
                }
            },
            {
                type:"input",
                message:`Please enter the Employee-${i} Email-ID`,
                name:"email",
                validate: answer =>{
                    const validEmail = answer.match(
                        /\S+@\S+\.\S+/
                    );
                    if(validEmail){
                        return true;    
                    }
                    return "please enter a valid Email ID"
                }
            },
            {
                type: "list",
                message: `what the employee (${i})'s title?`,
                name: "role",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ]).then((data) =>{
            name = data.name;
            id= data.id;
            email=data.email;
            role =data.role;
        })
        switch(role){
            case "Intern":
                await inquirer.prompt({
                    type:"input",
                    message :`What shool is your Intern-${i} attending?`,
                    name:"school"
                }).then((data) =>{
                    const intern = new Intern(name,id,email,data.school);
                    teamMembers.push(intern);
                });
                break;

            case "Engineer":
                await inquirer.prompt({
                    type:"input",
                    message:`Please Enter the Employee-${i} Github ID`,
                    name:"gitHubID"
                }).then((data) =>{
                    const engineer = new Engineer(name,id,email,data.gitHubID);
                    teamMembers.push(engineer);
                });
                break
        }
    }
    fs.writeFile(outputPath,render(teamMembers), function(err) 
    {
        if (err)
        {
         return console.log(err);
        }
        console.log("File SuccessFully Created!!");
    });

}
init();