import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import mongoose from "mongoose";
import Items from "../models/Items";
// إنشاء منتج جديد
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      item,
      price,
      discountedPrice,
      image,
      createdAt,
    } = req.body;


    // التحقق من وجود السيرفر
    const serverExists = await Category.findById(category);
    if (!serverExists) {
      res.status(404).json({ message: "الفئة غير موجود." });
      return;
    }
    // التحقق من وجود السيرفر
    const ItemExists = await Items.findById(item);
    if (!ItemExists) {
      res.status(404).json({ message: "الفئة غير موجود." });
      return;
    }
    const newProduct = new Product({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// تعديل منتج موجود
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// حذف منتج
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض جميع المنتجات
export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// فلترة المنتجات
export const filterProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { minPrice, maxPrice, serverType } = req.query;

    const query: any = {};
    if (minPrice) query.price = { $gte: parseFloat(minPrice as string) };
    if (maxPrice)
      query.price = { ...query.price, $lte: parseFloat(maxPrice as string) };
    if (serverType) query.serverType = serverType;

    const products = await Product.find(query);
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// البحث عن منتجات
export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: "Query parameter is required" });
      return;
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query as string, $options: "i" } }, // بحث بالاسم
        { description: { $regex: query as string, $options: "i" } }, // بحث بالوصف
      ],
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// الحصول على منتج بواسطة الـ ID
// controllers/productController.ts
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  // <-- تغيير نوع الإرجاع إلى void
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "معرّف غير صالح" });
      return; // <-- إضافة return لتجنب تنفيذ الكود التالي
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "المنتج غير موجود" });
      return; // <-- إضافة return هنا أيضًا
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};
