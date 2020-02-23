import { login, getInfo, producerLogin, getUserModules } from "@/api/login";
import { Message } from "element-ui";
import router, { resetRouter } from "@/router";
import { treeToArr } from "@/utils/flatternArr";
const producerRoles = [
  {
    id: 1,
    m_id: 1,
    name: "小卖部管理",
    parent_id: 0,
    type: 1,
    url: "Canteen",
    items: [
      {
        id: 2,
        m_id: 2,
        parent_id: 1,
        type: 1,
        name: "商品管理",
        url: "Canteen-manage"
      },
      {
        id: 3,
        m_id: 3,
        parent_id: 1,
        type: 1,
        name: "消费订单汇总查询",
        url: "Canteen-statistics-producer"
      },
      {
        id: 4,
        m_id: 4,
        parent_id: 1,
        type: 1,
        name: "订单明细查询",
        url: "Canteen-order-producer"
      },
      {
        id: 5,
        m_id: 5,
        parent_id: 1,
        type: 1,
        name: "进销统计报表",
        url: "Canteen-invocing-report-producer"
      },
    ]
  }
]
const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "", // 认证凭证'
  userName: "",
  grade: localStorage.getItem("grade") ? localStorage.getItem("grade") : "",
  role: "",
  roles: [],
  introduce: "",
  isProducer: localStorage.getItem("isProducer")
    ? localStorage.getItem("isProducer")
    : "",
  company_id: localStorage.getItem("company_id")
    ? localStorage.getItem("company_id")
    : ""
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
    localStorage.setItem("grade", val);
  },
  DEL_GRADE(state) {
    state.grade = "";
    localStorage.removeItem("grade");
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
    localStorage.setItem("isProducer", val);
  },
  DEL_PRODUCER(state) {
    state.isProducer = "";
    localStorage.removeItem("isProducer");
  },
  SET_COMPANYID(state, val) {
    state.company_id = val;
    localStorage.setItem("company_id", val);
  },
  DEL_COMPANYID(state) {
    state.company_id = "";
    localStorage.removeItem("company_id");
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
            commit("SET_ROLES", []);
            commit("SET_GRADE", res.data.grade);
            commit("SET_NAME", res.data.userName);
            commit("SET_COMPANYID", res.data.company_id);
            resolve(res);
          }
          resolve(res);
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
          resolve(res);
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
    if (localStorage.getItem("isProducer") == 1) {
      router.push({
        path: "/producer",
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
    localStorage.clear();
  },
  _getUserModules({ commit }) {
    let roles = null;
    return new Promise((resolve, reject) => {
      if (localStorage.getItem("isProducer")) {
        return resolve({ roles });
      }
      getUserModules()
        .then(res => {
          if (res.msg === "ok") {
            let data = treeToArr(res.data);
            roles = data.map(item => {
              if (item.name === "充值记录明细") {
                localStorage.setItem("m_id", item.m_id);
              }
              return item.url;
            });
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
