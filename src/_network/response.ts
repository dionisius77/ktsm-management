export type ApiSuccessResponse<T> = {
  http_status: number;
  process_time: string;
  data: T;
}
export type ApiErrorResponse = {
  statusCode: number;
  message: string;
}

export type ApiErrorOther = {
  code: number;
  field: string;
  message: string;
}

export const UnknownError = (err :string) => {
  const errUnknown: ApiErrorResponse= {
      statusCode: 999999,
      message: "Service Unavailable: " + err,
  }
  return errUnknown;
}

export const NetworkError: ApiErrorResponse = {
  statusCode: 999503,
  message: "Service Unavailable",
}

export const UnauthorizedError: ApiErrorResponse = {

  statusCode: 999401,
  message: "Anda tidak bisa mengakses aplikasi",
}

export const ForbiddenError: ApiErrorResponse = {
  statusCode: 999403,
  message: "Anda tidak memiliki akses untuk fitur ini",
}


export function isApiResponseError(input: any): input is ApiErrorResponse {
  if (!input){
    return false
  }
  return typeof input.http_status === 'number'
      && input.http_status !== undefined
      && input.http_status !== null
      && input.http_status > 0
      && typeof input.message === 'string'
}

