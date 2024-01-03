import { Metadata } from './metadata';
import { CustomOctokit } from './octokit';
export declare class Issue {
    readonly octokit: CustomOctokit;
    readonly number: number;
    readonly title: string;
    message: string;
    readonly metadata: Metadata;
    private constructor();
    publishComment(content: string): Promise<void>;
    getComment(): Promise<string>;
    createComment(body: string): Promise<string | undefined>;
    updateComment(body: string): Promise<void>;
    static getIssue(octokit: CustomOctokit, issueNumber: number): Promise<Issue>;
}
