import Message from "./message";
import IMessageHandler from "./IMessageHander";

class MessageSubscriptionNode {
  public readonly message: Message;
  public readonly handler: IMessageHandler;

  public constructor(message: Message, handler: IMessageHandler) {
    this.message = message;
    this.handler = handler;
  }
}

export default MessageSubscriptionNode;
