在 [amis](https://aisuda.github.io/amis-editor-demo/#/edit/0) 编辑器里，物料拖动到画布区后，还可以拖动改变位置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0527ba56eba4895a44e84e18fdabc02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=2271108&e=gif&f=44&b=fdfdfd)

现在我们的编辑器没有支持拖动改变位置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f908294ce354902b9b06e9d500e7d24~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=540689&e=gif&f=36&b=fefefe)

我们来实现下：

其实这个也很简单，就是给物料也加上 useDrag 就可以了。

比如给 Button 加一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7b8b7914a37426e89116f847339ab2e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1556&h=758&s=142386&e=png&b=1f1f1f)

```javascript
const [_, drag] = useDrag({
  type: 'Button',
  item: {
      type: 'Button'
  }
});
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18a941cc97b248a185ee3a886ea406ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=646737&e=gif&f=42&b=f0effe)

现在是能拖动了，但是和从物料区拖过来的 drop 逻辑一样，都是新增组件。

我们得区分下两者。

加上 dragType 属性，然后带上当前拖拽的组件 id：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb33ad3a8704111a82681a1efbdc3df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1548&h=818&s=151608&e=png&b=1f1f1f)

在 useDrop 的时候判断下 dragTag，如果是 move，那就先 delete 再 add

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f1408b3157b44789c2618b501922ca0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=1314&s=287018&e=png&b=1f1f1f)

```javascript
import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponetsStore } from "../stores/components";

export interface ItemType {
  type: string;
  dragType?: 'move' | 'add',
  id: number
}

export function useMaterailDrop(accept: string[], id: number) {
    const { addComponent, deleteComponent, components } = useComponetsStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
              return;
            }

            if(item.dragType === 'move') {
              const component = getComponentById(item.id, components)!;

              deleteComponent(item.id);

              addComponent(component, id)
            } else {
              const config = componentConfig[item.type];

              addComponent({
                id: new Date().getTime(),
                name: item.type,
                desc: config.desc,
                props: config.defaultProps
              }, id)
            }
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop, drop }
}
```
测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3484aa4dc4442c69be6c8501333819d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=594855&e=gif&f=38&b=fefefe)

这样就实现了拖拽改变位置。

在 Container 组件也加上 useDrag：


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/344953d7ee3d452d87edc2091f98ccc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1604&h=1288&s=236841&e=png&b=1f1f1f)

这里因为要同时给 div 绑定 drag、drop 的处理，所以用 useRef 拿到 ref 之后再绑定。

```javascript
import { useDrag } from 'react-dnd';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {

    const {canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

    const divRef = useRef<HTMLDivElement>(null);

    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    }, []);
    
    return (
        <div 
            data-component-id={id}
            ref={divRef}
            style={styles}
            className={`min-h-[100px] p-[20px] ${ canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
        >{children}</div>
    )
}

export default Container;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f315518a6b24ccea7f35e4a8c1623fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=1273752&e=gif&f=58&b=fefefe)

接下来我们加一下 Table 的物料组件：

materials/Table/dev.tsx

```javascript
import { Table as AntdTable } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { CommonComponentProps } from '../../interface';
import { useMaterailDrop } from '../../hooks/useMaterailDrop';
import { useDrag } from 'react-dnd';

function Table({ id, name, children, styles }: CommonComponentProps) {

    const {canDrop, drop } = useMaterailDrop(['TableColumn'], id);
    
    const divRef = useRef<HTMLDivElement>(null);

    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id: id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    }, []);

    const columns = useMemo(() => {
        return React.Children.map(children, (item: any) => {
            return {
                title: <div className='m-[-16px] p-[16px]' data-component-id={item.props?.id}>{item.props?.title}</div>,
                dataIndex: item.props?.dataIndex,
                key: item
            }
        })
    }, [children]);

    return (
        <div
            className={`w-[100%] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
            ref={divRef}
            data-component-id={id}
            style={styles}
        >
            <AntdTable
                columns={columns}
                dataSource={[]}
                pagination={false}
            />
        </div>
    );
}

export default Table;
```
添加 drop、drag 的处理，用 antd 的 table 来渲染。

这里 columns 的处理比较巧妙：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89d00b0248df4186a4cd287dce24f4c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606&h=994&s=178719&e=png&b=1f1f1f)

我们拖拽 TableColumn 组件过来的时候，用 React.Children 遍历，把它变为 columns 配置。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c32249cbce648b8bf41c0cec34238a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196&h=1104&s=102652&e=png&b=f6f6f6)

当然，这个 TableColumn 组件还没写。

在 componentConfig 添加 Table 组件的配置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94464a2cfb844e1ea995701156401764~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=992&s=159632&e=png&b=1f1f1f)

```javascript
Table: {
    name: 'Table',
    defaultProps: {},
    desc: '表格',
    setter: [
        {
          name: 'url',
          label: 'url',
          type: 'input',
        },
    ],
    dev: TableDev,
    prod: TableDev
}
```
然后在 Page、Modal、Container 组件里支持下 Table 的 drop：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1fd96a2274245e0a61304df37ba36be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1400&h=650&s=131586&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea417a5feee3480cad3b8ca03dbab2e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368&h=890&s=168587&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c85a6eaa2e948eb8523e0c927a9106c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1450&h=770&s=159583&e=png&b=1f1f1f)

试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b151c1e8b81d4f2fa9e0ac75669e7ba8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=1089018&e=gif&f=53&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b6971448c6a473fa5c52a301ab7729b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2876&h=1212&s=161893&e=png&b=fefefe)

没啥问题。

然后再实现下 TableColumn 组件：

materials/TableColumn/dev.tsx
```javascript
const TableColumn = () => {
  return <></>
}

export default TableColumn;
```
materials/TableColumn/prod.tsx
```javascript
const TableColumn = () => {
    return <></>
}

export default TableColumn;
```
这只是我们做 column 配置用的，不需要渲染内容。

在 ColumnConfig 加一下配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2f5309de9ba4586a3eaa484ffb1c7fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=1190&s=143063&e=png&b=1f1f1f)

```javascript
TableColumn: {
    name: 'TableColumn',
    desc: '表格列',
    defaultProps: {
        dataIndex:`col_${new Date().getTime()}`,
        title: '列名'
    },
    setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'text',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
        {
          name: 'dataIndex',
          label: '字段',
          type: 'input',
        },
      ],
    dev: TableColumnDev,
    prod: TableColumnProd,
}
```
试下效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d25e82fbed324c45af2482538b718ff7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=963188&e=gif&f=70&b=fefefe)

我们用 TableColumn 组件来配置字段。

然后再来实现 Table 组件的 prod 版本：

materials/Table/prod.tsx

```javascript
import { Table as AntdTable } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CommonComponentProps } from '../../interface';

const Table = ({ url, children }: CommonComponentProps) => {

  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (url) {
      setLoading(true);

      const { data } = await axios.get(url);
      setData(data);

      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
        if (item?.props?.type === 'date') {
            return {
                title: item.props?.title,
                dataIndex: item.props?.dataIndex,
                render: (value: any) => value ? dayjs(value).format('YYYY-MM-DD') : null,
            }
        } else {
            return {
                title: item.props?.title,
                dataIndex: item.props?.dataIndex,
            }
        }
    })
  }, [children]);

  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      loading={loading}
    />
  );
}

export default Table;
```

生产环境的 Table 需要请求 url，拿到数据后设置到 table。

并且渲染列的时候，如果是 date，要用 dayjs 做下格式化。

安装下用到的包：

```
npm install --save axios
npm install --save dayjs
```
改下 componentConfig 里的组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cab3cacfdf54ab1947825640f194637~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=608&s=68303&e=png&b=1f1f1f)

试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41d64c2b7ab045fa932f8e24809e6709~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=601579&e=gif&f=41&b=fdfdfd)

可以看到，确实发请求了。

只不过现在没这个接口。

我们用 nest 创建一个后端服务：

```
npx @nestjs/cli new lowcode-demo-backend
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1320043f892a407dbea4a08e8544fa6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=792&s=192683&e=png&b=010101)

改下 AppController，加一个接口：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ca57a03d8a4bcba97151792ba52e2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1288&h=812&s=173602&e=png&b=1f1f1f)

```javascript
@Get('data')
data() {
    return [
      { name: '光光', sex: '男', birthday: new Date('1994-07-07').getTime() },
      { name: '东东', sex: '男', birthday: new Date('1995-06-06').getTime() },
      { name: '小红', sex: '女', birthday: new Date('1996-08-08').getTime() }
    ]
}
```
在 main.ts 开启跨域：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2570244f391a4c07bcb2537a1b0200d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=450&s=79114&e=png&b=1f1f1f)

把服务跑起来：
```
npm run start:dev
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92e9a64c06114f40a1900549f91f9e2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1596&h=392&s=133322&e=png&b=181818)

浏览器访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0ecfc6d896d4bf19fb1f57cef060687~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=738&s=71918&e=png&b=ffffff)

这样接口就有了。

我们再来试下 Table 组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bce41746dcc472589e0c36758e21b03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2866&h=892&s=155335&e=png&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb9ae0ae0576403eae318590bc1366e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542&h=810&s=109638&e=png&b=f0f0fd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed7a5b5f635b4057aa4f3d081e9271c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=928&s=169279&e=png&b=f0f1fd)

添加三个 TableColumn，配置下字段。

然后在 Table 配置下 url：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5335288de6dc4c6085423530e26e3b9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2860&h=712&s=141252&e=png&b=fdfdfd)

再点击预览：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a11c00057ec54e3ab600463131ee7933~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=339996&e=gif&f=28&b=fefefe)

这样，Table 组件就会请求 url，然后根据配置渲染表格

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32a099365db140d1a1dd80aec9dbcc5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=1558&s=329989&e=png&b=fefefe)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/lowcode-editor)，可以切换到这个 commit 查看：

```
git reset --hard 3df08cf3e09d69817f1bc75bf1b0f9f5e8cb41c4
```

## 总结

这节我们实现了物料组件拖拽改变位置，并实现了 Table 组件。

拖拽改变位置只要在物料组件上加上 useDrag 就可以了，要注意区分 add 和 move 的情况，加上标识，分别做处理。

Table 组件可以配置 url，然后拖拽 TableColumn 进来，TableColumn 可以配置字段信息。

Preview 渲染的时候，根据 url 请求接口，然后根据 columns 的配置来渲染数据。

这样，Table 的物料组件就完成了。
