class List {
  constructor() {
    // 给属性赋值,调用其它方法
    this.getData();
    // 将加入购物车使用事件委托
    this.$('.sk_bd ul').addEventListener('click', this.addCartFn.bind(this))
  }
  // 获取数据的方法
  async getData() {
    // 等待promise 对象解包完成
    let { data, status } = await axios.get('http://localhost:8888/goods/list?current=1')

    // console.log(data, status);
    //判断返回值的状态,追加数据
    if (status == 200) {
      // console.log(data);
      let html = '';
      data.list.forEach(goods => {
        // console.log(goods);
        html += `<li class="sk_goods" data-id="${goods.goods_id}">
        <a href="detail.html"><img src="${goods.img_big_logo}" alt=""></a>
        <h5 class="sk_goods_title">${goods.title}</h5>
        <p class="sk_goods_price"><em>¥${goods.current_price}</em> <del>￥${goods.price}</del></p>
        <div class="sk_goods_progress">
            已售<i>${goods.sale_type}</i>
            <div class="bar">
                <div class="bar_in"></div>
            </div>
            剩余<em>${goods.goods_number}</em>件
        </div>
        <a href="#none" class="sk_goods_buy">立即抢购</a>
    </li>`;

      });

      this.$('.sk_bd ul').innerHTML = html;

    }

  }

  // 加入购物车的方法
  async addCartFn(eve) {
    // console.log(this);
    // console.log(eve.target);
    // 判断用户是否登录,如果能够获取到token,则表示登录,获取不到表示未登录
    let token = localStorage.getItem('token')
    // 跳转
    if (!token) location.assign('./login.html?ReturnUrl=./list.html')

    // 判断是否点击的是a标签
    if (eve.target.classList.contains('sk_goods_buy')) {
      // 商品id或用户id获取
      let lisObj = eve.target.parentNode;
      let goodsId = lisObj.dataset.id
      // console.log(goodsId);
      let userId = localStorage.getItem('user_id');

      // 两个id必须都有才能发送请求
      if (!userId || !goodsId) throw new Error('两个id存在问题,请打印...');
      axios.defaults.headers.common['authorization'] = token;
      // 必须设置内容的类型,默认是json格式,server 是处理不了
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // 数据必须以原生的方式拼接好
      let param = `id=${userId}&goodsId=${goodsId}`;
      // 如果用户登录,则加数据信息添加到购物车中
      let { data, status } = await axios.post('http://localhost:8888/cart/add', param);
      // console.log(data);
      if (status == 200) {
        // console.log(data);
        if (data.code == 1) {  //购买成功
          layer.open({
            content: '加入购物成功',
            btn: ['去购物车结算', '留在当前页面']
            , yes: function (index, layero) {
              // 按钮【按钮一】的回调
              location.assign('./cart.html')
            }
            , btn2: function (index, layero) {
              //按钮【按钮二】的回调
              //return false 开启该代码可禁止点击该按钮关闭
            }
          })
        }

      }

    }

    // console.log(eve.target);



  }

  $(tag) {
    let res = document.querySelectorAll(tag)
    return res.length == 1 ? res[0] : res;
  }
}

new List