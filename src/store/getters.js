const getters = {
  token: state => state.user.token,
  userName: state => state.user.userName,
  roles: state => state.user.roles,
  role: state => state.user.role,
  grade: state => state.user.grade,
  introduce: state => state.user.introduce,
  isProducer: state => state.user.isProducer,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  opened: state => {
    if (state.app.opened === "false") {
      return false;
    } else if (state.app.opened === "true") {
      return true;
    }
  },
  msgIsShow: state => state.app.msgIsShow,
  showDriver: state => state.app.showDriver
};
export default getters;
