import { MessageServices } from '_services/message-api.services';
import { useMutation } from 'react-query';

const useMessagelMutation = () => {
  const createMessage = useMutation(MessageServices.createMessage);
  const updateMessageLogs = useMutation(MessageServices.updateMessageLogs);

  return { createMessage, updateMessageLogs };
};

export default useMessagelMutation;
