class HideIt {

    /**
    * Retrieves the headers of the table.
    * @returns {Array<string>} An array containing the innerText of each th element in the first row of the table.
    */
    get tableHeaders() {
        return [...this.#table.querySelectorAll("tr:nth-child(1) th")].map((node) => node.innerText);
    }

    /** @type {HTMLTableElement} */
    #table;

    /** @type {Object<string, number>} */
    #breakpoints;

    /** @type {number} */
    #resizeTimeout;

    /** @type {null | number} */
    #resizeTimer;

    /**
     * @param {string} selector CSS selector
     * @param {{breakpoints: Object<string, number>, resizeTimeout: number, renderOnResize: boolean}} options 
     */
    constructor(selector, options = {}) {
        this.#table = document.querySelector(selector);
        if (!this.#table) {
            throw new Error("Invalid selector")
        }
        this.#table.classList.add("hideit");
        
        this.#breakpoints = options.breakpoints || {
            "collapse-xs": 576,
            "collapse-sm": 768,
            "collapse-md": 992,
            "collapse-lg": 1200,
            "collapse": Number.MAX_SAFE_INTEGER,
        }
        this.#resizeTimer = null;
        this.#resizeTimeout = parseInt(options.resizeTimeout) || 150;

        this.process();

        this.#table.addEventListener("click", this.#handleToggle.bind(this));

        if (!options.hasOwnProperty("renderOnResize") ||
            (options.hasOwnProperty("renderOnResize") && options.renderOnResize)
        ) {
            window.addEventListener("resize", this.#handleResize.bind(this));
        }
    }

    process(rebuildExpanded = true) {
        this.#table.querySelectorAll("tbody tr:not(.child)").forEach((tr) => {
            tr.dataset.row = tr.rowIndex;
        });

        this.#table.querySelectorAll("thead > tr > th").forEach((th, i) => {
            let responsive = [...th.classList].filter(c => Object.keys(this.#breakpoints).includes)
            if (responsive.length == 0)
                return;

            this.#table.querySelectorAll(`tbody tr:not(.child) td:nth-child(${i + 1})`).forEach((td) => {
                td.classList.add(responsive[0])
            });
        });

        this.#updateResponsiveClass();

        if (rebuildExpanded) {
            this.#table.querySelectorAll("tbody > tr.hideit-expanded").forEach((tr) => {
                /** @type {HTMLTableRowElement} */
                let collapsible = tr.nextSibling;
                /** @type {HTMLUListElement} */
                let ul = collapsible.getElementsByClassName("hideit-details")[0];
    
                ul.innerHTML = null;
                tr.querySelectorAll("td.hideit-hidden").forEach((td) => {
                    ul.appendChild(this.#createChildLI(td));
                })
            })
        }

        this.#updateToggleButton();
    }

    render() {
        this.#updateResponsiveClass();

        this.#table.querySelectorAll("tbody > tr.hideit-expanded").forEach((tr) => {
            let collapsible = tr.nextSibling;
            /** @type {HTMLUListElement} */
            let ul = collapsible.getElementsByClassName("hideit-details")[0];

            for (let td of tr.cells) {
                if (td.classList.contains("hideit-hidden") && !this.#inChildUl(ul, td.cellIndex)) {
                    let index = ul.children.length;
                    while (true) {
                        if (index == 0) {
                            ul.prepend(this.#createChildLI(td));
                            break;
                        }
                        index--;
                        if (td.cellIndex > ul.children[index].dataset.column) {
                            ul.children[index].after(this.#createChildLI(td));
                            break;
                        }
                    }
                    continue;
                }

                if (!td.classList.contains("hideit-hidden") && this.#inChildUl(ul, td.cellIndex)) {
                    for (let li of ul.getElementsByTagName("li")) {
                        if (parseInt(li.dataset.column) != td.cellIndex) {
                            continue;
                        }

                        /** @type {HTMLSpanElement} */
                        let span = li.getElementsByClassName("hideit-data")[0];
                        if (span.children.length > 0) {
                            tr.cells[parseInt(li.dataset.column)].append(...span.children);
                        }
                        li.remove();
                    }
                }
            }
        });

        this.#updateToggleButton();
    }

    /**
     * Retrieves the hidden class names based on the current window width and breakpoints.
     * 
     * @returns {Array<string>} An array of class names that are hidden based on the current window width.
     */
    hiddenClasses() {
        return Object.keys(this.#breakpoints)
            .filter((k) => this.#breakpoints[k] >= window.innerWidth)
    }

    /**
     * Checks if a cell is present in a ul.
     * 
     * @param {HTMLUListElement} ul - The child element.
     * @param {number} column - The column value of the cell.
     * @returns {boolean} True if the cell is present in the ul, false otherwise.
     */
    #inChildUl(ul, column) {
        for (let li of ul.getElementsByTagName("li")) {
            if (parseInt(li.dataset.column) == column) {
                return true
            }
        }
        return false
    }

    /**
     * Creates a child list item element for a given table cell.
     * 
     * @param {HTMLTableCellElement} td - The table cell element.
     * @returns {HTMLLIElement} The created list item element.
     */
    #createChildLI(td) {
        let li = document.createElement("li");
        li.dataset.column = td.cellIndex;

        li.appendChild(Object.assign(document.createElement("span"), {
            classList: ["hideit-title"],
            innerHTML: this.tableHeaders[td.cellIndex],
        }));

        li.appendChild(Object.assign(document.createElement("span"), {
            classList: ["hideit-data"],
        }));

        if (td.children.length > 0) {
            li.children[1].append(...td.children)
        } else {
            li.children[1].innerHTML = td.innerText
        }

        return li
    }

    #updateResponsiveClass() {
        this.#table.querySelectorAll("thead > tr > th").forEach((th, i) => {
            let responsive = [...th.classList].filter(c => Object.keys(this.#breakpoints).includes(c));
            if (responsive.length == 0)
                return;
            
            if (this.hiddenClasses().includes(responsive[0])) {
                th.classList.add("hideit-hidden")
            } else {
                th.classList.remove("hideit-hidden")
            }

            this.#table.querySelectorAll(`tbody tr:not(.child) td:nth-child(${i + 1})`).forEach((td) => {
                if (this.hiddenClasses().includes(responsive[0])) {
                    td.classList.add("hideit-hidden")
                } else {
                    td.classList.remove("hideit-hidden")
                }
            });
        });
    }

    #updateToggleButton() {
        this.#table.querySelectorAll("tbody > tr:not(.child)").forEach((tr) => {
            tr.querySelector("td.hideit-toggler")?.classList.remove("hideit-toggler");

            if (tr.querySelector("td.hideit-hidden")) {
                tr.classList.add("hideit-has-child")
                tr.querySelector('td:not(.hideit-hidden)')?.classList.add("hideit-toggler");
            } else {
                tr.classList.remove("hideit-has-child")
                if (tr.classList.contains("hideit-expanded")) {
                    this.#table.rows[tr.rowIndex + 1].remove()
                    tr.classList.remove("hideit-expanded");
                }
            }
        });
    }

    /**
     * Handle screen resize.
     * 
     * @param {UIEvent} event 
     */
    #handleResize(event) {
        if (this.#resizeTimeout <= 0) {
            this.render.bind(this);
        } else {
            clearTimeout(this.#resizeTimer);
            this.#resizeTimer = setTimeout(this.render.bind(this), this.#resizeTimeout);
        }
    }

    /**
     * Handle collapsible menu button click
     * 
     * @param {MouseEvent} event 
     */
    #handleToggle(event) {
        if (!event.target.classList.contains("hideit-toggler"))
            return;

        /** @type {HTMLTableRowElement} */
        let tr = event.target.closest("tr");

        if (tr.classList.contains("hideit-expanded")) {
            /** @type {HTMLTableRowElement\} */
            let collapsible = tr.nextSibling;

            collapsible.querySelectorAll("td > ul.hideit-details > li").forEach((li) => {
                for (let row of this.#table.rows) {
                    if (row.dataset.row != tr.dataset.row)
                        continue;

                    let span = li.querySelector(".hideit-data");
                    if (span.children.length > 0) {
                        this.#table.rows[row.rowIndex].cells[parseInt(li.dataset.column)].append(...span.children);
                    } else {
                        this.#table.rows[row.rowIndex].cells[parseInt(li.dataset.column)].innerHTML = span.innerHTML;
                    }
                    li.remove();
                    break;
                }
            })

            collapsible.remove();
        } else {
            let collapsible = Object.assign(document.createElement("tr"), {
                classList: ["child"],
                colspan: "100%",
                innerHTML: `<td class="child" colspan="100%"><ul class="hideit-details" data-row="${tr.dataset.row}"></ul></td>`,
            });

            [...tr.getElementsByClassName("hideit-hidden")].forEach((td) => {
                collapsible.querySelector("td > ul").appendChild(this.#createChildLI(td));
            });

            tr.after(collapsible);
        }

        tr.classList.toggle("hideit-expanded");
    }
}