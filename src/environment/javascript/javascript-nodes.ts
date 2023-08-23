import CommentDraggable from "../../core/instances/CommentDraggable";
import Add from "./basic-functions/Add";
import BooleanVal from "./basic-types/BooleanVal";
import NumberVal from "./basic-types/NumberVal";

export default [
    {
        label: "Comment",
        class: "CommentDraggable",
        getInstance: (x, y, canvas) => new CommentDraggable(canvas, x, y, "New comment", [0, 140, 0, 1])
    },

    {
        label: "Boolean",
        class: "BooleanVal",
        getInstance: (x, y, canvas) => new BooleanVal(canvas, x, y, "New comment", [155, 155, 155, 1])
    },

    {
        label: "Number",
        class: "NumberVal",
        getInstance: (x, y, canvas) => new NumberVal(canvas, x, y, "New comment", [155, 155, 155, 1])
    },

    {
        label: "Add",
        class: "Add",
        getInstance: (x, y, canvas) => new Add(canvas, x, y, "New comment", [155, 155, 155, 1])
    },
]
