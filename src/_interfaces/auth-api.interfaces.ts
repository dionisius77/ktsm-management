export interface LoginReqI {
  email: string;
  password: string;
}

export interface LoginResI {
  token: string;
}

export interface CreateBranchReqI {
  email: string;
  name: string;
  operatingAreaId: string;
}

export interface BranchI {
  id: string;
  email: string;
  operatingAreaId: string;
  name: string;
  isOnline: boolean;
}

export interface OperatingAreaI {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
