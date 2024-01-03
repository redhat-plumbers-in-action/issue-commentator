import { z } from 'zod';
export const commentIdKey = 'comment-id';
export const issueMetadataObjectSchema = z.object({
    [commentIdKey]: z.string().optional(),
});
//# sourceMappingURL=metadata.js.map