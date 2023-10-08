import { evaluate } from "./expr";

type VarFunc = () => Promise<Record<string, boolean>> | Record<string, boolean>
type AnyFunction = () => unknown | Promise<unknown>;
type Functions = Record<string, AnyFunction>;
type Keybind = string


export type KeyBindOption = {
    name: string,
    bind: Keybind[] | Keybind,
    when?: string
}

type ParsedKeybind = {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
    key: string;
}

type ParsedKeyBindOption = {
    name: string,
    bind: ParsedKeybind[]
    when?: string
}

export class CoolKeyBinds {
    private functions: Functions = {};
    variableFunc: () => Promise<Record<string, boolean>> | Record<string, boolean>;
    keybinds: ParsedKeyBindOption[] = [];
    constructor(variables: VarFunc, functions: Functions) {
        this.functions = functions;
        this.variableFunc = variables;
    }

    setFunction(name: string, func: AnyFunction) {
        this.functions[name] = func;
    }

    setKeybinds(keybinds: KeyBindOption[]) {
        this.keybinds = keybinds.map(keybind => {
            const parsedBinds: ParsedKeybind[] = [];

            // Handle single keybind and array of keybinds uniformly
            const binds = Array.isArray(keybind.bind) ? keybind.bind : [keybind.bind];

            for (const bind of binds) {
                const ctrl = bind.includes('ctrl+');
                const alt = bind.includes('alt+');
                const shift = bind.includes('shift+');
                const meta = bind.includes('meta+');
                // Take the last character as the key char
                const index = bind.lastIndexOf("+");
                const key = bind.slice(index + 1);
                if (!key) continue
                parsedBinds.push({ ctrl, alt, shift, meta, key });
            }

            return {
                name: keybind.name,
                bind: parsedBinds,
                when: keybind.when || "",
            };
        });
    }

    private async eventListener(event: DocumentEventMap["keydown"]) {
        const { ctrlKey, altKey, shiftKey, metaKey, key } = event;
        let passedBindings = this.keybinds.filter((bind) => {
            return bind.bind.some(x => x.ctrl === ctrlKey && x.alt === altKey && x.shift === shiftKey && x.meta === metaKey && x.key === key)
        })
        if (!passedBindings.length) {
            return
        }
        event.preventDefault()
        const vars = await this.variableFunc();
        for (const bind of passedBindings) {
            console.log(bind.when)
            if (bind.when && !evaluate(bind.when, vars)) {
                continue;
            }

            if (this.functions[bind.name]) {
                //@ts-ignore
                await this.functions[bind.name]();
            } else {
                console.warn("Function not found: " + bind.name);
            }
        }
    }

    start() {
        //remove it if it already exists
        document.removeEventListener("keydown", this.eventListener);
        document.addEventListener("keydown", (ev) => this.eventListener(ev));
    }
}

