/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { MessageCard } from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/Message";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel, RefreshCcwDot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashbord = ({}) => {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // const handleDelete = (messageId: string) => {
  //   setMessages(messages.filter((messages) => messages.id !== messageId));
  //   console.log("handle delete");
  // };

  const form = useForm({ resolver: zodResolver(acceptMessageSchema) });

  const { watch, setValue, register } = form;
  const { toast } = useToast();
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get("/api/acceptingMessage");
      setValue("acceptMessages", response.data.data);
      console.log("fetch message");
      console.log(response.data.data);

      const message = response.data.data
        ? "You are accepting messages"
        : "You are not accepting messages";
      toast({ title: message });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({ title: "Error", description: error.response?.data.message });
      }
      toast({ title: "Internal error" });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get(`/api/getMessages`);
        console.log(response);
        setMessages(response.data.data.messages || []);
        console.log(messages);
        if (refresh) {
          toast({
            title: "Refresh messages",
            description: "Displaying latest Messages",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({ title: "Error", description: error.response?.data.message });
        }
        toast({ title: "Internal error" });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, setValue, fetchAcceptMessages]);

  const handleToggleBtn = async () => {
    setIsSwitchLoading(true);
    try {
      console.log("handle toggle");
      console.log(acceptMessages);
      const response = await axios.post(`/api/acceptingMessage`, {
        acceptMessage: !acceptMessages,
      });
      // console.log("handle toggle");
      // console.log(acceptMessages);
      console.log(response);
      setValue("acceptMessages", !acceptMessages);
      const message = response.data.data
        ? "You are accepting messages"
        : "You are not accepting messages";
      toast({ title: message });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        toast({ title: "Error", description: errorMessage });
      }
      toast({ title: "Internal error" });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const profileURL = `${window.location.protocol}//${window.location.host}/u/${session?.user.userName}`;

  const copyToClipBorad = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    const location = navigator.geolocation.getCurrentPosition;
    console.log(location);
    toast({ title: "Error", description: `${profileURL} copied to clipboard` });
    navigator.clipboard.writeText(profileURL);
  };
  if (!session || !session?.user) {
    return <div></div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded  max-w-6xl">
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute bg-[#387478] rounded-full h-64 w-64 -top-20 -left-20 blur-3xl" />
        <div className="absolute bg-[#3B1E54] rounded-full h-64 w-64 bottom-10 right-10 blur-3xl" />
      </div>
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBorad}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleToggleBtn}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <LoaderPinwheel className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcwDot className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id || index}
              message={message}
              // onMessageDelete={handleDelete}
              onMessageUpdate={() => {
                console.log(`update message`);
              }}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashbord;
