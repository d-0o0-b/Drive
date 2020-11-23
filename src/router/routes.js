export const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        name: 'Home',
        path: '/home',
        component: () => import('../views/Home.vue')
    },
    {
        name: 'OrderTest',
        path: '/orderTest',
        component: () => import('../views/OrderTest.vue')
    },
    {
        name: 'Mock',
        path: '/mock',
        component: () => import('../views/Mock.vue'),
        redirect: '/mock/mockTestBefore',
        children: [
            {
                name: 'MockTestBefore',
                path: 'mockTestBefore',
                component: () => import('../views/Mock/MockTestBefore.vue')
            },
            {
                name: 'MockTest',
                path: 'mockTest',
                component: () => import('../views/Mock/MockTest.vue')
            },
        ]
    },
    {
        name: 'Result',
        path: '/result',
        component: () => import('../views/Result.vue')
    },
    {
        name: 'Like',
        path: '/like',
        component: () => import('../views/Like.vue')
    },
    {
        name: 'Mistake',
        path: '/mistake',
        component: () => import('../views/Mistake.vue')
    },
]