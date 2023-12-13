import { z } from 'zod';
export declare const commentIdKey = "comment-id";
export declare const issueMetadataObjectSchema: z.ZodObject<{
    "comment-id": z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    "comment-id"?: string | undefined;
}, {
    "comment-id"?: string | undefined;
}>;
export type IssueMetadataObject = z.infer<typeof issueMetadataObjectSchema>;
