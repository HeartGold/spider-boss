
## boss直聘自动化工具
### 功能
- [x] 自动获取当前职位信息下对应的推荐牛人
- [x] 通过学校、关键字、专业、公司等进行打分并排序
- [x] 取前100人进行打招呼

### 初始化
- cookie: 需要手动获取cookie，登录后打开控制台，执行`document.cookie`，将结果手动拷贝到 front/src/config/cookie.txt 中
- 安装依赖：npm i 
  
### 执行
- npm run start
  
### todo
- [ ] 实时获取最新简历，并发送提醒邮件
- [ ] 自动发送简历查询信息
- [ ] 优化评分规则
