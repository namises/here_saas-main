export const handleResponse = (res, payload) => {
  return res.send({
    success: true,
    data: {
      ...payload,
    },
  });
};

export const handleError = (res, error, message) => {
  console.error({ error });
  return res.send({
    success: false,
    message: message || error.message || "Unable to process the req at the moment",
  });
};
