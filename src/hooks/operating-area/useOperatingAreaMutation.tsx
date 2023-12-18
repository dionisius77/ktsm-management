import { AuthServices } from "_services/auth-api.services";
import { useMutation } from "react-query";

const useOperatingAreaMutation = () => {
  const createOperatingArea = useMutation(AuthServices.createOperatingArea);
  const updateOperatingArea = useMutation(AuthServices.updateOperatingArea);
  const deleteOperatingArea = useMutation(AuthServices.deleteOperatingArea);
  const createBranch = useMutation(AuthServices.createBranch);

  return { createOperatingArea, updateOperatingArea, deleteOperatingArea, createBranch };
};

export default useOperatingAreaMutation;
