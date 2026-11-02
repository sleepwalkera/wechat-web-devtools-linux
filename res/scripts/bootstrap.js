/* patch wechat devtools begin */
// 强制 GTK3：Electron 36 在 GTK4 可用的新桌面（如 Debian 13 / 新版 GNOME）会自动选用
// GTK4，与进程内仍加载的 GTK3 混用会触发 "Gtk-ERROR ... GTK 4 ... not supported"
// 并以 SIGTRAP 崩溃（issue #199）。在主进程最早阶段追加以覆盖所有 GUI 启动路径。
(() => {
    try {
        const { app } = require("electron");
        if (app && app.commandLine) {
            app.commandLine.appendSwitch("gtk-version", "3");
        }
    } catch (error) {
        // 非 Electron 主进程环境下忽略
    }
})();
(() => {
    try {
        {
            // 先检查app.asar.unpacked路径有没有文件，没有会使用app.asar路径的文件
            const originalExistsSync = require("fs-extra").existsSync;
            require("fs-extra").existsSync = function (path) {
                if (path.includes("wcc.exe")) {
                    path = path.replace("wcc.exe", "wcc");
                } else if (path.includes("wcsc.exe")) {
                    path = path.replace("wcsc.exe", "wcsc");
                }
                return originalExistsSync.apply(this, [path]);
            };
        }
    } catch (error) {
        process.stderr.write(error.message);
        process.stderr.write(error.stack);
    }
})();
/* patch wechat devtools end */