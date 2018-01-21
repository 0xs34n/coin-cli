import MessageType from "./MessageType";

export default interface Message {
  type: MessageType;
  payload?: any;
}