export const formatDate = () => {
  function roomList(timestamp: string) {
    const date = new Date(Number(timestamp));
    const dateString = date.toDateString();
    const nowDate = new Date();

    const isToday = dateString === nowDate.toDateString();
    if (isToday) {
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();

      return hours + ":" + minutes.slice(-2) + ":" + seconds.slice(-2);
    }

    const isCurrentMonth =
      date.getFullYear() == nowDate.getFullYear() &&
      date.getMonth() == nowDate.getMonth();
    if (isCurrentMonth) {
      const isInWeek = date.getDate() + 6 >= nowDate.getDate();
      if (isInWeek) return date.toLocaleString("default", { weekday: "long" });
    }

    const result = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
    return result;
  }

  function message(createdTimestamp: string, modifiedTimestamp?: string) {
    if (!modifiedTimestamp) {
      const date = new Date(Number(createdTimestamp));
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();

      return hours + ":" + minutes.slice(-2) + ":" + seconds.slice(-2);
    }
    const date = new Date(Number(modifiedTimestamp));
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    return (
      "edited " + hours + ":" + minutes.slice(-2) + ":" + seconds.slice(-2)
    );
  }

  return { roomList, message };
};
