let nodemailer=require('nodemailer');

let smtpTransport=nodemailer.createTransport({
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
        user: '2648272023@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: 'jhulglpciqgwdife',
    }
});

let sendMail = (mssage)=>{
    let mailOptions={
        from:'2648272023@qq.com',
        to:'476371581@qq.com',
        subject:'部署通知',
        html:mssage
    };
    smtpTransport.sendMail(mailOptions,function (err,response) {
        if(err){
            console.log(err);
        }else{
            console.log('Mail sent: '+ JSON.stringify(response));
        }
    });
}
module.exports = sendMail