/*
 * Shared base of the Uix custom elements: console warnings, the check of layout attributes, and the
 * authoring element, which renders its native HTML once in light DOM and keeps it in sync with its
 * attributes.
 */

/**
 * Size attributes.
 *
 * @type {readonly string[]}
 */
export const sizeAttributes = ["width", "height", "min-width", "max-width", "min-height", "max-height"];

/**
 * Layout attributes, as a whole.
 *
 * @type {readonly string[]}
 */
export const layoutAttributes = ["grow", "span", ...sizeAttributes, "align", "justify", "gap", "wrap", "scroll"];

/**
 * The layout attributes each layout type accepts.
 *
 * @type {Readonly<Record<string, readonly string[]>>}
 */
const acceptedByType = {
    container: layoutAttributes,
    item: ["grow", "span", ...sizeAttributes],
    floating: sizeAttributes,
    inline: [],
    part: [],
};

/**
 * Why a layout attribute has no effect, by layout type; {owner} names the component of a part.
 *
 * @type {Readonly<Record<string, string>>}
 */
const reasonsByType = {
    item: "only containers (rows, columns, toolbars…) arrange children",
    floating: "this element floats above the page, anchored to what opens it",
    inline: "this element flows in its text, like a word",
    part: "{owner} lays out this element",
};

/**
 * Whether CSS reads lengths from attributes itself, with typed attr().
 *
 * @type {boolean}
 */
const nativeAttr = CSS.supports("width", "attr(x type(<length>))");

/**
 * Reports an authoring mistake in the console, naming the element and how to fix it.
 *
 * @param {Element} element
 * @param {string} message
 */
export function warn(element, message) {
    console.warn(`Uix <${element.localName}>: ${message}`, element);
}

/**
 * Warns about the layout attributes an element does not accept: by default, those its layout type does not
 * accept.
 *
 * @param {Element} element
 * @param {string} type
 *     container, item, floating, inline or part.
 * @param {object} [options]
 * @param {string} [options.owner]
 *     For a part, the component that lays it out.
 * @param {string} [options.hint]
 *     Advice added to the warning.
 * @param {readonly string[]} [options.accepted]
 *     The attributes the element accepts, when they differ from its type's.
 * @param {string} [options.reason]
 *     Why the others have no effect, when the reason of its type does not apply.
 */
export function checkLayout(element, type, {
    owner = "",
    hint = "",
    accepted = acceptedByType[type] ?? layoutAttributes,
    reason = reasonsByType[type] ?? "",
} = {}) {
    const ignored = layoutAttributes.filter((name) => element.hasAttribute(name) && !accepted.includes(name));
    if (ignored.length === 0) {
        return;
    }
    const names = ignored.map((name) => `'${name}'`).join(", ");
    const several = ignored.length > 1;
    const why = reason.replace("{owner}", owner);
    warn(element, `${names} ${several ? "have" : "has"} no effect here: ${why}. Remove ${several ? "them" : "it"}.${hint ? ` ${hint}` : ""}`);
}

/**
 * Copies a layout attribute to its custom property, or removes the property with the attribute. Sizes are
 * skipped where CSS reads them from the attributes itself.
 *
 * @param {HTMLElement} element
 * @param {string} name
 */
export function copyLayoutValue(element, name) {
    if (nativeAttr && sizeAttributes.includes(name)) {
        return;
    }
    const value = element.getAttribute(name);
    if (value === null) {
        element.style.removeProperty(`--uix-${name}`);
    } else {
        element.style.setProperty(`--uix-${name}`, value);
    }
}

/**
 * Authoring element: renders its native HTML once, in light DOM, then keeps it in sync with its attributes.
 * Subclasses implement create() and sync().
 */
export class UixAuthoring extends HTMLElement {
    /**
     * Attributes whose changes call sync(); define() adds the size attributes the element accepts.
     *
     * @type {string[]}
     */
    static observedAttributes = [];

    /**
     * Layout type, which sets who places the element and the layout attributes it accepts: container,
     * item, floating, inline or part.
     *
     * @type {string}
     */
    static layout = "item";

    /**
     * For a part: the component that lays it out, named in warnings.
     *
     * @type {string}
     */
    static layoutOwner = "";

    /**
     * Advice added to the warning about an ignored layout attribute.
     *
     * @type {string}
     */
    static layoutHint = "";

    /**
     * The layout attributes the element accepts, when they differ from those of its layout type.
     *
     * @type {readonly string[] | null}
     */
    static layoutAccepted = null;

    /**
     * Why the layout attributes it does not accept have no effect, when the reason of its layout type does
     * not apply.
     *
     * @type {string}
     */
    static layoutReason = "";

    /**
     * The layout attributes the element accepts.
     *
     * @returns {readonly string[]}
     */
    static get acceptedLayoutAttributes() {
        return this.layoutAccepted ?? acceptedByType[this.layout] ?? layoutAttributes;
    }

    /**
     * Whether the native HTML is in place.
     *
     * @type {boolean}
     */
    #ready = false;

    connectedCallback() {
        const type = /** @type {typeof UixAuthoring} */ (this.constructor);
        if (!this.#ready) {
            this.create();
            this.#ready = true;
            checkLayout(this, type.layout, {
                owner: type.layoutOwner,
                hint: type.layoutHint,
                accepted: type.acceptedLayoutAttributes,
                reason: type.layoutReason || undefined,
            });
        }
        for (const name of sizeAttributes.filter((size) => type.acceptedLayoutAttributes.includes(size))) {
            copyLayoutValue(this, name);
        }
        this.sync();
    }

    /**
     * @param {string} name
     */
    attributeChangedCallback(name) {
        if (sizeAttributes.includes(name)) {
            copyLayoutValue(this, name);
        } else if (this.#ready) {
            this.sync();
        }
    }

    /**
     * Builds the native HTML, unless it is already there (rendered by a server, for instance).
     */
    create() {
        //
    }

    /**
     * Copies the attributes onto the native HTML.
     */
    sync() {
        //
    }
}

/**
 * Registers a custom element, once: loading Uix from a CDN and from a build does no harm. The element
 * follows changes to the size attributes it accepts.
 *
 * @param {string} name
 * @param {typeof UixAuthoring} constructor
 */
export function define(name, constructor) {
    if (customElements.get(name)) {
        return;
    }
    const sizes = sizeAttributes.filter((size) => constructor.acceptedLayoutAttributes.includes(size));
    if (sizes.length > 0) {
        constructor.observedAttributes = [...new Set([...constructor.observedAttributes, ...sizes])];
    }
    customElements.define(name, constructor);
}
