export const formatDate = () => {
  function roomList(timestamp: number) {
    const date = new Date(timestamp);
    const dateString = date.toDateString();
    const nowDate = new Date();

    const isToday = dateString === nowDate.toDateString();
    if (isToday) {
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      return hours + ":" + minutes.slice(-2);
    }

    const isCurrentMonth =
      date.getFullYear() === nowDate.getFullYear() &&
      date.getMonth() === nowDate.getMonth();
    if (isCurrentMonth) {
      const isInWeek = date.getDate() + 6 >= nowDate.getDate();
      if (isInWeek) return date.toLocaleString("default", { weekday: "long" });
    }

    const result = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
    return result;
  }

  function message(createdTimestamp: number, modifiedTimestamp?: number) {
    if (!modifiedTimestamp) {
      const date = new Date(createdTimestamp);
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();

      return hours + ":" + minutes.slice(-2) + ":" + seconds.slice(-2);
    }
    const date = new Date(modifiedTimestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    return (
      "edited " + hours + ":" + minutes.slice(-2) + ":" + seconds.slice(-2)
    );
  }

  function bubble(timestamp: number) {
    const date = new Date(timestamp);
    const nowDate = new Date();
    if (date.getFullYear() === nowDate.getFullYear()) {
      return date.toLocaleString("default", { month: "long", day: "numeric" });
    }
    return date.toLocaleString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return { roomList, message, bubble };
};

export function isSameDay(firstTimestamp: number, secondTimestamp: number) {
  const firstDate = new Date(firstTimestamp);
  const secondDate = new Date(secondTimestamp);
  return firstDate.toDateString() === secondDate.toDateString();
}
