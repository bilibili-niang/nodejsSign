//接收copy文件的路由
var express = require('express')
var getcopy = express.Router()
var multiparty = require('multiparty')
const formidable = require('formidable')
const path = require('path')
//获取时间
var sd = require('silly-datetime')
const fs = require('fs')

getcopy.get('/', function (req, res) {
	res.render('index.html', {})
})

getcopy.post('/base64', function (req, res) {
	console.log('post')
	var imgData = req.body.myPhoto
	// console.log(req.body)
	console.log(imgData)
	console.log(typeof imgData)
	const path = 'sign/' + Date.now() + '.png'
	const base64 = imgData.replace(/^data:image\/\w+;base64,/, '') //去掉图片base64码前面部分data:image/png;base64
	const dataBuffer = new Buffer.from(base64, 'base64') //把base64码转成buffer对象，
	fs.writeFile(path, dataBuffer, function (err) { //用fs写入文件
		if (err) {
			console.log(err)
			console.log('保存失败!')
		} else {
			console.log('写入成功！')
			res.json({
				status: 'success',
				imgpath: path
			})
		}
	})
	
})
getcopy.get('/signs', function (req, res) {
	res.render('signs.html', {})
})
getcopy.get('/getsigns', function (req, res) {
	//获取文件夹下的所有图片
	const imgpath = path.resolve(__dirname, '../sign')
	fs.readdir(imgpath, function (err, file) {
		file.forEach(function (item, index) {
			file[index] = 'sign/' + item
		})
		console.log(file)
		res.json({
			data: file
		})
	})
})

//一键删除
getcopy.get('/delAllSigns', function (req, rse) {
	const imgpath = path.resolve(__dirname, '../sign')
	fs.readdir(imgpath, function (err, file) {
		file.forEach(function (item, index) {
			item = 'sign/' + item
			fs.unlinkSync(item)
		})
	})
})

module.exports = getcopy