"use client";
import BikeAnimation from "@/components/bikeAnimiation";
import { MessageCard } from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/Message";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Clipboard, LoaderPinwheel, RefreshCcwDot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm({ resolver: zodResolver(acceptMessageSchema) });
  const { watch, setValue, register } = form;
  const { toast } = useToast();
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get("/api/acceptingMessage");
      setValue("acceptMessages", response.data.data);

      const message = response.data.data
        ? "You are accepting messages"
        : "You are not accepting messages";
      toast({ title: message });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({ title: "Error", description: error.response?.data.message });
      } else {
        toast({ title: "Internal error" });
      }
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/getMessages`);
        setMessages(response.data.data.messages || []);

        if (refresh) {
          toast({
            title: "Refresh messages",
            description: "Displaying latest Messages",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({ title: "Error", description: error.response?.data.message });
        } else {
          toast({ title: "Internal error" });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [status, fetchMessages, fetchAcceptMessages]);

  const handleToggleBtn = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post(`/api/acceptingMessage`, {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);

      const message = response.data.data
        ? "You are accepting messages"
        : "You are not accepting messages";
      toast({ title: message });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data.message,
        });
      } else {
        toast({ title: "Internal error" });
      }
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const profileURL = `http://localhost:3000/user/${session?.user.userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "Copied to clipboard",
      description: `${profileURL} has been copied.`,
    });
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <BikeAnimation
        text={"Loading"}
        textColor="text-[#D4A373]"
        tireColor="#D4BEE4"
        pedalColor="#ecb365"
        bodyColor="text-[#D4BEE4]"
      />
    );
  }

  return (
    <div className="p-6 bg-[#f0f0f5] dark:bg-[#1F4663] rounded-lg shadow-lg container relative overflow-hidden">
      {/* Interactive Background Effects */}
      <div className="absolute inset-0 -z-40 opacity-90 pointer-events-none">
        <div className="absolute bg-[#387478] rounded-full h-72 w-72 -top-28 -right-20 blur-3xl" />
        <div className="absolute bg-[#3B1E54] rounded-full h-72 w-72 bottom-16 right-10 blur-3xl" />
      </div>

      <h1 className="text-4xl font-bold mb-4 text-[#3B1E54]">User Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#387478] mb-2">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 border-2 mr-5  border-[#3B1E54] bg-white dark:bg-gray-800 text-[#3B1E54] rounded-lg shadow-sm  transition duration-300"
          />

          <Button
            className="bg-[#3B1E54] text-[#ecb365] hover:bg-[#3B1E54] hover:text-white transition duration-300 transform  rounded-lg shadow-md"
            onClick={copyToClipboard}
          >
            <Clipboard /> Copy
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-row justify-between">
        <div>
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleToggleBtn}
            disabled={isSwitchLoading}
          />
          <span className="ml-2 text-[#387478]">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Button
          className="bg-[#3B1E54] text-[#ecb365] hover:bg-[#3B1E54] hover:text-white transition duration-300 transform  rounded-lg shadow-md"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <div className="flex items-center">
              <LoaderPinwheel className="h-4 w-4 animate-spin mr-2" />
              Refreshing
            </div>
          ) : (
            <div className="flex items-center">
              <RefreshCcwDot className="h-4 w-4 mr-2" />
              Refresh
            </div>
          )}
        </Button>
      </div>

      <Separator className="border border-[#D4A373] " />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id || index}
              message={message}
              onMessageUpdate={() => console.log(`Update message`)}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-full">
            <BikeAnimation
              text="No messages to show"
              textColor="text-[#3B1E54]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
