import { UixAuthoring, define, setOrRemove, sizeAttributes, warn } from "./core.js";

/**
 * <uix-app heading="…" logo="…" background-pattern="…">: the root of an application. Renders the title as
 * a first-level heading, a div with the heading role, in every application, nested or not, after the logo
 * image when there is one (an image URL; decorative, since the title names the application); warns about an
 * unknown background pattern.
 */
export class UixApp extends UixAuthoring {
    static observedAttributes = ["heading", "logo", "background-pattern"];

    static layout = "container";

    static layoutAccepted = ["grow", "span", "align", "justify", "gap", "padding"];

    static layoutReasons = {
        ...Object.fromEntries(sizeAttributes.map((name) => [name, "the application always takes all the space of its parent; size its parent instead"])),
        wrap: "the application stacks its children in a column, which never wraps",
        scroll: "the application always scrolls what does not fit",
    };

    /**
     * Values of background-pattern.
     *
     * @type {readonly string[]}
     */
    static backgroundPatterns = [
        "none",
        "dots",
        "staggered-dots",
        "grid",
        "graph-paper",
        "horizontal-lines",
        "vertical-lines",
        "diagonal-lines",
        "crosshatch",
        "checkerboard",
        "zigzag",
    ];

    sync() {
        const pattern = this.getAttribute("background-pattern");
        if (pattern !== null && !UixApp.backgroundPatterns.includes(pattern)) {
            warn(this, `background-pattern="${pattern}" is unknown, so the default pattern (dots) is drawn. Write one of: ${UixApp.backgroundPatterns.join(", ")}.`);
        }

        const text = this.getAttribute("heading");
        const logo = this.getAttribute("logo");
        let heading = this.querySelector(":scope > [data-heading]");
        if (!text && !logo) {
            heading?.remove();
            return;
        }
        if (!heading) {
            heading = document.createElement("div");
            heading.setAttribute("data-heading", "");
            this.prepend(heading);
        }
        setOrRemove(heading, "role", text ? "heading" : null);
        setOrRemove(heading, "aria-level", text ? "1" : null);

        let image = null;
        if (logo) {
            image = document.createElement("img");
            image.setAttribute("data-logo", "");
            image.alt = "";
            image.src = logo;
        }
        let title = null;
        if (text) {
            title = document.createElement("span");
            title.setAttribute("data-text", "");
            title.textContent = text;
        }
        heading.replaceChildren(...[image, title].filter((node) => node !== null));
    }
}

define("uix-app", UixApp);
