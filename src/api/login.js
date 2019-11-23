import $axios from "./index";

export function login(data) {
  const url = "http://canteen.tonglingok.com/api/v1/token/admin";
  return $axios.post(url, data);
}
export function producerLogin(data) {
  const url = "http://canteen.tonglingok.com/api/v1/token/supplier";
  return $axios.post(url, data);
}
export function getInfo() {
  const url = "/getInfo";
  return $axios.get(url);
}
export function getUserModules() {
  const url = 'http://canteen.tonglingok.com/api/v1/modules/admin';
  return $axios.get(url);
}
