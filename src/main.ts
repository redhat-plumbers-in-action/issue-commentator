import { getInput, setFailed } from '@actions/core';

import '@total-typescript/ts-reset';

import action from './action';
import { getOctokit } from './octokit';

try {
  const octokit = getOctokit(getInput('token', { required: true }));

  await action(octokit);
} catch (error) {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else {
    message = JSON.stringify(error);
  }

  setFailed(message);
}
