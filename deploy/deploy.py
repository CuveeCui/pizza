# coding:utf-8

import os
import sys
import re
import datetime
import paramiko
import yaml
from time import sleep
from optparse import OptionParser

pkey = os.path.expanduser('~')+"/.ssh/id_rsa"  #本地密钥文件路径
key = paramiko.RSAKey.from_private_key_file(pkey) 

class Deploy(object):
    def __init__(self, config=None):
        self.name = "beta"  #待部署的环境名称
        self.type = "development"
        self.ip = "47.93.217.112"    #服务器ip
        self.port = 8822 #ssh登陆访问端口
        self.username = "deploy" #登陆服务器的用户名
        self.password = "XXXXXX"  #登陆服务器的密码
        self.login_port = "3001"  #用户访问端口
        self.workspace = "caixinglong"   #个人工作空间目录
        self.workspace_list = None #个人工作空间目录列表
        self.src_url = "git@github.com:eumlab/readio_server.git" #部署的源代码地址
        self.branch = "master"  #部署的代码的分支
        self.docker_running_time = 36000    #docker容器的运行时间
        self.docker_image_name = "readio_server"  #docker镜像名
        self.max_docker_user = 3    #允许运行的最大的docker容器数量     
        self.timeout = 720   #ssh连接发送命令的超时时间
        self.prompt = "$ "  #ssh连接服务器命令提示符
        self.alive = False  #ssh是否已经连接
        self.railsenv = None #启动rails的环境变量设置，如：test、production、development
        self.wechat_appid = None #微信appid
        self.wechat_secret = None #微信secret
        if config is None:
            # 默认配置文件路径为当前路径下的deploy.yml
            self.config = os.path.join(os.path.dirname(__file__),'deploy.yml').replace("\\","/")
        else:
            self.config = config
        
        # transport和chanel
        self.t = '' #socket连接
        self.chan = ''  #连接通道
        self.recv_buffer = 65535    #接收缓冲区的大小
        self.try_times = 3  # 链接失败的重试次数
        self.ssh = None #ssh连接
    
    # 启动ssh连接Linux服务器
    def start_connect(self):
        #以下执行一些初始化相关的函数
        self.__set_config() #初始化数据
        if not self.alive:
            self.connect()  #连接服务器，并初始化一个ssh连接通道
        
    # 获取yaml配置文件信息
    def __get_config(self):
        config = open(self.config)
        data = yaml.load(config)
        return data
    
    # 存储配置文件信息
    def __set_config(self, data=None):
        if data is None:
            data = self.__get_config()
            #以下步骤将设置初始化变量
            env_name = self.name
            env_type = self.type
            workspace = self.workspace
            if env_type not in data:
                print '\nyour env_type "%s" is not in deploy.yml,please check your deploy.yml\n' % env_type
                sys.exit()
            env_name_list = data[env_type]["envlist"]
            if env_name not in env_name_list:
                print '\nyour env_name "%s" is not in deploy.yml,please check \"envlist\" key\n' % env_name
                sys.exit()
            self.workspace_list = self.login_port = data[env_type]["envlist"][env_name]["docker_user"]
            if workspace not in self.workspace_list:
                print '\nyour workspace "%s" is not in deploy.yml,please check \"docker_user\" key\n' % workspace
                sys.exit()
            self.ip = data[env_type]["envlist"][env_name]["ip"]   #服务器ip
            self.port = data[env_type]["envlist"][env_name]["port"] #ssh登陆访问端口
            self.username = data[env_type]["envlist"][env_name]["username"] #登陆服务器的用户名
            self.password =  data[env_type]["envlist"][env_name]["password"]  #登陆服务器的密码
            self.login_port = data[env_type]["envlist"][env_name]["docker_user"][workspace]["user_port"] #用户访问端口
            self.workspace = workspace   #个人工作空间目录
            self.src_url = data[env_type]["envlist"][env_name]["code"] #部署的源代码地址
            if self.branch is None:
                self.branch = data[env_type]["envlist"][env_name]["branch"]  #部署的代码的分支
            self.docker_running_time = data[env_type]["envlist"][env_name]["docker_running_time"]    #docker容器的运行时间
            self.docker_image_name = data[env_type]["envlist"][env_name]["docker_image_name"]  #docker镜像名
            self.max_docker_user = data[env_type]["envlist"][env_name]["max_docker_user"]    #允许运行的最大的docker容器数量     
            self.prompt = data[env_type]["envlist"][env_name]["prompt"]  #ssh连接服务器命令提示符
        else:
            print "预留设置数据的接口，暂时未开放"

    # 调用该方法连接远程主机
    def connect(self):
        while True:
            # 连接过程中可能会抛出异常，比如网络不通、链接超时
            try:
                self.t = paramiko.Transport(sock=(self.ip, self.port))
                #self.t.connect(username=self.username, password=self.password)
                self.t.connect(username=self.username,pkey=key)
                self.chan = self.t.open_session()
                self.chan.settimeout(self.timeout)
                self.chan.get_pty()
                self.chan.invoke_shell()
                # 如果没有抛出异常说明连接成功，直接返回
                print u'连接%s成功' % self.ip
                # 接收到的网络数据解码为str
                ret = self.chan.recv(self.recv_buffer).decode('utf-8')
                while not ret.endswith("$ "):
                    ret += self.chan.recv(self.recv_buffer).decode('utf-8')
                print ret,
                self.alive = True
                return
            # 这里不对可能的异常如socket.error, socket.timeout细化，直接一网打尽
            except Exception, e1:
                print e1
                if self.try_times != 0:
                    print u'服务器连接%s失败，进行重试' %self.ip
                    self.try_times -= 1
                else:
                    print u'连接服务器重试3次失败，结束程序'
                    exit(1)

    # 断开Linux系统连接
    def close(self):
        self.chan.close()
        self.t.close()

    # 发送要执行的命令
    def send(self, cmd, prompt=None, timeout=None, isoutput=None):
        if prompt is None:
            prompt = self.prompt
        cmd += '\n'
        # 通过命令执行提示符来判断命令是否执行完成
        result = ''
        ret = []
        retdebug = []
        out = ""
        # 发送要执行的命令
        self.chan.send(cmd)
        # 回显很长的命令可能执行较久，通过循环分批次取回回显
        tmp_prompt = tuple(prompt.split("|"))
        while not  out.endswith(tmp_prompt):
            out = self.chan.recv(self.recv_buffer)
            retdebug.append(out)
            out_tmp = out.replace(" \r","")
            out_tmp = out_tmp.replace("\r","")
            ret.append(out_tmp)
            out = self.auto_matching_rule(out_tmp)
            #print out_tmp
            # 克隆代码时打印克隆进度
            if "git clone " in cmd or "tail -f " in cmd:
                print out_tmp
        result = "".join(ret)
        # 克隆代码时、bin/webpack-dev-server执行时不打印最后克隆全部结果
        if "git clone " not in cmd and "no" != isoutput:
            print result,
        return result

    # 自动匹配规则函数，如：自动输入yes or no
    def auto_matching_rule(self, output):
        #自动输入yes，例子continue connecting (yes/no)?
        if "(yes/no)?" in output:
            return self.send("yes")
        if "[Y/n]" in output:
            return self.send("yes")
        if "Press enter to continue" in output:
            return self.send("\n",prompt="$ |# |> ")
        return output
    
    # 输出日志格式化，该方法预留，暂时未使用
    def log_print_formate(self, msg, cmd=None, log_type="Info", exec_time=None):
        log_msg = "<%s><%s><%s\n%s>" % (exec_time, log_type, cmd, msg)
        print log_msg

    # 拉取分支代码
    def pull(self,url=None,path=None):
        if url is None:
            src_url = self.src_url
        # 进入代码存放目录
        path = "/home/deploy/workgroup/%s" % self.workspace
        flag = self.is_exsits_file(path)
        if not flag:
            cmd = "mkdir %s" % path
            self.send(cmd)
        cmd = "cd %s" % path
        self.send(cmd)
        flag = self.is_exsits_file("readio_server")
        if not flag:
            cmd = "git clone %s" % src_url
            self.send(cmd)
        self.send("cd readio_server")
        #拉取指定分支代码
        # 删除本地自己私有分支所有修改git checkout .和git clean -df
        self.send("git branch")
        self.send("git status")
        self.send("git checkout .")
        self.send("git clean -df")
        #删除本地除develop外的所有分支
        cmd = 'git stash && git checkout develop && git branch | grep -v "develop" | xargs git branch -D'
        self.send(cmd)
        self.send("git checkout develop")
        # 删除本地develop分支所有修改git checkout .
        self.send("git branch")
        self.send("git status")
        self.send("git checkout .")
        self.send("git clean -df")
        self.send("git pull")
        cmd = "git checkout -q %s" % self.branch
        output = self.send(cmd)
        if re.search("did not match",output):
            print '\n\nyour remote branch "%s" is not exist,please check your branch \n' % self.branch
            sys.exit()
        self.send("git branch")

    # 启动部署任务
    def start_task(self,type=None):
        # 删除启动的容器
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker rm -f {}' % self.login_port
        self.send(cmd)
        # 拉取代码
        self.pull()
        #启动redis容器服务
        self.check_redis_service_status()
        # 拷贝配置文件到代码目录
        cmd = "cd /home/deploy/workgroup/%s/readio_server" % self.workspace
        self.send(cmd)
        self.send("cp /var/www/readio_server/shared/config/zetting.yml config/zetting.yml")
        self.send("cp /var/www/readio_server/shared/config/mongoid.yml config/mongoid.yml")
        self.send("cp /var/www/readio_server/shared/config/environments/production.rb config/environments/production.rb")
        if self.wechat_appid and self.wechat_secret:
            # 修改zetting配置文件，适配不同人使用不同的微信测试号
            start_line = None
            end_line = None
            #获取readio_web行号
            cmd = 'sed -n \'/readio_web/=\' config/zetting.yml'
            output = self.send(cmd)
            print "output:",output
            ret = re.search(r"\n(\d+)\n",output)
            if ret:
                start_line = ret.group(1)
                print "line:",ret.group(1)
            #获取readio_web行号
            cmd = 'sed -n \'/wechat_secondary/=\' config/zetting.yml'
            output = self.send(cmd)
            print "output:",output
            ret = re.search(r"\n(\d+)\n",output)
            if ret:
                end_line = ret.group(1)
                print "line:",ret.group(1)
            # 开始替换
            start_line = str(int(start_line) + 1)
            end_line = str(int(end_line) - 1)
            cmd = 'sed -i \'%s,%sc        appid: %s\\n      secret: %s\\n\      token: fdjfalkdsfl945u03jl\' config/zetting.yml' % (start_line,end_line,self.wechat_appid,self.wechat_secret)
            self.send(cmd)
            cmd = 'sed -i \'%ss/^/      /\' config/zetting.yml' %  start_line
            self.send(cmd)
        
        # 删除容器启动后遗留的文件目录
        if self.is_exsits_file("tmp/pids/server.pid"):
            self.send("sudo rm tmp/pids/server.pid")
        # 获取主机名字
        output = self.send("cat /etc/hostname")
        hostname = self.workspace
        ret = re.search(r"\n(\w+)\n",output)
        if ret:
            hostname = "%s_%s" % (ret.group(1),self.workspace)
        # 启动docker容器，挂载代码目录
        cmd = "docker run --name %s -d -p %s:3000 -h %s -v /home/deploy/workgroup/%s/readio_server:/readio_server --link redis:redis readio_server:latest sleep %s" % (self.workspace,self.login_port,hostname,self.workspace,self.docker_running_time)
        output = self.send(cmd)
        # 优化已经存在容器的情况
        ret = re.search(r'is already in use by container \"(\w+)\"',output)
        if ret:
            rm_cmd = "docker rm -f %s" % ret.group(1)
            self.send(rm_cmd)
            self.send(cmd)
        # 转化编码,解决中文显示乱码问题
        self.login_docker_change_utf8()
        # 拷贝线上微信证书
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} mkdir /wxpay' % self.login_port
        self.send(cmd)
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker cp /wxpay/apiclient_cert.p12 {}:/wxpay/apiclient_cert.p12' % self.login_port
        self.send(cmd)

        # 容器中执行编译包命令
        print "\n\nreadio_server容器进行yarn instll包安装，请耐心等待，预计60s内完成。。。\n"
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} yarn install' % self.login_port
        self.send(cmd)
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} bundle install' % self.login_port
        self.send(cmd)
        #启动消息队列
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} sidekiq &' % self.login_port
        self.send(cmd)
        if type == "debug":
            cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} bin/webpack-dev-server &' % self.login_port
            self.send(cmd)
            print "\n\ndebug模式下，你的readio_server服务默认不启动，请登录容器执行rails s -p 3000 -b 0.0.0.0命令启动后，web服务才可以访问。\n"
            print "\n访问地址：http://%s:%s\n" % (self.ip,self.login_port)
        else:
            if self.railsenv is None:
                cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} bin/webpack-dev-server &' % self.login_port
                self.send(cmd)
                cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} rails s -p 3000 -b 0.0.0.0 &' % self.login_port
                self.send(cmd)
            else:
                cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} bundle exec rake assets:precompile' % self.login_port
                self.send(cmd)
                cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} rails s -p 3000 -b 0.0.0.0 -e %s &' % (self.login_port,self.railsenv)
                self.send(cmd)
            # 查看服务是否启动成功
            print "\n\n等待你的node和readio_server服务正常启动,预计60秒...\n"
            #检查服务启动状态
            self.check_status()
    
    # 执行静态检查
    def rubocop_task(self):
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} bundle exec rubocop' % self.login_port
        self.send(cmd)
    
    # 停止指定用户的部署容器任务
    def stop_task(self):
        # 删除启动的容器
        cmd  = 'docker ps | grep "readio_server:latest"'
        output = self.send(cmd)
        pattem = "0.0.0.0:%s->3000/tcp" % self.login_port
        if re.search(pattem,output):
            cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker rm -f {}' % self.login_port
            self.send(cmd)
        else:
            print "\n\n服务器上不存在%s用户部署的容器，无需停止。。。\n" % self.workspace
            return
        #检查是否删除完成
        cmd  = 'docker ps | grep "readio_server:latest"'
        output = self.send(cmd)
        pattem = "0.0.0.0:%s->3000/tcp" % self.login_port
        if not re.search(pattem,output):
            print "\n\n服务器上已经不存在%s用户部署的容器，停止完成。。。\n" % self.workspace
    
    # 停止服务器上所有部署的容器任务
    def stop_alltask(self):
        output = self.send('docker ps | grep "3000/tcp"')
        if re.search("readio_server:latest",output):
            print "\n\n停止全部readio_server容器服务开始。。。\n"
            cmd = 'docker ps | grep "3000/tcp" |awk \'BEGIN{ i=0 } { i++ } {print $1}\' |xargs -I {} docker rm -f {}'
            self.send(cmd)
        else:
            print "\n\n服务器上不存在readio_server容器服务。。。\n"
            return
        #检查服务是否全部停止完毕
        sleep(1)
        output = self.send('docker ps | grep "3000/tcp"')
        if not re.search("readio_server:latest",output):
            print "\n\n停止全部readio_server容器服务成功。。。\n"

    # 检查部署服务的状态
    def check_status(self):
        #print "\n\n检查node和readio_server服务是否正常启动，预计1min\n"
        sleep(60)
        cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'  |xargs -I {} docker exec {} ps aux' % self.login_port
        output = self.send(cmd,isoutput="no")
        check_timeout = 3
        check_times = 40
        times = check_times*check_timeout
        while True:
            node_servre = re.search("node /readio_server/node_modules/.bin/webpack",output)
            readio_server = re.search("tcp://0.0.0.0:3000",output)
            if self.railsenv is None:
                if node_servre and readio_server:
                    #后台访问启动检查
                    self.send(cmd) 
                    print "\n\n检查node和readio_server服务已经正常启动，web服务已经可以访问。\n"
                    print "\n访问地址：http://%s:%s\n" % (self.ip,self.login_port)
                    break
                print "\n\n检查node和readio_server服务是否正常启动，第%s次检查中。。。\n" % str(41-check_times)
            else:
                if readio_server:
                    #后台访问启动检查
                    self.send(cmd) 
                    print "\n\n检查readio_server服务已经正常启动，web服务已经可以访问。\n"
                    print "\n访问地址：http://%s:%s\n" % (self.ip,self.login_port)
                    break
                print "\n\n检查node和readio_server服务是否正常启动，第%s次检查中。。。\n" % str(41-check_times)
            check_times -= 1
            sleep(check_timeout)
            if not check_times:
                print "\n检查node和readio_server服务%ss无法正常启动，请检查部署\n" % str(times)
                break
            output = self.send(cmd) 

    # 启动redis容器服务
    def check_redis_service_status(self):
        cmd = "ps aux | grep redis"
        output = self.send(cmd)
        if re.search("redis-server 127.0.0.1:6379",output):
            self.send("sudo /etc/init.d/redis-server stop")
        #如果redis容器不存在就启动redis容器
        cmd = "docker ps | grep redis"
        output = self.send(cmd)
        if not re.search("0.0.0.0:6379->6379/tcp",output):
            output = self.send("docker run -d --name redis -p 6379:6379 redis")
            ret = re.search(r'The container name \"/redis\" is already in use by container \"(\w+)\"',output)
            if ret:
                cmd = "docker rm -f %s" % ret.group(1)
                self.send(cmd)
                self.send("docker run -d --name redis -p 6379:6379 redis")
        else:
            print "\n\nredis容器服务已经启动，无需再次启动。\n"
        self.send("docker ps")
    
    def login_docker_change_utf8(self):
        self.login_docker()
        sleep(1)
        self.send('echo "set fileencodings=utf-8,gbk,utf-16le,cp1252,iso-8859-15,ucs-bom">> /etc/vim/vimrc',prompt="# ")
        self.send('echo "set termencoding=utf-8">> /etc/vim/vimrc',prompt="# ")
        self.send('echo "set encoding=utf-8">> /etc/vim/vimrc',prompt="# ")
        # 增加退出容器模式
        self.send('exit')

    def login_docker_task(self):
        self.login_docker()
        while True:
            cmd = raw_input()
            if "exit" == cmd:
                sys.exit()
            self.send(cmd,prompt="# ")
    
    def docker_mogondb_task(self):
        self.login_docker()
        self.send("rails c",prompt="> |$ |break>")
        while True:
            cmd = raw_input()
            if "exit" == cmd:
                sys.exit()
            self.send(cmd,prompt="> ")
    
    def docker_log_task(self):
        # 优化获取生产日志文件
        if self.railsenv is None:
            cmd = "tail -f /home/deploy/workgroup/%s/readio_server/log/development.log" % self.workspace
        else:
            cmd = "tail -f /home/deploy/workgroup/%s/readio_server/log/%s.log" % (self.workspace,self.railsenv)
        self.send(cmd)

    def login_docker(self):
        docker_id = None
        cmd  = 'docker ps | grep "readio_server:latest"'
        output = self.send(cmd)
        pattem = "0.0.0.0:%s->3000/tcp" % self.login_port
        if re.search(pattem,output):
            cmd = 'docker ps | grep "0.0.0.0:%s->3000/tcp" |awk \'{print $1}\'' % self.login_port
            output = self.send(cmd)
            for line in output.splitlines():
                ret = re.match(r"^(\w+)$",line)
                if ret:
                    docker_id = ret.group(1)
                    break
        else:
            print "\n\n服务器上不存在%s用户部署的容器，无法登陆容器。。。\n" % self.workspace
            return
        # 登陆docker容器
        cmd = "docker exec -it %s bash" % docker_id
        self.send(cmd,prompt="# ")

    # 同步本地代码到docker容器
    def rsync_task(self):
        deploy_path = os.path.split(__file__)
        rsync_path = "%s/%s/%s" % (os.getcwd(),deploy_path[0],deploy_path[1])
        rsync_path = rsync_path[:-23]
        cmd = 'rsync -avzlP  -e \'ssh -p %s\' %s %s@%s:/home/deploy/workgroup/%s/readio_server --exclude={.git/,.github,tmp/,log/,node_modules/,public/assets/} --delete' % (self.port,rsync_path,self.username,self.ip,self.workspace)
        print cmd
        os.system(cmd)

    # 丢弃docker内修改的代码
    def restore_task(self):
        cmd = "cd /home/deploy/workgroup/%s/readio_server" % self.workspace
        self.send(cmd)
        self.send("git branch")
        self.send("git status")
        self.send("git checkout .")
        self.send("git clean -df")
        self.send("git status")

    # 目录或者文件是否存在判断
    def is_exsits_file(self,path):
        cmd = "ls %s" % path
        output = self.send(cmd)
        #No such file or directory
        if "没有那个文件或目录" in output or "No such file or directory" in output:
            return False
        return True

# 程序入口，包含命令行输入解析，部署调度  
def main():
    start_time = datetime.datetime.now()  #执行开始时间
    usage = "usage: python %prog [options] [COMMAND]\
            \n\nCOMMAND:\n\tstart\t:\tstart a deploy task\
            \n\tdebug\t:\tdebug mode\
            \n\tstop\t:\tstop a deploy task\n\tstopall\t:\tstop all deploy task\
            \n\trubocop\t:\texecute ruby rubocop\n\tlogin\t:\tlogin your docker container\
            \n\tdb\t:\tquery mongondb\n\tlog\t:\tquery running logs\
            \n\trsync\t:\trsync your code to docker\n\trestore\t:\trestore your docker code" 
    parser = OptionParser(usage=usage) 
    parser.add_option("-e", "--envname",  
                    dest="envname", 
                    default="beta", 
                    help="select your environment,default environment is beta") 
    parser.add_option("-t", "--envtype", 
                    dest="envtype", 
                    default="development", 
                    help="select your environment type,default environment type is development") 
    parser.add_option("-w", "--workspace", 
                    dest="workspace", 
                    help="your workspace,please use own workspace,eg:caixinglong") 
    parser.add_option("-b", "--branch", 
                    dest="branch", 
                    help="your branch,please use own branch,eg:develop") 
    parser.add_option("-r", "--railsenv", 
                    dest="railsenv", 
                    help="your railsenv,default environment,eg:environment")  
    parser.add_option("-a", "--wechatappid", 
                    dest="wechatappid", 
                    help="your wechat appid")  
    parser.add_option("-s", "--wechatsecret", 
                    dest="wechatsecret", 
                    help="your wechat secret")  

    (options, args) = parser.parse_args() 
    if args:
        cmdlist = ["start","stop","stopall","rubocop","login","db","log","startall","debug","rsync","restore"]
        args0 = args[0]
        dp = None
        if args0 in cmdlist:
            dp = Deploy()
            #设置用户独有的属性
            dp.name = options.envname
            dp.type = options.envtype
            dp.workspace = options.workspace
            dp.branch = options.branch
            dp.railsenv = options.railsenv
            dp.wechat_appid = options.wechatappid 
            dp.wechat_secret = options.wechatsecret
            dp.start_connect()

        if args0 == "start":            
            dp.start_task()
        if args0 == "debug":
            dp.start_task(type="debug")
        if args0 == "startall":
            for workspace in dp.workspace_list:
                dp.workspace = workspace
                dp.start_connect()
                dp.start_task()
        if args0 == "stop":
            dp.stop_task()
        if args0 == "stopall":
            dp.stop_alltask()
        if args0 == "rubocop":
            dp.rubocop_task()
        if args0 == "login":
            dp.login_docker_task()
        if args0 == "db":
            dp.docker_mogondb_task()
        if args0 == "log":
            dp.docker_log_task()
        if args0 == "rsync":
            dp.rsync_task()
        if args0 == "restore":
            dp.restore_task()
    else:
        print "\nyour command is not correct\nPlease see 'python %s -h'\n" % os.path.split(__file__)[1]
    end_time = datetime.datetime.now()   #执行结束时间
    spent_time= end_time - start_time
    print "\n\n=========本次任务共耗时，%s秒 ==============\n\n" % str(spent_time.seconds)
    

if __name__ == "__main__":
    # 入口函数
    main()