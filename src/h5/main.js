import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

import vueResource from 'vue-resource';
import VueI18n from 'vue-i18n';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/assets/icons/iconfont.css';



import globalFn from '@/util/index' // 自定义全局方法

Vue.config.productionTip = false

Vue.use(ViewUI, {
	size: 'default ',
});
Vue.use(vueResource);
Vue.use(VueI18n);

Vue.use(globalFn)

Vue.prototype.$Message.config({
	duration: 4
})
Vue.prototype.$Notice.config({
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
	locale: 'zh',
	messages: {
		'zh-CN': require('@/assets/lang/cn.js'), // 简体
		'en': require('@/assets/lang/en.js'), // 英文
		'zh': require('@/assets/lang/hk.js'), // 繁体
		'ja_JP': require('@/assets/lang/jp.js'),
		'ko_KR': require('@/assets/lang/ko.js'),
		'de_DE': require('@/assets/lang/de.js'),
		'fr_FR': require('@/assets/lang/fr.js'),
		'it_IT': require('@/assets/lang/it.js'),
		'es_ES': require('@/assets/lang/es.js'),
	},
	silentTranslationWarn: true
});


Vue.config.productionTip = false;


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

new Vue({
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')

