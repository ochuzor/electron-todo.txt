import { IpcMain, IpcMainEvent } from 'electron';
import { IDataStore, TodoIndexDoc } from './data-store';
import { IpcStoreEvent } from './ipc-events-constants';

export class EventDataStoreServer {
    constructor(private ipcMain: IpcMain, private dataStore: IDataStore) {}

    start(): void {
        this.ipcMain.on(IpcStoreEvent.SaveText, this.onSaveText.bind(this));
        this.ipcMain.on(IpcStoreEvent.DeleteDoc, this.onDeleteDoc.bind(this));
        this.ipcMain.on(IpcStoreEvent.GetAllDocs, this.onGetAll.bind(this));
        this.ipcMain.on(IpcStoreEvent.SearchDocs, this.onSearch.bind(this));
        this.ipcMain.on(IpcStoreEvent.GetDoc, this.onGetItem.bind(this));
    }

    onSaveText(event: IpcMainEvent, data: string | TodoIndexDoc): void {
        this.dataStore.saveText(data).then(respData => {
            event.returnValue = respData;
        });
    }

    onDeleteDoc(event: IpcMainEvent, id: string): void {
        this.dataStore.deleteDoc(id).then(respData => {
            event.returnValue = respData;
        });
    }

    onGetAll(event: IpcMainEvent): void {
        event.returnValue = this.dataStore.getAll();
    }

    onSearch(event: IpcMainEvent, query: string): void {
        event.returnValue = this.dataStore.search(query);
    }

    onGetItem(event: IpcMainEvent, docId: string): void {
        event.returnValue = this.dataStore.getItem(docId);
    }
}
