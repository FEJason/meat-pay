import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vueResource from 'vue-resource';
import VueI18n from 'vue-i18n';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/icons/iconfont.css';
import 'vant/lib/index.css';
import Clipboard from 'v-clipboard'

import globalFn from '@/util/index' // 自定义全局方法

import { Popup } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Button } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import { Sidebar, SidebarItem } from 'vant';

Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Popup);

var moment = require('moment');
var momentTimezone = require('moment-timezone');

Vue.config.productionTip = false


Vue.use(ViewUI, {
	// size: 'default',
});
Vue.use(Clipboard)
Vue.use(vueResource);
Vue.use(VueI18n);

Vue.use(globalFn)

// Vue.prototype.rootHost = "http://www.bizzans.com"; //BZEEX
// Vue.prototype.host = "https://api.bizzans.com"; //asdfl234.xyz
// Vue.prototype.rootHost = "";
Vue.prototype.host = "";

// // Vue.prototype.api = Api;
// Vue.http.options.credentials = true;
// Vue.http.options.emulateJSON = true;
// Vue.http.options.headers = {
// 	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
// 	'Content-Type': 'application/json;charset=utf-8'
// };

// Message 全局配置
Vue.prototype.$Message.config({
	// 自动关闭的延时，单位秒
	duration: 4
})
Vue.prototype.$Notice.config({
	// 距离顶端的距离，单位像素
	top: 70
})
ViewUI.LoadingBar.config({
	color: '#2d8cf0',
	failedColor: '#2d8cf0',
	height: 2
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
	document.title = to.meta.title
	ViewUI.LoadingBar.start();
	next();
});

router.afterEach((to, from) => {
	window.scrollTo(0, 0);
	ViewUI.LoadingBar.finish();
});

const i18n = new VueI18n({
	locale: 'zh-CN',
	messages: {
		'zh-CN': require('./assets/lang/cn.js'), // 简体
		'en': require('./assets/lang/en.js'), // 英文
		'zh': require('./assets/lang/hk.js'), // 繁体

		'ja_JP': require('./assets/lang/jp.js'),
		'ko_KR': require('./assets/lang/ko.js'),
		'de_DE': require('./assets/lang/de.js'),
		'fr_FR': require('./assets/lang/fr.js'),
		'it_IT': require('./assets/lang/it.js'),
		'es_ES': require('./assets/lang/es.js'),
	},
	silentTranslationWarn: true
});
// vue-resource 拦截器
Vue.http.interceptors.push((request, next) => {
	//登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
	request.headers.set('x-auth-token', localStorage.getItem('TOKEN'));
	let lang = localStorage.getItem('LANGUAGE');
	if (lang != null) {
		lang = lang.substr(1);
		lang = lang.substr(0, lang.length - 1);
	}
	request.headers.set('lang', lang);

	next((response) => {
		//登录极验证时需获取后台返回的TOKEN值
		var xAuthToken = response.headers.get('x-auth-token');
		if (xAuthToken != null && xAuthToken != '') {
			localStorage.setItem('TOKEN', xAuthToken);
		}

		if (response.data.code == '4000' || response.data.code == '3000') {
			store.commit('setMember', null);
			// router.push('/login');
			return false;
		}
		return response;
	});
});

Vue.config.productionTip = false;

Vue.filter('timeFormat', function (tick) {
	return moment(tick).format("HH:mm:ss");
});

Vue.filter('dateFormat', function (tick) {
	return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});

Vue.filter('toFixed', function (number, scale) {
	return new Number(number).toFixed(scale);
});

// 转成百分比
Vue.filter('toPercent', function (point) {
	var str = Number(point * 100).toFixed(1);
	str += "%";
	return str;
});

// 截取小数位
function toFloor(number, scale = 8) {
	if (new Number(number) == 0) {
		return 0;
	}
	var __str = number + "";
	if (__str.indexOf('e') > -1 || __str.indexOf('E') > -1) {
		var __num = new Number(number).toFixed(scale + 1),
			__str = __num + "";
		return __str.substring(0, __str.length - 1);
	} else if (__str.indexOf(".") > -1) {
		if (scale == 0) {
			return __str.substring(0, __str.indexOf("."));
		}
		return __str.substring(0, __str.indexOf(".") + scale + 1);
	} else {
		return __str;
	}
}
Vue.filter('toFloor', (number, scale) => {
	return toFloor(number, scale);
});
Vue.prototype.toFloor = toFloor;

Vue.prototype.getTimezone4K = function () {
	var curlang = this.$store.getters.lang;
	if (curlang == "en") {
		return "America/Los_Angeles";
	}
	if (curlang == "ja_JP") {
		return "Asia/Tokyo";
	}
	if (curlang == "ko_KR") {
		return "Asia/Seoul";
	}
	if (curlang == "de_DE") {
		return "Europe/Berlin";
	}
	if (curlang == "fr_FR") {
		return "Europe/Paris";
	}
	if (curlang == "it_IT") {
		return "Europe/Rome";
	}
	if (curlang == "es_ES") {
		return "Europe/Madrid";
	}
	if (curlang == "zh") {
		return "Asia/Hong_Kong";
	}
	if (curlang == "zh-CN") {
		return "Asia/Shanghai";
	}
	return curlang;
};
Vue.prototype.getLang4K = function () {
	var curlang = this.$store.getters.lang;
	if (curlang == "en") {
		return "en";
	}
	if (curlang == "ja_JP") {
		return "ja";
	}
	if (curlang == "ko_KR") {
		return "ko";
	}
	if (curlang == "de_DE") {
		return "de_DE";
	}
	if (curlang == "fr_FR") {
		return "fr";
	}
	if (curlang == "it_IT") {
		return "it";
	}
	if (curlang == "es_ES") {
		return "es";
	}
	if (curlang == "zh") {
		return "zh_TW";
	}
	if (curlang == "zh-CN") {
		return "zh";
	}
	return curlang;
};
Vue.prototype.timeFormat = function (tick) {
	return momentTimezone(tick).tz(this.getTimezone4K()).format("HH:mm:ss");
};
Vue.prototype.dateFormat = function (tick) {
	return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
};
Vue.prototype.dateFormatHM = function (tick) {
	return momentTimezone(tick).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm");
};
Vue.prototype.dateFormatFromString = function (tick) {
	var timestamp = momentTimezone(tick).tz('Asia/Shanghai').valueOf();
	return momentTimezone(timestamp).tz(this.getTimezone4K()).format("YYYY-MM-DD HH:mm:ss");
};

new Vue({
	router,
	i18n,
	store,
	render: h => h(App)
}).$mount('#app')

