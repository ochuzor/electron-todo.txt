import { IpcRenderer } from 'electron';

import { IpcStoreEvent } from './ipc-events-constants';
import {
    IDataStore, 
    TodoIndexDoc
} from './data-store';

export class IpcRendererDataStore implements IDataStore {
    constructor(private ipcRenderer: IpcRenderer) {}
    
    saveText(text: string): Promise<TodoIndexDoc> {
        return new Promise(resolve => {
            resolve(this.ipcRenderer.sendSync(IpcStoreEvent.SaveText, text));
        });
    }
    
    deleteDoc(id: string): Promise<string> {
        return new Promise(resolve => {
            resolve(this.ipcRenderer.sendSync(IpcStoreEvent.DeleteDoc, id));
        });
    }
    
    getAll(): TodoIndexDoc[] {
        return this.ipcRenderer.sendSync(IpcStoreEvent.GetAllDocs);
    }
    
    search(query: string): TodoIndexDoc[] {
        return this.ipcRenderer.sendSync(IpcStoreEvent.SearchDocs, query);
    }
    
    getItem(id: string): TodoIndexDoc {
        return this.ipcRenderer.sendSync(IpcStoreEvent.GetDoc, id);
    }
}

