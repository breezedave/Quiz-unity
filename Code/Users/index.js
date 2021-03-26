const Server = require("./src/be/Server.js");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const init = () => {
    const settings = getSettings();
    const server = new Server(settings);

    const logColors = {
        RESET: "\x1b[0m",
        RED: "\x1b[31m",
        GREEN: "\x1b[32m",
    };

    const {WHITE, RED, GREEN} = logColors;

    webpack(webpackConfig).watch({}, (err, data) => {
        console.log(RESET, `\n\n${compiler.toUpperCase()}: `);
        if(err) {
            console.error(RED, err);
        } else {
            let errors = false;

            data.compilation.errors.forEach(_ => {
                errors = true;
                console.error(RED, _);
            })
            if(!errors) console.log(GREEN, "Compiled");
        }
        console.log(WHITE, "");
    });

};

const getSettings = () => {
    const settingsTag = process.argv.indexOf("--settings");

    return (settingsTag >= 0 && process.argv.length > settingsTag + 1)?
        require(process.argv[settingsTag + 1]):
        require("./settings.json");
}

init();
