import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

Vue.use(Router);

import Layout from "@/layout";
import { Message } from "element-ui";
import getTitle from "@/utils/getTitle";

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * mete{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

/*通用routers*/

export const currencyRoutes = [
  {
    path: "/",
    redirect: "/order"
  },
  {
    path: "/404",
    component: () => import("@/views/error"),
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login"),
    meta: {
      title: "登陆页面"
    },
    hidden: true
  },
  {
    path: "/producer",
    name: "producerLogin",
    component: () => import("@/views/producerLogin"),
    meta: {
      title: "登陆页面"
    },
    hidden: true
  },
  {
    path: "/order",
    name: "Order",
    redirect: "/order/order-statistics",
    component: Layout,
    meta: {
      title: "订餐管理",
      icon: "el-icon-document"
    },
    children: [
      {
        path: "order-statistics",
        name: "Order-statistics",
        component: () => import("@/views/orderManage/Statistics"),
        meta: {
          title: "订餐统计"
        }
      },
      {
        path: "order-details",
        name: "Order-details",
        component: () => import("@/views/orderManage/Details"),
        meta: {
          title: "订餐明细"
        }
      }
    ]
  },
  {
    path: "/settlement",
    name: "Settlement",
    redirect: "/settlement/details",
    component: Layout,
    meta: {
      title: "结算管理",
      icon: "el-icon-money"
    },
    children: [
      {
        path: "statistics",
        name: "Settlement-statistics",
        component: () => import("@/views/settlement/Statistics"),
        meta: {
          title: "消费统计"
        }
      },
      {
        path: "details",
        name: "Settlement-details",
        component: () => import("@/views/settlement/Details"),
        meta: {
          title: "消费明细"
        }
      }
    ]
  }
];
export const producerRoutes = [
  {
    path: "/canteen",
    name: "Canteen",
    redirect: "/canteen/manage",
    component: Layout,
    meta: {
      title: "小卖部管理",
      icon: "el-icon-coffee"
    },
    children: [
      {
        path: "manage",
        name: "Canteen-manage",
        component: () => import("@/views/canteen/Manage"),
        meta: {
          title: "商品管理(供)"
        }
      },
      {
        path: "statistics-producer",
        name: "Canteen-statistics-producer",
        component: () => import("@/views/canteen/StatisticsProducer"),
        meta: {
          title: "消费订单汇总查询(供)"
        }
      },
      {
        path: "order-detail-producer",
        name: "Canteen-order-producer",
        component: () => import("@/views/canteen/OrderDetailProducer"),
        meta: {
          title: "订单明细查询(供)"
        }
      },
      {
        path: "invoicing-report-producer",
        name: "Canteen-invocing-report-producer",
        component: () => import("@/views/canteen/InvoicingReportProducer"),
        meta: {
          title: "进销统计报表(供)"
        }
      }
    ]
  }
];
export const asyncRoutes = [
  {
    path: "/takeOut",
    redirect: "/takeOut/index",
    name: "TakeOut",
    component: Layout,
    children: [
      {
        path: "index",
        name: "TakeOut-index",
        component: () => import("@/views/takeout"),
        meta: {
          title: "外卖管理",
          icon: "el-icon-bicycle"
        }
      }
    ]
  },
  {
    path: "/recharge",
    name: "Recharge",
    redirect: "/recharge/cash",
    meta: {
      title: "充值管理",
      icon: "el-icon-bank-card"
    },
    component: Layout,
    children: [
      {
        path: "cash",
        name: "Recharge-cash",
        component: () => import("@/views/recharge/cash"),
        meta: {
          title: "现金充值"
        }
      },
      {
        path: "record",
        name: "Recharge-record",
        component: () => import("@/views/recharge/record"),
        meta: {
          title: "充值记录明细"
        }
      },
      {
        path: "card-balance",
        name: "Recharge-card-balance",
        component: () => import("@/views/recharge/cardBalance"),
        meta: {
          title: "饭卡余额查询"
        }
      }
    ]
  },
  {
    path: "/cuisine",
    name: "Cuisine",
    redirect: "/cuisine/settings",
    meta: {
      title: "菜品管理",
      icon: "el-icon-food"
    },
    component: Layout,
    children: [
      {
        path: "settings",
        name: "Cuisine-settings",
        component: () => import("@/views/cuisine/Settings"),
        meta: {
          title: "菜单设置"
        }
      },
      {
        path: "manage",
        name: "Cuisine-manage",
        component: () => import("@/views/cuisine/Manage"),
        meta: {
          title: "菜品管理"
        }
      },
      {
        path: "withoutManage",
        name: "Without-cuisine-manage",
        component: () => import("@/views/cuisine/ManageWithout"),
        meta: {
          title: "菜品管理(无选菜)"
        }
      }
    ]
  },
  {
    path: "/canteen",
    name: "Canteen",
    redirect: "/canteen/manage",
    component: Layout,
    meta: {
      title: "小卖部管理",
      icon: "el-icon-coffee"
    },
    children: [
      {
        path: "good-search",
        name: "Canteen-search",
        component: () => import("@/views/canteen/GoodSearch"),
        meta: {
          title: "商品查询(管)"
        }
      },
      {
        path: "order-detail-manager",
        name: "Canteen-order-manager",
        component: () => import("@/views/canteen/OrderDetailManager"),
        meta: {
          title: "订单明细查询(管)"
        }
      },
      {
        path: "statistics-manager",
        name: "Canteen-statistics-manager",
        component: () => import("@/views/canteen/StatisticsManager"),
        meta: {
          title: "消费订单汇总查询(管)"
        }
      },
      {
        path: "invoicing-report-manager",
        name: "Canteen-invocing-report-manager",
        component: () => import("@/views/canteen/InvoicingReportManager"),
        meta: {
          title: "进销统计报表(管)"
        }
      }
      // {
      //   path: "manage",
      //   name: "Canteen-manage",
      //   component: () => import("@/views/canteen/Manage"),
      //   meta: {
      //     title: "商品管理(供)"
      //   }
      // },
      // {
      //   path: "statistics-producer",
      //   name: "Canteen-statistics-producer",
      //   component: () => import("@/views/canteen/StatisticsProducer"),
      //   meta: {
      //     title: "消费订单汇总查询(供)"
      //   }
      // },
      // {
      //   path: "order-detail-producer",
      //   name: "Canteen-order-producer",
      //   component: () => import("@/views/canteen/OrderDetailProducer"),
      //   meta: {
      //     title: "订单明细查询(供)"
      //   }
      // },
      // {
      //   path: "invoicing-report-producer",
      //   name: "Canteen-invocing-report-producer",
      //   component: () => import("@/views/canteen/InvoicingReportProducer"),
      //   meta: {
      //     title: "进销统计报表(供)"
      //   }
      // }
    ]
  },
  {
    path: "/material",
    name: "Material",
    redirect: "/material/details",
    meta: {
      title: "材料管理",
      icon: "el-icon-goods"
    },
    component: Layout,
    children: [
      {
        path: "detail",
        name: "Matertial-detail",
        component: () => import("@/views/material/Details"),
        meta: {
          title: "菜品材料明细"
        }
      },
      {
        path: "storage",
        name: "Material-storage",
        component: () => import("@/views/material/Storage"),
        meta: {
          title: "入库材料管理"
        }
      },
      {
        path: "order-material",
        name: "Material-Order",
        component: () => import("@/views/material/OrderMaterial"),
        meta: {
          title: "材料下单报表"
        }
      },
      {
        path: "price-details",
        name: "Material-price-details",
        component: () => import("@/views/material/PriceDetails"),
        meta: {
          title: "材料价格明细"
        }
      }
    ]
  },
  {
    path: "/settings",
    name: "Settings",
    redirect: "/settings/supplement",
    meta: {
      title: "设置",
      icon: "el-icon-setting"
    },
    component: Layout,
    children: [
      {
        path: "supplement",
        name: "Settings-supplement",
        component: () => import("@/views/settings/Supplement"),
        meta: {
          title: "补录管理"
        }
      },
      {
        path: "department",
        name: "Settings-department",
        component: () => import("@/views/settings/Department"),
        meta: {
          title: "部门人员设置"
        }
      },
      {
        path: "consumption-strategy",
        name: "Settings-consumption-strategy",
        component: () => import("@/views/settings/ConsumptionStrategy"),
        meta: {
          title: "消费策略设置"
        }
      },
      {
        path: "role",
        name: "Settings-role",
        component: () => import("@/views/settings/Role"),
        meta: {
          title: "角色设置"
        }
      },

      {
        path: "password",
        name: "Settings-password",
        component: () => import("@/views/settings/Password"),
        meta: {
          title: "密码设置"
        }
      },
      {
        path: "operation",
        name: "Settings-operation-journal",
        component: () => import("@/views/settings/OperationJournal"),
        meta: {
          title: "操作日志查询"
        }
      }
    ]
  },
  {
    path: "/cofigure",
    name: "Configure",
    component: Layout,
    meta: {
      title: "配置",
      icon: "el-icon-office-building"
    },
    children: [
      {
        path: "details",
        name: "Configuring-details",
        meta: {
          title: "企业明细"
        },
        component: () => import("@/views/configuring/EnterpriseDetails")
      },
      {
        path: "manage",
        name: "Configuring-manage",
        meta: {
          title: "企业管理"
        },
        component: () => import("@/views/configuring/EnterpriseManage")
      },
      {
        path: "modules",
        name: "Configuring-modules",
        meta: {
          title: "模块管理"
        },
        component: () => import("@/views/configuring/Modules")
      },
      {
        path: "modules-setting",
        name: "Configuring-modules-setting",
        meta: {
          title: "模块设置"
        },
        component: () => import("@/views/configuring/ModuleManage")
      }
    ]
  },
  {
    path: "/canteenSetting",
    name: "CanteenSetting",
    redirect: "/canteenSetting/wechat",
    component: Layout,
    meta: {
      title: "小卖部设置",
      icon: "el-icon-coffee"
    },
    children: [
      {
        path: "wechat",
        name: "CanteenSetting-wechat",
        component: () => import("@/views/canteenSetting/Wechat"),
        meta: {
          title: "微信端设置"
        }
      },
      {
        path: "supplier",
        name: "CanteenSetting-supplier",
        component: () => import("@/views/canteenSetting/SupplierManagement"),
        meta: {
          title: "供应商管理"
        }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () => {
  return new Router({
    routes: currencyRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 };
    }
  });
};

const router = createRouter();
// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = createRouter();
  router.matcher = reset.matcher;
}
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title);

  if (to.path === "/login" || to.path === "/producer") {
    next();
  } else {
    // let res = await store.dispatch('user/_getUserModules')
    if (store.getters.token) {
      let hasRoles = store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else if (localStorage.isProducer) {
        const { roles } = await store.dispatch("user/_getUserModules");
        const addRoutes = await store.dispatch(
          "permission/getAsyncRoutes",
          roles
        );
        router.addRoutes(addRoutes);
        next({ ...to, replace: true });
      } else {
        try {
          const { roles } = await store.dispatch("user/_getUserModules");
          const addRoutes = await store.dispatch(
            "permission/getAsyncRoutes",
            roles
          );
          router.addRoutes(addRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
});

export default router;
