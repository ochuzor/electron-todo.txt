import { isString, cloneDeep } from 'lodash';
import shortid from 'shortid';

import { TextIndexer } from './indexer/text-indexer';
import FileStorageHandler from './file-storage-handler';
import { IDataStore, TodoIndexDoc } from './data-store';

const indexOpts = {
    doc: {
        id: 'id',
        field: ['text'],
    },
};

function textToData(text: string): TodoIndexDoc {
    return {
        id: shortid.generate(),
        text,
    };
}

function isText(value: string | TodoIndexDoc): value is string {
    return isString(value);
}

export class FileDataStore implements IDataStore {
    constructor(
        private indexer: TextIndexer,
        private storageHandler: FileStorageHandler
    ) {}

    static FromFile(file: string): FileDataStore {
        const indexer = new TextIndexer(indexOpts);
        const fileStorageHandler = new FileStorageHandler(file);
        if (FileStorageHandler.FileExists(file)) {
            indexer.initWith(fileStorageHandler.readData());
        }

        return new FileDataStore(indexer, fileStorageHandler);
    }

    saveText(data: string | TodoIndexDoc): Promise<TodoIndexDoc> {
        return new Promise(resolve => {
            const _data = isText(data) ? textToData(data) : cloneDeep(data);

            this.indexer.addToIndex(_data);
            this.storageHandler.writeData(this.indexer.toString());
            resolve(_data);
        });
    }

    deleteDoc(id: string): Promise<string> {
        return new Promise(resolve => {
            this.indexer.removeFromIndex(id);
            this.storageHandler.writeData(this.indexer.toString());
            resolve(id);
        });
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
