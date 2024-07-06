import LoginView from "./views/login.js";
import ForumView from "./views/forum.js";
import RegistrationView from "./views/registration.js";
import PostView from "./views/post.js";
import NewPostView from "./views/newPost.js";

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
    const route = this.matchRoute(path);

    if (route) {
      if (route.protected && !this.isAuthenticated()) {
        window.location.hash = "/";
        document.getElementById("app").innerHTML = await LoginView();
        this.toggleNavBar(false);
      } else {
        document.getElementById("app").innerHTML = await route.view(this.getParams(route, path));
        this.toggleNavBar(route.path !== "/" && route.path !== "/register");
      }
    }
  }

  matchRoute(path) {
    return this.routes.find((route) => {
      const routePath = route.path
        .replace(/:[^\s/]+/g, "([\\w-]+)") // Replace :id with a regex capture group
        .replace(/\//g, "\\/");
      const regex = new RegExp(`^${routePath}$`);
      return regex.test(path);
    });
  }

  getParams(route, path) {
    const values = path.match(new RegExp(route.path.replace(/:[^\s/]+/g, "([\\w-]+)").replace(/\//g, "\\/")));
    const keys = [...route.path.matchAll(/:([^\s/]+)/g)].map(result => result[1]);
    return keys.reduce((params, key, index) => {
      params[key] = values[index + 1];
      return params;
    }, {});
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    return !!token;
  }

  navigate(path) {
    window.location.hash = path;
  }

  toggleNavBar(show) {
    const navBar = document.getElementById("main-nav");
    const logoutLink = document.getElementById("logout-link");
    if (navBar) {
      navBar.style.display = show ? "block" : "none";
      if (show && this.isAuthenticated()) {
        logoutLink.style.display = "block";
        logoutLink.addEventListener("click", () => {
          localStorage.removeItem("authToken");
          this.navigate("/");
        });
      } else {
        logoutLink.style.display = "none";
      }
    }
  }
}

const routes = [
  {path: "/", view: LoginView},
  {path: "/forum", view: ForumView, protected: true},
  {path: "/register", view: RegistrationView},
  {path: "/post/:id", view: PostView, protected: true},
  {path: "/newpost", view: NewPostView, protected: true}, // Add new post route
  {path: "*", view: () => "<h1>404 Not Found</h1>"},
];

export default new Router(routes);
