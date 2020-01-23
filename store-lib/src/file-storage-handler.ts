import fs from 'fs';

export default class FileStorageHandler {
    constructor(private file: string) {}

    static FileExists(file: string) {
        return fs.existsSync(file);
    }

    writeData(text: string): void {
        fs.writeFileSync(this.file, text, 'utf8');
    }

    readData(): string {
        return fs.readFileSync(this.file, 'utf8');
    }
}
