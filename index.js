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
const base = (core.getInput('github_base_ref') || process.env.GITHUB_BASE_REF);
const head = (core.getInput('github_head_ref') || process.env.GITHUB_HEAD_REF);

console.log("base: " + base);
console.log("head: " + head);
console.log("context head" + github.context.baseRef);
console.log("context head" + github.context.base_ref);

const octokit = github.getOctokit(token);
const context = github.context

async function run() {
    console.log("starting try catch");

    try {
        const currentBranch = context.ref;
        const prPayload = github.context.payload.pull_request.number;
        const repo = process.env.GITHUB_REPO;
        console.log("current branch is: " + currentBranch);
        console.log("prnumber is: " + prPayload);
        console.log("current repo: " + context.repo.repo);
        console.log("current repo: " + repo);

        const request = await octokit.pulls.get({
            ...context.repo.owner,
            ...context.repo.repo,
            prPayload
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
