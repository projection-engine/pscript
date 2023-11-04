export default class MathUtil {
    static isPointInsideCircle(x: number, y: number, centerX: number, centerY: number, radiusSquared: number): boolean {
        return ((x - centerX) ** 2 + (y - centerY) ** 2 < radiusSquared)
    }

    static isPointInsideRect(x: number, y: number, centerX: number, centerY: number, width: number, height: number): boolean {
        const XI = centerX + width
        const YI = centerY + height
        return x >= centerX && x <= XI && y >= centerY && y < YI
    }

    static #areaOfTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }

    static isPointInsideTriangle(x: number, y: number, positions: [number, number, number, number, number, number]): boolean {
        const x1 = positions[0], y1 = positions[1],
            x2 = positions[2], y2 = positions[3],
            x3 = positions[4], y3 = positions[5]

        const A = this.#areaOfTriangle(x1, y1, x2, y2, x3, y3);
        const A1 = this.#areaOfTriangle(x, y, x2, y2, x3, y3);
        const A2 = this.#areaOfTriangle(x1, y1, x, y, x3, y3);
        const A3 = this.#areaOfTriangle(x1, y1, x2, y2, x, y);
        return (A === A1 + A2 + A3);
    }
}
