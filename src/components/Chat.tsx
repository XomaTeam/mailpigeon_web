import { useEffect, useRef } from "react";
import ChatTopBar from "./ChatTopBar";
import { WS_URL, fetcher } from "../http";
import { UserType } from "../types";
import useSWR from "swr";
import SendInput from "./SendInput";
import TopChatInfo from "./TopChatInfo";
import MessageLayout from "./MessageLayout";

type Props = {
  selectedChat: number | null;
};

const Chat = ({ selectedChat }: Props) => {
  const { data: me } = useSWR<UserType>("/users/me", fetcher);

  const ws = useRef<WebSocket>();

  useEffect(() => {
    if (me) {
      ws.current = new WebSocket(WS_URL + me.id);

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [me, ws]);

  return (
    <>
      {selectedChat !== null && me ? (
        <div className="flex flex-col bg-chat h-screen">
          <ChatTopBar>
            <TopChatInfo userId={selectedChat} />
          </ChatTopBar>
          <MessageLayout userId={selectedChat} ws={ws} />
          <SendInput ws={ws} userId={selectedChat} me={me} />
        </div>
      ) : (
        <div className="bg-chat h-screen">
          <ChatTopBar />
          <div className="h-full w-full flex justify-center items-center">
            <span className="badge mb-16 badge-primary p-4 text-lg">
              Выберите, кому хотели бы написать
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
