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
var _ = require("lodash");
var clientlib = require("aem-clientlib-generator");

module.exports = function(grunt) {

  grunt.registerMultiTask("clientlib", "Generates all necessary files for AEM ClientLibs", function() {

    var done = this.async();
    var clientLibKeys = ["embed", "dependencies", "cssProcessor", "jsProcessor", "allowProxy", "longCacheKey", "categories", "serializationFormat"];
    var assetDep = {
      "cssProcessor": "css",
      "jsProcessor": "js"
    };
    var clientLibName = this.target;
    var options       = this.options({
      flatten: true,
      expand: true,
      filter: "isFile",
      clientLibRoot: "./"
    });

    grunt.log.writeln("Start clientlib generator for target: " + this.target);
    grunt.log.writeln("Clientlib Path: " + options.clientLibRoot);


    function normalizePattern(obj) {
      var res = _.clone(obj);
      var isArray = _.isArray(obj);

      // convert simplest way
      if (_.isString(res)) {
        res = [res];
      }
      // convert simple patten to source-only object
      if (_.isArray(res)) {
        res = {
          src: res
        };
      }
      res.options = {};

      ["cwd", "expand", "flatten", "filter"].forEach(function(prop){
        if (!isArray && !_.isUndefined(obj[prop])) {
          res.options[prop] = obj[prop];
        } else if (!_.isUndefined(options[prop])) {
          res.options[prop] = options[prop];
        }
      });

      // convert renaming property to function for normalizing task
      if (_.isString(res.rename)) {
        var newName = res.rename;
        res.options.rename = function(dest) {
          return path.join(dest, newName);
        }
      }
      return res;
    }

    var data = this.data;
    var assets = [];
    ["js", "css", "resources"].forEach(function(type){
      var item;

      if (data[type]) {
        item = normalizePattern(data[type]);

        // default path: append the type to the base dir
        if (_.isUndefined(item.base)) {
          item.base = type;
        }

        var assetItem = {
          type: type,
          base: item.base,
          files: grunt.file.expandMapping(item.src, "./", item.options)
        };

        assetItem.files = assetItem.files.map(function(file){
          // remove the unnecessary array wrapper
          if (_.isArray(file.src)) {
            file.src = file.src[0];
          }
          return file;
        });

        assets.push(assetItem);
      }
    });

    var clientLib = {
      path: options.path || options.clientLibRoot,
      name: clientLibName,
      assets: assets
    };

    clientLibKeys.forEach(function(nodeKey) {
      if (data.hasOwnProperty(nodeKey)) {
        if (!assetDep[nodeKey] || assetDep[nodeKey] && data[assetDep[nodeKey]]) {
          clientLib[nodeKey] = data[nodeKey];
        }
      }
    });

    clientlib(clientLib, done);

  });

};
