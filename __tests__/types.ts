export type User = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  fullName: string;
};

export type TaskInput = {
  name: string;
  description: string;
  status: string;
  executor?: string;
  labels?: string[];
};
