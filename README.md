# grunt-aem-clientlib-generator

A [Grunt](http://gruntjs.com/) plugin wrapper for {{aem-clientlib-generator}}.


## Installation
```bash
npm install grunt-aem-clientlib-generator
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks("grunt-aem-clientlib-generator");
```

## Usage
Define `clientlib` property in your grunt configuration file:

```javascript

grunt.initConfig({

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
          "app.js"    // it should be at the end (in the clientlib bundle process)
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
```

## Options

Options can be defined globally and for every task separately. The special file pattern properties
can also be defined for assets.

### Global Options

Global options will be used for all defined tasks and asset configurations until the property
will be overridden.

* `options` `{Object}` global configuration properties
  * `clientLibRoot` `{String}` Clientlib root path for all clientlibs
  * `cwd` `{String}` directory all paths start with; paths are stripped from the beginning
  * `expand` `{Boolean}` using glob pattern for file searching (default: true)
  * `flatten` `{Boolean}` removes the path component from source, keep the filename (default: true)

```javascript
clientlib: {

  // define options globally (used for all targets)
  options: {
    clientLibRoot: "./test/result/clientlibs-root", // clientlib root path
    cwd: "./test/src/frontend"
  },

  // task definitions follow.
}
```

### Task Options

Task options defines properties for a specific clientlib and will override properties from
global options. `cwd`, `expand` and `flatten` will also be used for all asset configurations.

* `options` `{Object}` task configuration properties
  * `path` `{String}` Clientlib root path (optional if `options.clientLibRoot` is set)
  * `cwd` `{String}` directory all paths start with; paths are stripped from the beginning
  * `expand` `{Boolean}` using glob pattern for file searching (default: true)
  * `flatten` `{Boolean}` removes the path component from source, keep the filename

```javascript
clientlib: {

  "clientlib.name": {
    options: {
      clientLibRoot: "./test/result/clientlibs-root", // clientlib root path
      cwd: "./test/src/frontend"
    },

    // asset configuration follows
    js: { },
    ...
  }
}
```

### Asset Options

Asset options will override global and task properties (if defined).

* `js|css]resources` `{Object}` asset configuration properties
  * `cwd` `{String}` directory all paths start with; paths are stripped from the beginning
  * `expand` `{Boolean}` using glob pattern for file searching (default: true)
  * `flatten` `{Boolean}` removes the path component from source, keep the filename
  * `base` `{String}` subpath under clientlib folder where the assets should be copied to (default: asset key, e.g. for
  asset configuration "js" is the base folder "js/"; use "." to copy files into the clientlib base)
  * `src` `{String|Array<String>}` globbing patterns for filename expansion
  * `rename` `{String|Function}`
    * if a string is defined, a single `src` will be renamed (ensure that `src` is a string)
    * if a function is specified it will be used for building the destination path for every source path
    Important: Keep in mind that the destination path will be used as a relative path to the clientlib base folder.

```javascript
clientlib: {

  "your.clientlib.name": {

    // asset configuration
    "js": {
      flatten: false,                 // keep folder structure
      cwd: "./test/src/frontend/js",  // choose another directory
      src: [
        "**/*.js"
      ]
    },
    ...
  }
}
```
