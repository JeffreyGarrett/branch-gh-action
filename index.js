const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
//setup brnahcing structure
let testFile = fs.readFileSync('branchStructure.json');
let testBranchStructure = JSON.parse(testFile);
//const token = core.getInput('github-token', { required: true })

let branchStructure = core.getInput('branch_structure') || testBranchStructure

console.log("test");

try {
    const currentBranch = github.base_ref;
    const futureBranch = github.head_ref;

    console.log(currentBranch);
    console.log(futureBranch);

    /* `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`); */
} catch (error) {

    core.setFailed(error.message);
}