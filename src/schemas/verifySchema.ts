import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z.string().length(6, { message: "It should be only 6 digits" }),
});
