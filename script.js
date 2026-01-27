class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

    return x;
  }

  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

    return y;
  }

  insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value)
      node.left = this.insert(node.left, value);
    else if (value > node.value)
      node.right = this.insert(node.right, value);
    else
      return node; // no duplicates

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);

    // LL
    if (balance > 1 && value < node.left.value)
      return this.rightRotate(node);

    // RR
    if (balance < -1 && value > node.right.value)
      return this.leftRotate(node);

    // LR
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

    // RL
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }
}

const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const tree = new AVLTree();

function insertValue() {
  const value = parseInt(document.getElementById("valueInput").value);
  if (isNaN(value)) return;

  tree.root = tree.insert(tree.root, value);
  draw();
  document.getElementById("valueInput").value = "";
}

function clearTree() {
  tree.root = null;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!tree.root) return;

  setPositions(tree.root, canvas.width / 2, 60, canvas.width / 4);
  drawEdges(tree.root);
  drawNodes(tree.root);
}

function setPositions(node, x, y, gap) {
  if (!node) return;

  node.x = x;
  node.y = y;

  setPositions(node.left, x - gap, y + 80, gap / 2);
  setPositions(node.right, x + gap, y + 80, gap / 2);
}

function drawEdges(node) {
  if (!node) return;

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;

  if (node.left) {
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(node.left.x, node.left.y);
    ctx.stroke();
  }

  if (node.right) {
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(node.right.x, node.right.y);
    ctx.stroke();
  }

  drawEdges(node.left);
  drawEdges(node.right);
}

function drawNodes(node) {
  if (!node) return;

  const radius = 18;

  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#38bdf8";
  ctx.fill();

  ctx.strokeStyle = "#0ea5e9";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#020617";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, node.x, node.y);

  drawNodes(node.left);
  drawNodes(node.right);
}

draw();
