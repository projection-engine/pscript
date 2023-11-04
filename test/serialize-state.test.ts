import {expect, test} from '@jest/globals';
import BooleanVal from "../src/environment/javascript/basic-types/BooleanVal";
import {Colors} from "../src/environment/javascript/javascript.enum";
import Serializer from "../src/core/libs/Serializer";
import CanvasStateStore from "../src/core/libs/CanvasStateStore";
import CanvasStateUtil from "../src/core/util/CanvasStateUtil";

test('Serialized node is valid', () => {
    Serializer.addTypes(BooleanVal)
    const canvas = CanvasStateStore.createState("TEST")
    const newNode = BooleanVal.of({canvas, x: 0, y: 0, label: "Boolean", colorRGBA: Colors.BOOLEAN})
    CanvasStateUtil.addDraggable(canvas.getId(), newNode)

    const serializedState = Serializer.serialize(canvas.getState())
    const deserializedState = Serializer.deserialize(canvas, serializedState)
    expect(Serializer.serialize(deserializedState)).toBe(serializedState);
});
