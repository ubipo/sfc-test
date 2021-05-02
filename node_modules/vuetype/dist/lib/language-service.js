"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var path = require("path");
var ts_file_map_1 = require("./ts-file-map");
var LanguageService = /** @class */ (function () {
    function LanguageService(rootFileNames, options) {
        var _this = this;
        this.options = options;
        this.files = new ts_file_map_1.TsFileMap();
        rootFileNames.forEach(function (file) {
            _this.files.updateFile(file);
        });
        var serviceHost = this.makeServiceHost(options);
        this.tsService = ts.createLanguageService(serviceHost, ts.createDocumentRegistry());
    }
    LanguageService.prototype.updateFile = function (fileName) {
        this.files.updateFile(fileName);
    };
    LanguageService.prototype.getHostVueFilePaths = function (fileName) {
        return this.files.getHostVueFilePaths(fileName);
    };
    LanguageService.prototype.getDts = function (fileName) {
        fileName = normalize(fileName);
        // Unsupported files or not found
        if (!this.files.canEmit(fileName)) {
            return {
                result: null,
                errors: []
            };
        }
        var output = this.tsService.getEmitOutput(fileName, true);
        var errors = this.collectErrorMessages(fileName);
        if (errors.length === 0) {
            var result = output.outputFiles
                .filter(function (file) { return /\.d\.ts$/.test(file.name); })[0].text;
            return {
                result: result,
                errors: []
            };
        }
        return {
            result: null,
            errors: errors
        };
    };
    LanguageService.prototype.makeServiceHost = function (options) {
        var _this = this;
        return {
            getScriptFileNames: function () { return _this.files.fileNames; },
            getScriptVersion: function (fileName) { return _this.files.getVersion(fileName); },
            getScriptSnapshot: function (fileName) {
                var src = _this.files.getSrc(fileName);
                return src && ts.ScriptSnapshot.fromString(src);
            },
            getCurrentDirectory: function () { return process.cwd(); },
            getCompilationSettings: function () { return options; },
            getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
            resolveModuleNames: function (moduleNames, containingFile) {
                return moduleNames.map(function (name) {
                    if (/\.vue$/.test(name)) {
                        return {
                            resolvedFileName: normalize(path.resolve(path.dirname(containingFile), name)),
                            extension: ts.Extension.Ts
                        };
                    }
                    return ts.resolveModuleName(name, containingFile, options, ts.sys).resolvedModule;
                });
            }
        };
    };
    LanguageService.prototype.collectErrorMessages = function (fileName) {
        var allDiagnostics = this.tsService.getCompilerOptionsDiagnostics()
            .concat(this.tsService.getSyntacticDiagnostics(fileName))
            .concat(this.tsService.getSemanticDiagnostics(fileName));
        return allDiagnostics.map(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            if (diagnostic.file && diagnostic.start) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                return "[" + (line + 1) + "," + (character + 1) + "] " + message;
            }
            return message;
        });
    };
    return LanguageService;
}());
exports.LanguageService = LanguageService;
// .ts suffix is needed since the compiler skips compile
// if the file name seems to be not supported types
function normalize(fileName) {
    if (/\.vue$/.test(fileName)) {
        return fileName + '.ts';
    }
    return fileName;
}
