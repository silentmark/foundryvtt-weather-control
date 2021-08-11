
export class ChatProxy {
  public create(data: DeepPartial<ChatMessage.CreateData>) {
    ChatMessage.create(data);
  }

  public getWhisperRecipients(name: string): User[] {
    return ChatMessage.getWhisperRecipients(name);
  }
}
