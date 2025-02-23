import { Request, Response } from "express";
import Category from "../models/Category";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, image } = req.body;

    const category = new Category({ name, image });
    await category.save();

    res.status(201).json({ message: "تم إنشاء الفئة بنجاح", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفئة" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const updates = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updates },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: "الفئة غير موجودة" });
      return;
    }

    res
      .status(200)
      .json({ message: "تم تحديث الفئة بنجاح", category: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء التحديث" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      res.status(404).json({ message: "الفئة غير موجودة" });
      return;
    }

    res.status(200).json({ message: "تم حذف الفئة بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
  }
};

export const getAllCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.find().select("-createdBy -__v");
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
  }
};
