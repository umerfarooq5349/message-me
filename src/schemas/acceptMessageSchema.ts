import { z } from "zod";

export const acceptMessageSchema = z.object({
  accesptingMessages: z.boolean(),
});
