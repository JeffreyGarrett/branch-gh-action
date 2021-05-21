const core = require('@actions/core');
const github = require('@actions/github');
const { GitHub } = require('@actions/github/lib/utils');
const fs = require('fs');

//setup branching structure
const branchFileLocation = core.getInput('branch_file_location') || 'branchStructure.json'
const branchRulesFile = fs.readFileSync(branchFileLocation);
const branchStructure = JSON.parse(branchRulesFile);

//setup rest client
const token = (core.getInput('github_token') || process.env.GITHUB_TOKEN);

//environment variables that could be used vs API call.
//const base = (core.getInput('github_base_ref') || process.env.GITHUB_BASE_REF);
//const head = (core.getInput('github_head_ref') || process.env.GITHUB_HEAD_REF);

const octokit = github.getOctokit(token);
const context = github.context

async function run() {
    const wildCard = "ALL";
    let branchFound = false;
    try {
        console.log("Getting PR information");
        //sending API request to get the full PR object
        const prPayload = github.context.payload.pull_request.number;
        const request = await octokit.pulls.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: prPayload
        })
        const pr = request.data;

        console.log("The base branch is: " + pr.base.ref);
        console.log("The head branch is: " + pr.head.ref);
        console.log("Branch rules are:  " + JSON.stringify(branchStructure));
        //main logic to test branching structure. 
        //console.log(JSON.stringify(branchStructure));
        branchStructure.branch_rules.forEach(branch => {

            //check to see if branch rule
            if (branch.branch === pr.base.ref) {
                //if found branch, loop through allowed list
                console.log("Checking for Rules for " + branch.branch);
                branch.accepted_incoming_branches.forEach(allowRule => {
                    console.log("Found allow rule for: " + allowRule);

                    //check for wildcard first 
                    //then check for rule
                    if (allowRule === wildCard) {
                        console.log("rule found for " + allowRule);
                        console.log("wild card found.  All branches permitted");
                        core.ExitCode.Success;

                    } else if (allowRule === pr.head.ref) {
                        console.log("rule found for " + allowRule);
                        console.log("This is ok!");
                        core.ExitCode.Success;
                    }
                });
                console.log("Found Branch but no matching rule to allow " + pr.head.ref + " into " + pr.base.ref);
                core.ExitCode.Failure;
            }
        });
        console.log(prPayload.number);
        core.log("No rules for branch " + pr.base.ref);
        core.log("Allowing pr from " + pr.head.ref + " to " + pr.base.ref);
        core.ExitCode.Success;



    } catch (error) {

        core.setFailed(error.message);
    }
}

//run application
run().catch((error) => {
    core.setFailed(error.message)
})
