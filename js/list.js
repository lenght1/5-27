class List {
  constructor() {
    // 给属性赋值,调用其它方法
    this.getData();
    this.binkEve();
    // 将加入购物车使用事件委托
  }

  //绑定事件的方法
  binkEve() {
    //给ul绑定点击事件，回调到事件源
    this.$('.sk_bd ul').addEventListener('click', this.checkLogin.bind(this))
  }
  // 获取数据的方法
  async getData() {
    // 等待promise 对象解包完成
    let { status, data } = await axios.get('http://localhost:8888/goods/list')

    // console.log(data, status);
    //判断返回值的状态,追加数据
    if (status != 200 && data.code != 1) throw new Error('获取数据失败...');
    // console.log(data);
    let html = '';
    data.list.forEach(goods => {
      // console.log(goods);
      html += `<li class="sk_goods" data-id="${goods.goods_id}">
        <a href="#none">
        <img src="${goods.img_big_logo}" alt="">
        </a>
        <h5 class="sk_goods_title">${goods.title}</h5>
        <p class="sk_goods_price">
          <em>¥${goods.current_price}</em> 
          <del>￥${goods.price}</del></p>
        <div class="sk_goods_progress">
            已售
            <i>${goods.sale_type}</i>
            <div class="bar">
                <div class="bar_in"></div>
            </div>
            剩余
            <em>${goods.goods_number}</em>件
        </div>
        <a href="#none" class="sk_goods_buy">立即抢购</a>
    </li>`;
      //console.log(html);
      //追加到ul中
      this.$('.sk_bd ul').innerHTML = html;
    });





  }
//
  // 加入购物车的方法
  checkLogin(eve) {
    // console.log(this);
    // console.log(eve.target);
    // 判断用户是否登录,如果能够获取到token,则表示登录,获取不到表示未登录
    if (eve.target.nodeName != 'A' || eve.target.className != 'sk_goods_buy') return;
    //console.log(eve.target);
    //判断用户是否登录
    let token = localStorage.getItem('token')
    // 跳转
    if (!token) location.assign('./login.html?ReturnUrl=./list.html')


    //如果已经登录，需要将商品加入购物车
    //获取商品id和用户id
    let goodsId = eve.target.parentNode.dataset.id;
    //console.log(goodsId);
    let userId = localStorage.getItem('user_id');
    this.addCartGoods(goodsId, userId)
    // // 判断是否点击的是a标签
    // if (eve.target.classList.contains('sk_goods_buy')) {
    //   // 商品id或用户id获取
    //   let lisObj = eve.target.parentNode;
    //   let goodsId = lisObj.dataset.id
    //   // console.log(goodsId);
    //   let userId = localStorage.getItem('user_id');
  }
  addCartGoods(gId, uId) {

    const AUTH_TOKEN = localStorage.getItem('token');
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let param = `id=${uId}&goodsId=${gId}`;
    axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
      // console.log(data, status);
      // 判断 添加购物车是否成功
      if (status == 200 && data.code == 1) {
        layer.open({
          title: '商品添加成功'
          , content: '大爷，进购物车看看吗?'
          , btn: ['留下', '去吧']
          , btn2: function (index, layero) {
            // console.log('去购物车了...');
            location.assign('./cart.html')

          }
        });
      } else if (status == 200 && data.code == 401) {  // 如果登录过期,则重新登录
        // 清除 local中存的token和userid
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        // 跳转到登录页面
        location.assign('./login.html?ReturnUrl=./list.html')
      } else {
        layer.open({
          title: '失败提示框'
          , content: '大爷,你走措地了'
          , time: 3000
        }
        );
      }


    })

  }


  $(ele) {
    let res = document.querySelectorAll(ele);
    return res.length == 1 ? res[0] : res;
  }
}

new List;