/**
 * 项目的初始化
 * 新建 page widget 插件
 */
var path=require("path");
var fs=require("fs");
var cc_process_cwd=process.cwd();

/**
 * process.cwd()  获取执行node 命令的目录
 */
var fyg_conf=fis.get("fyg_conf") || {};
var widget_dir=fyg_conf["widget_dir"] || "widget/";
var page_dir=fyg_conf["page_dir"] || "page/";

var ab_widget_dir=path.join(cc_process_cwd,widget_dir);
var ab_page_dir=path.join(cc_process_cwd,page_dir);
var ab_temp_dir=path.join(__dirname,"template/");

exports.name='new';
exports.desc='new widget or page';
exports.options={
	"-h,--help":'print this help message',
	"-w":"new vue widget,and widget name",
	"-p":"new page,and page name",
	"-i":"init project",
	"--type":"page type,and normal || wap"
};
exports.run=function(argv,cli){
	//新建 page  或者 widget
	var fn_create=function(opt){
		fis.util.mkdir(opt.path);
		var files=opt.file || {};
		for(key in files){
			fs.writeFile(opt.path+opt.name+"."+key,files[key].replace(/\$name/gim,opt.name),function(err){
				if(err){
					fis.log.error(" create fail");
				}else{
					fis.log.notice(" create success");
				}
			});
		}

	};
	//判断文件或者文件夹是否存在
	/**
	 * [fn_exists 判断文件是否存在]
	 * @param  {[type]}   path     [description]
	 * @param  {[type]}   errmsg   [description]
	 * @param  {[type]}   type     [normal:false true:是否不存在，false:是否存在]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	var fn_exists=function(path,errmsg,type,callback){
		if(type){
			if(!fis.util.isDir(path)){
				if(callback){
					callback && callback.call && callback.call();
				}else{
				  fis.log.error(errmsg);
				}
			}
		}else{
			if(fis.util.isDir(path)){
				if(callback){
					callback && callback.call && callback.call();
				}else{
				  fis.log.error(errmsg);
				}
			}
		}

	};
	//读取文件
	/**
	 * [fn_read description]
	 * @param  {[type]} opt [description]
	 * {
	 *     path:  文件所在目录
	 *     tname  {
	 *         "file key":"目标文件名"
	 *     }
	 * }
	 * @return {[type]}     [description]
	 */
	var fn_read=function(opt){
		var tname=opt.tname || {};
		var temps={};
		for(key in tname){
			temps[key]=fis.util.read(path.join(opt.path,tname[key]));
		}
		return temps;
	};
	/**
	 * [fn_travel 目录结构拷贝]
	 * @param  {[type]}   dir      [目标路径]
	 * @param  {[type]}   dst      [拷贝路径]
	 * @param  {Function} callback [如果 readdirSync 获取到的 file 是文件，则执行callback 并传 拷问文件路径，已经生产路径]
	 * @return {[type]}            [description]
	 */
	var fn_travel=function(dir,dst,callback){
		fs.readdirSync(dir).forEach(function(file){
			var pathname=path.join(dir,file),
				despath=path.join(dst,file);
			if(fs.statSync(pathname).isDirectory()){
				fs.exists(despath,function(exists){
					if(!exists){
						fs.mkdirSync(despath);
					}
				});
				fn_travel(pathname,despath,callback);
			}else{
				callback(pathname,despath);
			}
		});
	};
	if(argv.h || argv.help){
		return cli.help(exports.name,exports.options);
	}
	else if(argv.p){
		var create_page=argv.p || argv.wap;
		var temps;
		fn_exists(ab_page_dir,ab_page_dir+" is not a dir",true,function(){
			fs.mkdirSync(ab_page_dir);
		});
		//获取 page 内容
		temps=fn_read({
			path:path.join(ab_temp_dir,"/page/"),
			tname:{
				html:argv.type=="wap"?"temp_wap.html":"temp.html",
				scss:"temp.scss",
				js:"temp.js"
			}
		});

		//page 已存在 return false	
		fn_exists(path.join(ab_page_dir,argv.p),"page '" + create_page + "' has existed");

		fn_create({
			name:create_page,
			path:path.join(ab_page_dir,"/"+create_page+"/"),
			file:temps
		});

	}
	else if(argv.w){
		var create_widget=argv.w;
		var temps={};

		fn_exists(ab_widget_dir,ab_widget_dir+" is not a dir",true);

		//获取 weidget 模板内容
		temps=fn_read({
			path:path.join(ab_temp_dir,"/widget/"),
			tname:{
				html:"temp.html",
				scss:"temp.scss",
				js:"temp.js"
			}
		});

		fn_exists(path.join(ab_widget_dir,argv.w),"widget '" + create + "' has existed");

		//widget 已存在 return false
		fn_create({
			name:create_widget,
			path:path.join(ab_widget_dir,"/"+create_widget+"/"),
			file:temps
		});
	}
	else if(argv.i){
		fn_travel(path.join(ab_temp_dir,"./project"),cc_process_cwd,function(pathname,despath){
			fs.exists(despath,function(exists){
				console.log(despath,exists);
				if(!exists){
					//这里之所以用 createReadStream 跟 createWriteStream 来拷贝文件
					fs.createReadStream(pathname).pipe(fs.createWriteStream(despath));
				}
			});
		});
	}
};