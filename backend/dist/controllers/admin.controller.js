"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAnnouncement = exports.getAllPoolRequests = exports.deleteGroup = exports.getAllGroups = exports.banUser = exports.getAllUsers = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const PoolRequest_model_1 = __importDefault(require("../models/PoolRequest.model"));
const notification_controller_1 = require("./notification.controller");
const getAllUsers = async (req, res) => {
    try {
        const users = await User_model_1.default.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.getAllUsers = getAllUsers;
const banUser = async (req, res) => {
    try {
        const user = await User_model_1.default.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.banUser = banUser;
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group_model_1.default.find()
            .populate('members.user', 'name email')
            .populate('admin', 'name email')
            .populate('route.pickup.routePoint', 'name address coordinates')
            .populate('route.drop.routePoint', 'name address coordinates');
        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.getAllGroups = getAllGroups;
const deleteGroup = async (req, res) => {
    try {
        const group = await Group_model_1.default.findByIdAndDelete(req.params.id);
        if (!group) {
            res.status(404).json({
                success: false,
                message: 'Group not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.deleteGroup = deleteGroup;
const getAllPoolRequests = async (req, res) => {
    try {
        const poolRequests = await PoolRequest_model_1.default.find()
            .populate('user', 'name email')
            .populate('matchedWith', 'name email');
        res.status(200).json({
            success: true,
            count: poolRequests.length,
            data: poolRequests
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.getAllPoolRequests = getAllPoolRequests;
const sendAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        const users = await User_model_1.default.find({}, '_id');
        const notificationPromises = users.map(user => (0, notification_controller_1.createNotification)({
            recipient: user._id.toString(),
            type: 'system',
            title,
            content
        }));
        await Promise.all(notificationPromises);
        res.status(201).json({
            success: true,
            message: 'Announcement sent to all users'
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.sendAnnouncement = sendAnnouncement;
//# sourceMappingURL=admin.controller.js.map