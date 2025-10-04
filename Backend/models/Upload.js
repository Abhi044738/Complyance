import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    _id: { type: String },
    country: { type: String, default: null },
    erp: { type: String, default: null },
    rawText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Upload = mongoose.models.Upload || mongoose.model("Upload", UploadSchema);
export default Upload;
