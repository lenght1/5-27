// 1 获取节点
const ulLisObj = document.querySelectorAll('.t-img li');
const olLisObj = document.querySelectorAll('.sy li');
const prev = document.querySelector('.arrow-l');
const next = document.querySelector('.arrow-r');

// 2 设置变量
let index = 0; // 要出来的图片索引
let lastIndex = 0; // 要进去的图片缩影
let times;  // 定时器返回值


// 3点击ol 中的li,实现图片切换
olLisObj.forEach((li, key) => {
    // console.log(li);
    // 3-1 给li绑定点击事件
    li.onclick = function () {
        // console.log(this);
        // 将当前index值给lastIndex
        // 将当前li对象的key赋值给index
        lastIndex = index;
        index = key;
        change();

    }

});

// 4 点击左边按钮,上一张上一张  index值为--
prev.onclick = function () {
    // 4-1 将index的值给lastIndex
    lastIndex = index;
    index--;
    // console.log(index);
    // 当index值为0,则赋值最大索引
    if (index < 0) {
        index = olLisObj.length - 1;
    }
    change();
}
// 5 右边按钮,下一张,下一章  index++
// obj.say =function(){}
next.onclick = function () {
    lastIndex = index;
    index++;
    if (index > olLisObj.length - 1) {
        index = 0;
    }
    change();
}

//  6 轮播的实现
function autoPaly() {
    times = setInterval(() => {
        next.onclick();
    }, 1000)


}
autoPaly();
// 给div1 设置移入和移除事件
next.parentNode.onmouseover = function () {
    clearInterval(times)
}

next.parentNode.onmouseout = function () {
    autoPaly();
}

// 实现图片切换,设置和取消ac类
function change() {
    // console.log(lastIndex, index);
    // 取消ol和ul中li有ac类的
    olLisObj[lastIndex].className = ' ';
    ulLisObj[lastIndex].className = ' ';

    // 设置当前选中的图片和序列号
    olLisObj[index].className = 'ac';
    ulLisObj[index].className = 'ac';
}



//倒计时
/*****获取当前时分秒****/
function countTime() {  
    //获取当前时间  
    var date = new Date();  
    var now = date.getTime();  
    
   
    
    //定义变量 d,h,m,s保存倒计时的时间  
    var c,h,m,s,hour;  
   
        h = + date.getHours();  
        // console.log(h);
        m =59- date.getMinutes();  
        // console.log(m);
        s =60- date.getSeconds(); 
        // console.log(s);                    
     if(h%2==0){
        c=h;
        hour=1;
     }
     else{
        c=h-1;
        hour=0;
     }
    //将倒计时赋值到DOM中  
    document.querySelector(".changci").innerHTML = c;  
    document.querySelector(".hour").innerHTML = hour+"时";  
    document.querySelector(".minute").innerHTML = m+"分";  
    document.querySelector(".second").innerHTML = s+"秒";  
    //递归每秒调用countTime方法，显示动态时间效果  
    setTimeout(countTime,1000);  

} 
countTime();
