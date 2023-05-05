export interface MessageDataOptionBasic {
  text: string;
  value: any;
  action?: string;
}

export interface MessageDataOption extends MessageDataOptionBasic {
  emit?: string;
  type?: string;
  to?: string;
}

export interface MessageData {
  agent: string;
  type: string;
  text: string;
  createdAt?: string;
  disableInput?: boolean;
  reselectable?: boolean;
  botTyping?: boolean;
  options?: MessageDataOption[];
  options_multiple_choice?: MessageDataOptionBasic[];
}