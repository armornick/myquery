
type QueryInput = string | HTMLElement | HTMLElement[] | NodeList;

export class MyQuery {

    static fn = this.prototype;
    fn = MyQuery.fn;

    private elements!: HTMLElement[];

    constructor(query: QueryInput) {
        if (typeof(query) === 'string') {
            const nodeList = document.querySelectorAll(query);
            this.elements = Array.prototype.slice.call(nodeList);
        }
        else if (Array.isArray(query)) {
            this.elements = query;
        }
        else if (query instanceof NodeList) {
            this.elements = Array.prototype.slice.call(query);
        }
        else if (query instanceof HTMLElement) {
            this.elements = [query];
        }
        else {
            throw new Error(`invalid input for MyQuery; got ${ String(query) }`);
        }
    }

    each(fn: (element:MyQuery)=>any) {
        this.elements.forEach(element => {
            fn(new MyQuery(element));
        });
        return this;
    }

    attr(key: string, val: any = undefined) {
        if (val === undefined) {
            this.elements[0].getAttribute(key);
        } else {
            this.elements.forEach(item => {
                item.setAttribute(key, String(val));
            });
        }
    }

    hide() {
        this.each((item:MyQuery) => {
            item.attr('hidden', true);
        });
    }

}

export default function $(query: QueryInput) {
    return new MyQuery(query);
}
