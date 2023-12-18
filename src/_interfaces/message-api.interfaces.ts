export enum ContentType {
  Text = "Text",
  Audio = "Audio",
  Video = "Video",
}

export interface SelectOptionI {
  label: string;
  value: string;
}

export interface GetMessagesParamsI {
  page: number;
  size: number;
  search?: string;
}

export interface MessageI {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BranchesI {
  id?: string;
  broadcastAt?: Date;
  expiredAt?: Date;
}

export interface BranchesFormI {
  branchId?: string;
  broadcastAt?: Date;
  expiredAt?: Date;
}

export interface CreateMessageReqI {
  title: string;
  content: string;
  contentType: ContentType;
  branches: BranchesI[];
}

export interface UpdateMessageReqI {
  content: string;
  contentType: ContentType;
}

export interface CreateMessageFormI {
  title: string;
  content: string;
  contentType: ContentType;
  broadcastAt: Date;
  expiredAt: Date;
  broadcastTo: SelectOptionI[];
  branches: BranchesFormI[];
}

export interface UpdateMessageLogsI {
  content: string | null;
  contentType: ContentType | null;
  broadcastAt: string;
  expiredAt: string;
}

export interface MessageLog {
  id: string;
  contentType?: ContentType;
  content?: string;
  branch: {
    id: string;
    email: string;
    name: string;
    socketId: string;
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  broadcastedAt: Date;
  isBroadcasted: boolean;
  expiredAt: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
