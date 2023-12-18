import { GetMessagesParamsI } from "_interfaces/message-api.interfaces";
import { MessageServices } from "_services/message-api.services";
import { useQuery } from "react-query";

const useMessageQuery = () => {
  const getMessages = (params: GetMessagesParamsI) =>
    useQuery(
      ["getMessages", params],
      () => MessageServices.getMessages(params),
      { keepPreviousData: false },
    );

  const getMessageById = (id: string) =>
    useQuery(["getMessageById", id], () => MessageServices.getMessageById(id), {
      keepPreviousData: true,
    });

  const getMessageLogsById = (messageId: string) =>
    useQuery(
      ["getMessageLogsById", messageId],
      () => MessageServices.getMessageLogById(messageId),
      {
        keepPreviousData: false,
      },
    );

  return { getMessageById, getMessages, getMessageLogsById };
};

export default useMessageQuery;
