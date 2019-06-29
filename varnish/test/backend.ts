import { Server as FileServer } from 'node-static';
import * as http from 'http';

export function start(port = 3000, path = './public') {
    const fileServer = new FileServer(path);

    http.createServer((req, res) => {
        res.setHeader('X-Cache-Tags', '123 456 C:ABC');
        
        req
            .addListener('end', () => { fileServer.serve(req, res); })
            .resume();
    }).listen(port);
}

start();
