import { warning } from '@actions/core';
import { context } from '@actions/github';
import { Metadata } from './metadata';
export class Issue {
    constructor(octokit, number, title, message, metadata) {
        this.octokit = octokit;
        this.number = number;
        this.title = title;
        this.message = message;
        this.metadata = metadata;
    }
    async publishComment(content) {
        if (this.metadata.commentID) {
            // Check if the comment is already up to date
            const currentComment = await this.getComment();
            if (JSON.stringify(currentComment) === JSON.stringify(content))
                return;
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
    async getComment() {
        var _a;
        if (!this.metadata.commentID)
            return '';
        const comment = (_a = (await this.octokit.request('GET /repos/{owner}/{repo}/issues/comments/{comment_id}', Object.assign(Object.assign({}, context.repo), { comment_id: +this.metadata.commentID }))).data.body) !== null && _a !== void 0 ? _a : '';
        return comment;
    }
    async createComment(body) {
        if (!body || body === '')
            return;
        const { data } = await this.octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', Object.assign(Object.assign({}, context.repo), { issue_number: this.number, body }));
        return data.id.toString();
    }
    async updateComment(body) {
        if (!this.metadata.commentID)
            return;
        await this.octokit.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', Object.assign(Object.assign({}, context.repo), { comment_id: +this.metadata.commentID, body }));
    }
    static async getIssue(octokit, issueNumber) {
        var _a;
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', Object.assign(Object.assign({}, context.repo), { issue_number: issueNumber }));
        return new this(octokit, issueNumber, data.title, (_a = data.body) !== null && _a !== void 0 ? _a : '', await Metadata.getMetadata(issueNumber));
    }
}
//# sourceMappingURL=issue.js.map