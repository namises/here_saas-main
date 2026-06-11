import React from "react";

const TestPreTag = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default TestPreTag;
