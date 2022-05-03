interface ViewImplementor extends HTMLElement {
    onViewImpl(shadow: ShadowRoot): void;
}

export var ViewImplementor: {
    new(): ViewImplementor;
    prototype: ViewImplementor;
}