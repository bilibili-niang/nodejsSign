var express = require('express')
var app = express()
var bodyParser = require('body-parser')
//获取时间
var sd = require('silly-datetime');
//读取日志文件
const fs = require('fs')

const port = 80;

app.use('*', function (req, res) {
    let url = req.url;
    tolog(url)
    // res.send('你看你妈呢,嗯?你渗透你妈呢')
    res.status(201).json({
        message: '你看你妈呢,嗯?你渗透你妈呢',
        other: '鄂ICP备2021010206号'
    })
})
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

function tolog(str) {
    //向文件追加内容
    fs.appendFile("log.txt", sd.format(new Date(), 'YYYY-MM-DD HH:mm')+'\n' + str, 'utf-8', function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        console.log('写入成功!!!');
    });
}

app.listen(port, function () {
    console.log("running at " + port);
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    let strStart = "启动时间： " + time;
    tolog(strStart)
    console.log(strStart)
})
