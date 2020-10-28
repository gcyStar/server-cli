/**
 * Created by chunyang.gao on 2018/2/16.
 */
// #! /usr/bin/env node
// -d --root 静态文件目录  -o --host 主机 -p --port 端口号
let cp = require('child_process')
let opener     = require('opener')
let argv = require('./yargsConfig')
let Server = require('../src/app.js')
let defautConfig = require('../src/config')
let version = require('../package.json').version
// console.log(argv)
let protocol = 'http://'

if(argv.v){
    console.log(version)
    return
}
if (argv.o) {
    opener(
        protocol + argv.host + ':' + argv.port
    );
}
if(argv.D){
    let sp = cp.spawn(process.execPath, ['deamon.js'],{
        cwd: __dirname,
        stdio: ['ignore','ignore','ignore'],
        env: argv,
        // shell: true,
        detached: true  //http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
    } )
    //在非 Windows 平台上，如果将 options.detached 设为 true，则子进程会成为新的进程组和会话的领导者。
    // 注意，子进程在父进程退出后可以继续运行，不管它们是否被分离。
    //认情况下，父进程会等待被分离的子进程退出。 为了防止父进程等待给定的 subprocess，
    // 可以使用 subprocess.unref() 方法。 这样做会导致父进程的事件循环不包含子进程的引用计数，
    // 使得父进程独立于子进程退出，除非子进程和父进程之间建立了一个 IPC 信道。
    console.log('server already started in deamon')
    sp.unref()
    // process.exit(0);
} else {
    let config = Object.assign({}, defautConfig, argv)
    let server = new Server(config);
    server.start();
    console.log('server already started')
}






