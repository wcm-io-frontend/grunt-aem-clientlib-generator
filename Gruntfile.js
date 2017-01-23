/*
 *  Copyright (c) 2016 pro!vision GmbH and Contributors
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

"use strict";

var path = require("path");

module.exports = function(grunt) {

  // load local tasks
  grunt.loadTasks('tasks');

  // Project configuration.
  grunt.initConfig({

    clean: {
      "result": ["test/result/**"]
    },

    nodeunit: {
      tests: ["test/*.test.js"]
    },

    clientlib: {

      // define options globally (used for all targets)
      options: {
        clientLibRoot: "./test/result/clientlibs-root", // clientlib root path
        cwd: "./test/src/frontend"
      },

      // target key will be used as clientlib name
      "test.base.apps.mainapp": {

        // collect all JS files within js directory
        "js": {
          flatten: false, // keep source directory structure
          cwd: "./test/src/frontend/js",

          // Important: the order defines how AEM merges/bundles the JavaScript files.
          // This is important for dependencies within JavaScript files
          src: [
            "**/*.js",  // find all JavaScript files
            "!app.js",  // exclude app.js because
            "app.js"    // it should be at the end (in the clientlib)
          ]
        },

        // collect all CSS files within css directory
        // Important: use globbing only if the files haven't any dependencies to
        // each other. The order can be different between Unix and Windows systems.
        "css": "css/**/*.css"
      },

      "test.base.apps.secondapp": {
        options: {
          cwd: "./test/src/frontend/secondapp"  // will override the global `cwd`
        },
        "embed": [
          "test.base.apps.thirdapp"   // this clientlib will be auto embedded in AEM (kind of `merging`)
        ],
        "dependencies": [
          "test.base.apps.mainapp"    // define clientlib dependency
        ],
        "cssProcessor": ["default:none", "min:none"], // disable minification
        "jsProcessor": ["default:none", "min:gcc"], // using google closure compiler instead of YUI for minification

        // example for copy & rename (for a single file)
        "js": {

          // source to be copied
          src: "js/lib.js",

          // renames lib.js to secondapp-lib.js
          rename: "secondapp-lib.js"
        },

        "css": {
          base: "style",    // change base dir from `css` (default) to `style` within the client lib folder
          src: "main.css"
        },
        "resources": {
          cwd: "./test/src/frontend/",
          base: ".",      // using root from this clientlib
          flatten: false, // and keep directory structure from src
          src: [
            "resources/**",
            "!resources/**/*.txt"
          ]
        }
      },
      "test.base.apps.thirdapp": {

        // keep in mind we are using `cwd` from options
        resources: {
          base: ".",      // use the clientlib subfolder instead of the default `resources` directory
          flatten: false, // keep the original folder structure from src
          src: [
            "resources/**/*.txt"
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");

  // default task will be used for 'frontend sync'
  grunt.registerTask("default", ["clean", "clientlib", "nodeunit"]);
};
