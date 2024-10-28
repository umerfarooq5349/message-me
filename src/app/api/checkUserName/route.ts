import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/user";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const userNameCheckQuerySchema = z.object({ userName: userNameValidation });

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const userNameQueryParams = { userName: searchParams.get("userName") };

    const result = userNameCheckQuerySchema.safeParse(userNameQueryParams);

    console.log(result);

    if (!result.success) {
      //   throw new Error("" + result);
      return Response.json({ result });
    }
    const { userName } = result.data;

    const existingUserName = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUserName) {
      return sendResponce(false, "User name is unavailable", 403);
      Response.json({
        status: true,
        message: "User name is already in use",
      });
    }

    return sendResponce(true, "User name available", 200);
  } catch (error) {
    return sendResponce(false, "Error fetching user names", 401, error);
  }
}
