import LoginView, { mountLogin } from "./views/login.js";
import ForumView from "./views/forum.js";

class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleRouteChange();
    window.addEventListener("hashchange", this.handleRouteChange);
  }

  async handleRouteChange() {
    const path = window.location.hash.slice(1) || "/";
    const route =
        this.routes.find((r) => r.path === path) ||
        this.routes.find((r) => r.path === "*");

    if (route) {
      const app = document.getElementById("app");
      if (app) {
        if (route.protected && !this.isAuthenticated()) {
          window.location.hash = "/";
          app.innerHTML = await LoginView();
          mountLogin();
        } else {
          app.innerHTML = await route.view();
          if (path === "/") {
            mountLogin();
          }
        }
      }
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    return !!token;
  }

  navigate(path) {
    window.location.hash = path;
  }
}

const routes = [
  { path: "/", view: LoginView },
  { path: "/forum", view: ForumView, protected: true },
  { path: "*", view: () => "<h1>404 Not Found</h1>" },
];

export default new Router(routes);
