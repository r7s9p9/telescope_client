import { IconSend2 } from "@tabler/icons-react";
import { useNotify } from "../../notification/notification";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryReadMessageList } from "../../../shared/api/api";
import { useState } from "react";

export function Chat() {
  const notify = useNotify();
  const navigate = useNavigate();

  const queryRead = useQueryReadMessageList();

  const { roomId } = useParams();

  const [listData, setListData] = useState();

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <Bar />
      <Messages />
      <Send />
    </div>
  );
}

function Bar() {
  return (
    <div className="w-full h-16 border-b-2 border-slate-200 bg-slate-50"></div>
  );
}

function Messages() {
  return <div className="grow w-full px-4 bg-green-100"></div>;
}

function Send() {
  return (
    <div className="relative shrink-0 h-16 w-full flex items-center">
      <input
        placeholder="Send message..."
        className="h-full w-full pl-4 pr-16 outline-none font-light text-gray-800 text-xl bg-slate-100 border-t-2 border-slate-200 focus:bg-slate-50 focus:border-slate-400 duration-300 ease-in-out"
      ></input>
      <SendButton />
    </div>
  );
}

function SendButton() {
  return (
    <div className="absolute right-4 flex items-center">
      <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 duration-300 ease-in-out">
        <IconSend2 className="text-slate-400" size={24} />
      </button>
    </div>
  );
}
