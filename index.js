const core = require('@actions/core');
const github = require('@actions/github');
const { GitHub } = require('@actions/github/lib/utils');
const fs = require('fs');

//setup branching structure
const branchRulesFile = fs.readFileSync('branchStructure.json');
const branchRules = JSON.parse(branchRulesFile);
const branchStructure = core.getInput('branch_structure') || branchRules;

//setup rest client
const token = (core.getInput('github_token') || process.env.GITHUB_TOKEN);
const octokit = github.getOctokit(token);
const context = github.context

async function run() {
    console.log("starting try catch");

    try {
        const pull_number = core.getInput('pull_number');
        const currentBranch = context.ref;
        //const prPayload = github.context.payload.pull_request;
        console.log("current branch is: " + currentBranch);
        console.log("current pr number: " + pull_number);
        console.log("current repo: " + context.repo.repo);

        const request = await octokit.pulls.get({
            ...context.repo.repo,
            pull_number
        })

        const pr = request.data;

        console.log("The base branch is: " + pr.base.ref);
        console.log("The head branch is: " + pr.head.ref);
        console.log(JSON.stringify(branchStructure));

        
        console.log(prPayload.number);


    } catch (error) {

        core.setFailed(error.message);
    }
}

run().catch((error) => {
    core.setFailed(error.message)
})
