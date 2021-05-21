# branch-gh-action

This action will fail if the head branch is not an approved branch to merge into the upper base branch.

## Inputs

### `branch_structure`

The location of the file for the json branchStruction of the person to greet. Default's to local system. 

```
{
    "branch_rules": [
        {
            "branch": "main",
            "accepted_incoming_branches": ["main", "Prod"]
        },
        {
            "branch": "Prod",
            "accepted_incoming_branches": ["Prod", "Staging"]
        }, 
        {
            "branch": "Staging",
            "accepted_incoming_branches": ["App-sit", "Staging"]
        },
        {
            "branch": "App-sit",
            "accepted_incoming_branches": ["App-sit", "App-dev"]
        },
        {
            "branch": "App-dev",
            "accepted_incoming_branches": ["Factory-dev", "App-dev"]
        },
        {
            "branch": "Factory-SIT",
            "accepted_incoming_branches": ["Factory-SIT", "Factory-dev"]
        }
    ]
}
```

## Outputs

### `NA


##

to build run 
