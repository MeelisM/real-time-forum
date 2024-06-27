import LoginView from "./views/login.js";
import ForumView from "./views/forum.js";
import RegistrationView from "./views/registration.js";
import PostView from "./views/post.js";

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
            } else {
                document.getElementById("app").innerHTML = await route.view(this.getParams(route, path));
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
}

const routes = [
    {path: "/", view: LoginView},
    {path: "/forum", view: ForumView, protected: true},
    {path: "/register", view: RegistrationView},
    {path: "/post/:id", view: PostView, protected: true},
    {path: "*", view: () => "<h1>404 Not Found</h1>"},
];

export default new Router(routes);
