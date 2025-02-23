import { Request, Response } from "express";
import Item from "../models/Items";

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, image } = req.body;

    const item = new Item({ name, image });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء الإنشاء" });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { name, image } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      res.status(404).json({ message: "الصنف غير موجود" });
      return;
    }

    res.status(200).json({
      message: "تم التحديث بنجاح",
      item: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "فشل في التحديث" });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      res.status(404).json({ message: "الصنف غير موجود" });
      return;
    }

    res.status(200).json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "فشل في الحذف" });
  }
};

export const getAllItems = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find().select("-__v").sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "فشل في جلب البيانات" });
  }
};
