import ts = require('typescript');
export interface Result<T> {
    result: T | null;
    errors: string[];
}
export declare class LanguageService {
    private options;
    private files;
    private tsService;
    constructor(rootFileNames: string[], options: ts.CompilerOptions);
    updateFile(fileName: string): void;
    getHostVueFilePaths(fileName: string): string[];
    getDts(fileName: string): Result<string>;
    private makeServiceHost(options);
    private collectErrorMessages(fileName);
}
