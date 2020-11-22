// 创建一个全新的渲染器
import {createRenderer} from "@vue/runtime-dom";

let ctx;
let canvas;
const draw = (el, noClear) => {
  if (!noClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (el.tag == "piechart") {
    let { data, r, x, y } = el;
    let total = data.reduce((memo, current) => memo + current.count, 0);
    let start = 0,
      end = 0;
    data.forEach(item => {
      end += (item.count / total) * 360;
      drawPieChart(start, end, item.color, x, y, r);
      drawPieChartText(item.name, (start + end) / 2, x, y, r);
      start = end;
    });
  }
  el.childs && el.childs.forEach(child => draw(child, true));
};

const d2a = n => {
  return (n * Math.PI) / 180;
};
const drawPieChart = (start, end, color, cx, cy, r) => {
  let x = cx + Math.cos(d2a(start)) * r;
  let y = cy + Math.sin(d2a(start)) * r;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.arc(cx, cy, r, d2a(start), d2a(end), false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
const drawPieChartText = (val, position, cx, cy, r) => {
  ctx.beginPath();
  let x = cx + (Math.cos(d2a(position)) * r) / 1.25 - 20;
  let y = cy + (Math.sin(d2a(position)) * r) / 1.25;
  ctx.fillStyle = "#000";
  ctx.font = "20px 微软雅黑";
  ctx.fillText(val, x, y);
  ctx.closePath();
};

// nodeOptions
const nodeOps = {
  insert: (child, parent, anchor) => {
    // 处理元素插入逻辑
    // 1. 如果是子元素，不是真实dom，此时只需将数据保存到前面虚拟对象上即可
    child.parent = parent;
    if (!parent.childs) {
      // 格式化父子关系
      parent.childs = [child];
    } else {
      parent.childs.push(child);
    }

    // 2. 如果是真实的dom元素，在这里只会是canvas，需要绘制
    if (parent.nodeType == 1) {
      draw(child); // 开始绘图
      if (child.onClick) {
        ctx.canvas.addEventListener(
          "click",
          () => {
            child.onClick();
            setTimeout(() => {
              draw(child);
            }, 0);
          },
          false
        );
      }
    }
  },
  remove: child => {},
  createElement: (tag, isSVG, is) => {
    return { tag };
  },
  createText: text => {},
  createComment: text => {},
  setText: (node, text) => {},
  setElementText: (el, text) => {},
  parentNode: node => {},
  nextSibling: node => {},
  querySelector: selector => {},
  setScopeId(el, id) {},
  cloneNode(el) {},
  insertStaticContent(content, parent, anchor, isSVG) {},
  patchProp(el, key, prevValue, nextValue) {
    // 处理属性的更新，很重要
    el[key] = nextValue;
  }
};

let renderer = createRenderer(nodeOps);

export function createCanvasApp(App) {
  const app = renderer.createApp(App);
  return {
    mount(selector) {
      canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.querySelector(selector).appendChild(canvas);
      ctx = canvas.getContext("2d");
      app.mount(canvas);
    }
  };
}
