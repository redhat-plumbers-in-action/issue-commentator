import { Octokit } from '@octokit/core';
import { Metadata } from './metadata';
export declare class Issue {
    readonly octokit: Octokit;
    readonly number: number;
    readonly title: string;
    message: string;
    readonly metadata: Metadata;
    private constructor();
    publishComment(content: string): Promise<void>;
    getComment(): Promise<string>;
    createComment(body: string): Promise<string | undefined>;
    updateComment(body: string): Promise<void>;
    static getIssue(octokit: Octokit, issueNumber: number): Promise<Issue>;
}
