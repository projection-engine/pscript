import AbstractNode from "../../../core/instances/AbstractNode";
import Types, {Colors, NodeTypes} from "../javascript.enum";
import NodeType from "../../../core/instances/NodeType";

export default class Do extends AbstractNode {
    nodeType = NodeType.of(NodeTypes.FUNCTION);
    width = 50
    resizable = false
}
