import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/user";
import { verifySchema } from "@/schemas/verifySchema"; // Import your schema

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse and validate incoming JSON data
    const { verifyCode, userName } = await request.json();

    // Use the verifySchema to validate the input
    const validationResult = verifySchema.safeParse({ verifyCode });

    // Check if validation failed
    if (!validationResult.success) {
      return sendResponce(false, "Must be 6 digit code", 400, validationResult);
    }

    const user = await UserModel.findOne({ userName, isVerified: false });

    if (!user) {
      return sendResponce(false, "User not found or you are varified.", 401);
    }

    const currentDate = new Date();
    const currentTimeInMilliseconds = currentDate.getTime();
    const expiryTimeInMilliseconds = user.verifyCodeExpiry.getTime();

    const isCodeValid = verifyCode === user.verifyCode;
    const isCodeExpired = currentTimeInMilliseconds >= expiryTimeInMilliseconds;

    if (isCodeValid && !isCodeExpired) {
      // Update the user to set isVerified to true
      await UserModel.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      );
      return sendResponce(true, "User varified", 200, user);
    } // If validation succeeds
    return sendResponce(false, "Wrong verify code or expired code", 403);
  } catch (error) {
    console.error("Error during validation:", error);
    return sendResponce(false, "Error during validation.", 500, error);
  }
}
