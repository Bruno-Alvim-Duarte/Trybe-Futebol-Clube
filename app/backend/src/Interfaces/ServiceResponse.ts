export type ServiceReponseSuccess<T> = {
  status: 'SUCCESSFUL',
  data: T
};

type ErrorTypes = 'UNAUTHORIZED' | 'NOT FOUND' | 'INVALID_DATA';

export type ServiceResponseError = {
  status: ErrorTypes,
  data: { message: string }
};

export type ServiceResponse<T> = ServiceReponseSuccess<T> | ServiceResponseError;
