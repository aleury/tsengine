import Message from "./message";

interface IMessageHandler {
  onMessage(message: Message): void;
}

export default IMessageHandler;
