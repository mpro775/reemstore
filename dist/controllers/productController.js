"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.searchProducts = exports.filterProducts = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const mongoose_1 = __importDefault(require("mongoose"));
const Items_1 = __importDefault(require("../models/Items"));
// إنشاء منتج جديد
const createProduct = async (req, res) => {
    try {
        const { name, description, category, item, price, discountedPrice, image, createdAt, } = req.body;
        // التحقق من وجود السيرفر
        const serverExists = await Category_1.default.findById(category);
        if (!serverExists) {
            res.status(404).json({ message: "الفئة غير موجود." });
            return;
        }
        // التحقق من وجود السيرفر
        const ItemExists = await Items_1.default.findById(item);
        if (!ItemExists) {
            res.status(404).json({ message: "الفئة غير موجود." });
            return;
        }
        const newProduct = new Product_1.default({
            name,
            description,
            category: category,
            item: item,
            price,
            discountedPrice,
            image,
            createdAt,
        });
        await newProduct.save();
        res
            .status(201)
            .json({ message: "Product created successfully", product: newProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createProduct = createProduct;
// تعديل منتج موجود
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, updates, {
            new: true,
        });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateProduct = updateProduct;
// حذف منتج
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteProduct = deleteProduct;
// عرض جميع المنتجات
const getAllProducts = async (_req, res) => {
    try {
        const products = await Product_1.default.find();
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllProducts = getAllProducts;
// فلترة المنتجات
const filterProducts = async (req, res) => {
    try {
        const { minPrice, maxPrice, serverType } = req.query;
        const query = {};
        if (minPrice)
            query.price = { $gte: parseFloat(minPrice) };
        if (maxPrice)
            query.price = { ...query.price, $lte: parseFloat(maxPrice) };
        if (serverType)
            query.serverType = serverType;
        const products = await Product_1.default.find(query);
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.filterProducts = filterProducts;
// البحث عن منتجات
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ message: "Query parameter is required" });
            return;
        }
        const products = await Product_1.default.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // بحث بالاسم
                { description: { $regex: query, $options: "i" } }, // بحث بالوصف
            ],
        });
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.searchProducts = searchProducts;
// الحصول على منتج بواسطة الـ ID
// controllers/productController.ts
const getProductById = async (req, res) => {
    // <-- تغيير نوع الإرجاع إلى void
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "معرّف غير صالح" });
            return; // <-- إضافة return لتجنب تنفيذ الكود التالي
        }
        const product = await Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "المنتج غير موجود" });
            return; // <-- إضافة return هنا أيضًا
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
};
exports.getProductById = getProductById;
