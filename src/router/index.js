import { createRouter, createWebHashHistory} from "vue-router";

import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Homepage from '../components/Homepage.vue'
import Im from '../components/Im.vue'
import tt from '../components/tt.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            component: Login
        },
        { 
            path:'/Login',
            component: Login
        },
        { 
            path:'/Register',
            component: Register
        },
        { 
            path:'/Homepage',
            component: Homepage
        },
        { 
            path:'/tt',
            component: tt
        },
        { 
            path:'/Im',
            component: Im
        }
    ]
});
export default router;