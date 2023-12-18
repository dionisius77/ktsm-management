import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse, ForbiddenError, UnauthorizedError, UnknownError, isApiResponseError } from './response';
import AuthActionTypes from '../redux/auth/auth.types';
import { store } from '../redux/store';

store.subscribe(listener);

function select(state: any) {
  return state.auth.token;
}

function listener() {
  const token = select(store.getState());
  axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
}

const client = axios.create({
  baseURL: process.env.REACT_APP_REST_HOST,
  maxRedirects: 5,
});

const request = async (options: AxiosRequestConfig<any>) => {
  const onSuccess = (response: AxiosResponse) => {
    return response.data;
  };

  const onError = function (error: any): Promise<ApiErrorResponse> {
    if (error.response.status === 401) {
      store.dispatch({
        type: AuthActionTypes.LOGOUT,
      });

      return Promise.reject(UnauthorizedError);
    }

    // if (error.response.status === 403) {
    //   return Promise.reject(ForbiddenError);
    // }

    // if (isApiResponseError(error.response.data)) {
    //   return Promise.reject(error.response.data as ApiErrorResponse);
    // }
    // if (error.message) {
    //   return Promise.reject(UnknownError(error.message));
    // }

    return Promise.reject(error.response.data);
  };

  const token = select(store.getState());

  try {
    const response = await client({
      headers: {
        Authorization: `bearer ${token}`,
      },
      ...options,
    });
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default request;

export const request_file = async (filename: string, options: any) => {
  const onSuccess = (response: AxiosResponse) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); //or any other extension
    document.body.appendChild(link);
    link.click();
  };

  const onError = function (error: any): Promise<ApiErrorResponse> {
    if (error.response.status === 401) {
      store.dispatch({
        type: AuthActionTypes.LOGOUT,
      });

      return Promise.reject(UnauthorizedError);
    }

    if (error.response.status === 403) {
      return Promise.reject(ForbiddenError);
    }

    if (isApiResponseError(error.response.data)) {
      return Promise.reject(error.response.data as ApiErrorResponse);
    }
    if (error.message) {
      return Promise.reject(UnknownError(error.message));
    }

    return Promise.reject(UnknownError(error.toString()));
  };

  const token = select(store.getState());

  try {
    const response = await client({
      headers: {
        Authorization: `bearer ${token}`,
      },
      responseType: 'blob',
      ...options,
    });
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
