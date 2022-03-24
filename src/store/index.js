import Vue from 'vue';
import Vuex from 'vuex';
import { getUserInfo, getSecurity, getCertification } from '@/api/user'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 登录态
        isLogin: localStorage.token || false,
        // 当前选中的导航
        activeNav: '',
        // 语言你
        lang: localStorage.LANGUAGE || 'zh-CN',
        // 头部背景色 - 首页透明、固定定位
        headerStyle: '',
        member: null,
        exchangeSkin:'night',
        loginTimes: null,
        // 汇率
        rate: 6.3,
        // 用户信息
        userInfo: (localStorage.userInfo && JSON.parse(localStorage.userInfo)) || {},
        // 安全信息
        securityInfo: (localStorage.securityInfo && JSON.parse(localStorage.securityInfo)) || {},
        // 实名信息
        certificationInfo: (localStorage.certificationInfo && JSON.parse(localStorage.certificationInfo)) || null,
    },
    mutations: {
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
            getCertification().then(res => {
                if (res) {
                    commit('SETCERTIFICATION', res)
                } else {
                    commit('SETCERTIFICATION', '')
                }
            })
        },
        /* 查询用户安全认证 */
        getSecurity({ commit }) {
            getSecurity().then((res) => {
                commit('SETSECURITYINFO', res)
            });
        },
    }
});
