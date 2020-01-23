import {
    isString, 
    cloneDeep
} from 'lodash';
import shortid from 'shortid';

import { TextIndexer } from './indexer/text-indexer';
import FileHandler from './file-handler';
import {
    IDataStore, 
    TodoIndexDoc
} from './data-store';

const indexOpts = {
    doc: {
        id: 'id',
        field: ['text']
    }
};

function textToData(text: string): TodoIndexDoc {
    return {
      id: shortid.generate(),
      text
    };
}

function isText(value: string | TodoIndexDoc): value is string {
    return isString(value);
}

export class FileDataStore implements IDataStore {
    constructor(private indexer: TextIndexer, private fileHandler: FileHandler) {}

    static FromFile(file: string): FileDataStore {
        const indexer = new TextIndexer(indexOpts);
        const fileHandler = new FileHandler(file);
        if (FileHandler.FileExists(file)) {
            indexer.initWith(fileHandler.readData());
        }
        
        return new FileDataStore(indexer, fileHandler);
    }

    saveText(data: string | TodoIndexDoc): Promise<TodoIndexDoc> {
        return new Promise((resolve) => {
            const _data = isText(data) ? textToData(data) : cloneDeep(data);
            
            this.indexer.addToIndex(_data);
            this.fileHandler.writeData(this.indexer.toString());
            resolve(_data);
        });
    }

    deleteDoc(id: string): Promise<string> {
        return new Promise(resolve => {
            this.indexer.removeFromIndex(id);
            this.fileHandler.writeData(this.indexer.toString());
            resolve(id);
        })
    }

    getAll(): TodoIndexDoc[] {
        return this.indexer.getAll();
    }

    getItem(id: string): TodoIndexDoc {
        return this.indexer.getDocument(id);
    }

    search(term: string): TodoIndexDoc[] {
        return this.indexer.search(term);
    }
}
