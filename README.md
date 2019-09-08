# 瑞威光电项目前端代码

### How to upload the built code
0. Run `yarn run build`
2. Run `yarn run make:win`
3. Run `$ docker pull 114.220.74.133:5000/fe-app && docker run -p "89:80" -e "IP:58.220.197.210" --name fe-app -d 114.220.74.133:5000/fe-app`

### How To Push The Docker Image
0. Change Host
    ```javascript
    const host = '114.220.74.133' //change here
    const port = '9994'
    export { host, port }
    ```
1. Run `yarn run build`
2. Build Image `$ docker build -t fe-app .`
3. Tag The Image `$ docker tag fe-app 114.220.74.133:5000/fe-app`
4. Push The Image `$ docker push 114.220.74.133:5000/fe-app`
  - Make Sure The Registry Running
  - The Run Command: `$ docker run -d -p 5000:5000 -v /opt/registry:/var/lib/registry --restart=always --name registry registry:2.1.1`
  - Set Your Docker Daemon 
    - Insecure registries: `114.220.74.133:5000`
--
5. Run It
  - `$ docker pull 114.220.74.133:5000/fe-app && docker run -p "89:80" -e "IP=localhost" -e "SUBTITLE=FPM" --rm --name fe-app -d 114.220.74.133:5000/fe-app:latest`


### How To Contribute
1. Make Sure You Are Project Member
2. Checkout The Remote Develop Branch At First Time
     ```bash
     $ git checkout -b develop origin/develop
     ```
3. Checkout A New Feature Branch For Coding
     ```bash
     $ git checkout -b feature-login
     ```
4. Merge To Develop Branch After Test And Commit
     ```bash
     $ git checkout develop
     $ git merge feature-login
     ```
5. Do Merge The Remote Develop Branch
     ```bash
     $ git pull
     ```
6. Push The Lasted Code After Test
7. Make A PR

### How To Use Fpm-Client
1. Install `yarn add yf-fpm-client-nodejs`
2. Checkout The Api Manual At [https://github.com/team4yf/yf-fpm-dbm#4useage](https://github.com/team4yf/yf-fpm-dbm#4useage)
3. Demo Like: 
     ```javascript
     //How to Use findAndCount()
     const query = new YF.Query('rw_message');
        query.page(1,10);
        query.findAndCount()
        .then(function(data){
            console.log(data);
        }).catch(function(err){
            done(err);
        })
     ```
> 查看 Changelog

[CHANGELOG.md](./CHANGELOG.md)

> 查看 TODO

[TODO.md](./TODO.md)

> 使用文档

命令行:
* 设置yarn采用淘宝的镜像源 `yarn config set registry http://registry.npm.taobao.org`
* 安装: `yarn` 
* 启动调试服务: `yarn start`
* 构建 dist: `yarn build`

基础设施:

* react-router @3.x 默认采用 hashHistory 的单页应用
* 入口文件: `src/index.js`
* 导航配置: `src/navs.js`
* 路由配置: `src/routes.jsx`
* 页面文件: `src/pages`
* 组件: `src/components`

