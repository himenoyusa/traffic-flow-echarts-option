/**
 * 计算位置偏移差值
 * @param {*} e {left, front, right} 除了掉头以外的值构成
 * @param {*} total 总数
 * @param {*} turn 掉头数
 * @param {*} width 边宽度
 * @returns {*} { left, front, right }
 */
const calcPosition = (e, total, turn, width) => {
  if (total === 0) {
    return { left: 0, front: 0, right: 0 };
  }
  // 计算除了调头之外的总值
  const rest = total - turn;
  // 计算占比
  const leftPercent = e.left / rest;
  const frontPercent = e.front / rest;
  const rightPercent = e.right / rest;
  // 计算差值
  const left = (leftPercent / 2) * width;
  const front = (frontPercent / 2 + leftPercent) * width;
  const right = (frontPercent + leftPercent + rightPercent / 2) * width;
  return { left, front, right };
};

type DirectionData = {
  left: number;
  right: number;
  front: number;
  turn: number;
};

interface CroData {
  n: DirectionData;
  s: DirectionData;
  w: DirectionData;
  e: DirectionData;
}

type Config = {
  boxSize?: number;
  gap?: number;
  maxWidth?: number;
  height?: number;
  colorList?: [string, string, string, string];
  fontColor?: string;
  textBorderColor?: string;
};

const getOption = (croData: CroData, config: Config = {}) => {
  // 配置
  const {
    boxSize = 100,
    gap = 40,
    maxWidth = 10,
    height = 20,
    colorList = ['#5b47c2', '#e50100', '#159e56', '#ff8801'],
    fontColor = '#fff',
    textBorderColor = '#333',
  } = config;

  const labelConfig = {
    show: true,
    color: fontColor,
    textBorderColor: textBorderColor,
    textBorderWidth: 2,
    fontSize: 10,
  };

  // 单方向总数计算 snwe 方向, io 进出
  const siTotal = Object.keys(croData.s).reduce((pre, cur) => pre + croData.s[cur], 0);
  const niTotal = Object.keys(croData.n).reduce((pre, cur) => pre + croData.n[cur], 0);
  const wiTotal = Object.keys(croData.w).reduce((pre, cur) => pre + croData.w[cur], 0);
  const eiTotal = Object.keys(croData.e).reduce((pre, cur) => pre + croData.e[cur], 0);
  const soTotal = croData.n.front + croData.w.right + croData.e.left + croData.s.turn;
  const noTotal = croData.s.front + croData.e.right + croData.w.left + croData.n.turn;
  const woTotal = croData.e.front + croData.n.right + croData.s.left + croData.w.turn;
  const eoTotal = croData.w.front + croData.s.right + croData.n.left + croData.e.turn;

  // 最大总数
  let totalMax = Math.max(siTotal, niTotal, wiTotal, eiTotal, soTotal, noTotal, woTotal, eoTotal);
  totalMax = totalMax === 0 ? maxWidth : totalMax;

  // 单方向宽度计算
  const siWidth = (siTotal / totalMax) * maxWidth;
  const niWidth = (niTotal / totalMax) * maxWidth;
  const wiWidth = (wiTotal / totalMax) * maxWidth;
  const eiWidth = (eiTotal / totalMax) * maxWidth;
  const soWidth = (soTotal / totalMax) * maxWidth;
  const noWidth = (noTotal / totalMax) * maxWidth;
  const woWidth = (woTotal / totalMax) * maxWidth;
  const eoWidth = (eoTotal / totalMax) * maxWidth;

  const option = {
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        top: height,
        left: height,
        bottom: height,
        right: height,
        data: [
          // ----------- 汇总流量节点, 仅用来表示总流量的宽度和值, 不用作连线
          // ----------- left right 的方向不论 in 或者 out, 均以车道实际方向为准
          {
            name: 'ni',
            x: (boxSize - gap) / 2,
            y: 0,
            symbol: 'rect',
            symbolSize: [niWidth, height],
            label: {
              ...labelConfig,
              formatter: `${niTotal}`,
            },
            itemStyle: { color: colorList[0] },
          },
          {
            name: 'no',
            x: (boxSize - gap) / 2 + gap,
            y: 0,
            symbol: 'rect',
            symbolSize: [noWidth, height],
            label: {
              ...labelConfig,
              formatter: `${noTotal}`,
            },
            itemStyle: { color: colorList[0] },
          },
          {
            name: 'wo',
            x: 0,
            y: (boxSize - gap) / 2,
            symbol: 'rect',
            symbolSize: [height, woWidth],
            label: {
              ...labelConfig,
              formatter: `${woTotal}`,
            },
            itemStyle: { color: colorList[1] },
          },
          {
            name: 'wi',
            x: 0,
            y: (boxSize - gap) / 2 + gap,
            symbol: 'rect',
            symbolSize: [height, wiWidth],
            label: {
              ...labelConfig,
              formatter: `${wiTotal}`,
            },
            itemStyle: { color: colorList[1] },
          },
          {
            name: 'ei',
            x: boxSize,
            y: (boxSize - gap) / 2,
            symbol: 'rect',
            symbolSize: [height, eiWidth],
            label: {
              ...labelConfig,
              formatter: `${eiTotal}`,
            },
            itemStyle: { color: colorList[2] },
          },
          {
            name: 'eo',
            x: boxSize,
            y: (boxSize - gap) / 2 + gap,
            symbol: 'rect',
            symbolSize: [height, eoWidth],
            label: {
              ...labelConfig,
              formatter: `${eoTotal}`,
            },
            itemStyle: { color: colorList[2] },
          },
          {
            name: 'so',
            x: (boxSize - gap) / 2,
            y: boxSize,
            symbol: 'rect',
            symbolSize: [soWidth, height],
            label: {
              ...labelConfig,
              formatter: `${soTotal}`,
            },
            itemStyle: { color: colorList[3] },
          },
          {
            name: 'si',
            x: (boxSize - gap) / 2 + gap,
            y: boxSize,
            symbol: 'rect',
            symbolSize: [siWidth, height],
            label: {
              ...labelConfig,
              formatter: `${siTotal}`,
            },
            itemStyle: { color: colorList[3] },
          },

          // ----------- 箭头节点, 仅表示形状
          {
            name: 'soArrow',
            x: (boxSize - gap) / 2,
            y: boxSize,
            symbol: 'triangle',
            symbolSize: [soWidth * 1.6, height * 0.4],
            symbolOffset: [0, height / 1.6],
            symbolRotate: 180,
            label: { show: false },
            itemStyle: { color: colorList[3] },
          },
          {
            name: 'noArrow',
            x: (boxSize - gap) / 2 + gap,
            y: 0,
            symbol: 'triangle',
            symbolSize: [noWidth * 1.6, height * 0.4],
            symbolOffset: [0, -height / 1.6],
            symbolRotate: 0,
            label: { show: false },
            itemStyle: { color: colorList[0] },
          },
          {
            name: 'woArrow',
            x: boxSize,
            y: (boxSize - gap) / 2 + gap,
            symbol: 'triangle',
            symbolSize: [woWidth * 1.6, height * 0.4],
            symbolOffset: [height / 1.6, 0],
            symbolRotate: 270,
            label: { show: false },
            itemStyle: { color: colorList[2] },
          },
          {
            name: 'eoArrow',
            x: 0,
            y: (boxSize - gap) / 2,
            symbol: 'triangle',
            symbolSize: [eoWidth * 1.6, height * 0.4],
            symbolOffset: [-height / 1.6, 0],
            symbolRotate: 90,
            itemStyle: { color: colorList[1] },
            label: { show: false },
          },

          /**
           * -------------------
           * 每个单方向的节点位置都由方向的左中右三个流量值来确定
           * -------------------
           */
          // ----------- 单方向流向节点 SI
          {
            name: 'siLeft',
            x:
              (boxSize - gap) / 2 + // 基本位置
              gap - // 进出方块的左右间隔距离
              siWidth / 2 + // 根据边宽找到边的原点距离, 注意原点始终应该在左上角, 所以有些是 - width + calc, 有些是 + width - calc
              calcPosition(croData.s, siTotal, croData.s.turn, siWidth).left, // 然后根据计算得到的差值补齐位置
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'siFront',
            x:
              (boxSize - gap) / 2 + gap - siWidth / 2 + calcPosition(croData.s, siTotal, croData.s.turn, siWidth).front,
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'siRight',
            x:
              (boxSize - gap) / 2 + gap - siWidth / 2 + calcPosition(croData.s, siTotal, croData.s.turn, siWidth).right,
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 SO
          {
            name: 'soLeft',
            x:
              (boxSize - gap) / 2 +
              soWidth / 2 -
              calcPosition(
                { left: croData.e.left, front: croData.n.front, right: croData.w.right },
                soTotal,
                croData.s.turn,
                soWidth,
              ).left,
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'soFront',
            x:
              (boxSize - gap) / 2 +
              soWidth / 2 -
              calcPosition(
                { left: croData.e.left, front: croData.n.front, right: croData.w.right },
                soTotal,
                croData.s.turn,
                soWidth,
              ).front,
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'soRight',
            x:
              (boxSize - gap) / 2 +
              soWidth / 2 -
              calcPosition(
                { left: croData.e.left, front: croData.n.front, right: croData.w.right },
                soTotal,
                croData.s.turn,
                soWidth,
              ).right,
            y: boxSize - height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 NI
          {
            name: 'niLeft',
            x: (boxSize - gap) / 2 + niWidth / 2 - calcPosition(croData.n, niTotal, croData.n.turn, niWidth).left,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'niFront',
            x: (boxSize - gap) / 2 + niWidth / 2 - calcPosition(croData.n, niTotal, croData.n.turn, niWidth).front,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'niRight',
            x: (boxSize - gap) / 2 + niWidth / 2 - calcPosition(croData.n, niTotal, croData.n.turn, niWidth).right,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 NO
          {
            name: 'noLeft',
            x:
              (boxSize - gap) / 2 +
              gap -
              noWidth / 2 +
              calcPosition(
                { left: croData.w.left, front: croData.s.front, right: croData.e.right },
                noTotal,
                croData.n.turn,
                noWidth,
              ).left,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'noFront',
            x:
              (boxSize - gap) / 2 +
              gap -
              noWidth / 2 +
              calcPosition(
                { left: croData.w.left, front: croData.s.front, right: croData.e.right },
                noTotal,
                croData.n.turn,
                noWidth,
              ).front,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'noRight',
            x:
              (boxSize - gap) / 2 +
              gap -
              noWidth / 2 +
              calcPosition(
                { left: croData.w.left, front: croData.s.front, right: croData.e.right },
                noTotal,
                croData.n.turn,
                noWidth,
              ).right,
            y: height / 2,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 WI
          {
            name: 'wiLeft',
            x: 0 + height / 2,
            y: (boxSize - gap) / 2 + gap - wiWidth / 2 + calcPosition(croData.w, wiTotal, croData.w.turn, wiWidth).left,

            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'wiFront',
            x: 0 + height / 2,
            y:
              (boxSize - gap) / 2 + gap - wiWidth / 2 + calcPosition(croData.w, wiTotal, croData.w.turn, wiWidth).front,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'wiRight',
            x: 0 + height / 2,
            y:
              (boxSize - gap) / 2 + gap - wiWidth / 2 + calcPosition(croData.w, wiTotal, croData.w.turn, wiWidth).right,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 WO
          {
            name: 'woLeft',
            x: 0 + height / 2,
            y:
              (boxSize - gap) / 2 +
              woWidth / 2 -
              calcPosition(
                { left: croData.s.left, front: croData.e.front, right: croData.n.right },
                woTotal,
                croData.w.turn,
                woWidth,
              ).left,

            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'woFront',
            x: 0 + height / 2,
            y:
              (boxSize - gap) / 2 +
              woWidth / 2 -
              calcPosition(
                { left: croData.s.left, front: croData.e.front, right: croData.n.right },
                woTotal,
                croData.w.turn,
                woWidth,
              ).front,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'woRight',
            x: 0 + height / 2,
            y:
              (boxSize - gap) / 2 +
              woWidth / 2 -
              calcPosition(
                { left: croData.s.left, front: croData.e.front, right: croData.n.right },
                woTotal,
                croData.w.turn,
                woWidth,
              ).right,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 EI
          {
            name: 'eiLeft',
            x: boxSize - height / 2,
            y: (boxSize - gap) / 2 + eiWidth / 2 - calcPosition(croData.e, eiTotal, croData.e.turn, eiWidth).left,

            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'eiFront',
            x: boxSize - height / 2,
            y: (boxSize - gap) / 2 + eiWidth / 2 - calcPosition(croData.e, eiTotal, croData.e.turn, eiWidth).front,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'eiRight',
            x: boxSize - height / 2,
            y: (boxSize - gap) / 2 + eiWidth / 2 - calcPosition(croData.e, eiTotal, croData.e.turn, eiWidth).right,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },

          // ----------- 单方向流向节点 EO
          {
            name: 'eoLeft',
            x: boxSize - height / 2,
            y:
              (boxSize - gap) / 2 +
              gap -
              eoWidth / 2 +
              calcPosition(
                { left: croData.n.left, front: croData.w.front, right: croData.s.right },
                eoTotal,
                croData.e.turn,
                eoWidth,
              ).left,

            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'eoFront',
            x: boxSize - height / 2,
            y:
              (boxSize - gap) / 2 +
              gap -
              eoWidth / 2 +
              calcPosition(
                { left: croData.n.left, front: croData.w.front, right: croData.s.right },
                eoTotal,
                croData.e.turn,
                eoWidth,
              ).front,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
          {
            name: 'eoRight',
            x: boxSize - height / 2,
            y:
              (boxSize - gap) / 2 +
              gap -
              eoWidth / 2 +
              calcPosition(
                { left: croData.n.left, front: croData.w.front, right: croData.s.right },
                eoTotal,
                croData.e.turn,
                eoWidth,
              ).right,
            symbol: 'rect',
            symbolSize: [0, 0],
            label: { show: false },
          },
        ],
        links: [
          // --------- SI
          {
            source: 'siLeft',
            target: 'woLeft',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.s.left / siTotal) * siWidth,
              curveness: -0.5,
              color: colorList[3],
            },
          },
          {
            source: 'siFront',
            target: 'noFront',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.s.front / siTotal) * siWidth,
              curveness: 0,
              color: colorList[3],
            },
          },
          {
            source: 'siRight',
            target: 'eoRight',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.s.right / siTotal) * siWidth,
              curveness: 0.5,
              color: colorList[3],
            },
          },

          // --------- NI
          {
            source: 'niLeft',
            target: 'eoLeft',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.n.left / niTotal) * niWidth,
              curveness: -0.5,
              color: colorList[0],
            },
          },
          {
            source: 'niFront',
            target: 'soFront',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.n.front / niTotal) * niWidth,
              curveness: 0,
              color: colorList[0],
            },
          },
          {
            source: 'niRight',
            target: 'woRight',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.n.right / niTotal) * niWidth,
              curveness: 0.5,
              color: colorList[0],
            },
          },

          // ----- EI
          {
            source: 'eiLeft',
            target: 'soLeft',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.e.left / eiTotal) * eiWidth,
              curveness: -0.5,
              color: colorList[2],
            },
          },
          {
            source: 'eiFront',
            target: 'woFront',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.e.front / eiTotal) * eiWidth,
              curveness: 0,
              color: colorList[2],
            },
          },
          {
            source: 'eiRight',
            target: 'noRight',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.e.right / eiTotal) * eiWidth,
              curveness: 0.5,
              color: colorList[2],
            },
          },

          // ----- WI
          {
            source: 'wiLeft',
            target: 'noLeft',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.w.left / wiTotal) * wiWidth,
              curveness: -0.5,
              color: colorList[1],
            },
          },
          {
            source: 'wiFront',
            target: 'eoFront',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.w.front / wiTotal) * wiWidth,
              curveness: 0,
              color: colorList[1],
            },
          },
          {
            source: 'wiRight',
            target: 'soRight',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.w.right / wiTotal) * wiWidth,
              curveness: 0.5,
              color: colorList[1],
            },
          },

          // ----------掉头流量
          {
            source: 'si',
            target: 'so',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.s.turn / siTotal) * siWidth,
              type: 'dotted',
              curveness: 0,
              color: colorList[3],
            },
          },
          {
            source: 'ni',
            target: 'no',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.n.turn / niTotal) * niWidth,
              type: 'dotted',
              curveness: 0,
              color: colorList[0],
            },
          },
          {
            source: 'wi',
            target: 'wo',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.w.turn / wiTotal) * wiWidth,
              type: 'dotted',
              curveness: 0,
              color: colorList[1],
            },
          },
          {
            source: 'ei',
            target: 'eo',
            label: {
              show: false,
            },
            lineStyle: {
              width: (croData.e.turn / eiTotal) * eiWidth,
              type: 'dotted',
              curveness: 0,
              color: colorList[2],
            },
          },
        ],
        lineStyle: {
          opacity: 0.9,
        },
      },
    ],
  };

  return option;
};

export default getOption;
