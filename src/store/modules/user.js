import { login, getInfo, producerLogin, getUserModules } from "@/api/login";
import { Message } from "element-ui";
import router, { resetRouter } from "@/router";
import { treeToArr } from "@/utils/flatternArr";
import { stat } from "fs";
const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "", // 认证凭证'
  userName: "",
  grade: "",
  role: "",
  roles: [],
  introduce: "",
  isProducer: ""
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
  },
  SET_PRODUCER(state, val) {
    state.isProducer = val;
  },
  DEL_PRODUCER(state) {
    state.isProducer = "";
  }
};
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas)
        .then(res => {
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
          if (res.code == "200") {
            commit("SET_TOKEN", res.data.token);
            commit("SET_ROLE", res.data.role);
            commit("SET_GRADE", res.data.grade);
            commit("SET_NAME", res.data.userName);
            commit("SET_PRODUCER", 1);
            localStorage.setItem("isProducer", 1);
            resolve(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  loginOut({ commit, state }) {
    commit("DEL_TOKEN");
    commit("DEL_ROLE");
    commit("DEL_GRADE");
    commit("DEL_PRODUCER");
    // resetRouter();
    if (localStorage.getItem("isProducer")) {
      router.push({
        path: "/producerLogin",
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    } else {
      router.push({
        path: "/login",
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    }
  },
  _getUserModules({ commit }) {
    let roles = null;
    return new Promise((resolve, reject) => {
      if (localStorage.getItem("isProducer"))
       {
        return resolve({roles});
      };
      getUserModules()
        .then(res => {
          if (res.msg === "ok") {
            let data = treeToArr(res.data);
            roles = data.map(item => item.url);
            commit("SET_ROLES", roles);
          }
          resolve({ roles });
        })
        .catch(error => {
          reject(error);
        });
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
