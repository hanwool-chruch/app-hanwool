const commonConfig = require("./webpack.config.common");

module.exports = {
  ...commonConfig,
  devtool: "source-map",
  mode: "development",
};
