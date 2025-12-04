import mongoose, { Document } from 'mongoose';
export interface IGroup extends Document {
    groupName: string;
    members: {
        user: mongoose.Types.ObjectId;
        role: 'member' | 'admin';
        joinedAt: Date;
    }[];
    route: {
        pickup: {
            address: string;
            coordinates: [number, number];
        };
        drop: {
            address: string;
            coordinates: [number, number];
        };
    };
    uberLocations?: {
        pickup?: {
            coordinates: [number, number];
        };
        drop?: {
            coordinates: [number, number];
        };
    };
    dateTime: Date;
    seatCount: number;
    status: 'Open' | 'Locked' | 'Completed';
    chatRoomId: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Group: mongoose.Model<IGroup, {}, {}, {}, mongoose.Document<unknown, {}, IGroup, {}, {}> & IGroup & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Group;
//# sourceMappingURL=Group.model.d.ts.map