import * as core from '@actions/core';
import * as github from '@actions/github';


export async function run() {
  try {
    const
      repoToken = core.getInput('repo-token', { required: true }),
      issue: { owner: string; repo: string; number: number } = github.context.issue
      core.setSecret(repoToken);

    //See https://octokit.github.io/rest.js/
    const client = new github.GitHub(repoToken)
    if (issue == null || issue.number == null) {
      console.log('No pull request context, skipping')
      return
    }
    const pull = await client.pulls.get(
      {
        owner: issue.owner,
        repo: issue.repo,
        pull_number: issue.number
      }
    )

    console.log("Context: " + github.context)
    console.log("pull: " + pull)
    console.log("GitHub: " + github)

    const teams = core.getInput('teams').split(',').map(a => a.trim())
    const persons = core.getInput('persons')
      .split(',')
      .filter(user => user != issue.owner)
      .map(a => a.trim())
    if(teams.length == 0 && persons.length == 0){
      core.setFailed("Please specify 'teams' and/or 'persons'")
      return
    }
    else{
      console.log("Adding teams: " + teams + ", persons: " + persons + ", owner: " + issue.owner)
    }

    await client.pulls.createReviewRequest(
      {
        owner: issue.owner,
        repo: issue.repo,
        pull_number: issue.number,
        reviewers: persons,
        team_reviewers: teams
      }
    )
  } catch (error) {
    core.setFailed(error.message)
    throw error
  }
}

run()