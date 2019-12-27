export default function handleUrlEncode(data) {
  return Object.keys(data).map(key => {
    return key + '=' + data[key];
  }).join('&')
}