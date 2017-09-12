---
title: 'IOS development Technical Q&A'
date: 2014-12-18
tags:
    - iOS
---

### 私有数据存储<em style="font-size:12px;float:right">[Technical Q&A QA1699](https://developer.apple.com/library/ios/qa/qa1699/_index.html)</em>
<span style="color:#E74C3C"><em>Q:</em></span>我的app支持文件共享，但是一些私有数据我不想让用户访问。我该在哪里存储这些私有数据？

<span style="color:#E74C3C"><em>A:</em></span>从IOS3.2开始，通过在<em>Info.plist</em>中添加<em>UIFileSharingEnabled</em>关键字，应用程序可以允许用户向app中的文档目录添加文件。设置这个关键字后，<em>&lt; Application Home &gt;/Documents </em>目录下的内容可以在iTunes中自由访问，用户可以任意添加
或删除文件。添加<em>UIFileSharingEnabled</em>关键字并且需要维护用户私有数据的应用，需要将私有数据存储在别的目录下。

除了以上指出的目录外，整个<em>&lt; Application Home &gt;/Library </em>目录在更新和备份时，一直会被保存下来，除了<em>&lt; Application Home &gt;/Library/Caches </em>目录。因此，应用程序可以在<em>&lt; Application Home &gt;/Library </em>目录下创建自己的目录，在更新和备份期间，这些目录也会被保存下来。为了降低命名冲突的风险，我们建议你小心命名
你的目录。如，将一个目录命名为<em>Private Documents </em>会比较好。

与用户共享文件，更多信息，参见[Sharing Files With the User](https://developer.apple.com/library/ios/documentation/Miscellaneous/Conceptual/iPhoneOSTechOverview/CoreServicesLayer/CoreServicesLayer.html)。

有关如何备份和更新，更多信息，参见[Backup and Restore](http://developer.apple.com/library/ios/#documentation/iphone/conceptual/iphoneosprogrammingguide/RuntimeEnvironment/RuntimeEnvironment.html)。

***

### 向一个超出父视图边界的视图派发事件<em style="font-size:12px;float:right">[Technical Q&A QA1812](https://developer.apple.com/library/ios/qa/qa2013/qa1812.html)</em>

<span style="color:#E74C3C"><em>Q:</em></span>我的view在屏幕上显示正确，但是无法接受touch事件.为什么？

<span style="color:#E74C3C"><em>A:</em></span>该问题的常见起因是你的view定位在它父view边界之外。在应用接受到一个touch事件时，会发起一个<em>
hit-tesing</em>过程，来决定哪个view来接受事件。这个过程起始于view层次结构的根，通常是指应用的window，并从前向后的顺序查找subviews，直到找到位于touch下面的最上层的view。这个view会成为hit-test
view ，并接受touch事件。每个参与该流程的view首先会检测事件是否发生在自己的边界内。只有检测成功后，这个view才会进一步将事件交由其subviews来继续进行hit-test检测。所以如果你的view在touch下面，但其自身
定位超出其父view的边界，父view无法检测到事件位置，也不会将touch事件传递给你的view。

解决办法之一是改变view层次结构的布局，以便你的view定位在其父view边界之内。如果因某些原因导致必须保持当前布局，你也可以通过改变其父view的hit-testing行为，以避免父view会忽略touch事件。可以通过
覆盖父view的`-(UIView *)hitTest:withEvent: `方法来达到该效果,如下:

覆盖父view类的hit-tesing方法
```objc
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {

    // Convert the point to the target view's coordinate system.
    // The target view isn't necessarily the immediate subview
    CGPoint pointForTargetView = [self.targetView convertPoint:point fromView:self];

    if (CGRectContainsPoint(self.targetView.bounds, pointForTargetView)) {

        // The target view may have its view hierarchy,
        // so call its hitTest method to return the right hit-test view
        return [self.targetView hitTest:pointForTargetView withEvent:event];
    }

    return [super hitTest:point withEvent:event];
}
```
关于hit-testing的更多信息，请参考<em> Event Handling Guide for iOS</em>中关于[Event Delivery](http://developer.apple.com/library/ios/documentation/EventHandling/Conceptual/EventHandlingiPhoneOS/event_delivery_responder_chain/event_delivery_responder_chain.html)的讨论。

其它可能导致该问题的原因包括：

+ view或其任何父view的`userInteractionEnabled`属性设置为了`NO`。
+ application对象调用了`beginIgnoringInteractionEvents`方法，但没有调用`endIgnoringInteractionEvents`方法。


为了维持view的可交互性，你要确保`userInteractionEnabled`属性设置为了`YES`,并且确保application不会忽略用户事件。

如果你得view在动画期间没有收到touch事件，那是因为`UIView`的动画方法常常在动画执行期间禁用掉了touch事件。在执行`UIView`的动画时，配置`UIViewAnimationOptionAllowUserInteraction`选项，可以允许view在动画执行期间接受touch事件。

***












