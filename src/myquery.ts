
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

    get node(): HTMLElement {
        return this.elements[0];
    }

    each(fn: (element:MyQuery)=>any) {
        this.elements.forEach(element => {
            fn(new MyQuery(element));
        });
        return this;
    }

    attr(key: string, val: any = undefined) {
        if (val === undefined) {
            return this.node.getAttribute(key);
        } else {
            this.elements.forEach(item => {
                if (val) {
                    item.setAttribute(key, String(val));
                } else {
                    item.removeAttribute(key);
                }
            });
            return this.node.getAttribute(key);
        }
    }

    addClass(clas: string) {
        return this.each(item => {
            item.node.classList.add(clas);
        });
    }

    removeClass(clas: string) {
        return this.each(item => {
            item.node.classList.remove(clas);
        });
    }

    toggleClass(clas: string) {
        return this.each(item => {
            item.node.classList.toggle(clas);
        });
    }

    hide() {
        this.each((item:MyQuery) => {
            item.attr('hidden', true);
        });
        return this;
    }

    show() {
        return this.each((item:MyQuery) => {
            item.attr('hidden', null);
        });
    }

    toggle() {
        return this.each(item => {
            if (item.attr('hidden')) {
                item.attr('hidden', null);
            } else {
                item.attr('hidden', true);
            }
        })
    }

    on(event:keyof HTMLElementEventMap, handler:any) {
        return this.each(item => {
            item.node.addEventListener(event, handler);
        });
    }

    click(handler: (e:MouseEvent)=>void) {
        return this.on('click', handler);
    }

    fadeIn() {
        return this.addClass('fade-in');
    }

    fadeOut() {
        return this.addClass('fade-out');
    }

    fadeToggle() {
        return this.toggleClass('fade');
    }

    text(val: any = undefined) {
        if (val === undefined) {
            return this.node.textContent;
        } else {
            if (val) {
                return this.each(item => {
                    item.node.textContent = String(val);
                });
            } else {
                return this.each(item => {
                    item.node.textContent = "";
                });
            }
        }
    }

    html(val?: string) {
        if (val === undefined) {
            return this.node.innerHTML;
        } else {
            return this.each(item => {
                item.node.innerHTML = val;
            });
        }
    }

    remove() {
        return this.each(item => {
            item.node.remove();
        });
    }

    empty() {
        return this.each(item => {
            // NOTE:
            // I don't know the performance of this vs removing each child manually
            // but simplicity and readability is key in this little example
            item.node.innerHTML = "";
        })
    }

    css(input: string|object, value?:string){
        if (typeof(input) === 'object' || value) {
            return this.each(item => {
                if (typeof(input) === 'object') {
                    const properties = Object.keys(input);
                    for (const property of properties) {
                        Reflect.set(item.node.style, property, Reflect.get(input, property));
                    }
                }
                else {
                    if (value) {
                        const styles = window.getComputedStyle(item.node);
                        Reflect.set(styles, input, value);
                    }
                }
            });
        }
        else {
            const styles = window.getComputedStyle(this.node);
            return Reflect.get(styles, input);
        }
    }

}

export default function $(query: QueryInput) {
    return new MyQuery(query);
}
