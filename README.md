
# Auto Assign Review Teams
- Assign individual persons or member of [GitHub Teams](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/organizing-members-into-teams) 
- Team Assignment Works best, if [code review assignment](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/managing-code-review-assignment-for-your-team) for the team is enabled

## Example Usage
```yaml
name: "Assign Reviewers"
on:  
  pull_request:
    types: [opened, ready_for_review]
     
jobs:
  assign-reviewers:
    runs-on: ubuntu-latest
    steps:
    - name: "Adding Teams and Persons for review"
      uses: adipatel/auto-assign-review-teams@v0.3
      with:
        repo-token: ${{ secrets.USER_TOKEN_THAT_CAN_ASSIGN_REVIEWERS_ACTION }}
        teams: "my-github-team"         # only works for GitHub Organisation/Teams
        persons: "github-username"               # add individual persons here 
```

### Build & Release

This project follows the template https://github.com/actions/typescript-action . Her are instructions to build & package.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:  

```bash
$ npm test

PASS  __tests__/main.test.ts
   Team
     ✓ It requests a review to a team (183ms)
   Reviewer
     ✓ It requests a review to a person (13ms)
 
...
```
