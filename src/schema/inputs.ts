import { z } from 'zod';

export const issueSchema = z.coerce.number();

export const messageSchema = z.string();
