import LoginView from "./views/login.js";
import ForumView from "./views/forum.js";
import RegistrationView from "./views/registration.js";

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
      if (route.protected && !this.isAuthenticated()) {
        window.location.hash = "/";
        document.getElementById("app").innerHTML = await LoginView();
      } else {
        document.getElementById("app").innerHTML = await route.view();
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
  { path: "/register", view: RegistrationView },
  { path: "*", view: () => "<h1>404 Not Found</h1>" },
];

export default new Router(routes);
