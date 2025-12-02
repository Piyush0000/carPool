import mongoose, { Document } from 'mongoose';
export interface IChatMessage extends Document {
    sender: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    content: string;
    messageType: 'text' | 'image' | 'location';
    readBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const ChatMessage: mongoose.Model<IChatMessage, {}, {}, {}, mongoose.Document<unknown, {}, IChatMessage, {}, {}> & IChatMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ChatMessage;
//# sourceMappingURL=ChatMessage.model.d.ts.map