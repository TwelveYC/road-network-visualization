# road-network-visualization

## 道路网络可视化例子

使用d3.js将从osmnx上面下载的道路网络可视化出来

按照如下步骤操作
* 1、使用osmnx包下载Piedmont, California, USA的道路网络，然后生成networkx对象
* 2、将networkx对象的点线上面的坐标点抽离下来，形成json数据保存
* 3、使用d3.json的方法读取到生成的数据，然后处理，使用d3绘制出来

其中要注意的是，并没有使用d3.js的投影，只是简单根据经纬度数据转化为屏幕像素点。
打开html文件需要本地服务器
为后续开发道路网络可视化平台和等值线打下基础。

## 高亮
可以bursh和drag