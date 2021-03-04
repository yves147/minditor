const {
    contextBridge,
    ipcRenderer,
    remote
} = require("electron");

const fs = require("fs");

contextBridge.exposeInMainWorld(
    "api", {
    fs: require("fs"),
    read: (path) => {
        return fs.readFileSync(path).toString("utf-8")
    },
    directory: (path) => {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
    },
    send: (channel, data) => {
        let validChannels = ["toMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    open: function (a) {
        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: "Yves' Editor File Chooser",
            buttonLabel: "Open",
            properties: ["openDirectory"]
        }).then(a)
    },
    require,
    __dirname
}
);