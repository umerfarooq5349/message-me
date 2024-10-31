import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/user";

export async function POST(request: Request) {
  try {
    const session = await auth();
    await dbConnect();

    if (!session || !session?.user) {
      return sendResponce(false, "User is not authenticated", 401);
    }

    const userId = session.user._id;
    const { acceptMessage } = await request.json();
    console.log(`acceptingMessage ${acceptMessage}`);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );
    if (!user) {
      return sendResponce(false, "User not found", 401);
    }
    return sendResponce(
      true,
      `Accepting messages turned to ${user.isAcceptingMessages}`,
      201,
      user
    );
  } catch (error) {
    return sendResponce(false, "User not found", 404, error);
  }
}

export async function GET() {
  const session = await auth();
  await dbConnect();

  if (!session || !session?.user) {
    return sendResponce(false, "User not authenticated", 401);
  }

  const userId = session.user._id;

  const user = await UserModel.findById(userId);

  if (!user) {
    return sendResponce(false, "User not found", 404);
  }
  return sendResponce(true, "User found", 200, user.isAcceptingMessages);
}
