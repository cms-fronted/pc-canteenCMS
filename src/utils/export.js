import $axios from "@/api/index";
import { Message } from "element-ui";
import exportFiles from "./exportFile";

export default async function exportExcel(url, data) {
  const res = await $axios.get(url, data);
  if (res.msg === "ok") {
    exportFiles(res.data.url);
  } else {
    Message.error(res.msg);
  }
}
