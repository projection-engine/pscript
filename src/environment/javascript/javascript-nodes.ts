import CommentDraggable from "../../core/instances/CommentDraggable";
import Add from "./basic-functions/Add";
import BooleanVal from "./basic-types/BooleanVal";
import NumberVal from "./basic-types/NumberVal";
import {Colors} from "./javascript.enum";

export default [
    {
        label: "Comment",
        class: "CommentDraggable",
        getInstance: (x, y, canvas) => new CommentDraggable({
            canvas,
            x,
            y,
            label: "New comment",
            colorRGBA: Colors.COMMENT
        })
    },

    {
        label: "Boolean",
        class: "BooleanVal",
        getInstance: (x, y, canvas) => new BooleanVal({canvas, x, y, label: "Boolean", colorRGBA: Colors.BOOLEAN})
    },

    {
        label: "Number",
        class: "NumberVal",
        getInstance: (x, y, canvas) => new NumberVal({canvas, x, y, label: "Number", colorRGBA: Colors.NUMBER})
    },

    {
        label: "Add",
        class: "Add",
        getInstance: (x, y, canvas) => new Add({canvas, x, y, label: "Add", colorRGBA: Colors.FUNCTION})
    },
]
