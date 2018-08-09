export class Cell {
    value: number;
    enabled: boolean;
    owner: string;
    invalid: boolean;
    changed: boolean;
    isRippleEnabled: boolean;

    constructor(value: number, enabled: boolean, owner: string) {
        this.value = value;
        this.enabled = enabled;
        this.owner = owner;
        this.invalid = false;
        this.changed = false;
        this.isRippleEnabled = false;
    }
}
