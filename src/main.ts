import * as core from '@actions/core';
import * as github from '@actions/github';


export async function run() {
  try {
    const
      repoToken = core.getInput('repo-token', { required: true }),
      issue: { owner: string; repo: string; number: number } = github.context.issue
      core.setSecret(repoToken);

    if (issue == null || issue.number == null) {
      console.log('No pull request context, skipping')
      return
    }

    //See https://octokit.github.io/rest.js/
    const client = new github.GitHub(repoToken)

    const includeDraft : Boolean =  Boolean(core.getInput('include-draft') || false)
    const pull = await client.pulls.get(
      {
        owner: issue.owner,
        repo: issue.repo,
        pull_number: issue.number
      }
    )

    console.log('here is the includeDraft' + includeDraft)
    console.log('here is the pull data.draft' + pull.data.draft)

    //Skip DRAFT PRs
    if(pull.data.draft && !includeDraft){
      console.log('Skipped: DRAFT Pull Request, not assigning PR.')
      return
    }

    const teams = core.getInput('teams', { required: true }).split(',').map(a => a.trim())
    const persons = core.getInput('persons', { required: true })
      .split(',')
      .filter(user => user !== github.context.actor)
      .map(a => a.trim())
    
    if(teams.length == 0 && persons.length == 0){
      core.setFailed("Please specify 'teams' and/or 'persons'")
      return
    }
    else{
      console.log("Adding teams: " + teams + ", persons: " + persons)
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