export type ApiStatus = 'success' | 'fail' | 'error';

export type ApiValidationIssue = { path: string; message: string };

export type ApiErrorBody = {
  status: 'fail' | 'error';
  message?: string;
  errors?: ApiValidationIssue[];
};

export type Paginated<T> = {
  status: 'success';
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
};

export type ApiDataResponse<T> = {
  status: 'success';
  data: T;
};
