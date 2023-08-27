import Serializer from "../../core/libs/Serializer";
import BooleanVal from "./basic-types/BooleanVal";
import Add from "./basic-functions/Add";
import Do from "./basic-functions/Do";
import NumberVal from "./basic-types/NumberVal";

export default function registerTypes() {
    Serializer.addTypes(BooleanVal, Add, Do, NumberVal)
}
