import _  from 'lodash';
import shortid from 'shortid';

import { TextIndexer } from '../../store/text-indexer';
import FileHandler from './file-handler';
import {
    IDataStore, 
    TodoIndexDoc
} from './data-store';

function textToData(text: string): TodoIndexDoc {
    return {
      id: shortid.generate(),
      text
    };
}

function isString(value: string | TodoIndexDoc): value is string {
    return _.isString(value);
}

export class FileDataStore implements IDataStore {
    constructor(private indexer: TextIndexer, private fileHandler: FileHandler) {}

    saveText(data: string | TodoIndexDoc): Promise<TodoIndexDoc> {
        return new Promise((resolve) => {
            const _data = isString(data) ? textToData(data) : _.cloneDeep(data);
            
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
