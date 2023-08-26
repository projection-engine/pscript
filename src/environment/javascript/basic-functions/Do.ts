import AbstractNode from "../../../core/instances/AbstractNode";
import Output from "../../../core/instances/Output";
import Input from "../../../core/instances/Input";
import Types, {Colors, NodeTypes} from "../javascript.enum";

import PropertyType from "../../../core/instances/PropertyType";
import NodeType from "../../../core/instances/NodeType";
import RootNode from "../../../core/instances/RootNode";

export default class Do extends RootNode {
    nodeType = NodeType.of(NodeTypes.FUNCTION);
    width = 50
    resizable = false
}
