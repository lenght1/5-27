class register{
    constructor() {
        // 给属性赋值,调用其它方法
       
        
        
        
      }
      binkEve(){
        this.$('.over').addEventListener('click', this.getData)
      }
     getData(){
        let uN=this.$('.tel').value;
        let nN=this.$('.code').value;
        let uP=this.$('.psw').value;
        let uP1=this.$('.repsw').value;
        let zz= /\w{4,20}/;
        var regnc = /^[u4e00-u9fa5]{2,8}$/; 
        if(!uN||!nN||!uP||!uP1){
            alert("输入框不能为空！")

        }

        let xhr=new XMLHttpRequest();
        xhr.open('post','http://localhost:8888/users/register');
        xhr.setRequestHeader('constent-type','application/x-www-form-urlencoded');
        let data=(`username=${uN}&password=${nP}&rpassword=${nP}&nickname=${nN}`)
        if(!uN.match(zz)||!uP.match(zz)||!uP==uP1||!nN.match(regnc)){
            // xhr.send(data)
            alert("输入不符合要求");
            return;
        }else{
            xhr.send(data);
            console.log(111);
            xhr.onload=function(){
                let res=xhr.response;
                console.log(res);
            }
        }
       
    }
    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
      }
}
new  register();