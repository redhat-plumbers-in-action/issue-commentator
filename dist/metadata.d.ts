import MetadataController from 'issue-metadata';
import { IssueMetadataObject, commentIdKey } from './schema/metadata';
export declare class Metadata {
    readonly issueNumber: number;
    readonly controller: MetadataController;
    commentID: IssueMetadataObject[typeof commentIdKey];
    constructor(issueNumber: number, controller: MetadataController, metadata: IssueMetadataObject | undefined);
    setMetadata(): Promise<void>;
    static getMetadata(issueNumber: number): Promise<Metadata>;
}
