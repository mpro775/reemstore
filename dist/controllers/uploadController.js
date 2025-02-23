"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded." });
            return;
        }
        // إرجاع الرابط الكامل للصورة
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading file." });
    }
};
exports.uploadImage = uploadImage;
