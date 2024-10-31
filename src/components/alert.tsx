import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Assuming a custom Button component
import React from "react";

interface AlertProps {
  triggerText: string;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  triggerText,
  title,
  description,
  onConfirm,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className=" bg-transparent text-red-500  border-2 border-red-500   rounded-lg px-4 py-2 hover:shadow-lg hover:bg-red-500  hover:text-white transition duration-200 w-full">
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl p-6 text-center max-w-md mx-auto ">
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <div className="absolute bg-[#387478] rounded-full h-64 w-64 -top-20 -left-20 blur-3xl" />
          <div className="absolute bg-[#3B1E54] rounded-full h-64 w-64 bottom-10 right-10 blur-3xl" />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#3B1E54] text-2xl font-bold">
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#3B1E54] mt-2 mb-4">
            {description ||
              "This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4 mt-4">
          <AlertDialogCancel asChild>
            <Button className="bg-[#3B1E54] text-[#ecb365] rounded-lg px-4 py-2 transition duration-200 hover:bg-[#340e56] hover:text-white">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              className=" bg-transparent text-red-500  border-2 border-red-500   rounded-lg px-4 py-2 hover:shadow-lg hover:bg-red-500  hover:text-white transition duration-200"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
