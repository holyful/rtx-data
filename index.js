#!/usr/bin/env node
'use strict';

var sqlite = require('sqlite3').verbose();
var cli = require('cli');
var fs = require('fs');
var csv = require('csv');
var rtxPattern = process.env.HOME + '/Library/Application\ Support/RTXC/accounts/[username]/';
var rtxOrgDb = 'structInfo.db';


cli.parse({
    user: ['u', '登录RTX使用的用户名','string'],
    output: ['o','输出的文件(csv格式)','string']
});

cli.main(function(args, options) {
	
	var userName = options.user;
	var rtxOrgDbPath = rtxPattern.replace('[username]',userName) + rtxOrgDb;
	var db = new sqlite.Database(rtxOrgDbPath);
	var result = [];
	result.push({'userNick':'前缀','userName':'用户名','deptName':'部门','userMobile':'手机','userPhone':'分机'})
	
	db.each("SELECT ui.userNick as userNick, \
					ui.userName as userName, \
					di.deptName as deptName, \
					ui.userPhone as userPhone,\
					ui.userMobile as userMobile from userDept as ud \
		inner join userInfo as ui on ud.userId = ui.userId \
		inner join deptInfo as di on di.deptId= ud.deptId", function(err, row) {
	    result.push({
	    	'userNick':row.userNick,
	    	'userName':row.userName,
	    	'deptName':row.deptName,
	    	'userMobile':row.userMobile,
	    	'userPhone':row.userPhone
	    });
	},function(){
		csv.stringify(result, function(err, data){
        	fs.writeFileSync(options.output, data, {encoding:'utf8',flag:'w'});
    	});
	});
	


});