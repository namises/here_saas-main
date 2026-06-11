export const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const [_, token, tokenId] = req.headers.authorization.split(" ");
    return [token, tokenId];
  } else {
    return [];
  }
};
