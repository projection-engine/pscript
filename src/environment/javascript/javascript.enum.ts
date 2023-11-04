enum Types {
    NUMBER = "number",
    BOOLEAN = "boolean"
}


export default Types

const Colors: { [key: string]: ColorRGBA } = Object.freeze({
    NUMBER: [59, 171, 28, 1],
    BOOLEAN: [90, 34, 139, 1],
    FUNCTION: [240, 153, 60, 1],
    COMMENT: [0, 140, 0, 1],
    START: [255, 0, 0, 1]

})
export {Colors}


