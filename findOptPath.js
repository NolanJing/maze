/**
 * 
 *
 ** 迷宫以如下二维数组表示，其中1代表可以走通的路径，0代表障碍无法通过。
 *  mazeData =[
 *    [1,1,1,1,1],
 *    [1,1,1,1,1],
 *    [1,1,1,1,1],
 *    [1,1,1,1,1],
 *    [1,1,1,1,1]
 *  ]
 *
 */

// 节点链表
class Node {
    constructor (val, pre = null) {
        this.val = val;
        this.pre = pre;
    }
    // 检查节点是否为空
    valid (mazeData) {
        let [row, col] = this.val;
        if (!mazeData[row] || !mazeData[row][col]) return false;
        let pre_node = this.pre;
        while (pre_node) {
            if (pre_node.val[0] === row && pre_node.val[1] === col) return false;
            pre_node = pre_node.pre;
        }
        return true;
    }
    // 第一人称视角的前后左右
    left (mazeData) {
        let node = new Node([this.val[0] - 1, this.val[1]], this);
        return node.valid(mazeData) ? node : null;
    }

    right (mazeData) {
        let node = new Node([this.val[0] + 1, this.val[1]], this);
        return node.valid(mazeData) ? node : null;
    }

    before (mazeData) {
        let node = new Node([this.val[0], this.val[1] - 1], this);
        return node.valid(mazeData) ? node : null;
    }

    after (mazeData) {
        let node = new Node([this.val[0], this.val[1] + 1], this);
        return node.valid(mazeData) ? node : null;
    }
}

/**
 *
 * @param maze_data 迷宫
 * @param begin     起点
 * @param end       终点
 * @returns path    逆序路径
 */
function findOptPath (mazeData, begin, end) { // BFS
    let nodes = new Set();
    nodes.add(new Node(begin));
    let target = null;
    while (!target && nodes.size) {
        let new_nodes = new Set();
        nodes.forEach(node => {
            if (target) return;

        if (node.val[0] === end[0] && node.val[1] === end[1]) {
            target = node;
            return;
        }

        let left_node = node.left(mazeData);
        if (left_node) new_nodes.add(left_node);

        let right_node = node.right(mazeData);
        if (right_node) new_nodes.add(right_node);

        let top_node = node.before(mazeData);
        if (top_node) new_nodes.add(top_node);

        let bottom_node = node.after(mazeData);
        if (bottom_node) new_nodes.add(bottom_node);
    });
        nodes = new_nodes;
    }
    return target;
}
