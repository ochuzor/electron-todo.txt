import fs from 'fs';

export default class FileHandler {
    constructor(private file: string) {}
    writeData(text: string): void {
        fs.writeFileSync(this.file, text, 'utf8');
    }
  
    readData(): string {
        return fs.readFileSync(this.file, 'utf8');
    }
}
