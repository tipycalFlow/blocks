export class Menu {
    title: string;
    body: string;
    items: any[];

    constructor(title: string, body: string, items: any[]) {
        this.title = title;
        this.body = body;
        this.items = items;
    }
}
