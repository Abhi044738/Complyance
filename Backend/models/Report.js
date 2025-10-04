import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    _id: { type: String },
    uploadId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    scoresOverall: { type: Number, required: true },
    reportJson: { type: Object, required: true },
    expiresAt: { type: Date },
  },
  { versionKey: false }
);

ReportSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { expiresAt: { $exists: true } },
  }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;
