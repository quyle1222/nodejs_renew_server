 const convertToDate = (timestamp) => {
  const today = new Date(timestamp);
  const date =
    String(today.getDate()).padStart(2, "0") +
    "/" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "/" +
    today.getFullYear();
  return `${date}`;
 };

module.exports = {
    convertToDate,
};
