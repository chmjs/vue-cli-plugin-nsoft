const fs = require('fs');
const rimraf = require('rimraf');

module.exports = (api, options, rootOptions) => {

  const removeConfigurations = () => {
    const packageConfig = api.resolve('./package.json');
    const configsToRemove = ['eslintConfig','browserslist','postcss','jest'];

    fs.readFile(packageConfig, 'utf8', (err, data) => {
      let parsedConfig = JSON.parse(data);

      configsToRemove.forEach((config) => {
        if(parsedConfig[config]) {
          delete parsedConfig[config]
        }
      })

      const modifiedPackageConfig = JSON.stringify(parsedConfig, null, 2);
      fs.writeFile(packageConfig, modifiedPackageConfig, (err) => {
        api.exitLog('Something went wrong..', err);
      });
    });
  }


  api.extendPackage({
    name: options.name,
    description: options.description,
    author: options.author,
    contributors: [],
    version: "0.1.0",
    private: true,
    scripts: {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint",
      "test:coverage": "npm run test:unit && codecov",
      "test:e2e": "vue-cli-service test:e2e",
      "test:unit": "vue-cli-service test:unit",
      "test:unitUpdate": "vue-cli-service test:unit --u",
      "test:unitWatch": "vue-cli-service test:unit --watch",
    },
    dependencies: {
      "axios": "^0.18.0",
      "lodash": "^4.17.11",
      "numeral": "^2.0.6",
      "vue": "^2.5.17",
      "vue-router": "^3.0.1",
      "vuex": "^3.0.1"
    },
    devDependencies: {
      "@vue/cli-plugin-babel": "^3.0.5",
      "@vue/cli-plugin-e2e-nightwatch": "^3.0.5",
      "@vue/cli-plugin-eslint": "^3.0.5",
      "@vue/cli-plugin-unit-jest": "^3.0.5",
      "@vue/cli-service": "^3.0.5",
      "@vue/eslint-config-airbnb": "^4.0.0",
      "@vue/test-utils": "^1.0.0-beta.20",
      "babel-core": "7.0.0-bridge.0",
      "babel-eslint": "^10.0.1",
      "babel-jest": "^23.6.0",
      "codecov": "^3.1.0",
      "eslint": "^5.8.0",
      "eslint-plugin-vue": "^5.0.0-0",
      "node-sass": "^4.9.0",
      "sass-loader": "^7.0.1",
      "vue-template-compiler": "^2.5.17"
    }
  });

  api.render('./template/default', {
    ...options,
  });

  api.onCreateComplete(() => {

    removeConfigurations();

    const pathsToRemove = ['./src/components/HelloWorld.vue','./src/views','./src/router.js'];
    pathsToRemove.forEach((path) => {
      rimraf(api.resolve(path), () => {});
    });
  });
}