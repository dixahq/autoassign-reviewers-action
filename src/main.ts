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

    console.log("Actor: " + github.context.actor)
    console.log("pull status: " + pull.status)
    console.log("pull data: " + pull.data)
    console.log("pull.toString: " + pull.toString())
    console.log("Context.toString: " + github.context.toString())
    console.log("Context.payload: " + github.context.payload)
    console.log("Context.payload.string: " + github.context.payload.toString())

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