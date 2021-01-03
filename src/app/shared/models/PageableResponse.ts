export interface PageableResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: string;
  size: number;
  sort: {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
  };
  totalElements: number;
  totalPages: number;
}
