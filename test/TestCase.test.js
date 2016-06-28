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

var grunt = require("grunt");
var path = require("path");

exports.exports = {

  setUp: function (done) {

    this.expectedDir = path.join(__dirname, "expected", "clientlibs-root");
    this.resultDir = grunt.config.get("clientlib.options.clientLibRoot");

    done();
  },

  checkClientLibConfig: function (test) {

    var self = this;
    var jsonFiles = grunt.file.expand({cwd: this.expectedDir, filter: "isFile"}, "*.json");
    jsonFiles.forEach(function(jsonFile){

      var resultJson = path.join(self.resultDir, jsonFile);
      test.ok(grunt.file.exists(resultJson), resultJson + " does not exist");

      var expectedJson = path.join(self.expectedDir, jsonFile);
      test.equal(grunt.file.read(resultJson, "utf-8"), grunt.file.read(expectedJson, "utf-8"), "content does not match: " + jsonFile);
    });

    test.done();
  },

  checkClientLibContent: function (test) {

    var self = this;
    var files = grunt.file.expand({cwd: this.expectedDir, filter: "isFile"}, "**/*");
    files.forEach(function(file){

      var resultFile = path.join(self.resultDir, file);
      test.ok(grunt.file.exists(resultFile), resultFile + " does not exist");

      var expectedFile = path.join(self.expectedDir, file);
      test.equal(grunt.file.read(resultFile, "utf-8"), grunt.file.read(expectedFile, "utf-8"), "content does not match: " + file);
    });

    test.done();
  }

};
