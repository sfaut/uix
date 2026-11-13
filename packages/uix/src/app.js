import { UixAuthoring, define, layoutAttributes, sizeAttributes, warn } from "./core.js";

/**
 * <uix-app heading="…" background-pattern="…">: the root of an application. Renders the title as a
 * first-level heading, a div with the heading role, in every application, nested or not; warns about an
 * unknown background pattern.
 */
export class UixApp extends UixAuthoring {
    static observedAttributes = ["heading", "background-pattern"];

    static layout = "container";

    static layoutAccepted = layoutAttributes.filter((name) => !sizeAttributes.includes(name));

    static layoutReason = "the application always takes all the space of its parent";

    static layoutHint = "Size its parent instead.";

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
        let heading = this.querySelector(":scope > [data-heading]");
        if (!text) {
            heading?.remove();
            return;
        }
        if (!heading) {
            heading = document.createElement("div");
            heading.setAttribute("data-heading", "");
            heading.setAttribute("role", "heading");
            heading.setAttribute("aria-level", "1");
            this.prepend(heading);
        }
        heading.textContent = text;
    }
}

define("uix-app", UixApp);
