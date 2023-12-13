import { getInput } from '@actions/core';
import { context } from '@actions/github';
import MetadataController from 'issue-metadata';

import {
  IssueMetadataObject,
  commentIdKey,
  issueMetadataObjectSchema,
} from './schema/metadata';

export class Metadata {
  commentID: IssueMetadataObject[typeof commentIdKey];

  constructor(
    readonly issueNumber: number,
    readonly controller: MetadataController,
    metadata: IssueMetadataObject | undefined
  ) {
    if (!metadata) {
      this.commentID = undefined;
      return;
    }

    this.commentID = metadata[commentIdKey];
  }

  async setMetadata() {
    if (this.commentID === undefined) return;

    await this.controller.setMetadata(
      this.issueNumber,
      commentIdKey,
      this.commentID
    );
  }

  static async getMetadata(issueNumber: number) {
    const controller = new MetadataController('issue-commentator', {
      ...context.repo,
      headers: {
        authorization: `Bearer ${getInput('token', { required: true })}`,
      },
    });

    const metadataParsed = issueMetadataObjectSchema.safeParse(
      await controller.getMetadata(issueNumber)
    );

    return new this(
      issueNumber,
      controller,
      metadataParsed.success ? metadataParsed.data : undefined
    );
  }
}
