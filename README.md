
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
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        teams: "my-github-team"         # only works for GitHub Organisation/Teams
        persons: "aditya"               # add individual persons here 
```