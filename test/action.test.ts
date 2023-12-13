import { Octokit } from '@octokit/core';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import action from '../src/action';

import { commentIdKey } from '../src/schema/metadata';

const mocks = vi.hoisted(() => {
  return {
    request: vi.fn(),
    getMetadata: vi.fn(),
    setMetadata: vi.fn(),
  };
});

vi.mock('@octokit/core', () => {
  const Octokit = vi.fn(() => ({
    request: mocks.request,
  }));
  return { Octokit };
});

vi.mock('issue-metadata', async () => {
  const MetadataController = vi.fn(() => ({
    getMetadata: mocks.getMetadata,
    setMetadata: mocks.setMetadata,
  }));
  return { default: MetadataController };
});

describe('Integration tests', () => {
  beforeEach(async () => {
    // Mock Action environment
    vi.stubEnv(
      'GITHUB_REPOSITORY',
      'redhat-plumbers-in-action/issue-commentator'
    );

    vi.stubEnv('INPUT_ISSUE', '1');
    vi.stubEnv('INPUT_TOKEN', 'mock-token');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  test('First run, create an new issue comment', async () => {
    vi.mocked(mocks.request).mockImplementation(path => {
      switch (path) {
        case 'GET /repos/{owner}/{repo}/issues/{issue_number}':
          return {
            status: 200,
            data: {
              number: 1,
              title: 'Fix all the bugs',
              body: 'This pull request fixes all the bugs.',
            },
          };

        case 'POST /repos/{owner}/{repo}/issues/{issue_number}/comments':
          return {
            status: 200,
            data: {
              id: 123456789,
            },
          };

        default:
          throw new Error(`Unexpected endpoint: ${path}`);
      }
    });

    const firstMessage = JSON.stringify(
      `### Hello, world!\n\nThis is a test\n\n| Test | Table |\n| ---- | ----- |\n| 1 | 2 |\n| 3 | 4 |`
    );
    const secondMessage = JSON.stringify(
      `### Hello, universe!\n\nThis is not a test`
    );
    const thirdMessage = JSON.stringify(`### Hello, multiverse!`);

    vi.stubEnv(
      'INPUT_MESSAGE',
      `${firstMessage}\n${secondMessage}\n${thirdMessage}`
    );

    const octokit = new Octokit({ auth: 'mock-token' });

    await action(octokit);

    expect(mocks.request).toHaveBeenCalledTimes(2);

    const expectedBody = `### Hello, world!

This is a test

| Test | Table |
| ---- | ----- |
| 1 | 2 |
| 3 | 4 |

---

### Hello, universe!

This is not a test

---

### Hello, multiverse!`;

    expect(mocks.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: 'redhat-plumbers-in-action',
        repo: 'issue-commentator',
        issue_number: 1,
        body: expectedBody,
      }
    );
  });

  test('Update the existing issue comment', async () => {
    vi.mocked(mocks.request).mockImplementation(path => {
      switch (path) {
        case 'GET /repos/{owner}/{repo}/issues/{issue_number}':
          return {
            status: 200,
            data: {
              number: 1,
              title: 'Fix all the bugs',
              body: 'This pull request fixes all the bugs.',
            },
          };

        case 'GET /repos/{owner}/{repo}/issues/comments/{comment_id}':
          return {
            status: 200,
            data: {
              id: 123456789,
              body: '### Hello, world!',
            },
          };

        case 'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}':
          return {
            status: 200,
            data: {
              id: 123456789,
            },
          };

        default:
          throw new Error(`Unexpected endpoint: ${path}`);
      }
    });

    vi.mocked(mocks.getMetadata).mockImplementation(() => {
      return {
        [commentIdKey]: '123456789',
      };
    });

    const firstMessage = JSON.stringify(
      `### Hello, world!\n\nThis is a test\n\n| Test | Table |\n| ---- | ----- |\n| 1 | 2 |\n| 3 | 4 |`
    );
    const secondMessage = JSON.stringify(
      `### Hello, universe!\n\nThis is not a test`
    );
    const thirdMessage = JSON.stringify(`### Hello, multiverse!`);

    vi.stubEnv(
      'INPUT_MESSAGE',
      `${firstMessage}\n${secondMessage}\n${thirdMessage}`
    );

    const octokit = new Octokit({ auth: 'mock-token' });

    await action(octokit);

    expect(mocks.request).toHaveBeenCalledTimes(3);
    expect(mocks.getMetadata).toHaveBeenCalledTimes(1);

    const expectedBody = `### Hello, world!

This is a test

| Test | Table |
| ---- | ----- |
| 1 | 2 |
| 3 | 4 |

---

### Hello, universe!

This is not a test

---

### Hello, multiverse!`;

    expect(mocks.request).toHaveBeenCalledWith(
      'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
      {
        owner: 'redhat-plumbers-in-action',
        repo: 'issue-commentator',
        comment_id: 123456789,
        body: expectedBody,
      }
    );
  });
});
