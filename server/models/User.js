const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, ""],
      unique: [true, ""],
      match: [/^\S{3,16}$/, ""],
    },
    name: {
      type: String,
      required: [true, ""],
      match: [/^[ЁёА-я]{2,20}$/, ""],
    },
    email: {
      type: String,
      required: [true, ""],
      unique: [true, ""],
      validate: {},
    },
    phone: {
      type: String,
      required: [true, ""],
      unique: [true, ""],
      match: [/^\d{11}$/, ""],
    },
    password: {
      type: String,
      required: [true, ""],
      minLength: [6, ""],
    },
    photo: {
      type: String,
      default: function () {
        const id = this._id;
        console.log("User Schema - Photo ID");
        console.log(id);
        if (id) return id;
        return null;
      },
    },
    subscriptions: {
      messages: Boolean,
      email: Boolean,
    },

    //
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      // default: function(){
      //     //generate token
      // }
    },
    verificatoinDate: {
      type: Date,
      default: Date.now,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },

    // cart: {},
    // orders: {},
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
