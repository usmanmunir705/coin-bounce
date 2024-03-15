const mongoose = require('mongoose')
const {Schema } = require('mongoose');

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RefreshToken' ,refreshTokenSchema ,"tokens");


