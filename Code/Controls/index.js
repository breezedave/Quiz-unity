// Node.js WebSocket server script
const http = require('http');
const fs = require("fs");
const WebSocketServer = require('websocket').server;
const { app, globalShortcut, BrowserWindow,  } = require('electron');
const { spawn } = require("child_process");

const players = require("./fe/players.json");

const server = http.createServer((req, res) => {
    try {
        console.log(req.url);
        const url = req.url === "/"? "index.html": req.url;
        const content = fs.readFileSync("./fe/" + url);
        let contentType = "text/plain";

        if(/\.html/.test(url)) contentType = "text/html";
        if(/\.js/.test(url)) contentType = "text/javascript";
        if(/\.css/.test(url)) contentType = "text/css";
        if(/\.json/.test(url)) contentType = "application/json";

        res.writeHead(200, {'Content-Type': contentType});
        res.write(content);
        res.end();
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end();
    }
}).listen(3100);


const wsServer = new WebSocketServer({
    httpServer: server
});

const connections = [];

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connections.push(connection);

    connection.sendUTF(JSON.stringify({method: "PlayerList", message: JSON.stringify(players)}));

    connection.on('message', function(message) {
      connections.forEach(conn => {
          conn.sendUTF(message.utf8Data);
      });
    });

    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
})

const opts = {
    width: 840,
    height: 700,
    resizable: false,
    minimizable: false,
    frame: true,
    webPreferences: {
        nodeIntegration: true,
        devTools: true,
    },
}

app.on('ready', () => {
     const win = new BrowserWindow(opts);

     win.loadURL("http://localhost:3100");
     //win.removeMenu();
});

console.log("Listening on port 3100");

const ls = spawn("Quiz.exe", [], {
    cwd: "../Unity/Dist",
});
