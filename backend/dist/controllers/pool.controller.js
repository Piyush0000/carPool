"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPoolRequests = exports.updatePoolStatus = exports.deletePoolRequest = exports.getMyPoolRequests = exports.getPoolRequest = exports.getAllPoolRequests = exports.createPoolRequest = void 0;
const PoolRequest_model_1 = __importDefault(require("../models/PoolRequest.model"));
const mongoose_1 = require("mongoose");
const geoapify_utils_1 = require("../utils/geoapify.utils");
const createPoolRequest = async (req, res) => {
    try {
        const { pickupLocation, dropLocation, dateTime, preferredGender, seatsNeeded, mode } = req.body;
        if (!pickupLocation || !dropLocation || !dateTime) {
            res.status(400).json({
                success: false,
                message: 'Pickup location, drop location, and date time are required'
            });
            return;
        }
        const poolRequest = await PoolRequest_model_1.default.create({
            createdBy: req.user.id,
            pickupLocation,
            dropLocation,
            dateTime,
            preferredGender: preferredGender || 'Any',
            seatsNeeded: seatsNeeded || 1,
            mode: mode || 'Scheduled',
            status: 'Open'
        });
        res.status(201).json({
            success: true,
            data: poolRequest
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.createPoolRequest = createPoolRequest;
const getAllPoolRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query = {
                $or: [
                    { createdBy: req.user.id },
                    { status: 'Open' }
                ]
            };
        }
        const poolRequests = await PoolRequest_model_1.default.find(query)
            .populate('createdBy', 'name email gender year branch')
            .populate('matchedUsers', 'name email')
            .sort({ dateTime: 1 })
            .limit(50);
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
const getPoolRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid pool request ID'
            });
            return;
        }
        const poolRequest = await PoolRequest_model_1.default.findById(id)
            .populate('createdBy', 'name email gender year branch phone')
            .populate('matchedUsers', 'name email gender year branch phone');
        if (!poolRequest) {
            res.status(404).json({
                success: false,
                message: 'Pool request not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: poolRequest
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.getPoolRequest = getPoolRequest;
const getMyPoolRequests = async (req, res) => {
    try {
        const poolRequests = await PoolRequest_model_1.default.find({ createdBy: req.user.id })
            .populate('createdBy', 'name email')
            .populate('matchedUsers', 'name email')
            .sort({ dateTime: -1 });
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
exports.getMyPoolRequests = getMyPoolRequests;
const deletePoolRequest = async (req, res) => {
    try {
        const poolRequest = await PoolRequest_model_1.default.findById(req.params.id);
        if (!poolRequest) {
            res.status(404).json({
                success: false,
                message: 'Pool request not found'
            });
            return;
        }
        if (poolRequest.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Not authorized to delete this pool request'
            });
            return;
        }
        await poolRequest.deleteOne();
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
exports.deletePoolRequest = deletePoolRequest;
const updatePoolStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Open', 'Matched', 'Completed', 'Cancelled'].includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
            return;
        }
        const poolRequest = await PoolRequest_model_1.default.findById(req.params.id);
        if (!poolRequest) {
            res.status(404).json({
                success: false,
                message: 'Pool request not found'
            });
            return;
        }
        if (poolRequest.createdBy.toString() !== req.user.id) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update this pool request'
            });
            return;
        }
        poolRequest.status = status;
        await poolRequest.save();
        res.status(200).json({
            success: true,
            data: poolRequest
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.updatePoolStatus = updatePoolStatus;
const matchPoolRequests = async (req, res) => {
    try {
        const { pickupLocation, dropLocation, dateTime, preferredGender } = req.body;
        if (!pickupLocation || !dropLocation || !dateTime) {
            res.status(400).json({
                success: false,
                message: 'Pickup location, drop location, and date time are required'
            });
            return;
        }
        const requestDateTime = new Date(dateTime);
        const timeRange = 25 * 60 * 1000;
        const startTime = new Date(requestDateTime.getTime() - timeRange);
        const endTime = new Date(requestDateTime.getTime() + timeRange);
        const matchingRequests = await PoolRequest_model_1.default.find({
            status: 'Open',
            createdBy: { $ne: req.user.id },
            dateTime: {
                $gte: startTime,
                $lte: endTime
            },
            $or: [
                { preferredGender: 'Any' },
                { preferredGender: preferredGender },
                { preferredGender: { $exists: false } }
            ]
        }).populate('createdBy', 'name email gender year branch phone');
        const scoredMatches = matchingRequests.map(request => {
            const pickupDistance = (0, geoapify_utils_1.calculateDistanceHaversine)(pickupLocation.coordinates[1], pickupLocation.coordinates[0], request.pickupLocation.coordinates[1], request.pickupLocation.coordinates[0]);
            const dropDistance = (0, geoapify_utils_1.calculateDistanceHaversine)(dropLocation.coordinates[1], dropLocation.coordinates[0], request.dropLocation.coordinates[1], request.dropLocation.coordinates[0]);
            const timeDiff = Math.abs(request.dateTime.getTime() - requestDateTime.getTime()) / (1000 * 60);
            const distanceScore = Math.max(0, 40 - (pickupDistance + dropDistance) / 1000);
            const timeScore = Math.max(0, 40 - timeDiff / 2);
            const genderScore = preferredGender === request.preferredGender ||
                request.preferredGender === 'Any' ||
                !request.preferredGender ? 20 : 0;
            const matchScore = Math.min(100, distanceScore + timeScore + genderScore);
            return {
                ...request.toObject(),
                matchScore,
                distanceSimilarity: {
                    pickup: pickupDistance,
                    drop: dropDistance
                },
                timeDifference: timeDiff
            };
        });
        const filteredMatches = scoredMatches
            .filter(match => match.matchScore >= 30)
            .sort((a, b) => b.matchScore - a.matchScore);
        res.status(200).json({
            success: true,
            count: filteredMatches.length,
            data: filteredMatches
        });
    }
    catch (err) {
        console.error('Match pool requests error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.matchPoolRequests = matchPoolRequests;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
//# sourceMappingURL=pool.controller.js.map