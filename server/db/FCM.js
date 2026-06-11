import { Schema, model } from "mongoose";

const FCMSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true, unique: true },

    fcmTokens: {
      type: [String],
      validate: {
        validator: function (tokens) {
          const set = new Set(tokens);
          return set.size === tokens.length;
        },
        message: () => `Duplicate FCM tokens are not allowed.`,
      },
      default: [],
    },
  },
  { timestamps: true }
);

FCMSchema.statics.addToken = async function (employeeId, newToken) {
  const record = await this.findOne({ employee: employeeId });

  if (record) {
    if (!record.fcmTokens.includes(newToken)) {
      record.fcmTokens.push(newToken);
      await record.save();
    }
  } else {
    await this.create({
      employee: employeeId,
      fcmTokens: [newToken],
    });
  }
};

FCMSchema.statics.removeToken = async function (employeeId, tokenToRemove) {
  await this.updateOne({ employee: employeeId }, { $pull: { fcmTokens: tokenToRemove } });
};

const FCM = model("FCM", FCMSchema);

export default FCM;
