/**
 *
 *
 * 
 */
var __domain="http://127.0.0.1:4040";

//配置
var fyg_conf={
	domain:__domain,
	widget_dir:"widget/",
	page_dir:"page/",
	mod_paths:{
		Vue:"/static/js/lib/vue.js"
	},
	page_requires:[//每个页面需要依赖的js css
		"static/js/lib/mod.js",
		"static/js/lib/vue.js",
		"static/css/base/base.scss",
		"static/css/project/common.scss",
	]
};

fis.hook("commonjs",{
	baseUrl:__domain,
	paths:fyg_conf.mod_paths
});

//page 添加依赖
fis.match("page/**/*.html",{
	requires:fyg_conf.page_requires
});
//设置文件server 地址
fis.match("*",{
	domain:__domain
});

//文件合并
fis.match("::package",{
	packager:fis.plugin("map",{
	})
});

fis.set("fyg_conf",fyg_conf);
