import { warning } from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/core';

import { Metadata } from './metadata';

export class Issue {
  private constructor(
    readonly octokit: Octokit,
    readonly number: number,
    readonly title: string,
    public message: string,
    readonly metadata: Metadata
  ) {}

  async publishComment(content: string) {
    if (this.metadata.commentID) {
      // Check if the comment is already up to date
      const currentComment = await this.getComment();
      if (JSON.stringify(currentComment) === JSON.stringify(content)) return;
      // Update the comment
      this.updateComment(content);
      return;
    }

    const newCommentID = await this.createComment(content);

    if (!newCommentID) {
      warning(`Failed to create comment.`);
      return;
    }

    this.metadata.commentID = newCommentID;
    await this.metadata.setMetadata();
  }

  async getComment(): Promise<string> {
    if (!this.metadata.commentID) return '';

    const comment =
      (
        await this.octokit.request(
          'GET /repos/{owner}/{repo}/issues/comments/{comment_id}',
          {
            ...context.repo,
            comment_id: +this.metadata.commentID,
          }
        )
      ).data.body ?? '';

    return comment;
  }

  async createComment(body: string): Promise<string | undefined> {
    if (!body || body === '') return;

    const { data } = await this.octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        ...context.repo,
        issue_number: this.number,
        body,
      }
    );

    return data.id.toString();
  }

  async updateComment(body: string): Promise<void> {
    if (!this.metadata.commentID) return;

    await this.octokit.request(
      'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
      {
        ...context.repo,
        comment_id: +this.metadata.commentID,
        body,
      }
    );
  }

  static async getIssue(octokit: Octokit, issueNumber: number): Promise<Issue> {
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/issues/{issue_number}',
      {
        ...context.repo,
        issue_number: issueNumber,
      }
    );

    return new this(
      octokit,
      issueNumber,
      data.title,
      data.body ?? '',
      await Metadata.getMetadata(issueNumber)
    );
  }
}
