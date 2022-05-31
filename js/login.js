class Login {
  constructor() {
    // 给登录按钮,绑定点击事件
    this.$('.over').addEventListener('click', this.islogin)
    //console.log(location.search.split('='));

    //判断是否有回调页面
    let search=location.search;
    if(search){
      this.url= search.split('=')[1]
    }
  }

  islogin=()=> {
    // console.log(this);

    // 获取页面中form表单
    let forms = document.forms[0].elements;
    // console.log(forms);
    let username = forms.uname.value.trim();
    let password = forms.password.value.trim();
    // 判断是否为空
    if (!username || !password) throw new Error('用户名或者密码不能为空');

    // console.log(username, password);
    // 注意要发送post请请求
    //axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // xhr.setReuestHeader
    // 对参数进行编码
    let param = `username=${username}&password=${password}`;
    axios.post('http://localhost:8888/users/login', param, {
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        }
      }).then(res=>{
        if(res.status==200 && res.data.code== 1){
          localStorage.setItem('token',res.data.token);
          localStorage.setItem('user_id',res.data.user.id);
          if(this.url){
            location.href=this.url;
          }
        }
      })          
    
  }

  $(ele) {
    let res = document.querySelectorAll(ele);
    return res.length == 1 ? res[0] : res;
  }
}
new Login;