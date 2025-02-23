"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const Items_1 = __importDefault(require("../models/Items"));
const createItem = async (req, res) => {
    try {
        const { name, image } = req.body;
        const item = new Items_1.default({ name, image });
        await item.save();
        res.status(201).json({
            message: "تم إنشاء الصنف بنجاح",
            item: {
                _id: item._id,
                name: item.name,
                image: item.image,
                createdAt: item.createdAt,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء الإنشاء" });
    }
};
exports.createItem = createItem;
const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { name, image } = req.body;
        const updatedItem = await Items_1.default.findByIdAndUpdate(itemId, { name, image }, { new: true, runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ message: "الصنف غير موجود" });
            return;
        }
        res.status(200).json({
            message: "تم التحديث بنجاح",
            item: updatedItem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "فشل في التحديث" });
    }
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deletedItem = await Items_1.default.findByIdAndDelete(itemId);
        if (!deletedItem) {
            res.status(404).json({ message: "الصنف غير موجود" });
            return;
        }
        res.status(200).json({ message: "تم الحذف بنجاح" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "فشل في الحذف" });
    }
};
exports.deleteItem = deleteItem;
const getAllItems = async (_req, res) => {
    try {
        const items = await Items_1.default.find().select("-__v").sort({ createdAt: -1 });
        res.status(200).json({ items });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "فشل في جلب البيانات" });
    }
};
exports.getAllItems = getAllItems;
