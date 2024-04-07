export const formatDate = () => {
  function roomList(timestamp: string) {
    const date = new Date(Number(timestamp));
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

  function bubble(timestamp: string) {
    const date = new Date(Number(timestamp));
    const nowDate = new Date();
    if (date.getFullYear() === nowDate.getFullYear()) {
      return date.toLocaleString("default", { month: 'long', day: 'numeric'})
    }
    return date.toLocaleString("default", { year: 'numeric', month: 'long', day: 'numeric'})
  }
  return { roomList, message, bubble };
};

export function isSameDay(firstTimestamp: string, secondTimestamp: string) {
  const firstDate = new Date(Number(firstTimestamp));
  const secondDate = new Date(Number(secondTimestamp));
  return firstDate.toDateString() === secondDate.toDateString();
}