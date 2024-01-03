import { getInput } from '@actions/core';
import { context } from '@actions/github';
import MetadataController from 'issue-metadata';
import { commentIdKey, issueMetadataObjectSchema, } from './schema/metadata';
export class Metadata {
    constructor(issueNumber, controller, metadata) {
        this.issueNumber = issueNumber;
        this.controller = controller;
        if (!metadata) {
            this.commentID = undefined;
            return;
        }
        this.commentID = metadata[commentIdKey];
    }
    async setMetadata() {
        if (this.commentID === undefined)
            return;
        await this.controller.setMetadata(this.issueNumber, commentIdKey, this.commentID);
    }
    static async getMetadata(issueNumber) {
        const controller = new MetadataController('issue-commentator', Object.assign(Object.assign({}, context.repo), { headers: {
                authorization: `Bearer ${getInput('token', { required: true })}`,
            } }));
        const metadataParsed = issueMetadataObjectSchema.safeParse(await controller.getMetadata(issueNumber));
        return new this(issueNumber, controller, metadataParsed.success ? metadataParsed.data : undefined);
    }
}
//# sourceMappingURL=metadata.js.map