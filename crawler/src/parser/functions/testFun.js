module.exports = name => {
  try {
    return { name };
  } catch (e) {
    throw new Error(
      JSON.stringify({
        message: e.message,
        code: 501
      })
    );
  }
};
