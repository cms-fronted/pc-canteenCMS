import $axios from "./index";

export function login(data) {
  const url = "/v1/token/admin";
  return $axios.post(url, data);
}
export function producerLogin(data) {
  const url = "/v1/token/supplier";
  return $axios.post(url, data);
}
export function getInfo() {
  const url = "/getInfo";
  return $axios.get(url);
}
