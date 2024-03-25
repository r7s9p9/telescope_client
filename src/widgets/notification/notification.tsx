import {
  IconExclamationCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { NotificationState } from "./types";
import { useEffect } from "react";

export function Notification({
  notification,
  setNotification,
}: {
  notification: NotificationState["notification"];
  setNotification: NotificationState["setNotification"];
}) {
  let Icon;
  switch (notification.type) {
    case "info":
      Icon = <IconInfoCircle className="text-green-600 m-2" size={24} />;
      break;
    case "error":
      Icon = <IconExclamationCircle className="text-red-600 m-2" size={24} />;
      break;
  }

  const unshowNotification = () =>
    setNotification({ ...notification, isShow: false });

  useEffect(() => {
    if (notification.isShow) {
      setTimeout(() => {
        unshowNotification();
      }, 3000);
    }
  }, [notification.isShow]);

  return (
    <div
      className={`${notification.type === "info" ? "border-green-600" : "border-red-600"} absolute w-5/6 place-self-start bg-slate-100 border-2 rounded-xl flex justify-center items-center shadow-xl duration-500`}
      style={{
        transform: notification.isShow
          ? `translateY(50%)`
          : `translateY(-150%)`,
        filter: notification.isShow ? `blur(0px)` : `blur(4px)`,
      }}
    >
      <div className="w-full flex flex-row m-2 justify-between  items-center">
        {Icon}
        <p className="text-center">{notification.text}</p>
        <button
          onClick={unshowNotification}
          className="p-1 m-2 rounded-full border-2 border-slate-200 hover:bg-slate-200"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  );
}
