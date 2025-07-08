import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks:[
        {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ]
  },
  { timestamps: true }
);

const Board= mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;