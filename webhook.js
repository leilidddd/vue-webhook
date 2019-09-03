let http = require('http');
let crypto = require('crypto');
let {spawn} = require('child_process');
let SECRET = '19940819li';

let sign = (body)=>{
    return `sha1=`+crypto.createHmac('sha1',SECRET).update(body).digest('hex');
}

let server = http.createServer((req,res)=>{
    if(req.method == 'POST' && req.url == '/webhook'){
        console.log('push detected');
        let buffers = [];
        req.on('data',(buffer)=>{
            buffers.push(buffer);
        });
        req.on('end',(buffer)=>{
            let body = Buffer.concat(buffers);
            //events:push
            let event = req.headers['x-github-event'];
            //签名
            let signature = req.headers['x-hub-signature'];
            if(signature !== sign(body)){
                return res.end('Not Allowed');
            }
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({ok:true}));
            console.log('event ',event);
            if(event == 'push'){
                let payload = JSON.parse(body);
                console.log('payload ',payload);
                console.log('repository: ',`${payload.repository.name}`);
                let child = spawn('sh',[`./${payload.repository.name}.sh`]);
                let buffers = [];
                child.stdout.on('data',(buffer)=>{
                    buffers.push(buffer);
                });
                child.stdout.on('end',(buffer)=>{
                    let log = Buffer.concat(buffers);
                    console.log(log);
                })
            
            }


        })
    }else{
        res.end('Not Found');
    }
});
server.listen(4000,()=>{
    console.log('webhook listening at port 4000');
});