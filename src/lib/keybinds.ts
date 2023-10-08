import { CoolKeyBinds, type KeyBindOption } from "./coolkeybinds";

const keybindsList: KeyBindOption[] = [
    {
        name: "reload",
        bind: "ctrl+r",
    },
    {
        name: "add",
        bind: ["=", "ctrl+a"],
        when: "menu"
    },
    {
        name: "sub",
        bind: ["-", "ctrl+s"],
        when: "menu"
    },
    {
        name: "reset",
        bind: ["ctrl+z"]
    },
    {
        name: "left",
        bind: "ArrowLeft",
        when: "magic"
    },
    {
        name: "right",
        bind: "ArrowRight",
        when: "magic"
    },
    {
        name: "up",
        bind: "ArrowUp",
        when: "magic"
    },
    {
        name: "down",
        bind: "ArrowDown",
        when: "magic"
    },
    {
        name: "magic",
        bind: ["ctrl+m"],
    }
]


const functions = {
    "reload": () => window.location.reload(),
    "magic": () => state.magic = !state.magic
}

export function findAncestorFocus<T extends string>(elementsObj: Record<T, HTMLElement>) {
    const result = {} as Record<T, boolean>;
    for (let key in elementsObj) {
        result[key] = false;
    }

    let focused = document.activeElement;
    while (focused) {
        for (let key in elementsObj) {
            if (focused === elementsObj[key]) {
                result[key] = true;
            }
        }
        focused = focused.parentElement;
    }

    return result;
}
export const state: Record<string, boolean> = {
    magic: false
}

const varFunction = () => {
    return {
        ...state,
        ...findAncestorFocus({
            "menu": document.getElementById("form")!
        })
    }
}

const keybinds = new CoolKeyBinds(varFunction, functions);

keybinds.setKeybinds(keybindsList);

export default keybinds