import CommentDraggable from "../../core/instances/CommentDraggable";
import Add from "./basic-functions/Add";
import BooleanVal from "./basic-types/BooleanVal";
import NumberVal from "./basic-types/NumberVal";
import {Colors} from "./javascript.enum";
import Do from "./basic-functions/Do";
import FunctionDraggable from "../../core/instances/FunctionDraggable";

export default [
    {
        label: "Do",
        class: "Do",
        getInstance: (x, y, canvas) => Do.of({
            canvas,
            x,
            y,
            label: "Do",
            colorRGBA: Colors.START
        })
    },
    {
        label: "Comment",
        class: "CommentDraggable",
        getInstance: (x, y, canvas) => CommentDraggable.of({
            canvas,
            x,
            y,
            label: "New comment",
            colorRGBA: Colors.COMMENT
        })
    },
    {
        label: "Function",
        class: "FunctionDraggable",
        getInstance: (x, y, canvas) => FunctionDraggable.of({
            canvas,
            x,
            y,
            label: "New function",
            colorRGBA: Colors.FUNCTION
        })
    },

    {
        label: "Boolean",
        class: "BooleanVal",
        getInstance: (x, y, canvas) => BooleanVal.of({canvas, x, y, label: "Boolean", colorRGBA: Colors.BOOLEAN})
    },

    {
        label: "Number",
        class: "NumberVal",
        getInstance: (x, y, canvas) => NumberVal.of({canvas, x, y, label: "Number", colorRGBA: Colors.NUMBER})
    },

    {
        label: "Add",
        class: "Add",
        getInstance: (x, y, canvas) => Add.of({canvas, x, y, label: "Add", colorRGBA: Colors.FUNCTION})
    },
]
