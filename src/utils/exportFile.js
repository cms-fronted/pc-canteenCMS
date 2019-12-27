import handleUrlEncode from './handleUrlEncode'

export default function exportFiles(url = '', data = {}) {
  window.open(url + '?' + handleUrlEncode(data))
}