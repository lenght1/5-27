class Cart {
  constructor() {
    
    this.getCartGoods();
    this.$('.cart-list').addEventListener('click', this.dispatch);
    this.$('.cart-th input').addEventListener('click', this.checkAll);

  }
  /***事件委托的分发***/

  dispatch = (eve) => {
    let target = eve.target;
    if (target.nodeName == 'A' && target.classList.contains('del1')) this.delGoodsData(target);
    if (target.nodeName == 'A' && target.classList.contains('plus')) this.plusGoodsNum(target);
    if (target.nodeName == 'A' && target.classList.contains('mins')) this.minsGoodsNum(target);
  }
  /********数量减少的方法**********/
  minsGoodsNum=(tar)=>{
    let ul = tar.parentNode.parentNode.parentNode;
    // console.log(ul);
    // 获取数量,单价和小计
    let num = ul.querySelector('.itxt');
    let sum = ul.querySelector('.sum');
    let price = ul.querySelector('.price').innerHTML - 0;
    // console.log(num, sum, price);

    // 获取数量
    let numVal = num.value;
    // 对数量进行加1 操作
    if (numVal>0)
      
    
      numVal--;
    
      // 给 服务器发送数据,减少数量
      const AUTH_TOKEN = localStorage.getItem('token')
      axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      let uId = localStorage.getItem('user_id');
      let gId = ul.dataset.id;
      let param = `id=${uId}&goodsId=${gId}&number=${numVal}`
      axios.post('http://localhost:8888/cart/number', param).then(res => {
        // console.log(res);
        let { status, data } = res;
        if (status == 200 && data.code == 1) {
          // 将更新之后的数量设置回去
          num.value = numVal;
          sum.innerHTML = parseInt(numVal * price * 100) / 100;
          // 调用统计数量和价格的方法
          this.countSumPrice();
        }
  
      });
  
    
  }
  /*******数量增加的方法********/
  plusGoodsNum = (tar) => {
    // console.log(tar);
    let ul = tar.parentNode.parentNode.parentNode;
    console.log(ul);
    // 获取数量,单价和小计
    let num = ul.querySelector('.itxt');
    let sum = ul.querySelector('.sum');
    let price = ul.querySelector('.price').innerHTML - 0;
    // console.log(num, sum, price);

    // 获取数量
    let numVal = num.value;
    // 对数量进行加1 操作
    numVal++;
    // console.log(num);
    // 更新input中的数量

    // 给 服务器发送数据,增加数量
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let uId = localStorage.getItem('user_id');
    let gId = ul.dataset.id;
    let param = `id=${uId}&goodsId=${gId}&number=${numVal}`
    axios.post('http://localhost:8888/cart/number', param).then(res => {
      // console.log(res);
      let { status, data } = res;
      if (status == 200 && data.code == 1) {
        // 将更新之后的数量设置回去
        num.value = numVal;
        sum.innerHTML = parseInt(numVal * price * 100) / 100;
        // 调用统计数量和价格的方法
        this.countSumPrice();
      }

    });

    


  }
  /******全选的实现*******/
  checkAll = (eve) => {
    // console.log(this);
    // 点击全选的时候,应该让单个商品的选中框状态,跟随全选
    // console.log(eve.target);

    let allStatus = eve.target.checked;
    // console.log(allStatus);
    this.oneCheckGoods(allStatus);

    // 调用统计数量和价格的方法
    this.countSumPrice();
  }

  // 让单个商品跟随全选的状态
  oneCheckGoods(status) {

    // console.log(this.$('.good-checkbox'));
    this.$('.good-checkbox').forEach(input => {
      input.checked = status;
    })

  }
  /******单选的实现*******/
  oneGoodsCheckBox() {
    // console.log(this.$('.good-checkbox'));
    // 给每个单选按钮绑定点击事件
    this.$('.good-checkbox').forEach(input => {
      /// 保存this的指向
      let self = this;
      input.onclick = function () {
        // 获取当前的点击状态
        // console.log(this.checked);
        // 判断当前商品的input点击的是取消,则此时取消全选
        if (!this.checked) {
          self.$('.cart-th input').checked = false;
        }
        // 点击选中时,则判断页面中是否有其它的未选中,如果都选中,则全选选中
        if (this.checked) {
          let status = self.getOneGoodsStatus();
          // console.log(status);
          self.$('.cart-th input').checked = status;
        }

        // 统计价格和数据
        self.countSumPrice();
      }
    })
  }
  /********获取单个商品的选中状态********/
  getOneGoodsStatus() {
    // console.log(this.$('.good-checkbox'));

    // 寻找是否有没选中的,如果页面都选中res为空数组
    let res = Array.from(this.$('.good-checkbox')).find(input => {
      // console.log(input.checked);
      return !input.checked
    })

    // console.log(res);
    // 如果res有值,则页面中有没被选中的
    // 页面中都被选中,则返回true
    return !res;
  }
  /********统计数量和价格********/
  countSumPrice() {
    let sum = 0;
    let num = 0;
    // 只统计选中商品的
    this.$('.good-checkbox').forEach(input => {
      // console.log(input);
      if (input.checked) {
        // 通过input:checkbox 找到ul
        let ul = input.parentNode.parentNode;
        // console.log(ul);

        // 获取数量和小计
        let tmpNum = ul.querySelector('.itxt').value - 0;
        let tmpSum = ul.querySelector('.sum').innerHTML - 0;
        // console.log(tmpNum, tmpSum);
        sum += tmpSum;
        num += tmpNum;
      }


    });
    // 保留小数点后两位

    sum = parseInt(sum * 100) / 100
    // console.log(sum, num);

    // 将数量和价格放到页面中
    this.$('.sumprice-top strong').innerHTML = num;
    this.$('.summoney span').innerHTML = sum;

  }

  // 删除购物车中商品,需要 用户id,商品id
  delGoodsData(tar) {
    // console.log(tar);

    // console.log(id);
    // 弹出框,询问,是否确定删除
    layer.confirm('是否删除商品', {
      title: '删除提示框'
    }, function () {  // 确认的回调函数
      // console.log(111);
      // 1 给后台发送数据,删除记录
      // 找到ul上的商品id
      let ul = tar.parentNode.parentNode.parentNode
      let gId = ul.dataset.id;
      // 用户id
      let uId = localStorage.getItem('user_id');

      // console.log(gId, uId);
      // 必须携待token,后台需要验证
      const AUTH_TOKEN = localStorage.getItem('token')
      axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
      axios.get('http://localhost:8888/cart/remove', {
        params: {
          id: uId,
          goodsId: gId
        }
      }).then(res => {
        // console.log(res);
        // 直接刷新页面
        // location.reload();

        /******无刷新删除******/
        // 关闭弹出框,且删除对应的ul
        layer.closeAll();
        ul.remove();

      })
    })


  }
  /******取出商品信息****/
  async getCartGoods() {
    // 必须携待token,后台需要验证
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    let { data, status } = await axios.get('http://localhost:8888/cart/list', {
      params: {
        id: localStorage.getItem('user_id')
      }
    })

    // console.log(res);
    // 判断ajax的请求状态
    if (status == 200 && data.code == 1) {
      // console.log(data.cart);
      let html = '';
      data.cart.forEach(goods => {
        // console.log(goods);

        html += `<ul class="goods-list yui3-g" data-id="${goods.goods_id}">
        <li class="yui3-u-3-8 pr">
            <input type="checkbox" class="good-checkbox">
            <div class="good-item">
                <div class="item-img">
                    <img src="${goods.img_small_logo}">
                </div>
                <div class="item-msg">${goods.title}</div>
            </div>
        </li>
        <li class="yui3-u-1-8">
          
        </li>
        <li class="yui3-u-1-8">
            <span class="price">${goods.current_price}</span>
        </li>
        <li class="yui3-u-1-8">
            <div class="clearfix">
                <a href="javascript:;" class="increment mins">-</a>
                <input autocomplete="off" type="text" value="${goods.cart_number}" minnum="1" class="itxt">
                <a href="javascript:;" class="increment plus">+</a>
            </div>
            <div class="youhuo">有货</div>
        </li>
        <li class="yui3-u-1-8">
            <span class="sum">${goods.current_price * goods.cart_number}</span >
        </li >
          <li class="yui3-u-1-8">
            <div class="del1">
              <a href="javascript:;" class="del1">删除</a>
            </div>
            <div>移到我的关注</div>
          </li>
    </ul >`;
      });
      // 将拼接好的字符串追加到页面
      this.$('.cart-list').innerHTML += html;
      //单个商品的追加是异步实现的,所以 单选按钮事件绑定
      this.oneGoodsCheckBox();
    }

    // 登录过期的处理
    if (status == 200 && data.code == 401) {  // 如果登录过期,则重新登录
      // 清除 local中存的token和userid
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      // 跳转到登录页面
      location.assign('./login.html?ReturnUrl=./cart.html')
    }

  }

  
  $(ele) {
    let res = document.querySelectorAll(ele)
    return res.length == 1 ? res[0] : res;
  }
}

new Cart();