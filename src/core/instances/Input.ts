import AbstractIO from "./AbstractIO";

export default class Input extends AbstractIO {
    key: string;
    label: string;

    constructor(key: string, label: string, properties?: MutableObject) {
        super(properties);
        this.key = key;
        this.label = label;
    }
}
