webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by zhengguo.chen on 2016/2/2.
	 */
	var boot = __webpack_require__(282);
	var entry = __webpack_require__(383);
	boot(entry);

/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by zhengguo.chen on 2016/2/2.
	 */
	module.exports = function (entryModule) {
	  var ReactEngineClient = __webpack_require__(1);

	  // boot options
	  var options = {
	    // supply a function that can be called
	    // to resolve the file that was rendered.
	    viewResolver: function viewResolver() {
	      return entryModule;
	    }
	  };

	  document.addEventListener('DOMContentLoaded', function () {
	    ReactEngineClient.boot(options, function onBoot(data, history) {
	      console.log('ReactEngineClient boot successfully!');
	    });
	  });
	};

/***/ },

/***/ 284:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(285);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(286), __esModule: true };

/***/ },

/***/ 286:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(287);
	module.exports = __webpack_require__(290).Object.assign;

/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(288);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(303)});

/***/ },

/***/ 288:
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(289)
	  , core      = __webpack_require__(290)
	  , ctx       = __webpack_require__(291)
	  , hide      = __webpack_require__(293)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },

/***/ 289:
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },

/***/ 290:
/***/ function(module, exports) {

	var core = module.exports = {version: '2.2.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },

/***/ 291:
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(292);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },

/***/ 292:
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(294)
	  , createDesc = __webpack_require__(302);
	module.exports = __webpack_require__(298) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(295)
	  , IE8_DOM_DEFINE = __webpack_require__(297)
	  , toPrimitive    = __webpack_require__(301)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(298) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(296);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },

/***/ 296:
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(298) && !__webpack_require__(299)(function(){
	  return Object.defineProperty(__webpack_require__(300)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(299)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },

/***/ 299:
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(296)
	  , document = __webpack_require__(289).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },

/***/ 301:
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(296);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },

/***/ 302:
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },

/***/ 303:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(304)
	  , gOPS     = __webpack_require__(319)
	  , pIE      = __webpack_require__(320)
	  , toObject = __webpack_require__(321)
	  , IObject  = __webpack_require__(308)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(299)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },

/***/ 304:
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(305)
	  , enumBugKeys = __webpack_require__(318);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },

/***/ 305:
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(306)
	  , toIObject    = __webpack_require__(307)
	  , arrayIndexOf = __webpack_require__(311)(false)
	  , IE_PROTO     = __webpack_require__(315)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },

/***/ 306:
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },

/***/ 307:
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(308)
	  , defined = __webpack_require__(310);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(309);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },

/***/ 309:
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },

/***/ 310:
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(307)
	  , toLength  = __webpack_require__(312)
	  , toIndex   = __webpack_require__(314);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },

/***/ 312:
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(313)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },

/***/ 313:
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(313)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },

/***/ 315:
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(316)('keys')
	  , uid    = __webpack_require__(317);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },

/***/ 316:
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(289)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },

/***/ 317:
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },

/***/ 318:
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },

/***/ 319:
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },

/***/ 320:
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },

/***/ 321:
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(310);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },

/***/ 323:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by zhengguo.chen on 2016/2/1.
	 */
	var React = __webpack_require__(27);

	var DefaultLayout = React.createClass({
	  displayName: 'DefaultLayout',
	  render: function render() {
	    var favicon = __webpack_require__(324);
	    var ASSETS = this.props.ASSETS;
	    return React.createElement(
	      'html',
	      null,
	      React.createElement(
	        'head',
	        null,
	        React.createElement('meta', { charSet: 'utf-8' }),
	        React.createElement(
	          'title',
	          null,
	          'sss'
	        ),
	        React.createElement('link', { rel: 'shortcut icon', href: favicon, type: 'image/x-icon' }),
	        this.props.css && this.props.css.map(function (css, index) {
	          return React.createElement('link', { key: index, rel: 'stylesheet', href: ASSETS.styles[css] });
	        })
	      ),
	      React.createElement(
	        'body',
	        null,
	        this.props.children,
	        this.props.js && this.props.js.map(function (js, index) {
	          return React.createElement('script', { key: index, src: ASSETS.javascript[js] });
	        })
	      )
	    );
	  }
	});

	module.exports = DefaultLayout;

/***/ },

/***/ 324:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "img/favicon.png";

/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "img/favicon_5.png";

/***/ },

/***/ 381:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"list":"xx__list___pfIDt"};

/***/ },

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends2 = __webpack_require__(284);

	var _extends3 = _interopRequireDefault(_extends2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by zhengguo.chen on 2016/2/1.
	 */
	//browser area for webpack

	var React = __webpack_require__(27);
	var DefaultLayout = __webpack_require__(323);
	var XX = __webpack_require__(384);
	var style = __webpack_require__(385);

	var Index = React.createClass({
	  displayName: 'Index',
	  handleClickImg: function handleClickImg() {
	    console.log(Date.now());
	  },
	  componentDidMount: function componentDidMount() {},
	  render: function render() {
	    var img = __webpack_require__(325);
	    return React.createElement(
	      DefaultLayout,
	      (0, _extends3.default)({}, this.props, {
	        css: ['common', 'components', 'index'],
	        js: ['boot', 'index'] }),
	      React.createElement(
	        'div',
	        { className: style.hello },
	        'Hello ',
	        this.props.name
	      ),
	      React.createElement('img', { src: img, onClick: this.handleClickImg }),
	      this.props.list.map(function (item, index) {
	        return React.createElement(
	          'i',
	          { key: index },
	          item,
	          ' '
	        );
	      }),
	      React.createElement(XX, null)
	    );
	  }
	});

	module.exports = Index;

/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by zhengguo.chen on 2016/2/2.
	 */
	var React = __webpack_require__(27);

	var style = __webpack_require__(381);
	console.log(style.list);

	module.exports = React.createClass({
	  displayName: 'exports',
	  render: function render() {

	    return React.createElement(
	      'ul',
	      { className: style.list },
	      React.createElement(
	        'li',
	        null,
	        React.createElement('i', { className: 'icon icon-qqicon' }),
	        ' Hello33'
	      ),
	      React.createElement(
	        'li',
	        null,
	        'Millet'
	      )
	    );
	  }
	});

/***/ },

/***/ 385:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"hello":"index__hello___2_7gs"};

/***/ }

});