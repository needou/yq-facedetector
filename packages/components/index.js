import Component from "./components";
import Util from "./util";

const allComponents={
    ...Component
}

export default {
    install(app) {
        for (const key in allComponents) {
            app.component(key, allComponents[key]);
        }
    }
}

export{Component,Util}
