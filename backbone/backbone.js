//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // 建立root对象，在浏览器中是`window` (`self`) ，在服务器端是`global`。我们使用`self`而不是`window`(`self`)，为了支持
  // `WebWorker`
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // 根据当前环境设置Backbone。先从AMD开始。
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // 导出到全局，即使是在AMD下，为的是防止其它脚本需要全局环境下的Backbone。
      root.Backbone = factory(root, exports, _, $);
    });

  // 接下来是在Node.js或CommonJS下。jQuery可能不是必须的模块。
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // 最后是在浏览器环境下。
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root, Backbone, _, $) {

  // 初始化设置 - Initial Setup
  // -------------

  // 保存上一个`Backbone`变量的值，为的是如果之后调用`noConflict`后，仍能恢复它。
  var previousBackbone = root.Backbone;

  // 创建一个本地的指向数组常用方法的引用，我们稍后会用到它。
  var slice = Array.prototype.slice;

  // 当前库的版本。需要与`package.json`中的version保持一致。
  Backbone.VERSION = '1.3.3';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  //
  Backbone.$ = $;

  // 在*noConflict*模式下运行Backbone.js，将`Backbone`变量的控制权返回给之前的所有者。返回Backbone对象的引用。
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // 开启`emulateHTTP`参数，支持传统的HTTP服务器。此选项设置后，会通过`_method`参数和设置一个`X-Http-Method-Override`
  // 消息头，来伪装`"PATCH"`, `"PUT"` 和 `"DELETE"`请求。
  Backbone.emulateHTTP = false;


  // 开启`emulateJSON`参数，以支持那些传统的服务器，它们无法处理`application/json`请求...这会以`application/x-www-form-urlencoded`格式
  // 编码消息体，将模型数据以表单形式发送出去，并参数名称为`model`。
  Backbone.emulateJSON = false;

  // 将Backbone类的方法代理给Underscore的函数，封装model的`attributes`对象或collection的`models`数组，将其隐藏在后面。
  //
  // collection.filter(function(model) { return model.get('age') > 10 });
  // collection.each(this.addView);
  //
  // `Function#apply`可能比较慢，所以如果我们提前知道方法参数的个数，我们会直接调用函数。
  var addMethod = function(length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return _[method](this[attribute]);
      };
      case 2: return function(value) {
        return _[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return _[method](this[attribute], cb(iteratee, this), context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return _[method].apply(_, args);
      };
    }
  };
  var addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
    });
  };

  // 支持 `collection.sortBy('attr')` 和 `collection.findWhere({id: 1})`.
  var cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
  };
  var modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
      return matcher(model.attributes);
    };
  };

  // 事件 - Backbone.Events
  // ---------------

  //
  // 一个可以混入*任何对象*的模型，为的是提供对象自定义事件频道的功能。你可以使用`on`在事件上绑定一个回调，
  // 也可以使用`off`将回调移除；`trigger`ing一个事件会依次触发所有回调。
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  //
  var Events = Backbone.Events = {};

  // 用来分割事件字符串的正则表达式。
  var eventSplitter = /\s+/;

  // 遍历标准的`event, callback`（同时也支持巧妙的多空白符分割的事件`"change blur", callback`，以及jQuery风格的事件映射`{event: callback}`）。
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // 处理事件映射。
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // 处理空白符分割的事件名称，单独的对其进行代理。
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // 最终，标准的事件。
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // 将一个事件绑定到`callback`函数上。传入`"all"`会将回调绑定到所有触发的事件上。
  Events.on = function(name, callback, context) {
    return internalOn(this, name, callback, context);
  };

  // 在公共API上保护`listening`参数。
  var internalOn = function(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }

    return obj;
  };

  // `on`的反转版本。告诉**this**对象监听另一个对象的事件...跟踪监听的对象，以便之后更容易解绑。
  Events.listenTo = function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // 这个对象还没有监听`obj`对象的事件。
    // 设置必须的引用，跟踪所有监听的回调。
    if (!listening) {
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
    }

    // 在obj上绑定callbacks，在listening对象追踪它们。
    internalOn(obj, name, callback, this, listening);
    return this;
  };

  // reducing API，在`events`对象上添加回调。
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
  };

  // 移除一个或多个回调。如果`context`是null，移除那个函数的所有回调。如果`callback`是null，
  // 移除那个event的所有回调。如果`name`是null,移除所有事件绑定的所有callback。
  Events.off = function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });
    return this;
  };

  // 告诉这个对象不再监听给定的事件...或不再监听它当前正在监听的对象。
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];


      // 如果listening对象不存在，则对象当前没有监听obj。尽早中断。
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }

    return this;
  };

  // reducing API，从`events`对象上移除一个回调。
  var offApi = function(events, name, callback, options) {
    if (!events) return;

    var i = 0, listening;
    var context = options.context, listeners = options.listeners;

    // 删除所有事件监听器，丢弃events对象。
    if (!name && !callback && !context) {
      var ids = _.keys(listeners);
      for (; i < ids.length; i++) {
        listening = listeners[ids[i]];
        delete listeners[listening.id];
        delete listening.listeningTo[listening.objId];
      }
      return;
    }

    var names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // 如果没有存储事件则跳出。
      if (!handlers) break;

      // 如果有剩余事件则替换events对象。否则，清除它。
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          listening = handler.listening;
          if (listening && --listening.count === 0) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.objId];
          }
        }
      }

      // 如果列表中有事件，更新后面的事件。否则，清除它。
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }
    return events;
  };
  //
  // 绑定一个事件，只能触发一次的。回调在第一次调用后，它的监听器就会被删除。如果多个事件以空白分隔符语法传入，
  // 处理器会在每个事件上触发一次，而不是在所有事件的组合上触发一次。
  //
  Events.once = function(name, callback, context) {
    // 将事件映射到`{event: once}`对象。
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
    if (typeof name === 'string' && context == null) callback = void 0;
    return this.on(events, callback, context);
  };

  // `once`的反转版本。
  Events.listenToOnce = function(obj, name, callback) {
    // 将事件映射到`{event: once}`对象。
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
  };

  // 将事件回调压缩到一个`{event: onceWrapper}`的map中去。在事件调用后，`offer`会解绑`onceWrapper`。
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // 触发一个或多个事件，调用所有绑定的回调。除了事件名称参数外，回调的参数与`trigger`函数的参数相同（除非你在监听
  // `all`事件，这会使得回调接收到的第一个参数为事件的真实名字）。
  Events.trigger = function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // 处理触发合适的事件回调。
  var triggerApi = function(objEvents, name, callback, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // 一个难于理解，但却优化过的内部派发函数，用来触发事件。
  // 尝试保持常用用例的速度（多数的Backbone事件有3个参数）。
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // 保持向后兼容性的别名。
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // 将`Backbone`对象当做全局的事件中心，为那些需要全局"pubsub"的folks准备的。
  _.extend(Backbone, Events);

  // 模型 - Backbone.Model
  // --------------

  // Backbone的 **Models**是框架内的基本数据对象 -- 经常代表了服务器端数据库表的一个行。
  // 一些离散的数据块，和许多有用的相关方法，用来在这些数据上执行计算和进行转换。


  // 根据给定的属性，创建一个新的模式model。会为你自动生成一个客户端id（`cid`）。
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    var defaults = _.result(this, 'defaults');
    attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // 将所有可继承方法添加到Model的prototype上。
  _.extend(Model.prototype, Events, {

    // 一个所有属性的hash，当前值和上一个值是不同的。
    changed: null,

    // 上一次校验失败后的返回值。
    validationError: null,

    // JSON`id`属性的默认名称是`"id"`。MongoDB和CouchDB的用户可能会把名称替换为`"_id"`。
    idAttribute: 'id',

    // 前缀是用来创建客户端id，此id用来在本地标识models。如果你的model的id与它冲突，你可以覆盖它。
    cidPrefix: 'c',

    // Initialize默认是空函数。可以用你自己的初始化逻辑覆盖它。
    initialize: function(){},

    // 返回model的`attributes`对象的拷贝。
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // 默认代理`Backbone.sync` -- 但如果你需要为当前**这个**特殊的model自定义同步语义，可以覆盖它。
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // 返回一个属性的值。
    get: function(attr) {
      return this.attributes[attr];
    },

    // 返回属性值的HTML转义后的值。
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // 如果属性的值不是null或undefined，则返回`true`。
    has: function(attr) {
      return this.get(attr) != null;
    },

    // underscore的`_.matches`的特殊代理。
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // 设置model的属性，并触发`"change"`事件。这是model的核心操作，更新数据，
    // 通知想要知道状态变更的对象。这是model的核心。
    set: function(key, val, options) {
      if (key == null) return this;

      // 同时处理`"key", value` 和 `{key: value}`风格的参数。
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // 执行校验。
      if (!this._validate(attrs, options)) return false;

      // 提取属性和选项。
      var unset      = options.unset;
      var silent     = options.silent;
      var changes    = [];
      var changing   = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }

      var current = this.attributes;
      var changed = this.changed;
      var prev    = this._previousAttributes;

      // 对于每个要`设置`的属性，更新或删除当前值。
      for (var attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          changed[attr] = val;
        } else {
          delete changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // 更新`id`。
      if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

      // 触发所有相关属性的变更事件。
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // 可能你会迷惑为什么这里有个`while`循环。`"change"`事件可能引起嵌套的变更。
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // 从model中删除一个属性，触发`"change"`事件。如属性不存在，`unset`会是空操作。
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // 清除model上的所有属性，触发`"change"`事件。
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // 判断model自从上次的`"change"`事件以来是否发生了变化。
    // 如果给定一个属性名称，会判断是否此属性发生了变化。
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // 返回一个对象，包含所有已经变更的属性，如果属性没有变更那么返回值为false。有益于用来决定一个视图
    // 是否需要更新，或属性是否需要持久化到服务器端。复位的属性会被设置为undefined。
    // 你可以传入一个属性对象与model做差异比较，决定是否有变更发生。
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      var changed = {};
      for (var attr in diff) {
        var val = diff[attr];
        if (_.isEqual(old[attr], val)) continue;
        changed[attr] = val;
      }
      return _.size(changed) ? changed : false;
    },

    // 获取之前属性的值，在上次`"change"`事件变更后记录的。
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // 获取上次`"change"`事件发生后的，所有model的属性，
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // 从服务器端拉取molde的数据，将响应同model的本地属性进行合并。任何变更的属性都会触发一个"change" 事件。
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (!model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // 设置model的属性，将model同步到服务器端。如果服务器返回一个不同的属性的hash，会重新设置model的状态。
    save: function(key, val, options) {
     // 同时处理`"key", value` 和 `{key: value}`风格的参数。
      var attrs;
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true, parse: true}, options);
      var wait = options.wait;

      // 如果我们在等待，且属性已存在，save操作等价于带校验的`set(attr).save(null, opts)`。否则，
      // 检测在设置属性时，需要检查model是否是合法的。
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else if (!this._validate(attrs, options)) {
        return false;
      }

      // 在成功保存到服务器端后，客户端需要更新到服务器端的状态（可选的）。
      var model = this;
      var success = options.success;
      var attributes = this.attributes;
      options.success = function(resp) {
        // 保证在同步保存过程中存储属性。
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend({}, attrs, serverAttrs);
        if (serverAttrs && !model.set(serverAttrs, options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      // 如果`{wait: true}`，就设置临时属性来寻找新的ids。
      if (attrs && wait) this.attributes = _.extend({}, attributes, attrs);

      var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      var xhr = this.sync(method, this, options);

      // 恢复属性。
      this.attributes = attributes;

      return xhr;
    },

    // 如果model已经持久化了，那么就在服务器端销毁它。
    // 如果modelc存在于collection中，那么就把他移除掉。
    // 如果传入`wait: true`，要等到服务器相应后再销毁model。
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // model在服务器端的默认的URL - 如果你正在使用Backbone的restful方法，可以覆盖当前方法来改变调用终点。
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.get(this.idAttribute);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    },

    // **parse**将response转换为一个属性的hash，用来`set`到model上。默认只会直接返回response。
    parse: function(resp, options) {
      return resp;
    },

    // 使用当前model的属性，创建一个新的model。
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // 如果model没有保存到服务器，并且缺少一个id，那么model就是新的。
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // 检查model当前是否是有效状态。
    isValid: function(options) {
      return this._validate({}, _.extend({}, options, {validate: true}));
    },

    // 在设置model属性之前执行校验，如果校验通过，返回`true`。否则触发一个`"invalid"`事件。
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // 我们希望Model实现的Underscore的方法，这里是一个每个方法接受参数个数的映射。
  var modelMethods = {keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1};

  // 以`Model#attributes`代理的形式，混入Underscore的每个方法。
  addUnderscoreMethods(Model, modelMethods, 'attributes');

  // 集合 - Backbone.Collection
  // -------------------

  //
  // 如果model代表了一行数据，那么Backbone的Collection则更像是数据表...或表的一部分或一页，
  // 或者是因为特定原因而聚集在一起的一组行 - 比如，在特定目录下的所有消息，属于特定作者的所有文档，等等。
  // Collection维护了它们model的索引，它们都是有序的，并且可以根据`id`进行查找。
  //
  // 创建一个新的 **Collection**，可能会包含了给定类型的`model`。如果指定了一个`comparator`，当新增或移除model时，Collection会
  // 维护model顺序。
  //
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // `Collection#set`的默认选项.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // 在`at`指定的索引处，插入元素到数组中
  var splice = function(array, insert, at) {
    at = Math.min(Math.max(at, 0), array.length);
    var tail = Array(array.length - at);
    var length = insert.length;
    var i;
    for (i = 0; i < tail.length; i++) tail[i] = array[i + at];
    for (i = 0; i < length; i++) array[i + at] = insert[i];
    for (i = 0; i < tail.length; i++) array[i + length + at] = tail[i];
  };

  // 定义Collection的可继承方法。
  _.extend(Collection.prototype, Events, {

    // 集合默认的model类型仅仅是一个**Backbone.Model**。
    // 多数情况下会覆盖掉它。
    model: Model,

    // 初始化函数默认是个空函数。用以自己的初始化逻辑覆盖它。
    initialize: function(){},

    // 一个集合JSON的表示是由models的属性组成的一个数组。
    toJSON: function(options) {
      return this.map(function(model) { return model.toJSON(options); });
    },

    // 默认代理`Backbone.sync`。
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // 添加一个model，或一个model的列表。`models`可以是Backbone的Models或JavaScript的原始对象，
    // 此对象可以转换为Models，或这两种类型的结合。
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // 删除一个model，或一个model的列表。
    remove: function(models, options) {
      options = _.extend({}, options);
      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();
      var removed = this._removeModels(models, options);
      if (!options.silent && removed.length) {
        options.changes = {added: [], merged: [], removed: removed};
        this.trigger('update', this, options);
      }
      return singular ? removed[0] : removed;
    },

    // 通过设置一个新的model列表来更新一个collection，按需添加新的，删除不存在的，合并collection中
    // 已存在的。类似于**Model#set**，是用来更新collection中数据的核心操作。
    set: function(models, options) {
      if (models == null) return;

      options = _.extend({}, setOptions, options);
      if (options.parse && !this._isModel(models)) {
        models = this.parse(models, options) || [];
      }

      var singular = !_.isArray(models);
      models = singular ? [models] : models.slice();

      var at = options.at;
      if (at != null) at = +at;
      if (at > this.length) at = this.length;
      if (at < 0) at += this.length + 1;

      var set = [];
      var toAdd = [];
      var toMerge = [];
      var toRemove = [];
      var modelMap = {};

      var add = options.add;
      var merge = options.merge;
      var remove = options.remove;

      var sort = false;
      var sortable = this.comparator && at == null && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // 将裸对象转换为model的引用，阻止添加不合法的model。
      var model, i;
      for (i = 0; i < models.length; i++) {
        model = models[i];

        // 如果发现了一个重复的model，就不在添加新的了，而是选择性的将它合并到这个已存在的model上。
        var existing = this.get(model);
        if (existing) {
          if (merge && model !== existing) {
            var attrs = this._isModel(model) ? model.attributes : model;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            toMerge.push(existing);
            if (sortable && !sort) sort = existing.hasChanged(sortAttr);
          }
          if (!modelMap[existing.cid]) {
            modelMap[existing.cid] = true;
            set.push(existing);
          }
          models[i] = existing;

        // 如果是一个新的合法的model，就将它push到`toAdd`列表中去。
        } else if (add) {
          model = models[i] = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
            modelMap[model.cid] = true;
            set.push(model);
          }
        }
      }

      // 删除就的models。
      if (remove) {
        for (i = 0; i < this.length; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // 查看是否需要排序，更新`length` 属性，插入新的models。
      var orderChanged = false;
      var replace = !sortable && add && remove;
      if (set.length && replace) {
        orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
          return m !== set[index];
        });
        this.models.length = 0;
        splice(this.models, set, 0);
        this.length = this.models.length;
      } else if (toAdd.length) {
        if (sortable) sort = true;
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      // 如何合适的话，无声的将collection排序。
      if (sort) this.sort({silent: true});

      // 如果不是无声的更新，是时候触发所有合适的add/sort/update事件了。
      if (!options.silent) {
        for (i = 0; i < toAdd.length; i++) {
          if (at != null) options.index = at + i;
          model = toAdd[i];
          model.trigger('add', model, this, options);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length || toMerge.length) {
          options.changes = {
            added: toAdd,
            removed: toRemove,
            merged: toMerge
          };
          this.trigger('update', this, options);
        }
      }

      // 返回新增的（或合并后的）model（或models）。
      return singular ? models[0] : models;
    },

    // 在你有许多需要单独添加或删除的元素时，你可以使用一个新的model列表重置整个集合，
    // 这不会细粒度的触发`add`和`remove`事件。在重置完成后仅触发一个`resets`事件。
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // 将一个model添加到collection的最后。
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // 移除collection最后一个model。
    pop: function(options) {
      var model = this.at(this.length - 1);
      return this.remove(model, options);
    },

    // 在collection的开始出添加一个model。
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // 移除collection的第一个model。
    shift: function(options) {
      var model = this.at(0);
      return this.remove(model, options);
    },

    // 从集合的模型中分割出一个子数组。
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // 获得一个model，可以给定id，cid，也可以给定带有id或cid属性的model对象，同时还可以给定一个由modelId方法转换的属性对象。
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] ||
        this._byId[this.modelId(obj.attributes || obj)] ||
        obj.cid && this._byId[obj.cid];
    },

    // 如果model在collection中，返回`True`。
    has: function(obj) {
      return this.get(obj) != null;
    },

    // 根据索引获取model。
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // 返回与给定属性匹配的models。用来当做`filter`比较有用。
    where: function(attrs, first) {
      return this[first ? 'find' : 'filter'](attrs);
    },

    // 返回第一个与给定属性匹配的model。用来当做`find`比较有用。
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // 强制collection重排序。通常情况下不需要调用此方法，因为在添加新的元素时set方法会维护它的顺序。
    sort: function(options) {
      var comparator = this.comparator;
      if (!comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      var length = comparator.length;
      if (_.isFunction(comparator)) comparator = _.bind(comparator, this);

      // 根据 `comparator`的类型排序。
      if (length === 1 || _.isString(comparator)) {
        this.models = this.sortBy(comparator);
      } else {
        this.models.sort(comparator);
      }
      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // 从集合中的每个模型中获取一个属性。
    pluck: function(attr) {
      return this.map(attr + '');
    },

    // 为collection抓取默认的model的集合，在数据返回后重置collection。如果传入`reset: true`，
    // 响应数据会传入`reset`方法而不是`set`方法。
    fetch: function(options) {
      options = _.extend({parse: true}, options);
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // 在collection中创建一个新的model实例。除非传入`wait: true`以等待服务器响应，
    // 否则model会马上添加到collection中，
    //
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(m, resp, callbackOpts) {
        if (wait) collection.add(m, callbackOpts);
        if (success) success.call(callbackOpts.context, m, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse**将一个服务器的响应（response）转换为一个model的列表，之后加入collection。
    // 默认实现是直接返回response。
    parse: function(resp, options) {
      return resp;
    },

    // 创建一个新集合，与当前集合的model列表相同。
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // 定义在collection中如何唯一标识一个model。
    modelId: function(attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // 私有方法，用来重置所有内部状态。collection首次初始化或重置时调用。
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // 准备将一个属性的hash(或别的model)加入到collection中。
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // 内部方法，供remove和set方法调用。
    _removeModels: function(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // 在触发 'remove' 事件前，移除引用，防止死循环。#3693
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];

        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }

        removed.push(model);
        this._removeReference(model, options);
      }
      return removed;
    },

    // 用来检查一个对象是否是Model类型，用来添加到collection中。
    _isModel: function(model) {
      return model instanceof Model;
    },

    // 内部方法，用来关联model与collection。
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // 内部方法，用来切断model与collection的关联。
    _removeReference: function(model, options) {
      delete this._byId[model.cid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._byId[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    //
    // 内部方法，每次set方法中的model触发事件时都会调用。在model改变id后，集合中的元素会更新索引。
    // 所有其它的事件都是代理的此方法。会忽略其它集合中触发的“add”和“remove”事件。
    //
    _onModelEvent: function(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._byId[prevId];
            if (id != null) this._byId[id] = model;
          }
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // 在Collection中我们需要实现的Underscore的方法。Backbone Collections中9%的个性方法事实上都是在这实现的。
  var collectionMethods = {forEach: 3, each: 3, map: 3, collect: 3, reduce: 0,
      foldl: 0, inject: 0, reduceRight: 0, foldr: 0, find: 3, detect: 3, filter: 3,
      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
      contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
      isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
      sortBy: 3, indexBy: 3, findIndex: 3, findLastIndex: 3};

  // 混入每个Underscore的方法，作为`Collection#models`的代理。
  addUnderscoreMethods(Collection, collectionMethods, 'models');

  // 试图 - Backbone.View
  // -------------

  // Backbone的视图比起它们的代码来，更加约定俗称化。一个视图就是一个简单的JavaScript对象，它代表了
  // DOM中的一块带有逻辑的UI。可能是单个条目，一整个列表，一个侧栏或面板，更或者是囊括你整个应用的周围的框架。
  // 将一块UI定义为一个**View**，允许你以声明式方式定义DOM的事件，而不用担心渲染次序...让视图能够更容易通过特殊的
  // 事件来响应model状态的变化。

  // 创建一个Backbone.View，如果未提供一个已存在的元素，那么它会在DOM之外创建它的初始化元素。
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // 缓存的正则表达式，用来分割`delegate`的关键字。
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // view的选项列表，用来当做属性设置。
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // 设置所有可继承的 **Backbone.View**的属性和方法。
  _.extend(View.prototype, Events, {

    // View的element的默认`tagName`是`"div"`。
    tagName: 'div',

    // jQuery的代理，用来在当前视图包含的DOM元素中查找元素。比起全局查找来，这种方式更优。
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize默认是个空函数。用你自己的初始化逻辑覆盖它。
    initialize: function(){},

    // **render**是view应该覆盖的核心函数，为的是向它的元素(`this.el`)填充合适的HTML。
    // **render**方法约定总要返回`this`.
    render: function() {
      return this;
    },

    // 将视图的元素从DOM中移除，然后移除任何Backbone.Event的事件监听，这样便将View移除掉了。
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // 从文档中删除视图的元素以及所有添加到元素上的事件监听。子类可以使用其它的DOM操作的API。
    _removeElement: function() {
      this.$el.remove();
    },

    // 更改视图的元素(`this.el`属性）并且在新元素上重新代理视图的事件。
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // 使用给定的`el`在视图上创建 `this.el`和 `this.$el`引用。`el`属性可以是CSS选择器，或者是
    // 一段HTML字符串，一个jQuery的上下文或一个DOM元素。子类可以覆盖此方法，来利用别的DOM操作的API来设置
    // `this.el`属性。
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // 设置回调，`this.events`是一个形如以下类型的hash对。
    //    *{"event selector": "callback"}*
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    // 回调函数会绑定在视图对象上，并且会正确的设置`this`引用。使用时间代理为的是效率。
    // 请忽略掉用来绑定时间到`this.el`时使用的选择器。
    delegateEvents: function(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    //
    // 添加单个事件监听到视图的DOM元素上（或者是使用`selector`指定的子元素上）。这只能在可代理的事件上工作：
    // `focus`，`blur`事件不行，IE下`change`, `submit`, 和 `reset`事件也不行。
    //
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // 清除之前所有通过`delegateEvents`绑定到视图上的回调。你可能不需要使用本方法，但如果你有多个Backbone的
    // 视图添加到了同一个DOM元素上，或许你会用到它。
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // 一个细粒度的`undelegateEvents`方法，用来移除单个代理事件。`selector` 和 `listener`都是可选的。
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    },

    // 生成一个可以赋给视图的DOM元素。子类可以覆盖此方法，已使用别的DOM操作的API。
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // 保证视图有一个可渲染的DOM元素。如果`this.el`是一个字符串，它会被传入给`$()`，之后
    // 拿到第一个匹配的元素，重新赋给`el`属性。否则，就根据 `id`, `className` 和 `tagName`属性创建一个新的元素。
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // 将一个hash对象设置到视图元素的属性上。子类可以使用别的DOM操作的API覆盖本方法。
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // 同步 - Backbone.sync
  // -------------

  //
  // 覆盖此方法，改变Backbone持久化数据到服务器的方式。你需要传入请求的类型，以及model。
  // 默认，会向model的 `url()`指向的链接地址发送RESTful ajax请求。某些可能的环境下会：
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * 以XML格式而不是JSON格式发送模型。
  // * 通过WebSocket而不是Ajax持久化模型。
  //
  // 开启`Backbone.emulateHTTP`，将`PUT`和`DELETE`以`POST`格式发送，使用`_method`
  // 参数包含真正的HTTP方法，同时所有的请求体`model`为参数名称，以`application/x-www-form-urlencoded`格式而不是
  // `application/json`格式发送。在与像**PHP**这种服务器端交互时很有用，它在读取`PUT`请求体时比较困难。
  //
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // 没有指定选项，则使用默认选项。
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // 默认JSON请求的选项。
    var params = {type: type, dataType: 'json'};

    // 保证我们有一个URL
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // 保证我们有合适的请求数据。
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // 对于更老旧的服务器，通过将请求转义为一个HTML-form的格式来模拟JSON类型。
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // 对于老旧服务器，通过`_method`伪造一个HTTP方法来模拟HTTP请求。添加一个`X-HTTP-Method-Override`头。
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // 在非GET请求下，不处理数据。
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // 在jQuery中回传`textStatus`和`errorThrown`。
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // 发送请求，允许用户覆盖任何Ajax的选项。
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // CRUD操作到HTTP的映射，`Backbone.sync`默认的实现方式。
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };


  // 设置默认的`Backbone.ajax`实现，代理的是`$`。如果要用不同的库，请覆盖此方法。
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // 路由 - Backbone.Router
  // ---------------

  // 路由用来映射假的URL到action上，路由匹配时会触发事件。
  // 创建一个新的路由，设置它的`routes`的hash。
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // 缓存的正则表达式，用来匹配路由字符串中具名参数部分和通配部分（splatted parts）。
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // 建立**Backbone.Router**所有可继承的属性和方法。
  _.extend(Router.prototype, Events, {

    // Initialize默认是个空函数。用你自己的初始化逻辑覆盖它。
    initialize: function(){},

    //手工绑定单个具名路由到回调上。比如：
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // 提供给定参数，执行一个路由处理函数。这是一个路由触发前进行设置或路由触发后进行清空的绝佳场所。
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // 只是简单的代理了`Backbone.history`，保存一个fragment到history中。
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // 将所有定义的路由绑定到`Backbone.history`上。这里我们必须反转路由的次序，以支持
    // 最笼统的路由应该定义在路由映射的最下方这一行为。
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // 将一个路由字符串转换为一个正则表达式，适合用来匹配当前location的hash字符串。
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // 给定一个路由，和一个匹配的URL片段，返回提起并解码后的参数数组。空的或者未匹配的参数会
    // 当做`null`来统一跨浏览器行为。
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // 不对搜索参数进行解码。
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // 历史记录 - Backbone.History
  // ----------------

  // 处理跨浏览器历史管理，要么基于[pushState](http://diveintohtml5.info/history.html)和真实的URLs，
  // 要么基于[onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)和URL片段。
  // 如果浏览器都不支持二者（当然指的是老版本IE），则回滚值轮训方式。
  var History = Backbone.History = function() {
    this.handlers = [];
    this.checkUrl = _.bind(this.checkUrl, this);

    // 保证`History`可以在浏览器外使用。
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  // 缓存的正则表达式用来移除起始位置的#，反斜杠或最后的空白符。
  var routeStripper = /^[#\/]|\s+$/g;

  // 缓存的正则表达式，用来删除起始或末尾的反斜杠。
  var rootStripper = /^\/+|\/+$/g;

  // 缓存的正则表达式URL的hash部分。
  var pathStripper = /#.*$/;

  // 标记history处理是否已经启动。
  History.started = false;

  // 建立**Backbone.History**所有可继承的属性和方法。
  _.extend(History.prototype, Events, {

    // 默认轮训检测hash辩护的间隔，如果有必要的话，一秒钟检测二十次。
    interval: 50,

    // 我们是否处在应用的根部？
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // 路径名是否匹配根路径名？
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var rootPath = path.slice(0, this.root.length - 1) + '/';
      return rootPath === this.root;
    },

    // `location.pathname`中的Unicode字符是以编码后的形式存在的，所以比较前需要解码。`%25`不应该解码
    // 因为它可能是一个编码参数的一部分。
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // 在IE6下，如果hash的片段包含`?`，那么如果hash的片段和搜索参数是不正确的
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // 获取真正的hash值。Firefox的location.hash会是编码形式的，因为此bug我们不能直接使用location.hash。
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // 在不带根路径字符春的情况下，获取路径名和搜索参数。
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // 从path或hash中获取跨浏览器一直的URL片段。
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // 开始处理hash的变更，如果当前的URL与已存在的一个路由匹配的话，返回`true`，否则返回`false`。
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // 计算初始的配置。我们是否需要一个iframe？是否需要pushState... 它存在吗？
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // 一致化root，总在首位包含一个反斜杠。
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // 从hashChange转换到pushState，如果同时都需要二者，反之亦然。
      if (this._wantsHashChange && this._wantsPushState) {

        // 如果我们从一个`pushState`开始，但现在浏览器不支持它...
        if (!this._hasPushState && !this.atRoot()) {
          var rootPath = this.root.slice(0, -1) || '/';
          this.location.replace(rootPath + '#' + this.getPath());
          // 立即返回，因为浏览器会重定向到新的url上。
          return true;

        // 或者，如果我们在基于hash的路由下开始，但我们当前在一个支持`pushState`...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // 如果浏览器不支持`hashchange`事件，HTML5的history，或用户希望`hashChange`而不是`pushState`，
      // 就代理一个iframe来处理location事件。
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'javascript:0';
        this.iframe.style.display = 'none';
        this.iframe.tabIndex = -1;
        var body = document.body;
        // 如果文档没有ready呢，使用`appendChild`在IE<9下会抛出异常。
        var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
        iWindow.document.open();
        iWindow.document.close();
        iWindow.location.hash = '#' + this.fragment;
      }

      // 为老旧版本的浏览器添加跨平台的`addEventListener`的shim。
      var addEventListener = window.addEventListener || function(eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // 根据是否我们正使用pushState或hash，以及浏览器是否支持`onhashchange`，来决定我们检测URL状态的方式。
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // 禁用 Backbone.history，可能是临时性的。在真实的应用中或许没用，但在路由的单元测试中可能有用。
    stop: function() {
      // 为老旧版本的浏览器添加跨平台的`removeEventListener`的shim。
      var removeEventListener = window.removeEventListener || function(eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // 移除window的监听器。
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // 如果需要，清理iframe。
      if (this.iframe) {
        document.body.removeChild(this.iframe);
        this.iframe = null;
      }

      // 某些环境下在清除一个undefined的间隔时会抛出异常。
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // 添加一个路由，在片段变更时会检测它。后添加的路由可能覆盖之前的路由。
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // 查看当前的URL，检测它是否变化了，如果变化了，就调用`loadUrl`，通过隐藏的iframe一致化处理。
    checkUrl: function(e) {
      var current = this.getFragment();

      // 如果用户按了回退按钮，iframe的hash会变化，我们应该使用变化后的进行比较。
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe.contentWindow);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // 尝试加载当前URL的片段。如果路由成功匹配了，返回`true`。如果定义的路由没有匹配的，返回`false`。
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.some(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    //
    // 将一个片段保存进hash历史中，或者如果传入`replace`选项就替换当前的URL状态。你需要负责提前进行正确的URL编码。
    //
    // 如果你希望触发路由的回调（通常不会），可以在选项对象包含`trigger: true`,或者如果你希望在不添加历史记录的前提下
    // 修改当前的URL，就传入 `replace: true`。
    //
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // 一致化片段
      fragment = this.getFragment(fragment || '');

      // 不要再root的尾部添加反斜杠。
      var rootPath = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        rootPath = rootPath.slice(0, -1) || '/';
      }
      var url = rootPath + fragment;

      // 为匹配的路由删除hash符号并转码。
      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // 如果pushState可用，我们使用它来设置片段为真正的URL。
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // 如果hash changes被显示的禁用了，就更新hash片段来存储记录。
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
          var iWindow = this.iframe.contentWindow;

          // IE7及早期版本浏览器打开和关闭iframe的技巧，用以将hash变更push进历史中。当replace是true时，我们就不用这么干了。
          if (!options.replace) {
            iWindow.document.open();
            iWindow.document.close();
          }

          this._updateHash(iWindow.location, fragment, options.replace);
        }

      // 如果你不需要基于hashchange的历史，那么`navigate`就变成了一次页面刷新。
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // 更新hash地址，要么替换当前的记录，要么添加一个新的到浏览器历史中。
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // 一些浏览器需要在`hash`的起始位置包含一个#。
        location.hash = '#' + fragment;
      }
    }

  });

  // 创建默认的Backbone.history对象。
  Backbone.history = new History;

  // 辅助工具 - Helpers
  // -------


  // 辅助函数，用来正确的设置子类的原型链。类似于`goog.inherits`，
  // 但使用的是原型属性的hash和class属性的hash来进行继承。
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // 新的子类的构造器函数要么是你自己定义的（`extend`调用时传入的"constructor"属性），要么
    // 就是有我们定义的类，它只简单的调用了父类的构造器。
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // 如果提供了静态属性，那么久添加到构造器函数上。
    _.extend(child, parent, staticProps);

    // 在不调用`parent`的构造器函数以及没有添加原型属性的情况下，设置原型链以继承`parent`。
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;

    // 设置一个便捷的属性，以防自后需要使用父类的原型对象。
    child.__super__ = parent.prototype;

    return child;
  };

  // 设置model，collection，router，view和history的继承性。
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // 在需要URL但又未提供时，抛出一个错误。
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // 封装一个可选的错误回调，触发一个error事件。
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;
});
