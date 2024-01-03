import { getInput } from '@actions/core';

import { Issue } from './issue';
import { CustomOctokit } from './octokit';
import { composeComment } from './utils';

import { issueSchema, messageSchema } from './schema/inputs';

async function action(octokit: CustomOctokit) {
  const issueInputParsed = issueSchema.safeParse(
    getInput('issue', { required: true })
  );
  if (!issueInputParsed.success)
    throw new Error(`Input 'issue' doesn't provide required value.`);
  const issueNumber = issueInputParsed.data;

  const messageInputParsed = messageSchema.safeParse(
    getInput('message', { required: true })
  );
  if (!messageInputParsed.success)
    throw new Error(`Input 'message' doesn't provide required value.`);
  const message = composeComment(messageInputParsed.data);

  const issue = await Issue.getIssue(octokit, issueNumber);
  await issue.publishComment(message);
}

export default action;
