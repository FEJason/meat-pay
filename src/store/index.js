import Vue from 'vue';
import Vuex from 'vuex';
import { getUserInfo, getSecurity, getCertification, getAllNotRead } from '@/api/user'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 登录态
        isLogin: localStorage.token || false,
        // 当前选中的导航
        activeNav: '',
        // 语言
        lang: localStorage.LANGUAGE || 'zh-CN',
        // 头部背景色 - 首页透明、固定定位
        headerStyle: '',
        member: null,
        exchangeSkin:'night',
        loginTimes: null,
        // 汇率
        rate: 6.3,
        // 未读消息
        notRead: Number(localStorage.notRead) || 0,
        // 用户信息
        userInfo: (localStorage.userInfo && JSON.parse(localStorage.userInfo)) || {},
        // 安全信息
        securityInfo: (localStorage.securityInfo && JSON.parse(localStorage.securityInfo)) || {},
        // 实名信息
        certificationInfo: (localStorage.certificationInfo && JSON.parse(localStorage.certificationInfo)) || null,
        // 隐藏资产
        hideBalance: (localStorage.hideBalance && JSON.parse(localStorage.hideBalance)) || false,
    },
    mutations: {
        SETISHIDDENAMOUNT(state, val) {
            state.hideBalance = val
            localStorage.hideBalance = val
        },
        SET_HADERSTYLE(state, val) {
            state.headerStyle = val
        },
        SET_ISLOGIN(state, val) {
            state.isLogin = val
            if (!val) {
                delete localStorage.token
            } else {
                localStorage.token = val
            }
        },
        SET_ATCIVENAV(state, val) {
            state.activeNav = val
        },
        navigate(state, nav) {
            state.activeNav = nav;
        },
        setMember(state, member) {
            state.member = member;
            localStorage.setItem('MEMBER', JSON.stringify(member));
        },
        recoveryMember(state) {
            state.member = JSON.parse(localStorage.getItem('MEMBER'));
        },
        setlang(state, lang) {
            state.lang = lang;
            localStorage.setItem('LANGUAGE', lang);
        },
        initLang(state) {
            if (localStorage.getItem('LANGUAGE') == null) {
                state.lang = "en_US";
            } else {
                state.lang = JSON.parse(localStorage.getItem('LANGUAGE'));
            }
        },
        initLoginTimes(state){
            if(localStorage.getItem("LOGINTIMES") == null){
                state.loginTimes = 0;
            }else{
                state.loginTimes = JSON.parse(localStorage.getItem('LOGINTIMES'));
            }
        },
        setLoginTimes(state, times){
            state.loginTimes = times;
            localStorage.setItem('LOGINTIMES', JSON.stringify(times));
        },
        setSkin(state,skin){
            state.exchangeSkin=skin;
        },
        SETUSERINFO(state, val) {
            state.userInfo = val
            localStorage.userInfo = JSON.stringify(val)
        },
        SETSECURITYINFO(state, val) {
            state.securityInfo = val
            localStorage.securityInfo = JSON.stringify(val)
        },
        SETCERTIFICATION(state, val) {
            state.certificationInfo = val
            localStorage.certificationInfo = JSON.stringify(val)
        },
        SETOTREAD(state, val) {
            state.notRead = val
            localStorage.notRead = JSON.stringify(val)
        }
    },
    getters: {
        member(state) {
            return state.member;
        },
        isLogin(state) {
            return state.member != null;
        },
        lang(state) {
            return state.lang;
        },
        loginTimes(state) {
            return state.loginTimes;
        }
    },
    actions: {
        /* 获取用户信息 */
        getUserInfo({ commit }) {
            getUserInfo().then(res => {
                commit('SETUSERINFO', res)
            })
        },
        /* 查询用户实名认证 */
        getCertification({ commit }) {
            return new Promise((resolve, reject) => {
                getCertification()
                    .then(res => {
                        if (res) {
                            commit('SETCERTIFICATION', res)
                        } else {
                            commit('SETCERTIFICATION', '')
                        }
                        resolve()
                    })
                    .catch(() => {
                        reject()
                    })
            })
        },
        /* 查询用户安全认证 */
        getSecurity({ commit }) {
            return new Promise((resolve, reject) => {
                getSecurity()
                    .then((res) => {
                        commit('SETSECURITYINFO', res)
                        resolve()
                    })
                    .catch(() => {
                        reject()
                    })
            })
        },
        /* 消息未读数量 */
        getAllNotRead({ commit }) {
            getAllNotRead().then(res => {
                commit('SETOTREAD', Number(res))
            })
        },
    }
});
