import LoginView from "./views/login.js";
import ForumView from "./views/forum.js";

export const Router = {
  routes: [
    { path: "/", view: "login" },
    { path: "/forum", view: "forum" },
  ],
  init: function () {
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleRouteChange();
    window.addEventListener("hashchange", this.handleRouteChange);
  },
  handleRouteChange: function () {
    const path = window.location.hash.slice(1) || "/";
    const route = this.routes.find((r) => r.path === path);
    if (route) {
      document.getElementById("app").innerHTML = Views[route.view]();
    }
  },
};

export const Views = {
  login: LoginView,
  forum: ForumView,
};
