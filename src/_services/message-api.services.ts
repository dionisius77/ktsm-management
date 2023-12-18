import { ApiSuccessResponse } from '_network/response';
import request from '_network/request';
import { CreateMessageReqI, GetMessagesParamsI, MessageI, MessageLog, UpdateMessageLogsI } from '_interfaces/message-api.interfaces';

const tempBaseUrl = 'http://localhost:3002';

const getMessages = (params: GetMessagesParamsI): Promise<ApiSuccessResponse<MessageI[]>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/messages`,
    method: 'GET',
    params: params
  });
};

const createMessage = (
  payload: CreateMessageReqI
): Promise<ApiSuccessResponse<void>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/messages`,
    method: 'POST',
    data: payload,
  });
};

const getMessageById = (id: string): Promise<ApiSuccessResponse<MessageI>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/messages/${id}`,
    method: 'GET',
  });
}

const updateMessageLogs = ({id, payload}: {id: string, payload: UpdateMessageLogsI}) => {
  const newPayload = {
    contentType: payload.contentType,
    content: payload.content,
    broadcastAt: new Date(payload.broadcastAt),
    expiredAt: new Date(payload.expiredAt),
  }
  return request({
    baseURL: tempBaseUrl,
    url: `/management/message-logs/${id}`,
    method: 'PUT',
    data: newPayload,
  });
}

const getMessageLogById = (messageId: string): Promise<ApiSuccessResponse<MessageLog[]>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/message-logs/${messageId}`,
    method: 'GET',
  });
}

export const MessageServices = {
  getMessages,
  createMessage,
  getMessageById,
  updateMessageLogs,
  getMessageLogById,
};
