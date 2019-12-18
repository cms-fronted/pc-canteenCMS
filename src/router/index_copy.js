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
    path: "/login",
    name: "Login",
    componet: () => import("@/views/login"),
    meta: { title: "登录页" },
    hidden: true
  },
  {
    path: "/404",
    name: "404",
    componet: () => import("@/views/error"),
    hidden: true
  },
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home"),
        meta: { title: "首页", icon: "el-icon-s-data" }
      }
    ]
  },
  // {
  //   path: "*",
  //   name: "*404",
  //   redirect: "/404",
  //   hidden: true
  // }
];
export const asyncRoutes = [
  {
    path: "/order",
    name: "Order",
    component: Layout,
    redirect: "/order/order-statistics",
    meta: { title: "订餐管理", icon: "el-icon-document" },
    children: [
      {
        path: "order-statistics",
        name: "Order-statistics",
        component: () => import("@/views/orderManage/Statistics"),
        meta: { title: "订餐统计" }
      },
      {
        path: "order-details",
        name: "Order-details",
        component: () => import("@/views/orderManage/Details"),
        meta: { title: "订餐明细" }
      }
    ]
  },
  {
    path: "/settlement",
    name: "Settlement",
    component: Layout,
    redirect: "/settlement/settlement-statistics",
    meta: { title: "结算管理", icon: "el-icon-money" },
    children: [
      {
        path: "settlement-statistics",
        name: "Settlement-statistics",
        component: () => import("@/views/settlement/Statistics"),
        meta: { title: "结算统计" }
      },
      {
        path: "settlement-details",
        name: "Settlement-details",
        component: () => import("@/views/settlement/Details"),
        meta: { title: "结算明细" }
      }
    ]
  },
  {
    path: "takeaway",
    name: "Takeaway",
    component: Layout,
    redirect: "/takeaway/index",
    children: [
      {
        path: "index",
        name: "Take-index",
        component: () => import("@/views/takeout"),
        meta: { title: "外卖管理", icon: "el-icon-bicycle" }
      }
    ]
  },
  {
    path: "recharge",
    name: "Recharge",
    component: Layout,
    redirect: "/recharge/cash",
    meta: { title: "充值管理", icon: "el-icon-bank-card" },
    children: [
      {
        path: "cash",
        name: "Racharge-cash",
        component: () => import("@/views/recharge/cash"),
        meta: { title: "现金充值" }
      },
      {
        path: "record",
        name: "Recharge-record",
        component: () => import("@/views/recharge/record"),
        meta: { title: "充值记录明细" }
      },
      {
        path: "card-balance",
        name: "Recharge-card-balance",
        component: () => import("@/views/recharge/cardBalance"),
        meta: { title: "饭卡余额查询" }
      }
    ]
  },
  {
    path: "cuisine",
    name: "Cuisine",
    redirect: "/cuisine/setting",
    component: Layout,
    meta: { title: "菜品管理", icon: "el-icon-food" },
    children: [
      {
        path: "setting",
        name: "Cuisine-setting",
        component: () => import("@/views/cuisine/Settings"),
        meta: { title: "菜单设置" }
      },
      {
        path: "selected-manage",
        name: "Cuisine-selected-manage",
        component: () => import("@/views/cuisine/Manage"),
        meta: { title: "菜品管理" }
      },
      {
        path: "without-selected",
        name: "Cuisine-without-selected",
        component: () => import("@/views/cuisine/ManageWithout"),
        meta: { title: "菜品管理(无选菜)" }
      }
    ]
  },
  {
    path: "shop",
    name: "Shop",
    redirect: "/shop/goods-search-manager",
    component: Layout,
    meta: { title: "小卖部管理", icon: "el-icon-coffee" },
    children: [
      {
        path: "goods-search-manager",
        name: "Shop-goods-search-manager",
        component: () => import("@/views/canteen/GoodSearch"),
        meta: { title: "商品查询" }
      },
      {
        path: "order-detail-manager",
        name: "Shop-order-detail-manager",
        component: () => import("@/views/canteen/OrderDetailManager"),
        meta: { title: "订单明细查询" }
      },
      {
        path: "statistics-manager",
        name: "Shop-statistics-manager",
        component: () => import("@/views/canteen/StatisticsManager"),
        meta: { title: "消费订单汇总" }
      },
      {
        path: "invocing-report-M",
        name: "Shop-invocing-report-manager",
        component: () => import("@/views/canteen/InvoicingReportManager"),
        meta: { title: "进销统计报表" }
      }
    ]
  },
  {
    path: "material",
    name: "Material",
    redirect: "/material/storage",
    component: Layout,
    meta: { title: "材料管理", icon: "el-icon-goods" },
    children: [
      {
        path: "storage",
        name: "Material-storage",
        component: () => import("@/views/material/Storage"),
        meta: { title: "入库材料管理" }
      },
      {
        path: "report",
        name: "Material-report",
        component: () => import("@/views/material/OrderMaterial"),
        meta: { title: "材料下单报表" }
      },
      {
        path: "price-detail",
        name: "Material-price-details",
        component: () => import("@/views/material/PriceDetails"),
        meta: { title: "材料价格明细" }
      }
    ]
  },
  {
    path: "settings",
    name: "Settings",
    redirect: "/settings/supplement",
    component: Layout,
    meta: { title: "设置", icon: "el-icon-setting" },
    children: [
      {
        path: "supplement",
        name: "Settings-supplement",
        component: () => import("@/views/settings/Supplement"),
        meta: { title: "补录管理" }
      },
      {
        path: "department",
        name: "Settings-department",
        component: () => import("@/views/settings/Department"),
        meta: { title: "部门人员设置" }
      },
      {
        path: "consumption-strategy",
        name: "Settings-consumption-strategy",
        component: () => import("@/views/settings/ConsumptionStrategy"),
        meta: { title: "消费策略设置" }
      },
      {
        path: "role",
        name: "Settings-role",
        component: () => import("@/views/settings/Role"),
        meta: { title: "角色设置" }
      },
      {
        path: "QRcode",
        name: "Settings-QRcode",
        component: () => import("@/views/settings/QRcode"),
        meta: { title: "二维码设置" }
      },
      {
        path: "password",
        name: "Settings-password",
        component: () => import("@/views/settings/Password"),
        meta: { title: "密码设置" }
      },
      {
        path: "operation",
        name: "Settings-operation-journal",
        component: () => import("@/views/settings/OperationJournal"),
        meta: { title: "操作日志查询" }
      }
    ]
  },
  {
    path: "/cofigure",
    name: "Configure",
    component: Layout,
    meta: { title: "配置", icon: "el-icon-office-building" },
    children: [
      {
        path: "details",
        name: "Configuring-details",
        meta: { title: "企业明细" },
        component: () => import("@/views/configuring/EnterpriseDetails")
      },
      {
        path: "manage",
        name: "Configuring-manage",
        meta: { title: "企业管理" },
        component: () => import("@/views/configuring/EnterpriseManage")
      },
      {
        path: "modules",
        name: "Configuring-modules",
        meta: { title: "模块管理" },
        component: () => import("@/views/configuring/Modules")
      }
    ]
  },
  {
    path: "/shopSetting",
    name: "shopSetting",
    redirect: "/canteenSetting/wechat",
    component: Layout,
    meta: { title: "小卖部设置", icon: "el-icon-coffee" },
    children: [
      {
        path: "wechat",
        name: "ShopSetting-wechat",
        component: () => import("@/views/canteenSetting/Wechat"),
        meta: { title: "微信端设置" }
      },
      {
        path: "supplier",
        name: "ShopSetting-supplier",
        component: () => import("@/views/canteenSetting/SupplierManagement"),
        meta: { title: "供应商管理" }
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

const creatRouter = () => {
  return new Router({
    routes: currencyRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 };
    }
  });
};
const router = creatRouter()
// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = creatRouter();
  router.matcher = reset.matcher;
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title);
  if (to.path === "/login") {
    next();
  } else {
    if (store.getters.token) {
      const hasRoles = store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const  {roles}  = await store.dispatch("user/_getUserModules");
          const addRoutes = await store.dispatch(
            "permission/getAsyncRoutes",
            roles
          );
          router.addRoutes(addRoutes);
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (error) {
          Message.error(error);
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
