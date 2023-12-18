export const timeFormatter = (dateTime: Date | string) => {
  return new Date(dateTime).toLocaleTimeString("id-ID", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Jakarta",
  });
};
