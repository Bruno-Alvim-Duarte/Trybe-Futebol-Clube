export type ServiceReponseSuccess<T> = {
  status: 'SUCCESSFUL' | 'CREATED',
  data: T
};

type ErrorTypes = 'UNAUTHORIZED' | 'NOT_FOUND' | 'INVALID_DATA' | 'UNPROCESSABLE';

export type ServiceResponseError = {
  status: ErrorTypes,
  data: { message: string }
};

export type ServiceResponse<T> = ServiceReponseSuccess<T> | ServiceResponseError;
