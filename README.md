<h1 align="center">
  Traffic Flow Echarts Option
</h1>

<h2 align="center">
  流量转向图 Echarts 配置工具
</h2>

Traffic flow charts option generator for Echarts

一个 Web 端基于 Echarts 的交通行业流量转向图绘制工具

## Example 示例

## 📖 Documentation

- How to install 安装方式

```text
yarn add traffic-flow-echarts-option
// npm i -S traffic-flow-echarts-option
```

- Usage 使用方式

```js
import { getOption } from 'traffic-flow-echarts-option';
// use echarts-for-react
import ReactEcharts from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GraphChart, CanvasRenderer]);

const options = getOption(data, config);

return <ReactEcharts
          option={option}
          echarts={echarts}
          style={{
            height: '240px',
            width: '100%',
            display: 'inline-block',
            verticalAlign: 'top',
          }}
        />;

```

## 📄 License

React Native is MIT licensed, as found in the [LICENSE][l] file.

React Native documentation is Creative Commons licensed, as found in the [LICENSE-docs][ld] file.

[l]: https://github.com/facebook/react-native/blob/HEAD/LICENSE
[ld]: https://github.com/facebook/react-native/blob/HEAD/LICENSE-docs
