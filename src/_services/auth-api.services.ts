import { ApiSuccessResponse } from "_network/response";
import {
  BranchI,
  CreateBranchReqI,
  LoginReqI,
  LoginResI,
  OperatingAreaI,
} from "../_interfaces/auth-api.interfaces";
import request from "../_network/request";

const tempBaseUrl = "http://localhost:3001";

const login = (payload: LoginReqI): Promise<ApiSuccessResponse<LoginResI>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/login`,
    method: "POST",
    data: payload,
  });
};

const createBranch = (
  payload: CreateBranchReqI,
): Promise<ApiSuccessResponse<void>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/branch`,
    method: "POST",
    data: payload,
  });
};

const getBranch = (): Promise<ApiSuccessResponse<BranchI[]>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/branch`,
    method: "GET",
  });
};

const getOperatingArea = (): Promise<ApiSuccessResponse<OperatingAreaI[]>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/operating-area`,
    method: "GET",
  });
};

const createOperatingArea = (
  name: string,
): Promise<ApiSuccessResponse<void>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/operating-area`,
    method: "POST",
    data: { name },
  });
};

const updateOperatingArea = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<ApiSuccessResponse<void>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/operating-area/${id}`,
    method: "PUT",
    data: { name },
  });
};

const deleteOperatingArea = (id: string): Promise<ApiSuccessResponse<void>> => {
  return request({
    baseURL: tempBaseUrl,
    url: `/management/operating-area/${id}`,
    method: "DELETE",
  });
};

export const AuthServices = {
  login,
  createBranch,
  getBranch,
  createOperatingArea,
  getOperatingArea,
  updateOperatingArea,
  deleteOperatingArea,
};
