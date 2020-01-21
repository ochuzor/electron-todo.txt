type IndexDoc = {
    id: string;
    text: string;
};

export class TextIndexer {
    initWith(data: string): void;
    getDocument(id: string): IndexDoc;
    getAll(): IndexDoc[];
    addToIndex(doc: IndexDoc): void;
    removeFromIndex(id: string): void;
    search(term: string): IndexDoc[];
    toString(): string;
}