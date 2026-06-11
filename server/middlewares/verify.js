import { v4 as uuid } from "uuid";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import DB from "../db/index.js";
import { extractToken } from "../utils/extractToken.js";
import { handleError } from "../utils/handlers.js";

const validateTokenFromDB = async (token, tokenId) => {
  try {
    const tokenDoc = await DB.Token.findOne({
      tokenId,
    });
    if (!tokenDoc) {
      throw new Error("Invalid Auth");
    }
    return tokenDoc.accessToken === token;
  } catch (error) {
    throw error;
  }
};

export const generateToken = async (user) => {
  try {
    //generate uuid to append at the end of token
    const tokenId = uuid();
    //generate access token
    const accessToken = jwt.sign(user, process.env.JWT_SECRET);
    //save access token
    await DB.Token.create({
      userId: mongoose.Types.ObjectId.createFromHexString(`${user._id}`),
      accessToken,
      tokenId,
    });
    // append token id at the end to later manage multiple auth sessions and delete specific if required
    return `${accessToken} ${tokenId}`;
  } catch (error) {
    throw new Error(error.message || "Unable to generate token");
  }
};

// this is extraction of verification logic and it exists in case needed somewhere else
export const verify = async (token, tokenId) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (token && secret) {
      const payload = await jwt.verify(token, secret);
      if (!payload) {
        throw new Error("Invalid Token");
      }
      const valid = await validateTokenFromDB(token, tokenId);
      if (!valid) {
        throw new Error("Invalid Token");
      }
      return payload;
    }
  } catch (error) {
    throw error;
  }
};

//this is express middleware for verification
export const verifyToken = async (req, res, next) => {
  try {
    const [token, tokenId] = extractToken(req);
    if (!token || !tokenId) {
      throw new Error("Invalid Token");
    }
    const payload = await verify(token, tokenId);
    req.user = { ...payload, userId: payload._id };
    next();
  } catch (error) {
    console.error({ error });
    return handleError(res, error, "Invalid Token");
  }
};
