import Comment from "../../core/instances/Comment";
import Add from "./basic-functions/Add";
import BooleanVal from "./basic-types/BooleanVal";
import NumberVal from "./basic-types/NumberVal";
import {Colors} from "./javascript.enum";
import Do from "./basic-functions/Do";

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
        getInstance: (x, y, canvas) => Comment.of({
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
