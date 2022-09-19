let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
//画板控制开关
let painting = false
//第一个点坐标
let startPoint = {
    x: undefined,
    y: undefined
}
//初始化画布大小
let lastPos = {
    x: undefined,
    y: undefined
}
//截取的pic:
var picStream = []
wh()
setInterval(function () {
    if (startPoint.x > 0 & startPoint.y > 0 & lastPos != startPoint) {
        // console.log(`点坐标:${startPoint.x},${startPoint.y}`)
        lastPos = startPoint
        show()
    }
}, 1000)

function show() {
    let url = canvas.toDataURL('image/jpg')
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    picStream.push(url)
    // console.log(`a的地址:${url}`)
}

var arr = []

function getpng() {
    $('body >a:last').each(function (index, item) {
        // arr.push(bob)
        arr.push($(item).attr('href'))
    })
    // console.log(arr)
    const base64Data = $('a:last').attr('href')
    console.log(base64Data)
    $.ajax({
        url: '/base64',
        type: 'POST',
        data: {
            myPhoto: base64Data
        },
        success: function (res) {
            console.log(res)
            if (res.status == 'success') {
                alert('成功,请点击查看签名前往查看')
            }
        },
        error: function (e) {
            console.log(e)
        }
    })
}

var list = []

//捕获
function renderPng() {
    var gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: 'js/gif.worker.js'
    })
    var j = 0
    var canvas = document.createElement('canvas')
    var ctx = tCanvas.getContext('2d')
    for (var i = 1; i <= len; i++) {
        var imgImage = new Image()
        imgImage.src = img
        imgImage.onload = function (e) {
            //Canvas绘制图片
            canvas.width = width
            canvas.height = height
            console.log(width, height)
            //铺底色
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(imgImage, 0, 0, width, height)
            gif.addFrame(canvas, {
                copy: true,
                delay: 50
            })
            j++
            //图片
            if (j >= len) {
                gif.render()
            }
        }
    }
    gif.on('finished', function (blob) {
        //生成图片链接
        var url = URL.createObjectURL(blob)

    })
}

function createGif(images) {
    console.log(images)
    gifshot.createGIF({
        gifWidth: 700,
        gifHeight: 500,
        images: images,
        interval: 0.2, // 每帧捕获之间等待的时间（以秒为单位）
        numFrames: 20,
        frameDuration: 1,
        fontWeight: 'normal',
        fontSize: '16px',
        fontFamily: 'sans-serif',
        fontColor: '#ffffff',
        textAlign: 'center',
        textBaseline: 'bottom',
        sampleInterval: 10,
        numWorkers: 2
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image,
                animatedImage = document.createElement('img')
            animatedImage.src = image
            document.body.appendChild(animatedImage)
            console.log(animatedImage)
        }
    })
}

//特性检测
if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (e) {
        //[0]表示touch第一个触碰点
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        painting = true
        if (EraserEnabled) {
            ctx.clearRect(x - 20, y - 20, 40, 40)
        }
        startPoint = {
            x: x,
            y: y
        }
    }
    canvas.ontouchmove = function (e) {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        let newPoint = {
            x: x,
            y: y
        }
        if (painting) {
            if (EraserEnabled) {
                ctx.clearRect(x - 15, y - 15, 30, 30)
            } else {
                drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y)
            }
            startPoint = newPoint
        }
    }
    canvas.ontouchend = function () {
        painting = false
    }
} else {
    //非触屏设备
    //按下鼠标(mouse)
    //鼠标点击事件（onmousedown）
    canvas.onmousedown = function (e) {
        let x = e.offsetX
        let y = e.offsetY
        painting = true
        if (EraserEnabled) {
            ctx.clearRect(x - 15, y - 15, 30, 30)
        }
        startPoint = {
            x: x,
            y: y
        }
    }
    //滑动鼠标
    //鼠标滑动事件（onmousemove）
    canvas.onmousemove = function (e) {
        let x = e.offsetX
        let y = e.offsetY
        let newPoint = {
            x: x,
            y: y
        }
        if (painting) {
            if (EraserEnabled) {
                ctx.clearRect(x - 15, y - 15, 30, 30)
            } else {
                drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y)
            }
            startPoint = newPoint
        }
    }
    //松开鼠标
    //鼠标松开事件（onmouseup)
    canvas.onmouseup = function () {
        painting = false
    }
}

/*****工具函数*****/
//点与点之间连接
function drawLine(xStart, yStart, xEnd, yEnd) {
    //开始绘制路径
    ctx.beginPath()
    //线宽
    ctx.lineWidth = 2
    //起始位置
    ctx.moveTo(xStart, yStart)
    //停止位置
    ctx.lineTo(xEnd, yEnd)
    //描绘线路
    ctx.stroke()
    //结束绘制
    ctx.closePath()
}

//canvas与屏幕宽高一致
function wh() {
    let pageWidth = document.documentElement.clientWidth
    let pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
}

//控制橡皮擦开启
let EraserEnabled = false
eraser.onclick = function () {
    EraserEnabled = true
    eraser.classList.add('active')
    brush.classList.remove('active')
    canvas.classList.add('xiangpica')
}
brush.onclick = function () {
    EraserEnabled = false
    brush.classList.add('active')
    eraser.classList.remove('active')
    canvas.classList.remove('xiangpica')
}

//清屏
clear.onclick = function () {
    ctx.fillStyle = '#C5C5C5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

//保存
save.onclick = function () {
    console.log('click save')
    let url = canvas.toDataURL('image/jpg')
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.className = 'pngs'
    a.download = '签名'
    a.target = '_blank'
    a.click()
}
//密码校验:
