import { login, getInfo, producerLogin } from "@/api/login";
import { Message } from "element-ui";
import router, { resetRouter } from "@/router";

const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "", // 认证凭证'
  userName: "",
  grade: "",
  role: "",
  roles: [],
  introduce: ""
};
const mutations = {
  SET_TOKEN(state, val) {
    state.token = val;
    localStorage.setItem("token", val);
  },
  DEL_TOKEN(state) {
    state.token = "";
    localStorage.removeItem("token");
  },
  SET_ROLE(state, val) {
    console.log(val);
    state.role = val;
  },
  DEL_ROLE(state) {
    state.role = "";
  },
  SET_GRADE(state, val) {
    state.grade = val;
  },
  DEL_GRADE(state) {
    state.grade = "";
  },
  SET_ROLES(state, payload) {
    state.roles = payload;
  },
  SET_NAME(state, payload) {
    state.userName = payload;
  },
  SET_INTRODUCE(state, payload) {
    state.introduce = payload;
  }
};
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas)
        .then(res => {
          console.log("请求成功");
          console.log(res);
          if (res.code == "200") {
            commit("SET_TOKEN", res.data.token);
            commit("SET_ROLE", res.data.role);
            commit("SET_GRADE", res.data.grade);
            commit("SET_NAME", res.data.userName);
            resolve(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  _producerLogin({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      producerLogin(formdatas)
        .then(res => {
          console.log("请求成功");
          console.log(res);
          if (res.code == "200") {
            commit("SET_TOKEN", res.data.token);
            commit("SET_ROLE", res.data.role);
            commit("SET_GRADE", res.data.grade);
            commit("SET_NAME", res.data.userName);
            resolve(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  loginOut({ commit }) {
    commit("DEL_TOKEN");
    commit("DEL_ROLE");
    commit("DEL_GRADE");
    // resetRouter();
    router.push({
      path: "/login",
      query: {
        redirect: router.currentRoute.fullPath
      }
    });
  },
  _getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(res => {
          if (res.code === 0) {
            const { name, roles, introduce } = res.data;
            commit("SET_ROLES", roles);
            commit("SET_NAME", name);
            commit("SET_INTRODUCE", introduce);
          } else {
            Message.error(res.msg);
          }
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
