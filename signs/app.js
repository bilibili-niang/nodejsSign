const mongoose = require('mongoose')
//负责接收copy图片的路由
const getcopyRouter = require('./router/getcopy')
//读取日志文件
const fs = require('fs')
//跨域:
const cors = require('cors')

//导入错误写入模块：
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const session = require('express-session')
const port = 80
const template = require('express-art-template')
// const template = require('art-template')
const ejs = require('ejs') //引入ejs
//获取时间
const sd = require('silly-datetime')
//tset
const url = require('url')

//允许跨域:
app.all('*', function (req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header('Access-Control-Allow-Origin', '*')
	//允许的header类型
	res.header('Access-Control-Allow-Headers', 'content-type')
	//跨域允许的请求方式
	res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
	if (req.method.toLowerCase() == 'options')
		res.send(200)  //让options尝试请求快速结束
	else
		next()
})


//解决文件过大的问题
//handle request entity too large
app.use(bodyParser.json({
	limit: '20mb'
}))
app.use(bodyParser.urlencoded({
	limit: '20mb',
	extended: true
}))

//模板引擎的选项
template.minimize = true
template.htmlMinifierOptions = {
	collapseWhitespace: true,
	minifyCSS: true,
	minifyJS: true,
	// 运行时自动合并：rules.map(rule => rule.test)
	ignoreCustomFragments: []
}

app.engine('html', template)

app.set('view options', {
	// 是否开启压缩。它会运行 htmlMinifier，将页面 HTML、CSS、CSS 进行压缩输出
	// 如果模板包含没有闭合的 HTML 标签，请不要打开 minimize，否则可能被 htmlMinifier 修复或过滤
	minimize: true,
	// bail 如果为 true，编译错误与运行时错误都会抛出异常
	bail: true,
	openTag: '}}',
	closeTag: '{{',
	compress: true,
	filename: 'err.html',
})
app.use('/node_modules/', express.static('./node_modules/'))
app.use('/source/', express.static('./source/'))
// 开放static目录
app.use('/public/', express.static('./public/'))
app.use('/public/images/usericons/', express.static('./public/images/usericons/'))
app.use('/images/', express.static('./images/'))
app.use('/static/', express.static('./static/'))
app.use('/sign/', express.static('./sign/'))
app.use('/views/', express.static('./views/'))
app.use('/robots.txt', express.static('./robots.txt/'))
app.set('views', path.join(__dirname, './views/')) //默认views目录,
app.set('view engine', 'html')

//挂载session
app.use(session({
	//resave : 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
	resave: true,
	saveUnitialized: true, //无论有没有session,都默认给你分配一把钥匙
	secret: 'kannimadesession', //在生成的session后面添加的字符串,和在md5密码后面加上一个字符串防止别人对比出来的同理
	saveUninitialized: true,
	// HTML 压缩器配置。参见 https://github.com/kangax/html-minifier
	htmlMinifierOptions: {
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
		// 运行时自动合并：rules.map(rule => rule.test)
		ignoreCustomFragments: []
	},
}))

//session跨域
app.all('*', function (req, res, next) {
	if ( ! req.get('Origin')) return next()
	// use "*" here to accept any origin
	res.set('Access-Control-Allow-Origin', req.headers.origin)
	// 这里除了req.headers.origin外还可以是:.
	// 'http://localhost:3000'
	res.set('Access-Control-Allow-Methods', 'GET')
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
	res.header('Access-Control-Allow-Credentials', 'true')
	// res.set('Access-Control-Allow-Max-Age', 3600);
	if ('OPTIONS' === req.method) return res.sendStatus(200)
	next()
})

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

app.use(getcopyRouter)
app.get('*', function (req, res) {
	res.render('404', {
		errdata: decodeURI(req.url)
	})
})

app.listen(port, function () {
	console.log('running at ' + port)
	let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
	let strStart = '启动时间： ' + time
	console.log(strStart)
})