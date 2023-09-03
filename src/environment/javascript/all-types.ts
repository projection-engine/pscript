import PropertyType from "../../core/instances/PropertyType";
import Types, {Colors} from "./javascript.enum";

export default  {
    [Types.BOOLEAN]: PropertyType.of(Types.BOOLEAN, "Boolean", Colors.BOOLEAN),
    [Types.NUMBER]: PropertyType.of(Types.NUMBER, "Numeric", Colors.NUMBER),
}
