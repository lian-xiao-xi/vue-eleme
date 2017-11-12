export function formatDate(dateValue) {
  let date = new Date(dateValue);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
}