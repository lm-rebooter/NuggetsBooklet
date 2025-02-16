大家写中后台系统的时候，应该都用过 Ant Design 的 Form 组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/730c4b51a23f44a8bca2935d52f7e0d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1242&h=528&s=62829&e=gif&f=24&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52bc2023ca1e4971a0fa1dfeb7432d69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=1180&s=180679&e=png&b=1f1f1f)

用 Form.Item 包裹 Input、Checkbox 等表单项，可以定义 rules，也就是每个表单项的校验规则。

外层 Form 定义 initialValues 初始值，onFinish 当提交时的回调，onFinishFailed 当提交有错误时的回调。

Form 组件每天都在用，那它是怎么实现的呢？

其实原理不复杂。

每个表单项都有 value 和 onChange 参数，我们只要在 Item 组件里给 children 传入这俩参数，把值收集到全局的 Store 里。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a3409dfb7c54ca2b922e76860b9b697~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1914&h=562&s=82704&e=png&b=ffffff)

这样在 Store 里就存储了所有表单项的值，在 submit 时就可以取出来传入 onFinish 回调。

并且，还可以用 async-validator 对表单项做校验，如果有错误，就把错误收集起来传入 onFinishFailed 回调。

那这些 Item 是怎么拿到 Store 来同步表单值的呢？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/232f6ae69f394500b0d75d67ca134bbf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=758&s=113191&e=png&b=1f1f1f)

用 Context。

在 Form 里保存 Store 到 Context，然后在 Item 里取出 Context 的 Store 来，同步表单值到 Store。

我们来写下试试：

```
npx create-vite
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40a976982a454676894fd24f10ce4dbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=434&s=50421&e=png&b=000000)

安装依赖，改下 main.tsx

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c83821058ca44df8a8bfe957a867e424~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=394&s=69639&e=png&b=1f1f1f)

然后创建 Form/FormContext.ts

```javascript
import { createContext } from 'react';

export interface FormContextProps {
  values?: Record<string, any>;
  setValues?: (values: Record<string, any>) => void;
  onValueChange?: (key: string, value: any) => void;
  validateRegister?: (name:string, cb: Function) => void;
}

export default createContext<FormContextProps>({})
```
在 context 里保存 values 也就是 Store 的值。

然后添加 setValues 来修改 values

onValueChange 监听 value 变化

validateRegister 用来注册表单项的校验规则，也就是 rules 指定的那些。

然后写下 Form 组件 Form/Form.tsx

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2abf56d424f3459ea2e3f7f1c0adbe88~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1206&h=894&s=183283&e=png&b=1f1f1f)

参数传入初始值 initialValues、点击提交的回调 onFinish、点击提交有错误时的回调 onFinishFailed。

这里的 Record\<string,any> 是 ts 的类型，任意的对象的意思。

用 useState 保存 values，用 useRef 保存 errors 和 validator

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a6210b87a304e1990446416f72765ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=644&s=119320&e=png&b=1f1f1f)

为什么不都用 useState 呢？

因为修改 state 调用 setState 的时候会触发重新渲染。

而 ref 的值保存在 current 属性上，修改它不会触发重新渲染。

errors、validator 这种就是不需要触发重新渲染的数据。

然后 onValueChange 的时候就是修改 values 的值。

submit 的时候调用 onFinish，传入 values，再调用所有 validator 对值做校验，如果有错误，调用 onFinishFailed 回调：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a49abccd6164befa6e1faa94a8d27cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=1154&s=240245&e=png&b=1f1f1f)

然后把这些方法保存到 context 中，并且给原生 form 元素添加 onSubmit 的处理：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1133e18f4ad14c46b15af62ab60fe103~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=1030&s=176446&e=png&b=1f1f1f)

```javascript
import React, { CSSProperties, useState, useRef, FormEvent, ReactNode } from 'react';
import classNames from 'classnames';
import FormContext from './FormContext';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    style?: CSSProperties;
    onFinish?: (values: Record<string, any>) => void;
    onFinishFailed?: (errors: Record<string, any>) => void;
    initialValues?: Record<string, any>;
    children?: ReactNode
}

const Form = (props: FormProps) => {
    const { 
        className, 
        style,
        children, 
        onFinish,
        onFinishFailed,
        initialValues,
        ...others 
    } = props;

    const [values, setValues] = useState<Record<string, any>>(initialValues || {});

    const validatorMap = useRef(new Map<string, Function>());

    const errors = useRef<Record<string, any>>({});

    const onValueChange = (key: string, value: any) => {
        values[key] = value;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        for (let [key, callbackFunc] of validatorMap.current) {
            if (typeof callbackFunc === 'function') {
                errors.current[key] = callbackFunc();
            }
        }

        const errorList = Object.keys(errors.current).map(key => {
                return errors.current[key]
        }).filter(Boolean);

        if (errorList.length) {
            onFinishFailed?.(errors.current);
        } else {
            onFinish?.(values);
        }
    }

    const handleValidateRegister = (name: string, cb: Function) => {
        validatorMap.current.set(name, cb);
    }

    const cls = classNames('ant-form', className);

    return (
        <FormContext.Provider
            value={{
                onValueChange,
                values,
                setValues: (v) => setValues(v),
                validateRegister: handleValidateRegister
            }}
        >
            <form {...others} className={cls} style={style} onSubmit={handleSubmit}>{children}</form>
        </FormContext.Provider>
    );
}

export default Form;
```
这里用到了 classnames 包要安装下：

```
npm install --save classnames
```

接下来添加 Form/Item.tsx，也就是包装表单项用的组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7099e8d516f34e1b8f3451f3878c91ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=764&h=868&s=125007&e=png&b=1f1f1f)

首先是参数，可以传入 label、name、valuePropName、rules 等：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e63e13c60f5b4827bedaccf7152d1cea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=968&s=150275&e=png&b=1f1f1f)

valuePropName 默认是 value，当 checkbox 等表单项就要取 checked 属性了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84a123556caf4a3f9dab074fb7fbd164~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1514&h=506&s=97892&e=png&b=f9fbfb)

这里 children 类型为 ReactElement 而不是 ReactNode。

因为 ReactNode 除了包含 ReactElement 外，还有 string、number 等：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d200f6a32714d5fbf94a7303eb0658f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=422&h=332&s=33219&e=png&b=1f1f1f)

而作为 Form.Item 组件的 children，只能是 ReactElement。

然后实现下 Item 组件：

如果没有传入 name 参数，那就直接返回 children。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b95df0dd393466d9906a21546511a3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=546&s=51292&e=png&b=1f1f1f)

比如这种就不需要包装：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20a783f76c834697865ce0135cf80c77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=672&h=468&s=56681&e=png&b=202020)

创建两个 state，分别存储表单值 value 和 error。

从 context 中读取对应 name 的 values 的值，同步设置 value：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df9929bc9d984117a923c587062d9182~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=966&s=166347&e=png&b=1f1f1f)

然后 React.cloneElement 复制 chilren，额外传入 value、onChange 等参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0d07f737e8440d389ea3d23111e7cdf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1594&h=844&s=172091&e=png&b=1f1f1f)

onChange 回调里设置 value，并且修改 context 里的 values 的值：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3bed81034b44ccda5961ecc54d65ed2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1400&h=372&s=77942&e=png&b=1f1f1f)

这里的 getValueFromEvent 是根据表单项类型来获取 value：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd025ffa1b274368af1d2783ffe06a0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=1034&s=179375&e=png&b=1f1f1f)

然后是校验 rules，这个是用 async-validator 这个包：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9a4103d80624967a128312a89e037c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=1206&s=157587&e=png&b=202020)

在 context 注册 name 对应的 validator 函数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ea8ba58f65c4785a1828081248ab533~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=848&s=117696&e=png&b=1f1f1f)

然后 Item 组件渲染 label、children、error

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/509239c752284fb4a0d6a5b52e6bd696~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=1110&s=168055&e=png&b=1f1f1f)

```javascript
import React, { ReactNode, CSSProperties, useState, useContext, ReactElement, useEffect, PropsWithChildren, ChangeEvent } from 'react';
import classNames from 'classnames';
import Schema, { Rules } from 'async-validator';

import FormContext from './FormContext';

export interface ItemProps{
    className?: string;
    style?: CSSProperties;
    label?: ReactNode;
    name?: string;
    valuePropName?: string;
    rules?: Array<Record<string, any>>;
    children?: ReactElement
}

const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target.type === 'checkbox') {
        return target.checked;
    } else if (target.type === 'radio') {
        return target.value;
    }

    return target.value;
}

const Item = (props: ItemProps) => {
    const { 
        className,
        label,
        children,
        style,
        name,
        valuePropName,
        rules,
    } = props;

    if(!name) {
        return children;
    }

    const [value, setValue] = useState<string | number | boolean>();
    const [error, setError] = useState('');

    const { onValueChange, values, validateRegister } = useContext(FormContext);

    useEffect(() => {
        if (value !== values?.[name]) {
            setValue(values?.[name]);
        }
    }, [values, values?.[name]])

    const handleValidate = (value: any) => {
        let errorMsg = null;
        if (Array.isArray(rules) && rules.length) {
            const validator = new Schema({
                [name]: rules.map(rule => {
                    return {
                        type: 'string',
                        ...rule
                    }
                })
            });

            validator.validate({ [name]:value }, (errors) => {
                if (errors) {
                    if (errors?.length) {
                        setError(errors[0].message!);
                        errorMsg = errors[0].message;
                    }
                } else {
                    setError('');
                    errorMsg = null;
                }
            });

        }

        return errorMsg;
    }

    useEffect(() => {
        validateRegister?.(name, () => handleValidate(value));
    }, [value]);

    const propsName: Record<string, any> = {};
    if (valuePropName) {
        propsName[valuePropName] = value;
    } else {
        propsName.value = value;
    }

    const childEle = React.Children.toArray(children).length > 1 ? children: React.cloneElement(children!, {
        ...propsName,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            setValue(value);
            onValueChange?.(name, value);

            handleValidate(value);
        }
    });

    const cls = classNames('ant-form-item', className);

    return (
        <div className={cls} style={style}>
            <div>
                {
                    label && <label>{label}</label>
                }
            </div>
            <div>
                {childEle}
                {error && <div style={{color: 'red'}}>{error}</div>}
            </div>
        </div>
    )
}

export default Item;
```

安装用到的 async-validator：

```javascript
npm install --save async-validator
```
然后在 Form/index.tsx 导出下：

```javascript
import InternalForm from './Form';
import Item from './Item';

type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
  Item: typeof Item;
} 

const Form = InternalForm as FormInterface;

Form.Item = Item;

export default Form;
```
主要是把 Item 挂在 Form 下。

在 App.tsx 测试下：

```javascript
import { Button, Checkbox, Input } from "antd";
import Form from "./Form/index";

const Basic: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      initialValues={{ remember: true, username: '神说要有光' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: '请输入用户名!' },
          { max: 6, message: '长度不能大于 6' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item>
        <div>
          <Button type="primary" htmlType="submit" >
            登录
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Basic;
```

除了 Form 外，具体表单项用的 antd 的组件。

试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbee212ef23548d29da2af1f850aeb55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1478&h=1114&s=326131&e=gif&f=61&b=fdfdfd)

form 的 initialValues 的设置、表单的值的保存，规则的校验和错误显示，都没问题。

这样，Form 组件的核心功能就完成了。

核心就是一个 Store 来保存表单的值，然后用 Item 组件包裹具体表单，设置 value 和 onChange 来同步表单的值。

当值变化以及 submit 的时候用 async-validator 来校验。

那 antd 的 Form 也是这样实现的么？

基本是一样的。

我们来看下源码：

antd 的 Form 有个叫 FormStore 的类：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c7515edc73f4afea05f1f81b36c5aac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=1116&s=230072&e=png&b=1f1f1f)

它的 store 属性保存表单值，然后暴露 getFieldValue、setFieldValue 等方法来读写 store。

然后它提供了一个 useForm 的 hook 来创建 store：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34ddd235fbff451f93a1847db5f3ded1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=792&s=172216&e=png&b=1f1f1f)

用的时候这样用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef18824b162a44da9e7bedc6780aea31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=582&h=476&s=36647&e=png&b=f5f5f5)

这样，Form 组件里就可以通过传进来的 store 的 api 来读写 store 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4315a54ae6f478abd6d17480f9f1897~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=798&s=204543&e=png&b=1f1f1f)

当然，它会通过 context 把 store 传递下去：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd73127c2d14c3f831a48932ec87c26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=502&s=99248&e=png&b=1f1f1f)

在 Field 也就是 Item 组件里就通过 context 取出 store 的 api 来读写 store：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cecd901f359148d3950f49616c597a20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=298&s=96376&e=png&b=1f1f1f)

和我们的实现有区别么？

有点区别，antd 的 FormStore 是可以独立出来的，通过 useForm 创建好传入 Form 组件。

而我们的 Store 没有分离出来，直接内置在 Form 组件里了。

但是实现的思路都是一样的。

提供个 useForm 的 api 的好处是，外界可以拿到 store 的 api 来自己修改 store。

当然，我们也可以通过 ref 来做这个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28f8fb3152eb4675b6dd89102028dfba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=1020&s=193851&e=png&b=1f1f1f)

```javascript
import React, { CSSProperties, useState, useRef, FormEvent, ReactNode, ForwardRefRenderFunction, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import FormContext from './FormContext';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    style?: CSSProperties;
    onFinish?: (values: Record<string, any>) => void;
    onFinishFailed?: (errors: Record<string, any>) => void;
    initialValues?: Record<string, any>;
    children?: ReactNode
}

export interface FormRefApi {
    getFieldsValue: () => Record<string, any>,
    setFieldsValue: (values: Record<string, any>) => void,
}

const Form= forwardRef<FormRefApi, FormProps>((props: FormProps, ref) => {
    const { 
        className, 
        style,
        children, 
        onFinish,
        onFinishFailed,
        initialValues,
        ...others 
    } = props;

    const [values, setValues] = useState<Record<string, any>>(initialValues || {});

    useImperativeHandle(ref, () => {
        return {
            getFieldsValue() {
                return values;
            },
            setFieldsValue(fieldValues) {
                setValues({...values, ...fieldValues});
            }
        }
    }, []);

    const validatorMap = useRef(new Map<string, Function>());

    const errors = useRef<Record<string, any>>({});

    const onValueChange = (key: string, value: any) => {
        values[key] = value;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        for (let [key, callbackFunc] of validatorMap.current) {
            if (typeof callbackFunc === 'function') {
                errors.current[key] = callbackFunc();
            }
        }

        const errorList = Object.keys(errors.current).map(key => {
                return errors.current[key]
        }).filter(Boolean);

        if (errorList.length) {
            onFinishFailed?.(errors.current);
        } else {
            onFinish?.(values);
        }
    }

    const handleValidateRegister = (name: string, cb: Function) => {
        validatorMap.current.set(name, cb);
    }

    const cls = classNames('ant-form', className);

    return (
        <FormContext.Provider
            value={{
                onValueChange,
                values,
                setValues: (v) => setValues(v),
                validateRegister: handleValidateRegister
            }}
        >
            <form {...others} className={cls} style={style} onSubmit={handleSubmit}>{children}</form>
        </FormContext.Provider>
    );
})

export default Form;
```

然后在 App.tsx 试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04cd71f31b344529973da571fe69b263~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=828&s=149412&e=png&b=1f1f1f)

```javascript
import { Button, Checkbox, Input } from "antd";
import Form from "./Form/index";
import { useEffect, useRef } from "react";
import { FormRefApi } from "./Form/Form";

const Basic: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const form = useRef<FormRefApi>(null);

  return (
    <>
      <Button type="primary" onClick={() => {
        console.log(form.current?.getFieldsValue())
      }}>打印表单值</Button>

      <Button type="primary" onClick={() => {
        form.current?.setFieldsValue({
          username: '东东东'
        })
      }}>设置表单值</Button>

      <Form
        ref={form}
        initialValues={{ remember: true, username: '神说要有光' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: '请输入用户名!' },
            { max: 6, message: '长度不能大于 6' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item>
          <div>
            <Button type="primary" htmlType="submit" >
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default Basic;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/519a39254f6a43f5807e5cd0367a331a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=826&s=228463&e=gif&f=40&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da423bd611504c76a18189d782bdb699~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=428&s=74220&e=gif&f=15&b=fdfdfd)

当然，你也可以把 store 的 api 处理出来，然后封装个 useForm 的 hook 来传入 Form 组件。

这样，用法比 ref 的方式简单点。

至此，我们就实现了 antd 的 Form 的功能。

案例代码上传了 [react 小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/form-component)

## 总结

我们每天都在用 antd 的 Form 组件，今天自己实现了下。

其实原理不复杂，就是把 Form 的表单项的值存储到 Store 中。

在 Form 组件里把 Store 放到 Context，在 Item 组件里取出来。

用 Item 组件包裹表单项，传入 value、onChange 参数用来同步表单值到 Store。

这样，表单项的值变化或者 submit 的时候，就可以根据 rules 用 async-validator 来校验。

此外，我们还通过 ref 暴露出了 setFieldsValue、getFieldsValue 等 store 的 api。

当然，在 antd 的 Form 里是通过 useForm 这个 hook 来创建 store，然后把它传入 Form 组件来用的。

两种实现方式都可以。

每天都用 antd 的 Form 组件，不如自己手写一个吧！
