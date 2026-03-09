Excel 是常用的办公软件，我们会用它来做数据的整理。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d93156a170f4c23a75cbce3f40014ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=536&s=63426&e=png&b=fdfdfd)

后台管理系统一般都会支持从 Excel 导入数据，或者导出数据到 Excel 文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c36b870e0ce24a9e86fae6f06bb63876~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=640&s=119707&e=png&b=d6d6d6)

那这种功能是如何实现的呢？

在 Node 和浏览器里，如何解析、生成 Excel 文件呢？

一般我们会用 [exceljs](https://www.npmjs.com/package/exceljs) 这个包来做。

在 npm 官网可以看到，这个包每周有 30w+ 的下载量，用的还是很多的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e4a95a769c4423bb83ae6102e9efe23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=694&h=514&s=43873&e=png&b=fefefe)

我们具体写代码试试：

```
mkdir exceljs-test
cd exceljs-test
npm init -y
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c18b7a56c1b4208a686bcedc5da71ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=666&s=86286&e=png&b=010101)

安装 exceljs：

```
npm install --save exceljs
```
把刚才这个 excel 文件复制过来：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d93156a170f4c23a75cbce3f40014ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=536&s=63426&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b591b0ae6914488aa20cb9ef8135ab83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=410&h=244&s=24754&e=png&b=191919)

我们在代码里读取出来看看：

```javascript
const { Workbook } = require('exceljs');

async function main(){
    const workbook = new Workbook();

    const workbook2 = await workbook.xlsx.readFile('./data.xlsx');

    workbook2.eachSheet((sheet, index1) => {
        console.log('工作表' + index1);

        sheet.eachRow((row, index2) => {
            const rowData = [];
    
            row.eachCell((cell, index3) => {
                rowData.push(cell.value);
            });

            console.log('行' + index2, rowData);
        })
    })
}

main();
```
工作表就是这个东西：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb7c74166adc4b50ba7af7a6db9b2fa2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=894&s=285150&e=gif&f=42&b=fdfdfd)

每个工作表下都是独立的表格。

也就是 workbook（工作簿） > worksheet（工作表） > row（行） > cell（列）这样的层级关系。

每一层都可以遍历：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a8e52d5819d4f6ca1cefaab0b32e173~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=818&s=127582&e=png&b=1f1f1f)

所以我们遍历 sheet、row、cell 这几层，就能拿到所有的数据。

跑下看看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28013f43c3ce4ae89200190d697944f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=204&s=44099&e=png&b=181818)

确实都拿到了。

这样就是数据导入，我们从 excel 文件里解析出数据，然后存入数据库。

exceljs 还提供了简便的方法，可以直接调用 worksheet 的 getSheetValues 来拿到表格数据，不用自己遍历：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bb978d8799d4752ab3832eb744818ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=970&s=183332&e=png&b=1d1d1d)

解析 excel 文件还是很简单的。

导入数据的时候，按照格式从中解析数据然后存入数据库就行。

有同学可能会说，那如果 excel 的格式不符合要求呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cb4f54f3eaf4ad78b3604395a42759a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=578&s=94262&e=png&b=eeeeee)

一般我们都会提供一个 excel 模版，用这个模版来填数据，然后再导入。

excel 解析我们会了，再来看下 excel 的生成：

```javascript
const { Workbook } = require('exceljs');

async function main(){
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('guang111');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: '姓名', key: 'name', width: 30 },
        { header: '出生日期', key: 'birthday', width: 30},
        { header: '手机号', key: 'phone', width: 50 }
    ];

    const data = [
        { id: 1, name: '光光', birthday: new Date('1994-07-07'), phone: '13255555555' },
        { id: 2, name: '东东', birthday: new Date('1994-04-14'), phone: '13222222222' },
        { id: 3, name: '小刚', birthday: new Date('1995-08-08'), phone: '13211111111' }
    ]
    worksheet.addRows(data);

    workbook.xlsx.writeFile('./data2.xlsx');    
}

main();
```
相当简单，也是按照层次结构，先 addWorkSheet、然后 addRows，之后写入文件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e2e9d654fbf476a9bcbf843929e9385~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1704&h=976&s=107669&e=png&b=fefefe)

可以看到 worksheet 的名字，还有每行的数据都是对的。

右边手机号那一列最宽，因为我们设置了 width 是 50。

excel 是可以设置格式的，比如字体、背景色等，在代码里同样可以。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95ef121dde384041b6283b594c581d58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=1038&s=175284&e=png&b=1f1f1f)

就是遍历 row、cell，根据行数设置 style 就好了：
```javascript
worksheet.eachRow((row, rowIndex) => {
    row.eachCell(cell => {
        if(rowIndex === 1) {
            cell.style = {
                font: {
                    size: 10,
                    bold: true,
                    color: { argb: 'ffffff' }
                },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' }
                },
                border: {
                    top: { style: 'dashed', color: { argb: '0000ff' } },
                    left: { style: 'dashed', color: { argb: '0000ff' } },
                    bottom: { style: 'dashed', color: { argb: '0000ff' } },
                    right: { style: 'dashed', color: { argb: '0000ff' } }
                }
            }
        } else {
            cell.style = {
                font: {
                    size: 10,
                    bold: true,
                },
                alignment: { vertical: 'middle', horizontal: 'left' },
                border: {
                    top: { style: 'dashed', color: { argb: '0000ff' } },
                    left: { style: 'dashed', color: { argb: '0000ff' } },
                    bottom: { style: 'dashed', color: { argb: '0000ff' } },
                    right: { style: 'dashed', color: { argb: '0000ff' } }
                }
            }
        }
    })
})
```
style 可以设置 font、fill、border、alignment 这些。

跑下看看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3233def7c38d4047b0ea9eb90c555aa9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1732&h=506&s=78554&e=png&b=fefefe)

这样，就完成了数据的导出。

而且，exceljs 这个库可以直接在浏览器里用。

我们试试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d20a3d223934f0296f629780100f8a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1292&h=1148&s=235094&e=png&b=1f1f1f)

创建 index.html，引入 exceljs 包。

添加一个 file 类型的 input，onchange 的时候解析其中的内容，解析逻辑和之前一样，只是从 readFile 换成 load。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/exceljs@4.4.0/dist/exceljs.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file"/>
    <script>
        const fileInput = document.getElementById('fileInput');
        fileInput.onchange = async () => {
            const file = fileInput.files[0];

            const { Workbook } = ExcelJS;

            const workbook = new Workbook();

            const workbook2 = await workbook.xlsx.load(file);

            workbook2.eachSheet((sheet, index1) => {
                console.log('工作表' + index1);

                const value = sheet.getSheetValues();

                console.log(value);
            })
        }
    </script>
</body>
</html>
```
起个静态服务：

```
npx http-server .
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e316343d7ec743b4b661840d79f62f80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=594&h=546&s=83162&e=png&b=181818)

浏览器访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffb5b97548c14580b1e626946525853c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=834&s=115567&e=png&b=fefefe)

可以看到，同样解析出了 excel 的内容。

然后再试试生成 excel：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e726e420d33844ee9b87f0e273d0f03f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=1002&s=211065&e=png&b=202020)

前面的逻辑一样，只是把 writeFile 换成了 writeBuffer。

这里我创建了一个 10M 的 ArrayBuffer 来写入数据，之后再读取。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/exceljs@4.4.0/dist/exceljs.min.js"></script>
</head>
<body>
    <script>
        const { Workbook } = ExcelJS;

        async function main(){
            const workbook = new Workbook();

            const worksheet = workbook.addWorksheet('guang111');

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 20 },
                { header: '姓名', key: 'name', width: 30 },
                { header: '出生日期', key: 'birthday', width: 30},
                { header: '手机号', key: 'phone', width: 50 }
            ];

            const data = [
                { id: 1, name: '光光', birthday: new Date('1994-07-07'), phone: '13255555555' },
                { id: 2, name: '东东', birthday: new Date('1994-04-14'), phone: '13222222222' },
                { id: 3, name: '小刚', birthday: new Date('1995-08-08'), phone: '13211111111' }
            ]
            worksheet.addRows(data);

            worksheet.eachRow((row, rowIndex) => {
                row.eachCell(cell => {
                    if(rowIndex === 1) {
                        cell.style = {
                            font: {
                                size: 10,
                                bold: true,
                                color: { argb: 'ffffff' }
                            },
                            alignment: { vertical: 'middle', horizontal: 'center' },
                            fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '000000' }
                            },
                            border: {
                                top: { style: 'dashed', color: { argb: '0000ff' } },
                                left: { style: 'dashed', color: { argb: '0000ff' } },
                                bottom: { style: 'dashed', color: { argb: '0000ff' } },
                                right: { style: 'dashed', color: { argb: '0000ff' } }
                            }
                        }
                    } else {
                        cell.style = {
                            font: {
                                size: 10,
                                bold: true,
                            },
                            alignment: { vertical: 'middle', horizontal: 'left' },
                            border: {
                                top: { style: 'dashed', color: { argb: '0000ff' } },
                                left: { style: 'dashed', color: { argb: '0000ff' } },
                                bottom: { style: 'dashed', color: { argb: '0000ff' } },
                                right: { style: 'dashed', color: { argb: '0000ff' } }
                            }
                        }
                    }
                })
            })

            const arraybuffer = new ArrayBuffer(10 * 1024 * 1024);
            const res = await workbook.xlsx.writeBuffer(arraybuffer);

            console.log(res.buffer);
        }

        main();
    </script>
</body>
</html>
```
跑下试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/348ad82e55ee4618b12c071c7d7300ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=1080&s=104568&e=png&b=ffffff)

可以看到，确实有数据了。

那有了 arraybuffer 的数据，如何触发下载呢？

创建一个 a 标签，设置 download 属性，然后触发点击就可以了。

也就是这样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/435f792813204ef992932295b04a40b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=848&s=155108&e=png&b=1f1f1f)

```javascript
function download(arrayBuffer) {
    const link = document.createElement('a');

    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'guang.xlsx';

    document.body.appendChild(link);

    link.click();
    link.addEventListener('click', () => {
        link.remove();
    });
}
```
跑一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d10353e0521545a2820abd644bb73f45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=292&s=57738&e=png&b=fefefe)

可以看到，生成了 excel 并且触发了下载。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9090e02d4ca847d5a4a80928b6f516a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1722&h=364&s=52811&e=png&b=fdfdfd)

打开文件，可以看到和 node 里生成的一样。

案例代码上传了 github：https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exceljs-test

## 总结

Excel 的导入导出是后台管理系统的常见功能，我们一般用 exceljs 来实现。

excel 文件分为 workbook、worksheet、row、cell 这 4 层，解析和生成都是按照这个层次结构来。

解析就是 readFile 之后，遍历 worksheet、row，拿到 cell 中的数据 。

生成就是 addWorkSheet、addRow 添加数据，然后 writeFile 来写入文件。

如果是在浏览器里，就把 readFile 换成 load，把 writeFile 换成 writeBuffer 就好了。

浏览器里生成 excel 之后，可以通过 a 标签触发下载，设置 download 属性之后，触发点击就好了。

这样，我们就分别在 node 和浏览器里完成了 excel 的解析和生成。