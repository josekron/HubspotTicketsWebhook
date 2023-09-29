import * as Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const ticketsSchema = new Schema({
  stage: String,
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export const TicketsModel = Mongoose.model("Tickets", ticketsSchema, "tickets");
