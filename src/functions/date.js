const nowDate = () => {
  const mydate = new Date();

  const y = mydate.getFullYear();
  const m = mydate.getMonth() + 1;
  const d = mydate.getDate();

  const h = mydate.getHours();
  const min = mydate.getMinutes();
  const s = mydate.getSeconds();

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};

const nowMillis = () => {
  return Date.now().toString();
};

module.exports = {
  nowDate,
  nowMillis,
};
