import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(6, { message: "Message should be at least 6 charectors" }),
});
