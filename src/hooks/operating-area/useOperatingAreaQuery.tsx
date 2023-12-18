import { AuthServices } from "_services/auth-api.services";
import { useQuery } from "react-query";

const useOperatingAreaQuery = () => {
  const getOperatingArea = () =>
    useQuery(["getOperatingArea"], () => AuthServices.getOperatingArea(), {
      keepPreviousData: false,
    });

  const getBranch = () =>
    useQuery(["getBranch"], () => AuthServices.getBranch(), {
      keepPreviousData: false,
    });

  return { getBranch, getOperatingArea };
};

export default useOperatingAreaQuery;
