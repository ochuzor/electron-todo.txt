export interface TodoIndexDoc {
    id: string | number;
    text: string;
}

export interface IDataStore {
    saveText(data: string | TodoIndexDoc): Promise<TodoIndexDoc>;
    deleteDoc(id: string): Promise<string>;
    getAll(): TodoIndexDoc[];
    getItem(id: string): TodoIndexDoc;
    search(term: string): TodoIndexDoc[];
}
