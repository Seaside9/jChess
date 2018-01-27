import Node from 'tree-node';

class AI {
  constructor(board, color) {
    this.aiColor = color;
    this.color = color;
    this.board = board;
    this.root = new Node();
    this.nodeCount = 0;
    this.depth = 3;
    this.passRate1 = 1;
    this.passRate2 = 0.1;
  }

  swapColor() {
    if (this.color === "black") {
      this.color = "white";
    } else {
      this.color = "black";
    }
  }

  advanceDenied(depth) {
    if (this.nodeCount > 12000) {
      this.runtimeDepth = 2;
    }

    if (depth >= this.runtimeDepth) {
      return true;
    } else if (depth <= 2) {
      return false;
    } else if (depth % 2 === 1) {
      if (Math.random() > this.passRate1) {
        return true;
      }
    } else {
      if (Math.random() > this.passRate2) {
        return true;
      }
    }
    return false;
    // if (depth === this.depth || (this.nodeCount > 30000)) {
    //   return true;
    // } else if (depth <= 2) {
    //   return false;
    // } else if (depth % 2 === 1) {
    //   if (Math.random() < this.passRate1) {
    //     return false; }
    // }
    // return false;
  }

  abPrune(node, depth, alpha, beta, color) {
    this.depthHash.node[depth] += 1;
    this.nodeCount += 1;

    let board = node.data("Board");
    node.data("best", node);

    // Basecases
    // if (depth === this.depth ||
    //   // ((depth === this.depth - 1) && (Math.random() > 0.10)) ||
    //   ((depth === this.depth - 2) && (Math.random() > 0.0005)) ||
    //   ((depth === this.depth - 4) && (Math.random() > 0.0005)) ||
    //   // ((depth === this.depth - 6) && (Math.random() > 0.01)) ||
    //   (this.nodeCount > 30000)
    // ) { // if leaf node
    if (this.advanceDenied(depth)) { // if leaf node
      if (board.isInCheckMate()) {
        node.data("val", board.points());
      } else {
        node.data("val", color === "black" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
      }
      return node;
    }
    let val = color === "black" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

    let pump = board.pumpMoves(color);
    let move = pump();

    while (move){
      let childNode = new Node();
      childNode.data("Board", move);
      node.appendChild(childNode);
      childNode = color === "black" ?
        this.abPrune(childNode, depth + 1, alpha, beta, "white") :
        this.abPrune(childNode, depth + 1, alpha, beta, "black");

      if (color === "black") {
        if (val > childNode.data("val")){
          val = childNode.data("val");
          node.data("best", childNode);
        }
        if (val < beta){
          beta = val;
        }
        // if (beta <= alpha) break;
        if (beta <= alpha) {
          this.depthHash.cuts[depth] += 1;
          break;
        }
      } else {
        if (val < childNode.data("val")){
          val = childNode.data("val");
          node.data("best", childNode);
        }
        if (val > alpha){
          alpha = val;
        }
        if (beta <= alpha) {
          this.depthHash.cuts[depth] += 1;
          break;
        }
        // if (beta <= alpha) break;
      }
      move = pump();
    }

    if(node.childIds.length === 0) {
      node.data("val", color === "black" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
      return node;
    }

    node.data("val", val);
    return node;
  }

  getMove() {
    let start = Date.now();
    this.nodeCount = 0;
    this.runtimeDepth = this.depth;
    this.depthHash = {
      node: {

      },
      cuts: {

      },
    };
    for (let i = 0; i <= this.depth; i++) {
      this.depthHash.node[i] = 0;
      if (i < this.depth) this.depthHash.cuts[i] = 0;
    }
    this.root = new Node();
    this.root.data("Board", this.board).data("Points", this.board.points(this.aiColor));
    this.color = "black";
    this.abPrune(this.root, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, "black");
    window.root = this.root;
    window.dh = this.depthHash;
    console.log("### THOUGHTS ###");
    console.log(`Total Node Count: ${this.nodeCount} ${this.nodeCount > 12000 ? '(CAPPED)' : ''}`);
    console.log(`Time: ${(Date.now() - start)/1000}s`);

    console.log(`Hash: ${JSON.stringify(this.depthHash, null, '\t')}`);
    return this.root.data("best").data("Board").lastMove;
  }
}

export default AI;
