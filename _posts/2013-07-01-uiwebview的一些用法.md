---
title: uiwebview的一些用法
date: 2013-07-01
layout: page
tags:
    - iOS
    - UIWebView
---

### 设置背景透明

+ 设置webview的 **backgroundColor** 属性为 **[UIColor clearColor]**;

  ```objc
  webView.backgroundColor = [UIColor clearColor];
  ```

+ 为webview中的HTML页面的 **body**标签添加CSS背景样式设置

  ```html
  <body style="background-color: transparent">
     ...
  </body>
  ```

+ 设置webview的 **opaque**属性值为 **NO**

  ```objc
  webView.opaque = NO;
  ```

### 加载本地HTML页面

- 方式一

    ```objc
  NSString *localHTMLPageName = @"myPage";
  NSString *path = [[NSBundle mainBundle] pathForResource:localHTMLPageName ofType:@"html"];
  // 从html文件中读取html字符串
  NSFileHandle *readHandle = [NSFileHandle fileHandleForReadingAtPath:path];
  NSString *htmlString = [[NSString alloc] initWithData:
                      [readHandle readDataToEndOfFile] encoding:NSUTF8StringEncoding];
  // 或使用
  // NSString *htmlString = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:NULL];
  // baseURL用来确定htmlString的基准地址，
  // 相当于HTML的<base>标签的作用，定义页面中所有链接的默认地址。
  [webView loadHTMLString:htmlString baseURL:[[NSBundle mainBundle] bundleURL]];
    ```

- 方式二

  ```objc
  NSString *localHTMLPageName = @"myPage";
  NSString *localHTMLPageFilePath = [[NSBundle mainBundle] pathForResource:localHTMLPageName ofType:@"html"];
  NSURL *localHTMLPageFileURL = [NSURL fileURLWithPath:localHTMLPageFilePath];
  [webView loadRequest:[NSURLRequest requestWithURL:localHTMLPageFileURL]];
  ```

### 移除滚动后的外边阴影

UIWebView包含一个scrollView组件，用来将关联web内容实现滚动效果，页面滚动后的UIWebView的面板周围会出现阴影效果，该效果是在四周添加UIImageView实现的，因此移除这种阴影效果的代码如下：

```objc
UIScrollView *scrollView = webView.scrollView;
for (int i = 0; i < scrollView.subviews.count ; i++) {
    UIView *view = [scrollView.subviews objectAtIndex:i];
    if ([view isKindOfClass:[UIImageView class]]) {
        view.hidden = YES ;
    }
}
```

### 在Safari中打开链接地址

默认情况下，长按web页面中的链接,系统会自动呼出菜单提供open，copy和cancel选项，但如果要实现触击链接跳转至safari中打开页面该怎么做呢？`UIWebViewDelegate`协议中，包含

```objc
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
```

接口，如果为webView添加了delegate对象并实现该接口，那么在webView加载任何一个frame之前都会delegate对象的该方法，该方法的返回值用以控制是否允许加载目标链接页面的内容，返回YES将直接加载内容，NO则反之。并且UIWebViewNavigationType枚举，定义了页面中用户行为的分类，包括

- `objcUIWebViewNavigationTypeLinkClicked`，用户触击了一个链接。
- `UIWebViewNavigationTypeFormSubmitted`，用户提交了一个表单。
- `UIWebViewNavigationTypeBackForward`，用户触击前进或返回按钮。
- `UIWebViewNavigationTypeReload`，用户触击重新加载的按钮。
- `UIWebViewNavigationTypeFormResubmitted`，用户重复提交表单
- `UIWebViewNavigationTypeOther`，发生其它行为。

因此，实现用户触击UIWebView页面中的链接，并跳至Safari中打开链接页面的步骤如下：

- 定义实现`UIWebViewDelegate`协议的类MyWebViewDelegate（通常是由包含UIWebView的controller中实现UIWebViewDelegate协议）。
- 按如下方式实现`webView:shouldStartLoadWithRequest:navigationType:`接口

  ```objc
  - (BOOL)webView:(UIWebView _)webView shouldStartLoadWithRequest:(NSURLRequest _)request navigationType:(UIWebViewNavigationType)navigationType { if ( navigationType == UIWebViewNavigationTypeLinkClicked ) { \[[UIApplication sharedApplication] openURL:[request URL]]; return NO; } return YES; }\`\`\`
  ```
- 新建MyWebViewDelegate对象，并赋值给webView的delegate属性

参见：[UIWebView open links in Safari](http://stackoverflow.com/questions/2899699/uiwebview-open-links-in-safari/2899793#2899793)

### 禁用页面滚动弹跳

之前提到UIWebView使用一个UIScrollView对象来关联web页面的内容，通过UIWebView的scrollView属性即可获得该对象，默认情况下网页长度超出设备视口长度后页面会滚动，用户使用手指滚动页面到页面边距并放开手指后页面会产生一个弹跳效果，去除这个效果的方法如下

```objc
webView.scrollView.bounces = NO ;
```

参见：[Stop UIWebView from "bouncing" vertically?](http://stackoverflow.com/questions/500761/stop-uiwebview-from-bouncing-vertically/3324886#3324886)

### scalesPageToFit属性

默认情况下UIWebView加载HTML页面后，会以页面的原始大小进行显示，亦即如果页面的大小超出UIWebView视口大小，UIWebView会出现滚动效果，而且用户只能通过滚动页面来查看不同区域的内容，不能使用手指的捏合手势来放大或缩小页面。通过设置

```objc
webView.scalesPageToFit = YES ;
```

UIWebView可以缩放HTML页面来适配其视口大小，从而达到整屏显示内容的效果，并且用户可以用捏合动作来放大或缩小页面来查看内容。

### 调用JavaScript代码

UIWebView提供

```objc
- (NSString *)stringByEvaluatingJavaScriptFromString:(NSString *)script
```

方法，可以在objective-c代码中调用JavaScript代码，参数script字符串保存了所要执行的js代码字符串，执行结果以字符串形式返回。以获取web页面标题为例，代码如下：

```objc
NSString *pageTitle = [webView stringByEvaluatingJavaScriptFromString:@"document.title"];
```

脚本的代码内容还要依据具体的应用场景。此外，该方法规定执行的脚本时长限定在10s内，为的是防止过长时间的阻塞页面主线程，超过执行时间上线会自动停止脚本运行，并且脚本可分配内存限定在10MB内，超过分配上线将会引发异常。

### JavaScript调用native代码

以上提到，UIWebView加载任何一个页面之前都会调用其代理的

```objc
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request
     navigationType:(UIWebViewNavigationType)navigationType
```

方法，通过调用参数request对象的URL属性来获取关于本次请求的地址以及参数信息，因此可以通过js代码模拟一次特殊的网络请求来达到调用该代理方法的作用，并通过过滤"特殊的url"来达到有目的性的js代码调用native代码的效果。所谓的"特殊的url"主要的目的是达到一种标识的效果，我们可以规定url的scheme部分，如`appscheme://appName?invokeMethodName=objcMethod&paramA=xxx;`也可以在常规的url后面附加特殊的参数标识，如`http://www.yoursite.com?objecMethodCallFlag=1&methodName=methodA&paramA=xxx1`。之后根据规定在代理方法中去相应的解析url并做出if](`http://www.yoursite.com?objecMethodCallFlag=1&methodName=methodA&paramA=xxx`。之后根据规定在代理方法中去相应的解析url并做出if) else判断即可。常见的调用方式是动态添加一个隐藏的iframe标签到HTML页面，如下：

```js
// js
function invokeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}
var url = "appscheme://appName?invokeMethodName=objcMethod&paramA=xxx";
invokeObjc(url);
```
```objc
// objc
 - (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType ｛

    static NSString *callScheme = @"appscheme";
    static NSString *invokeMethodName = @"invokeMethodName";
    NSString *scheme = request.URL.scheme ;

    if ([callScheme isEqualToString:scheme]) {

        NSString *query = request.URL.query ;
        NSArray *arr = [query componentsSeparatedByString:@"&"];
        __block NSString *methodName = @"" ;
        NSMutableDictionary *params = [NSMutableDictionary new];

        // 未考虑参数的解码操作
        [arr enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
                NSArray *kv =[obj componentsSeparatedByString:@"="];
                if (kv) {
                    if ([invokeMethodName isEqualToString: kv[0]]) {
                        methodName = kv[1];
                    }else{
                        [params setObject:kv[1] forKey:kv[0]];
                    }
            }
        }];
        // 获得方法名和参数之后，可以添加逻辑判断
        NSLog(@"%@",methodName);
        NSLog(@"%@",params);

        return NO ;
    }
    return YES ;
｝
```

前面提到的native代码调用js代码的实现方式，结合两种实现方式即完成了js与native代码间的简单的通信操作。

### 让UIWebView更加接近native

某些情况下，我们既想要UIWebView加载web页面，又想使得所加载的页面的外观和操作行为更加接近native感觉。
这时需要使用一些CSS样式来达到这些效果，这些CSS只适用于IOS中的Safari。

- `-webkit-touch-callout`

禁用长按触控对象弹出的菜单。IOS中，当你长按一个触控对象时，如链接，safari会弹出包含链接信息的菜单。禁用此行为CSS代码

```css
.disable-callout{
    -webkit-touch-callout:none ;
}
```

或在webViewDidFinisheLoad中使用

```objc
[webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.style.webkitTouchCallout='none';"];
```

- `-webkit-user-select`

控制用户是否可以选择页面元素内容。IOS中，在页面元素中进行长按操作，safari会弹出菜单，来允许进行选择行为。禁用此行为代码

```css
.disable-select{
    -webkit-user-select:none;
}
```
或在webViewDidFinisheLoad中使用

```objc
[webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.style.webkitUserSelect='none';"];
```

- `-webkit-tap-highlight-color`

覆盖当用户tap链接或clickable元素时默认产生的高亮颜色（灰色）。如

```css
.no-highlight{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}
```
### 参考
+ [Apple CSS Reference](https://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html#/apple_ref/doc/uid/TP30001266-SW1)
+ [Remove UIWebView Shadow?](http://stackoverflow.com/questions/1074320/remove-uiwebview-shadow)
