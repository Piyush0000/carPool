import { Request, Response } from 'express';
export declare const createGroup: (req: any, res: Response) => Promise<void>;
export declare const joinGroup: (req: any, res: Response) => Promise<void>;
export declare const leaveGroup: (req: any, res: Response) => Promise<void>;
export declare const lockGroup: (req: any, res: Response) => Promise<void>;
export declare const getAllGroups: (req: any, res: Response) => Promise<void>;
export declare const getAllGroupsPublic: (req: Request, res: Response) => Promise<void>;
export declare const getOpenGroups: (req: any, res: Response) => Promise<void>;
export declare const getUserGroups: (req: any, res: Response) => Promise<void>;
export declare const getGroup: (req: any, res: Response) => Promise<void>;
export declare const matchGroups: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=group.controller.d.ts.map