"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = new Category_1.default({ name, image });
        await category.save();
        res.status(201).json({ message: "تم إنشاء الفئة بنجاح", category });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفئة" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const updates = req.body;
        const updatedCategory = await Category_1.default.findByIdAndUpdate(categoryId, { $set: updates }, { new: true });
        if (!updatedCategory) {
            res.status(404).json({ message: "الفئة غير موجودة" });
            return;
        }
        res
            .status(200)
            .json({ message: "تم تحديث الفئة بنجاح", category: updatedCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء التحديث" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const deletedCategory = await Category_1.default.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            res.status(404).json({ message: "الفئة غير موجودة" });
            return;
        }
        res.status(200).json({ message: "تم حذف الفئة بنجاح" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCategories = async (_req, res) => {
    try {
        const categories = await Category_1.default.find().select("-createdBy -__v");
        res.status(200).json({ categories });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
    }
};
exports.getAllCategories = getAllCategories;
