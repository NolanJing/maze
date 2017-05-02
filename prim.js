function Maze(col, row, start, end) {
    this.col = col;
    this.row = row;
    this.start = start;
    this.end = end;
}

Maze.prototype.random = function (k) {
    return Math.floor(Math.random() * k);
};

Maze.prototype.generate = function () {
    // 生成 2R+1 行 2R+1 列数组
    this.mazeDataArray = [];
    for (let i = 0; i < 2 * this.col + 1; i++) {
        let arr = [];
        for (let j = 0; j < 2 * this.row + 1; j++) {
            // 设置墙和初始格子
            if (i % 2 == 0 || j % 2 == 0) {
                arr.push({
                    value: 0,
                    x: j,
                    y: i
                });
            } else {
                arr.push({
                    value: 1,
                    isVisited: false,
                    x: j,
                    y: i
                });
            }
        }
        this.mazeDataArray[i] = arr;
    }
    // 随机选择一点作为 currentNode
    let currentNode = this.mazeDataArray[2 * this.random(this.row) + 1][2 * this.random(this.col) + 1];
    currentNode.isVisited = true;
    // 访问过的节点列表
    let visitedList = [];
    visitedList.push(currentNode);
    // 循环以下操作，直到所有的格子都被访问到。
    while (currentNode.isVisited) {
        // 得到当前访问格子的四周（上下左右）的格子
        let upNode = this.mazeDataArray[currentNode.y - 2] ? this.mazeDataArray[currentNode.y - 2][currentNode.x] : {isVisited: true};
        let rightNode = this.mazeDataArray[currentNode.x + 2] ? this.mazeDataArray[currentNode.y][currentNode.x + 2] : {isVisited: true};
        let downNode = this.mazeDataArray[currentNode.y + 2] ? this.mazeDataArray[currentNode.y + 2][currentNode.x] : {isVisited: true};
        let leftNode = this.mazeDataArray[currentNode.x - 2] ? this.mazeDataArray[currentNode.y][currentNode.x - 2] : {isVisited: true};

        let neighborArray = [];
        if (!upNode.isVisited) {
            neighborArray.push(upNode);
        }
        if (!rightNode.isVisited) {
            neighborArray.push(rightNode);
        }
        if (!downNode.isVisited) {
            neighborArray.push(downNode);
        }
        if (!leftNode.isVisited) {
            neighborArray.push(leftNode);
        }
        // 在这些格子中随机选择一个没有在访问列表中的格子，
        // 如果找到，则把该格子和当前访问的格子中间的墙打通(置为0)，
        if (neighborArray.length !== 0) { // 如果找到
            let neighborNode = neighborArray[this.random(neighborArray.length)];
            this.mazeDataArray[(neighborNode.y + currentNode.y) / 2][(neighborNode.x + currentNode.x) / 2].value = 1;
            neighborNode.isVisited = true;
            visitedList.push(neighborNode);
            currentNode = neighborNode;
        } else {
            // 把该格子作为当前访问的格子，并放入访问列表。
            // 如果周围所有的格子都已经访问过，则从已访问的列表中，随机选取一个作为当前访问的格子。
            currentNode = visitedList[this.random(visitedList.length)];
            if (!currentNode) {
                // visitedList为空时 跳出循环
                break;
            }
            currentNode.isVisited = true;
            // 从 visitedList 中删除随机出来的当前节点
            let tempArr = [];
            visitedList.forEach(item => {
                if (item !== currentNode) {
                    tempArr.push(item);
                }
            });
            visitedList = tempArr;
        }
    }
    //start 0,0
    // 1,0 => 0
    this.mazeDataArray[this.start[0]][this.start[1]]={
        x:this.start[0],
        y:this.start[1],
        value:1
    };
    // this.mazeDataArray[this.start[0]+1][this.start[0]+1]={value:1};
    // end 9,9
    // 20,21 =>1
    this.mazeDataArray[this.end[0]][this.end[1]]={
        x:this.end[0],
        y:this.end[1],
        value:1};
    // this.mazeDataArray[this.end[0]][this.end[1]-1]={value:1};
};

Maze.prototype.drawDom = function () {

    for (let i = 0, len = this.mazeDataArray.length; i < len; i++) {
        let tr = document.createElement("tr");
        document.querySelector('table').appendChild(tr);
        for (let j = 0, len = this.mazeDataArray[i].length; j < len; j++) {
            let td = document.createElement("td");
            // start
            if(i===this.start[0] && j===this.start[1] ){
                td.setAttribute("class", "startNode");
                td.innerHTML= 's';
            }
            // end
            if(i===this.end[0] && j===this.end[1] ){
                td.setAttribute("class", "endNode");
                td.innerHTML= 'e';
            }
            // wall
            if (!this.mazeDataArray[i][j].value){
                td.setAttribute("class", "wall");
            }

            tr.appendChild(td);
        }
    }
};

Maze.prototype.findPath = function () {
    // 先将所有格子的isVisited 置为 false
    for (let i = this.mazeDataArray.length - 1; i >= 0; i--) {
        for (let j = this.mazeDataArray[i].length - 1; j >= 0; j--) {
            this.mazeDataArray[i][j].isVisited = false;
        }
    }
    // 路径数组
    this.path = [];

    let node = this.mazeDataArray[this.end[0]][this.end[1]]; // 迷宫的出口

    while (node) {
        // console(a)
        let queue = []; // 辅助队列

        if (!node.isVisited) {
            node.isVisited = true;
            // console.log(node)
            queue.unshift(node); // 入队
            while (queue.length) { // 队列非空
                // console.log(queue.length);
                let firstItem = queue.shift(); // 队首元素 出队
                // console.log(firstItem);
                firstItem.neighbor = [];
                if (this.mazeDataArray[node.x - 1] && this.mazeDataArray[node.x - 1][node.y].value) {// 上
                    if (!this.mazeDataArray[node.x - 1][node.y].isVisited)
                        firstItem.neighbor.push(this.mazeDataArray[node.x - 1][node.y]);
                }
                if (this.mazeDataArray[node.x][node.y + 1] && this.mazeDataArray[node.x][node.y + 1].value) {// 右
                    if (!this.mazeDataArray[node.x][node.y + 1].isVisited)
                        firstItem.neighbor.push(this.mazeDataArray[node.x][node.y + 1]);
                }
                if (this.mazeDataArray[node.x + 1] && this.mazeDataArray[node.x + 1][node.y].value) {// 下
                    if (!this.mazeDataArray[node.x + 1][node.y].isVisited)
                        firstItem.neighbor.push(this.mazeDataArray[node.x + 1][node.y]);
                }
                if (this.mazeDataArray[node.x][node.y - 1] && this.mazeDataArray[node.x][node.y - 1].value) {// 左
                    if (!this.mazeDataArray[node.x][node.y - 1].isVisited)
                        firstItem.neighbor.push(this.mazeDataArray[node.x][node.y - 1]);
                }

                // console.log(u.neighbor);
                // 遍历邻居节点
                for (neighborNode of firstItem.neighbor) {
                    if (!neighborNode.isVisited) {
                        neighborNode.isVisited = true;
                        queue.push(neighborNode);
                    }
                }// for 遍历邻居节点

                node = queue[0];
                this.path.push(node);
                // console.log(node);
            }// while
        }// visited
    }

    let pathTree = this.path[0];

    console.log(pathTree);

    /*let pathArray = [];
     while (endNode) {
     pathArray.push([endNode.x, endNode.y])
     endNode = endNode.pre;
     }
     console.log(pathArray)*/

};

Maze.prototype.init = function () {
    this.generate();
    this.drawDom();
    this.findPath();
};