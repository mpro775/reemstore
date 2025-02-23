"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const uploadController_1 = require("../controllers/uploadController");
const router = express_1.default.Router();
// Route لرفع الصور
router.post("/upload", uploadMiddleware_1.upload.single("image"), uploadController_1.uploadImage);
exports.default = router;
