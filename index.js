const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

//setup brnahcing structure
let branchRulesFile = fs.readFileSync('branchStructure.json');
let branchRules = JSON.parse(branchFile);
const token = (core.getInput('github_token') || process.env.GITHUB_TOKEN);
let branchStructure = core.getInput('branch_structure') || branchRules;
const octokit = new github.GitHub(token)
const context = github.context

console.log("testing again");

try {
    const pull_number = parseInt(core.getInput('pull_number'),0);
    const currentBranch = github.context.ref;
    const prPayload = github.context.payload.pull_request;
    
    const request = await octokit.pulls.get({
        ...context.repo,
        pull_number
      })
    
    const pr = request.data;
    
    console.log("The base branch is: " + pr.base.ref);
    console.log("The head branch is: " + pr.head.ref);
    console.log(JSON.stringify("The Branch strucutre is : \n" + branchStructure))
    
    console.log(currentBranch);
    console.log(prPayload.number);


} catch (error) {

    core.setFailed(error.message);
}