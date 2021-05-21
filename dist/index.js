/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 806:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 459:
/***/ ((module) => {

module.exports = eval("require")("@actions/github/lib/utils");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(806);
const github = __nccwpck_require__(946);
const { GitHub } = __nccwpck_require__(459);
const fs = __nccwpck_require__(747);

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
                core.log("Found Branch but no matching rule to allow " + pr.head.ref + " into " + pr.base.ref);
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

})();

module.exports = __webpack_exports__;
/******/ })()
;