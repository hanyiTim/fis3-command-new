/**
 * 项目的初始化
 * 新建 page widget 插件
 */
var path=require("path");
var fs=require("fs");
var cc_process_cwd=process.cwd();

var temp_dir = 'template/vuejs'
if(fis.util.isFile(path.join(__dirname,'temp_version.conf'))){
	temp_dir = fis.util.read(path.join(__dirname,'temp_version.conf'));
}
/**
 * process.cwd()  获取执行node 命令的目录
 */
var fyg_conf=fis.get("fyg_conf") || {};
var widget_dir=fyg_conf["widget_dir"] || "widget/";
var page_dir=fyg_conf["page_dir"] || "page/";

var ab_widget_dir=path.join(cc_process_cwd,widget_dir);
var ab_page_dir=path.join(cc_process_cwd,page_dir);
var ab_temp_dir=path.join(__dirname,temp_dir);

exports.name='new';
exports.desc='new widget or page';
exports.options={
	"-h,--help":'print this help message',
	"-w":"new vue widget,and widget name",
	"-p":"new page,and page name",
	"-i":"init project",
	"--set":"set temp version",
	"--get":"get temp version infomation",
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
	var fn_exists=function(path,errmsg,type){
		if(type){
			if(!fis.util.isDir(path)){
				fis.log.notice(errmsg);
			}
		}else{
			if(fis.util.isDir(path)){
				fis.log.notice(errmsg);
			}
		}

	};
	//读取文件
	var fn_read=function(opt){
		var tname=opt.tname || {};
		var temps={};
		for(key in tname){
			temps[key]=fis.util.read(path.join(opt.path,tname[key]));
		}
		return temps;
	};
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
	var fn_getTemps=function(pathname,compare){
		let tempdir=fs.readdirSync(pathname);
		let obj={};
		tempdir.map((item) => {
			if(item){
				let match=/^([\w\-]*?)\.([\w\-]*?)$/gi.exec(item);
				if(match[2] &&(!compare || compare(match))){
					obj[match[2]]=match[0];
				}
			}
		});
		return obj;
	}
	if(argv.h || argv.help){
		return cli.help(exports.name,exports.options);
	}
	else if(argv.set && argv.set !== true){
		if(fis.util.isDir(path.join(__dirname,'template',argv.set))){
			fis.util.write(path.join(__dirname,'temp_version.conf'),path.join('/template',argv.set),'utf-8');
			fis.log.notice(`set temp version success   ╮(╯▽╰)╭`);
		}else{
			fis.log.notice(`can't found dir : ${path.join(__dirname,'template',argv.set)}`);
			fis.log.notice(`set temp version fail  ╮(╯Д╰)╭`);
		}
	}
	else if(argv.get){
		let tempList=fs.readdirSync(path.join(__dirname,'template'));
		console.log("list:",tempList);
		tempList.map((item) => {
			if(new RegExp(item,'gi').test(temp_dir)){
				item=`> ${item}\n`;
				console.log(item);
			}
		});
	}
	else if(argv.p){
		let compare;
		if(argv.type!=="wap"){
			compare=function(match){
				if(/wap/gi.test(match[0])){
					return false;
				}else{
					return true;
				}
			}
		}
		let tempdir_obj=fn_getTemps(path.join(ab_temp_dir,"/page/"),compare);
		console.log(tempdir_obj);
		var create_page=argv.p || argv.wap;
		var temps;
		fn_exists(ab_page_dir,ab_page_dir+" is not a dir╮(╯Д╰)╭",true);
		//获取 page 内容
		temps=fn_read({
			path:path.join(ab_temp_dir,"/page/"),
			tname:tempdir_obj
		});

		//page 已存在 return false	
		fn_exists(path.join(ab_page_dir,argv.p),"page '" + create_page + "' has existed╮(╯Д╰)╭");

		fn_create({
			name:create_page,
			path:path.join(ab_page_dir,"/"+create_page+"/"),
			file:temps
		});

	}
	else if(argv.w){
		var create_widget=argv.w;
		var temps={};
		let tempdir_obj=fn_getTemps(path.join(ab_temp_dir,"/widget/"));

		fn_exists(ab_widget_dir,ab_widget_dir+" is not a dir╮(╯Д╰)╭",true);

		//获取 weidget 模板内容
		temps=fn_read({
			path:path.join(ab_temp_dir,"/widget/"),
			tname:tempdir_obj
		});

		fn_exists(path.join(ab_widget_dir,argv.w),"widget '" + create_widget + "' has existed╮(╯Д╰)╭");

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
					fs.createReadStream(pathname).pipe(fs.createWriteStream(despath));
				}
			});
		});
	}
};