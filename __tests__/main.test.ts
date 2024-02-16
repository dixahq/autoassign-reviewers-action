const path = require('path');
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const worker = setupServer(
  http.get(
    'https://api.github.com/repos/foo/bar/pulls/10',
    ({ request, params, cookies }) => {
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    },
  ),
  http.post(
    'https://api.github.com/repos/foo/bar/pulls/10/requested_reviewers',
    ({ request, params, cookies }) => {
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    },
  ),
);

beforeAll(() => {
  worker.listen();
});

afterAll(() => {
  worker.close();
});

describe('Team', () => {
  it('It requests a review to a team', async () => {
    const teams = 'hello,team';
    const repoToken = 'token';
    process.env['INPUT_TEAMS'] = teams;
    process.env['INPUT_REPO-TOKEN'] = repoToken;

    process.env['GITHUB_REPOSITORY'] = 'foo/bar';
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'payload.json');

    const main = require('../src/main');

    await main.run();
  });
});

describe('Reviewer', () => {
  it('It requests a review to a person', async () => {
    const reviewer = 'person';
    const repoToken = 'token';
    process.env['INPUT_PERSONS'] = reviewer;
    process.env['INPUT_REPO-TOKEN'] = repoToken;

    process.env['GITHUB_REPOSITORY'] = 'foo/bar';
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'payload.json');

    const main = require('../src/main');

    await main.run();
  });
});
