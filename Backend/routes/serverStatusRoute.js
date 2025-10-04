import mongoose from "mongoose";

export const serverStatusCheck = async (req, res) => {
  const databaseState = mongoose.connection.readyState;
  res.json({
    ok: true,
    db: databaseState,
  });
};
