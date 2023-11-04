import AbstractSingleton from "../../core/libs/AbstractSingleton";
import SveltePortal from "../../core/libs/SveltePortal";

export default class ToolTipService extends AbstractSingleton {
    portal = new SveltePortal(999, false)
    element: HTMLElement
    closeCurrent?: VoidFunction

    constructor() {
        super();
        document.addEventListener("dragstart", () => {
            this.portal.close()
            this.closeCurrent?.()
        })
        const el = document.createElement("div")
        el.classList.add("tooltip")
        el.setAttribute("data-sveltetooltip", "-")
        this.portal.create(el)

        this.element = el
    }

    static getInstance(): ToolTipService {
        return super.get<ToolTipService>()
    }

}
