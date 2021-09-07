/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const glob = require("glob");

const allTemplates = () => {
    return glob
        .sync("**/*.html", { cwd: path.join(__dirname, "static/templates") })
        .map((file) => `"modules/template/templates/${file}"`)
        .join(", ");
};

module.exports = (env) => {
    const defaults = {
        watch: false,
        mode: "development",
    };

    const environment = { ...defaults, ...env };
    const isDevelopment = environment.mode === "development";

    const config = {
        entry: "./src/main.ts",
        watch: environment.watch,
        devtool: "inline-source-map",
        stats: "minimal",
        mode: environment.mode,
        resolve: {
            alias: {
              "@package": path.resolve(__dirname, './package.json'),
              "@module": path.resolve(__dirname, './static/module.json'),
            },
            extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
        },
        output: {
            filename: "weather-control.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: '/static/',
        },
        devServer: {
            hot: true,
            writeToDisk: true,
            proxy: [
                {
                    context: (pathname) => {
                        return !pathname.match("^/sockjs");
                    },
                    target: "http://localhost:${npm_config_foundryport}",
                    ws: true,
                },
            ],
        },
        module: {
            rules: [
                isDevelopment
                    ? {
                        test: /\.html$/,
                        loader: "raw-loader",
                    }
                    : {
                        test: /\.html$/,
                        loader: "null-loader",
                    },
                {
                    test: /\.ts$/,
                    use: [
                        "ts-loader?configFile=tsconfig.webpack.json",
                        "webpack-import-glob-loader",
                        "source-map-loader",
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: '"__ALL_TEMPLATES__"',
                                replace: allTemplates,
                            },
                        },
                    ],
                },

                {
                    test: /\.(scss|css)$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ESLintPlugin({
                extensions: ["ts"],
            }),
            new CopyPlugin({
                patterns: [{
                    from: "static",
                    noErrorOnMissing: true
                }],
            }),
            new MiniCssExtractPlugin({
                filename: 'weather-control.css'
            })
        ],
    };

    if (!isDevelopment) {
        delete config.devtool;
    }

    return config;
};
