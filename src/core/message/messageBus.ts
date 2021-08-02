import Message, { MessagePriority } from "./message";
import IMessageHandler from "./IMessageHander";
import MessageSubscriptionNode from "./messageSubscriptionNode";

class MessageBus {
  private static _subscriptions: Map<string, IMessageHandler[]> = new Map();

  private static _normalQueueMessagesPerUpdate: number = 10;
  private static _normalMessageQueue: MessageSubscriptionNode[] = [];

  private constructor() {}

  public static addSubscription(code: string, handler: IMessageHandler): void {
    if (!MessageBus._subscriptions.has(code)) {
      MessageBus._subscriptions.set(code, []);
    }

    const handlers = MessageBus._subscriptions.get(code);

    if (handlers.includes(handler)) {
      console.warn(
        `Attempting to add a duplicate handler to code '${code}'. Subscription not added.`
      );
      return;
    }

    handlers.push(handler);
  }

  public static removeSubscription(
    code: string,
    handler: IMessageHandler
  ): void {
    if (!MessageBus._subscriptions.has(code)) {
      console.warn(
        `The code '${code}' has no subscriptions registered. Cannot unsubscribe handler.`
      );
      return;
    }

    const handlers = MessageBus._subscriptions.get(code);
    const handlerIndex = handlers.indexOf(handler);
    if (handlerIndex === -1) {
      console.warn(
        `Attempting to remove handler that doesn't exist from code '${code}'.`
      );
      return;
    }

    handlers.splice(handlerIndex, 1);
  }

  public static post(message: Message): void {
    console.log(`Message posted:`, message);

    if (!MessageBus._subscriptions.has(message.code)) {
      return;
    }

    const handlers = MessageBus._subscriptions.get(message.code);
    for (let h of handlers) {
      if (message.priority === MessagePriority.HIGH) {
        h.onMessage(message);
      } else {
        MessageBus._normalMessageQueue.push(
          new MessageSubscriptionNode(message, h)
        );
      }
    }
  }

  public static update(time: number): void {
    const queueLength = MessageBus._normalMessageQueue.length;

    if (queueLength === 0) {
      return;
    }

    const messageLimit = Math.min(
      queueLength,
      this._normalQueueMessagesPerUpdate
    );

    for (let i = 0; i < messageLimit; ++i) {
      const node = MessageBus._normalMessageQueue.shift();
      node.handler.onMessage(node.message);
    }
  }
}

export default MessageBus;
