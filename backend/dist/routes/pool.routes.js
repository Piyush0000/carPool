"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_controller_1 = require("../controllers/pool.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route('/create')
    .post(pool_controller_1.createPoolRequest);
router.route('/requests')
    .get(pool_controller_1.getAllPoolRequests);
router.route('/my-requests')
    .get(pool_controller_1.getMyPoolRequests);
router.route('/match')
    .post(pool_controller_1.matchPoolRequests);
router.route('/:id')
    .get(pool_controller_1.getPoolRequest)
    .delete(pool_controller_1.deletePoolRequest);
router.route('/:id/status')
    .patch(pool_controller_1.updatePoolStatus);
exports.default = router;
//# sourceMappingURL=pool.routes.js.map