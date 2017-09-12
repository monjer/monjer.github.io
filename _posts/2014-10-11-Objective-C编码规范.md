---
title: Objective-C编码规范
date: 2014-10-11 12:55:08
tags:
---

+ 文件命名
+ 文件说明
+ 文件目录
+ \#import与#include
+ 空格及代码格式化
+ 类(class)命名
+ 分类(categories)命名
+ 属性(property)命名
+ 方法(method)命名
+ 变量(variable)命名
+ 点符号(dot-notation)用法
+ 注释(comment)
+ 单例
+ 块(Blocks)
+ 图片命名
+ Prefix.pch文件
+ CGGeometry函数
+ 使用#pragma mark -
+ 私有属性&&私有方法
+ 对象字面量(Literals)
+ 属性(Properties)和实例变量(Instance Variables)
+ 删除自动生成的代码模板
  
### 文件命名

文件名称应该反映其所包含类的名称及类的作用，在Objective-C中通常要在文件名称的开始处中添加由两个大写字母组成的前缀，以代表当前文件所属的工程。如：
```objc	
MMRootViewController.h	
MMRootViewController.m
```
定义Objective-C的一个控制类`MMRootViewController`，其中`MM`代表公司MolaMola的首字母缩写，`RootViewController`表明该类是Application的根对象,是全局控制器的顶层类。

### 文件说明

由于是多人协作共同完成一个工程，根据模块的划分，每个人都要创建和维护属于自己任务范围内的类，在Objective-C中几乎每个属于MVC范围的类都对应着一个头文件`.h`和源文件`.m`文件。因此我们需要在文件中为该文件添加必要的说明性内容，便于划清职责和后期代码维护。默认情况下Xcode会以注释的形式，在文件的启起始位置为新建的文件添加默认的说明，如`MMRootViewController.h`的文件说明：
```objc
//
//  MMRootViewController.h
//  MolaSyncPro
//
//  Created by manjun.han on 30/04/2013.
//  Copyright (c) 2013 molasync. All rights reserved.
//
```
在以上的文件说明中，分别指明了
	
+ **文件名称**:`MMRootViewController.h`
+ **类名**:`MMRootViewController`
+ **文件前缀**:`MM`
+ **所属工程名称**:`MolaSyncPro`
+ **文件创建者**:`manjun.han`
+ **文件创建日期**:`30/04/2013`
+ **文件所有公司名称:**:`molasync`
	
以上几项基本上能说明一个文件的基本信息，请在创建文件时，按照此格式来添加自己的文件说明。

### 文件目录

IOS开发中我们会以Xcode作为首选IDE开发我们的工程，基于工程架构考虑，为了更清晰的管理我们工程中的类，通常我们都会将一个较大的工程以模块的形式进行划分，通常不同的模块会被分类到不同目录下。默认情况下Xcode中是以**组(Group)**的形式来将模块归类，但所有模块中的文件都会保存在项目的根目录下，当工程规模变大时，我们在批量管理莫某块下的类时，如，集体移动，复制等操作，物理上会变得难于管理。因此要求我们在Xcode中新建的每个**组(Group)**都要对应文件系统中的一个**同层级同名**的目录。如在MolaSyncPro中：

组：

`ViewController`--> `SliderPanel`，

在工程的磁盘根目录下会有对应的磁盘目录：

`ViewController`--> `SliderPanel`。

### \#import与#include

根据被包含的头文件的语言类型来决定使用`#import`或`#include`:

+ 包含Objective-C或Objective-C++头文件时，使用`#import`
+ 包含C或C++头文件时，使用`#include`

`#import`保证头文件不会被重复包含多次。

### 缩进及代码格式化

+ **缩进**

	以4个空格为单位进行代码缩进，可以使用tabs进行代码缩进，但需要在Xcode的偏好设置中将tabs的间距设置为4个空格的长度。

+ **方法声明和定义***

	在`-`或者`+`与返回值声明之间需要添加一个空格的留白，`:`与`参数类型`之间不加空白，`参数`与`参数`声明之间添加一个空格的留白,方法定义中的大括号要单独成行，如方法声明：
	```objc
	- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath ;
	```
	方法定义：
	```objc
	- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath 
	{
		// todo
	}
	```
	参数过多时，每个参数声明需要单独成行，如：
	```objc
	- (void)mailComposeController:(MFMailComposeViewController *)controller
	          didFinishWithResult:(MFMailComposeResult)result
	                        error:(NSError *)error
	{
		// todo
	}
	```
	或
	```objc
	- (void)short:(GTMFoo *)theFoo
	          longKeyword:(NSRect)theRect
	    evenLongerKeyword:(float)theInterval
	                error:(NSError **)theError 
	{
	  // todo
	}
	```

+ **方法调用**

	方法调用的格式与方法定义格式类似，短参数列表可以写在同一代码行，如
	```objc
	[super touchesBegan:touches withEvent:event] ;
	```
	长参数列表需要将每个参数单个成行，如
	```objc
	[GAIDictionaryBuilder createEventWithCategory:GAIShareTrackerManager.SyncInviteActionType
										 action:GAIShareTrackerManager.ButtonPressAction
											label:GAIShareTrackerManager.inviteByEmail
											value:nil];
	```
	要注意的是尽量将每个单行参数中的`:`对齐。

+ **语句块**

	任何情况下都要在条件语句中保留大括号，起始大括号`{`需要与`if`语句或`else`语句在同一行，如
	```objc
	if([name isEqual:@"tom"]){
	
		NSLog(@"This is tom");
	}else{
	
		NSLog(@"not tom");
	}
	```
	而不要写成
	```objc
	if([name isEqual:@"tom"])
		NSLog(@"This is tom");
	```
	或不要写成
	```objc
	if([name isEqual:@"tom"]) NSLog(@"This is tom");
	```
	`switch/while/for/do while`语句的写法与if/else语句保持一致。

+ **行间距**

	在属性声明，方法声明，方法调用时，

	+ 属性声明之间，方法声明之间，不留空行
	+ 属性声明块和方法声明块之间添加一空行	
	+ 多个方法处理一个复杂逻辑，会形成方法声明块，不同的方法声明块之间保留一空行
	+ 方法定义之间要添加一个空行	
		```objc
		//
		// MMAlertViewController.h
		//
		@interface MMAlertViewController : NSObject
		
		@property (nonatomic) BOOL showNetworkActivity ;
		@property (nonatomic) BOOL modalAlert ;

		- (void)showSuccessAlertView ;
		- (void)showSuccessAlertViewDismissAfter:(NSTimeInterval) timer;
		@end
			
		//
		// MMAlertViewController.m
		//
		@implementation MMAlertViewController

		- (void)showSuccessAlertView
		{
		    [self buildSuccessView];
		}
		
		- (void)showSuccessAlertViewDismissAfter:(NSTimeInterval) timer
		{
		    [self showSuccessAlertView];
		    self.autoDissmissTimer = timer ;
		    [self autoDismissAfterTimeInterval];
		}
		@end
		```
### 类(class)命名

类名和协议名称需要添加前缀，并以驼峰形式的大小写混用模式命名，如：
```objc
MMRootViewController	
```
### 分类(categories)命名

分类名称的归类必须唯一，在命名上要突出该分类的所要解决的问题集，如：
```objc
UIView+Dimensions.h
UIView+Dimensions.m
```
表明该扩展用以添加UIView的定位相关的方法。

### 属性(property)命名

属性用以声明一个类的存取器(accessor methods)，要求以小写字母开头，驼峰式大小写字母混写。如：
```objc
@property (strong) NSString *title;

@property (assign) BOOL fontColorAlpha;
```
### 变量(variable)命名	

以小写字母开头，驼峰式大小写字母混写形式命名。要求词能达意，在适当的范围内可以将名称用长字符串描述的形式详细化。

+ 普通变量中，指针类型的变量名**\***需要在变量名前，如`NSString *textColor`，避免`NSString* textColor`,或者`NSString * textColor`;
+ 实例变量中，变量的名称是以下划线`_` 开始，如`_passwordField`;
+ 常量名称中(#defines,enums,const)，应该以小写字母`k`开头,如:
	```objc
	const int kNumberOfColor = 12 ；
	
	NSString *const *kUserName = @"kUserName";
	
	enum AnimationType{
		kAnimationFade,
		kAnimationZoom,
		kAnimationZoomOut,
		kAnimationZoomIn
	} ; 
	```
		
### 点符号(dot-notation)用法

点符号只应用于属性的访问和赋值，避免点符号的多级引用，如正确的写法为：
```objc
view.backgroundColor = [UIColor yellowColor];
[UIApplication sharedApplication].delegate;
```
不当的写法为：
```objc
[view setBackgroundColor:[UIColor yellowColor]];
[UIApplication sharedApplication].delegate.keyWindow.rootViewController;
```
	
### 注释(comment)

+ **类(class)，分类(category)，协议(protocol)声明注释**

	每个以上提到的几个类型都要在头文件中以多行`//`的形式进行注释，说明类型的作用，`//`与每行的文字描述需要添加一个空格，并且在描述的首尾行中添加空白的`//`注释，如
	```objc
	//
	// Application中所有Controller的父类
	// 定义了所有VC常用的加载启动流程中会涉及到的方法，以及一些VC通用方法
	//
	@interface MMViewController : UIViewController 
	
	
	@end
	```
+ **方法声明注释**

	方法注释的格式与类声明注释的格式类似，由于Objective-C中支持合理范围内的较长文字描述的方法名称，以达到自解释的目的，所以对于一般的简单的方法来说可以忽略注释，但对于内部逻辑实现较为复杂，地位比较重要，参数字面含义较模糊的，返回值需要特殊说明的方法，那么需要添加详细的注释，如
	```objc
	//
	// 根据当前设备的旋转方向（横放/竖直）重新获取屏幕的主窗口的keyWindowframe区域，
	// 设备的旋转,不会交替 window的frame的width和height，
	// window的frame值由screen的bounds减去status bar的frame值
	//
	- (CGRect)getCurrentWindowBoundsDependOnOrientation ;
	```
	默认情况下方法的创建者和创建时间与类所在文件是一致的，对于那些后续加入的方法，或者在非本人创建和维护的类添加的方法，需要添加方法的创建时间和创建人，如
	```objc
	//
	// add by: zhujunliang 2014.5.6
	//
	// 根据当前设备的旋转方向（横放/竖直）重新获取屏幕的主窗口的keyWindowframe区域，
	// 设备的旋转,不会交替 window的frame的width和height，
	// window的frame值由screen的bounds减去status bar的frame值
	//
	- (CGRect)getCurrentWindowBoundsDependOnOrientation ;
	```
### 单例

Objective-C中线程安全的单例模式的实现模式如下：
```objc
+ (id)sharedInstance 
{

   static id sharedInstance = nil;

   static dispatch_once_t onceToken;
   
   dispatch_once(&onceToken, ^{
      sharedInstance = [[self alloc] init];
   });	
   return sharedInstance;
}
```
### 块(Blocks)

在Objective-C中，根据不同的使用方式，块(Blocks)的语法包括以下几种

+ **局部变量块**
	```objc
	- (void)method
	{   ...
		returnType (^blockName)(parameterTypes) = ^returnType(parameters) {...};
		...
	}
	```
+ **属性块**
	```objc
	@property (nonatomic, copy) returnType (^blockName)(parameterTypes);
	```
+ **方法参数(parameter)块**
	```objc
	- (void)someMethodThatTakesABlock:(returnType (^)(parameterTypes))blockName;
	```
+ **方法调用参数(argument)块**
	```objc
	[someObject someMethodThatTakesABlock: ^returnType (parameters) {...}];
	```
+ **`typedef`定义块**
	```objc
	typedef returnType (^TypeName)(parameterTypes);
	// 或者
	TypeName blockName = ^returnType(parameters) {...};
	```
### 图片命名	

图片的名称形式上与属性名类似，小写字母开头，驼峰式大小写字母混用，但重点是需要保持图片命名的语义化，突出图片所用UI组件的布局，位置，功能，状态，如

+ **应用程序logo** : _appLogo_ , _appLogo@2x_
+ **顶部导航栏背景** : _topNavToolBarBackground_ , _topNavToolBarBackground@2x_
+ **返回按钮**: _backBtn_ , _backBtn@2x_
+ **提交按钮常态，禁用态，选中态** :
	* _submitBtnNormal_，_submitBtnNormal@2x_ ;
	* _submitBtnDisabled_ , _submitBtnDisabled@2x_ ;
	* _submitBtnSelected_ , _submitBtnSelected@2x_

### Prefix.pch文件

Xocde支持Prefix文件，新建项目时会自动添加Prefix文件到项目中，格式为 _项目名称\_Prefix.pch_ ，如项目名称为MolaSyncPro，那么Prefix文件为 _MolaSyncPro-Prefix.pch_ 。该文件中引入的所有头文件，在项目构建时(build)都会隐式的自动添加到其它工程的文件中。合理使用Prefix文件会提升项目的构建速度，预编译后的Prefix在每次项目构建时只是简单的进行加载而不是重复的二次编译，因此可以将项目中关键的配置头文件，宏定义文件，以及那些在整个项目周期内**不会经常变动的**代码包含进Prefix文件。

### CGGeometry函数

CGGeometry.h中定义了操作几何信息的各种快捷函数，在使用CGRect,CGSize,CGPoint等几何结构时，我们尽量使用这些快捷函数，避免使用在结构体上使用多级`.`来引用属性或为属性赋值，如鼓励以下正确的做法:
```objc
CGRect frame = self.view.frame;

CGFloat x = CGRectGetMinX(frame) ,
	    y = CGRectGetMinY(frame) ,
    width = CGRectGetWidth(frame) ,
   height = CGRectGetHeight(frame) ;
```
避免以下做法
```objc
CGRect frame = self.view.frame;

CGFloat x = frame.origin.x ,
	    y = frame.origin.y ,
    width = frame.size.width ,
   height = frame.size.height;
```
> 本小节的用法只是推荐使用，并非强制。

### 使用#pragma mark -

一个功能复杂的类有时会包含大量的属性和方法声明以及方法实现，而且属性之间，方法之间根据完成功能的不同会形成代码块，因此为了更加清晰的区分这些代码块，此处规定我们要使用`#pragma mark -`控制指令来划分这些代码块，以方便后期代码的分类，快速查找和维护。如，在同一个Controller中的方法实现如下:

```objc
#pragma mark - UIPopoverDelegate

- (void)popoverControllerDidDismissPopover:(UIPopoverController *)popoverController
{
	// todo
}

#pragma mark UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
	// todo	
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
	// todo	
}

- (UITableViewCell*)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
	// todo	 
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
	// todo
}
```
### 私有属性&&私有方法

在Objective-C中，**分类(Categories)**用以声明和实现实例方法和类方法，虽然语法上也可以在**分类(Categories)**中声明**属性(property)**，但并不鼓励这样做，所有私有属性和私有方法都应该在**类扩展(Class extensions)**中进行定义，如：

	@interface XYZPerson ()
	
	@property (nonatomic) NSObject *privateProperty;
	
	- (void)privateMethod ;
	
	@end

### 对象字面量(Literals)

Xcode4.4中添加了对对象字面量的支持，以更加快捷的方式创建对象，因此尽量使用对象字面量的形式来创建`NSString`,`NSArray`,`NSDictionary`,`NSNumber`类型的对象，在向数组或集合的字面量中添加空对象时，切勿添加`nil`值，而应该使用`NULL`值代替，如:
```objc
NSArray *positions = @[@"CEO", @"CIO", @"CFO", @"COO", @"CTO"];
NSDictionary *persons = @{@"CEO" : @"Tom", @"CIO" : @"JIM", @"CFO" : @"Polu", @"COO":@"Jemeas" , @"CTO" : @"Marry"};
NSNumber *allowed = @YES;
NSNumber *count = @1381;
```
而不应该用以下方式
```objc
NSArray *positions = [NSArray arrayWithObjects:@"CEO", @"CIO", @"CFO", @"COO", @"CTO"];
NSDictionary *persons =  [NSDictionary dictionaryWithObjectsAndKeys: @"Tom", @"CEO" , @"JIM",@"CIO", @"Polu", @"CFO",@"Jemeas" , @"COO" , @"Marry",@"CTO"];
NSNumber *allowed = [NSNumber numberWithBool:YES];
NSNumber *count = [NSNumber numberWithInteger:1381];
```
在格式上，对于复杂的数组和集合对象字面量，需要将元素分割为多行创建，如
```objc
NSArray *positions = @[	
	@"Chief Executive Officer", 
	@"Chief Information Officer",
	@"Chief Financial Officer",
	@"Chief Operating Officer", 
	@"Chief Technology Officer"
];

NSDictionary *persons =  @{
	@"Chief Executive Officer" : @"Tom", 
	@"Chief Information Officer" : @"JIM", 
	@"Chief Financial Officer" : @"Polu", 
	@"Chief Operating Officer":@"Jemeas" ,
	@"Chief Technology Officer" : @"Marry"
};
```
尽量保持多行元素间的对齐。

### 属性(Properties)和实例变量(Instance Variables)


默认情况下，每个`readwrite`属性(Property)都有一个实例变量(Instance variable)来保存其对象值，并且编译器会自动在属性上执行synthesize操作以生成对应的实例变量(Instance variable)。实例变量(Instance variable)会持有对象的值，没有特殊标明的情况下实例变量的名称与属性名称相同，但会以下划线`_`开头。如声明属性
```objc
@interface MMPerson : NSObject

@property NSString *name;

@end	
```
那么属性`name`的实例变量是`_name`。所以尽量避免重新声明属性(Property)的实例变量(Instance variable),如对于以上`MMPerson`类不正确的做法是
```objc
@interface MMPerson : NSObject{
	NSString *name;
}

@property NSString *name;

@end
```
在编码中我们推荐使用属性，并尽量使用使用点号来操作属性，或者直接使用编译器默认synthesize生成的实例变量(Instance variable)，在方法中，实例变量(Instance variable)的下划线`_`能够很好的与局部变量区分开来。

需要注意的是在类的`init`方法实现中，推荐使用实例变量来进行对象的初始化操作，而不适用self.propertyName的形式来初始化对象，如正确的写法是：
```objc
- (id)init
{
    self = [super init];

    if (self) {

        // initialize instance variables here
        _name = @"Tom";
    }
    return self;
}
```
而不要
```objc
- (id)init
{
    self = [super init];

    if (self) {

        self.name = @"Tom";
    }
    return self;
}
```
### 删除自动生成的不必要的代码注释和模板

使用Xcode的新建文件的功能，在继承Objective-C原生类，实现自定义的类时，Xcode在新的文件中会自动添加一些注释以及代码模板，如继承UIView时，`.m`文件中会自动添加`drawRect:`方法
```objc
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
```
在继承UIViewController时会自动生成`-(void)prepareForSegue:sender:`方法
```objc
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
```
尤其是在继承UITableViewController时，会在`-m`文件中添加诸多`UITableViewDelegate`和`UITableViewDataSource`代理方法。

但是，Xcode生成的新文件中，自动添加的英文注释以及代码模板并不是我们必须要使用的，所以根据具体情况，我们需要手工删除那些我们不需要的注释，以及不会实现的方法的代码模板或者片段，以保证代码整洁、清爽，增加代码的可阅读性。



### 参考


+ [Coding Guidelines for Cocoa][1]
+ [NYTimes Objective-C Style Guide][2]
+ [Google Objective-C Style Guide][3]
+ [Blocks Programming Topics][4]
+ [Speeding up your Xcode Builds][5]
+ [Configuring a Project for SDK-Based Development][6]
+ [CGGeometry Reference][7]
+ [Customizing Existing Classes][8]
+ [Google Objective-C Style Guide 中文版][9]
+ [Coding conventions][10]
+ [Encapsulating Data][11]


[1]: https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/CodingGuidelines/CodingGuidelines.html#//apple_ref/doc/uid/10000146-SW1
[2]: https://github.com/NYTimes/objective-c-style-guide
[3]: http://google-styleguide.googlecode.com/svn/trunk/objcguide.xml
[4]: https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html
[5]: https://developer.apple.com/library/ios/technotes/tn2190/_index.html
[6]: https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/cross_development/Configuring/configuring.html#//apple_ref/doc/uid/10000163i-CH1-SW2	
[7]: https://developer.apple.com/library/ios/documentation/graphicsimaging/reference/CGGeometry/Reference/reference.html
[8]: https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html#//apple_ref/doc/uid/TP40011210-CH6-SW3	
[9]: http://zh-google-styleguide.readthedocs.org/en/latest/google-objc-styleguide/
[10]: http://en.wikipedia.org/wiki/Coding_conventions#Software_maintenance
[11]: https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html#//apple_ref/doc/uid/TP40011210-CH5-SW1	
