# 搭建数据分析环境：Anaconda、Jupyter Notebook
Anaconda 是一个针对数据分析领域的 Python 发行版本，它提供了包管理（packages）工具和虚拟环境（environment）管理， `conda` 命令可用于安装、卸载、更新包、创建不同版本的 Python 独立环境，可用于替换 `pip` 和 `virtualenv` 这两个工具。此外，Anaconda 自带了很多数据科学的依赖包以及Juypter Notebook 等工具。


### Anaconda 下载安装

可直接从 Anaconda [官方网站](https://www.anaconda.com/download/)进行下载，选择 Python3.6 的版本，因为 Python2.7即将被废弃，下载后根据提示安装即可


![](https://user-gold-cdn.xitu.io/2018/1/7/160cc8346a38b48e?w=748&h=417&f=png&s=70931)



macOS/Linux 安装完成之后会自动把 Anaconda 添加到 PATH 环境变量（在 ~/.bash_profile 文件中可以看到），如果你的终端默认 SHELL 不是 bash 的话（用 `echo $SHELL` 查看默认 shell 是啥），加了系统也找不到 conda 命令，比如我的 mac 默认 shell 是 zsh ，需要把下面这行添加到 ~/.zshrc 文件中

```
# added by Anaconda3 5.0.1 installer
export PATH="/Users/你的用户名/anaconda3/bin:$PATH"
```

再检查 conda 命令是否能用

```
conda -V
conda 4.3.30
```

Windows 平台安装的时候请自动勾选加入 PATH 路径，如果安装的时候没有勾选，要手动找到 Anoconda 的安装路径加入到 PATH 变量中，否则一样找不到 conda 命令。


![](https://user-gold-cdn.xitu.io/2018/1/7/160cc8307b95901c?w=499&h=387&f=png&s=21224)

为了使用 conda 安装包的过程中加快速度，可以把镜像地址修改为国内清华大学的镜像：编辑  ~/.condrc，（Windows 是在C:\Users\你的用户名\.condrc，如果没有该文件就创建一个），添加内容：
```
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
ssl_verify: false
show_channel_urls: true

```


### 常用 conda 命令

包管理

```python
# 查看帮助
conda -h 
# 查看conda版本
conda --version
# 安装 matplotlib 
conda install matplotlib
# 查看已安装的包
conda list 
# 包更新
conda update matplotlib
# 删除包
conda remove matplotlib
```

环境管理

```python
# 基于python3.6版本创建一个名字为test的python独立环境
conda create --name test python=3.6 
# 激活此环境
activate test  
source activate test # linux/mac
# 退出当前环境
deactivate test 
# 删除该环境
conda remove -n test --all
# 或者 
conda env remove  -n test

# 查看所有安装的python环境
conda info -e
test              *  D:\Programs\Anaconda3\envs\test
root                     D:\Programs\Anaconda3（安装 conda 默认生成的）

```

其他命令

```python
# 更新conda本身
conda update conda
# 更新anaconda 应用
conda update anaconda
# 更新python，假设当前python环境是3.6.1，而最新版本是3.6.2，那么就会升级到3.6.2
conda update python
```


安装完 Anoconda 之后，Jupyter Notebook 也装好了。


Jupyter Notebook 是一个强大的数据分析工具，你可以在上面写代码、运行代码、写文档、列方程式、做数据可视化展示。 正如其名，它就像一个草稿本可以在上面随意地涂写改改画画，画错了还可以擦除重做。

### 启动jupyter
在命令行直接输入：
```
jupyter notebook
```

Jupyter 启动成功后，在浏览器中会自动打开 notebook 的主界面，新建一个notebook时要点击右上角的 `New`，选择 Python3 ，这里的 Python3 就是 jupyter 的内核，是安装 Anaconda 的时候的名字为root的默认 python 环境。


![](https://user-gold-cdn.xitu.io/2018/1/7/160cc83cabb5d763?w=1251&h=500&f=gif&s=530756)


新建了 notebook 之后你就可以在单元格里面写代码或者写 markdown 文档，或者基于用 matplotlib 制图。



![](https://user-gold-cdn.xitu.io/2018/1/7/160cc83ff1e148dc?w=1292&h=544&f=png&s=60523)


### 补充

如何查看 jupyter 使用了哪些 kernel

```
 ~ jupyter kernelspec list

Available kernels:
  weixin     /Users/xxx/Library/Jupyter/kernels/weixin
  python3    /Users/xxx/anaconda3/share/jupyter/kernels/python3
```

如何新增 kernel

```
# 创建python环境
conda create -n weixin python=3.6 
# 激活
source activate weixin
# 加入到juypter
python -m ipykernel install --user --name weixin --display-name "Python (weixin)"

```

![](https://user-gold-cdn.xitu.io/2018/1/7/160cc849749ca1a9?w=645&h=319&f=png&s=21108)

新增了 kernel 之后，你可以在不同的 kernel 之间切换运行代码，本质上 kernel 还是 Python 的虚拟环境。


推荐一个Jupyter Notebook 的视频教程：[Jupyter Notebook Tutorial: Introduction, Setup, and Walkthrough](https://www.youtube.com/watch?v=HW29067qVWk)（需要翻墙）