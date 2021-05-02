"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vueCompiler = require("vue-template-compiler");
var file_util_1 = require("./file-util");
var TsFileMap = /** @class */ (function () {
    function TsFileMap() {
        this.files = new Map();
    }
    Object.defineProperty(TsFileMap.prototype, "fileNames", {
        get: function () {
            return Array.from(this.files.keys()).filter(function (file) { return isSupportedFile(file); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If the file does not exists or it is unsupported type,
     * we does not try emit output or the compiler throws an error
     */
    TsFileMap.prototype.canEmit = function (fileName) {
        var file = this.getFile(fileName);
        return file != null && !!file.text;
    };
    TsFileMap.prototype.getSrc = function (fileName) {
        var file = this.getFile(fileName);
        // If it does not processed yet,
        // register it into map with returning file data
        if (!file) {
            file = this.loadFile(fileName);
            this.registerFile(file);
        }
        return file.text;
    };
    /**
     * Collect host vue file paths of input ts file.
     * If the input is a vue file, just return it.
     */
    TsFileMap.prototype.getHostVueFilePaths = function (fileName) {
        if (/\.vue$/.test(fileName)) {
            return [fileName];
        }
        var entries = Array.from(this.files.entries());
        return entries
            .filter(function (_a) {
            var key = _a[0], file = _a[1];
            return !/\.vue$/.test(key)
                && file.srcPath === fileName;
        })
            .map(function (_a) {
            var _ = _a[0], file = _a[1];
            return file.rawFileName;
        });
    };
    TsFileMap.prototype.getVersion = function (fileName) {
        var file = this.getFile(fileName);
        return file && file.version.toString();
    };
    TsFileMap.prototype.updateFile = function (fileName) {
        var file = this.loadFile(fileName);
        this.registerFile(file);
    };
    /**
     * Load a TS file that specifed by the argument
     * If .vue file is specified, it extract and retain TS code part only.
     */
    TsFileMap.prototype.loadFile = function (fileName) {
        var rawFileName = getRawFileName(fileName);
        var file = this.getFile(fileName) || {
            rawFileName: rawFileName,
            srcPath: undefined,
            version: 0,
            text: undefined
        };
        var src = file_util_1.readFileSync(rawFileName);
        if (src && isVueFile(rawFileName)) {
            var extracted = extractCode(src, fileName);
            src = extracted.content;
            file.srcPath = extracted.srcPath;
        }
        if (src !== file.text) {
            file.version += 1;
            file.text = src;
        }
        return file;
    };
    /**
     * Just returns a file object
     *
     * Returns undefined
     *   - Not loaded yet
     * Return TsFile but file.text is undefined
     *   - Loaded but not found or unsupported
     */
    TsFileMap.prototype.getFile = function (fileName) {
        return this.files.get(fileName);
    };
    TsFileMap.prototype.registerFile = function (file) {
        var rawFileName = file.rawFileName;
        if (isVueFile(rawFileName)) {
            // To ensure the compiler can process .vue file,
            // we need to add .ts suffix to file name
            this.files.set(rawFileName + '.ts', file);
        }
        this.files.set(rawFileName, file);
    };
    return TsFileMap;
}());
exports.TsFileMap = TsFileMap;
/**
 * Extract TS code from single file component
 * If there are no TS code, return undefined
 */
function extractCode(src, fileName) {
    var script = vueCompiler.parseComponent(src, { pad: true }).script;
    if (script == null || script.lang !== 'ts') {
        return {
            content: undefined,
            srcPath: undefined
        };
    }
    // Load an external TS file if it referred via src attribute.
    if (script.src && isSupportedFile(script.src)) {
        var srcPath = path.resolve(path.dirname(fileName), script.src);
        return {
            content: file_util_1.readFileSync(srcPath),
            srcPath: srcPath
        };
    }
    return {
        content: script.content,
        srcPath: undefined
    };
}
function isSupportedFile(fileName) {
    return /\.(tsx?|jsx?)$/.test(fileName);
}
function isVueFile(fileName) {
    return /\.vue(?:\.ts)?$/.test(fileName);
}
// If fileName is already suffixed by `.ts` remove it
function getRawFileName(fileName) {
    if (/\.vue\.ts$/.test(fileName)) {
        return fileName.slice(0, -3);
    }
    return fileName;
}
