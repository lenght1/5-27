class Register {

    constructor() {
        this.getUser();
    }

    getUser() {
        Register.$('.over').addEventListener('click', this.regiFn);
    }

    regiFn = (eve) => {
        eve.preventDefault();
        let form = document.forms[0];
        let username = form.tel.value;
        // console.log(username);
        let password = form.password.value;
        // console.log(form.mm);
        let rpassword = form.repassword.value;
        // console.log(rpassword);
        let nickname = form.code.value;
        // console.log(nickname);
        if (!username || !password || !rpassword || !nickname) {
            alert('不能为空')
        }
        let data = `username=${username}&password=${password}&rpassword=${rpassword}&nickname=${nickname}`;
        axios.post('http://localhost:8888/users/register/', data).then(res => {
            console.log(res);
            let { status, data } = res
            if (status == 200 && data.code == 1) {
                location.href = './login.html';
            } else {
                let str = data.message;
                Register.$('.reg_form .noLogo div').innerHTML = str;
                Register.$('.reg_form .noLogo').style.display = 'block'
            }
        })
    }



    static $(tag) {
        let tagArr = document.querySelectorAll(tag);
        return tagArr.length == 1 ? tagArr[0] : tagArr;
    }
}

new Register;