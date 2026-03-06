import { z } from 'zod';
export declare const commentIdKey = "comment-id";
export declare const issueMetadataObjectSchema: z.ZodObject<{
    "comment-id": z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type IssueMetadataObject = z.infer<typeof issueMetadataObjectSchema>;
