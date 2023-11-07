(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Language$Syntax$EError = function (a) {
	return {$: 'EError', a: a};
};
var $author$project$Model$initModel = {
	exp: $author$project$Language$Syntax$EError('No code yet'),
	fileList: _List_fromArray(
		['New File', 'PrecisionFloorPlan', 'MondrianArch', 'BalanceScale', 'BoxVolume', 'Battery', 'Ladder', 'Logo', 'NBoxes', 'FerrisWheel', 'TreeBranch', 'Target', 'PencilTip', 'Arrows', 'Rails', 'SVG-1', 'SVG-2', 'SVG-3', 'SVG-4', 'SVG-5', 'SVG-6', 'Test-1', 'Test-2', 'Test-3', 'Test-4'])
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Model$initModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Model$Change = function (a) {
	return {$: 'Change', a: a};
};
var $author$project$Model$Execute = function (a) {
	return {$: 'Execute', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$changeCode = _Platform_incomingPort('changeCode', $elm$json$Json$Decode$string);
var $author$project$Main$exeCode = _Platform_incomingPort('exeCode', $elm$json$Json$Decode$string);
var $author$project$Main$getEdit = _Platform_incomingPort('getEdit', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$exeCode($author$project$Model$Execute),
				$author$project$Main$changeCode($author$project$Model$Change),
				$author$project$Main$getEdit($author$project$Model$Change)
			]));
};
var $author$project$Language$Syntax$AFloat = function (a) {
	return {$: 'AFloat', a: a};
};
var $author$project$Language$Syntax$Add = {$: 'Add'};
var $author$project$Language$Syntax$DAdd = function (a) {
	return {$: 'DAdd', a: a};
};
var $author$project$Language$Syntax$DApp = F2(
	function (a, b) {
		return {$: 'DApp', a: a, b: b};
	});
var $author$project$Language$Syntax$DClosure = F3(
	function (a, b, c) {
		return {$: 'DClosure', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$DCom = F2(
	function (a, b) {
		return {$: 'DCom', a: a, b: b};
	});
var $author$project$Language$Syntax$DCopy = function (a) {
	return {$: 'DCopy', a: a};
};
var $author$project$Language$Syntax$DDelete = function (a) {
	return {$: 'DDelete', a: a};
};
var $author$project$Language$Syntax$DGen = F3(
	function (a, b, c) {
		return {$: 'DGen', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$DInsert = F2(
	function (a, b) {
		return {$: 'DInsert', a: a, b: b};
	});
var $author$project$Language$Syntax$DMap = function (a) {
	return {$: 'DMap', a: a};
};
var $author$project$Language$Syntax$DMem = F2(
	function (a, b) {
		return {$: 'DMem', a: a, b: b};
	});
var $author$project$Language$Syntax$DModify = F2(
	function (a, b) {
		return {$: 'DModify', a: a, b: b};
	});
var $author$project$Language$Syntax$DMul = function (a) {
	return {$: 'DMul', a: a};
};
var $author$project$Language$Syntax$EApp = F3(
	function (a, b, c) {
		return {$: 'EApp', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EBPrim = F4(
	function (a, b, c, d) {
		return {$: 'EBPrim', a: a, b: b, c: c, d: d};
	});
var $author$project$Language$Syntax$ECase = F3(
	function (a, b, c) {
		return {$: 'ECase', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$ECons = F3(
	function (a, b, c) {
		return {$: 'ECons', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EEmpList = function (a) {
	return {$: 'EEmpList', a: a};
};
var $author$project$Language$Syntax$EFix = F2(
	function (a, b) {
		return {$: 'EFix', a: a, b: b};
	});
var $author$project$Language$Syntax$EFloat = F2(
	function (a, b) {
		return {$: 'EFloat', a: a, b: b};
	});
var $author$project$Language$Syntax$EGraphic = F3(
	function (a, b, c) {
		return {$: 'EGraphic', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$ELam = F3(
	function (a, b, c) {
		return {$: 'ELam', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EList = F3(
	function (a, b, c) {
		return {$: 'EList', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EMap = F3(
	function (a, b, c) {
		return {$: 'EMap', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$ENil = function (a) {
	return {$: 'ENil', a: a};
};
var $author$project$Language$Syntax$EParens = F2(
	function (a, b) {
		return {$: 'EParens', a: a, b: b};
	});
var $author$project$Language$Syntax$ETuple = F3(
	function (a, b, c) {
		return {$: 'ETuple', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EUPrim = F3(
	function (a, b, c) {
		return {$: 'EUPrim', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$EUnwrap = F2(
	function (a, b) {
		return {$: 'EUnwrap', a: a, b: b};
	});
var $author$project$Language$Syntax$EVar = F2(
	function (a, b) {
		return {$: 'EVar', a: a, b: b};
	});
var $author$project$Language$Syntax$Mul = {$: 'Mul'};
var $author$project$Language$Syntax$Neg = {$: 'Neg'};
var $author$project$Language$Syntax$PVar = F2(
	function (a, b) {
		return {$: 'PVar', a: a, b: b};
	});
var $author$project$Language$Syntax$Sub = {$: 'Sub'};
var $author$project$Language$Syntax$VFix = F2(
	function (a, b) {
		return {$: 'VFix', a: a, b: b};
	});
var $author$project$Language$Syntax$DCons = F2(
	function (a, b) {
		return {$: 'DCons', a: a, b: b};
	});
var $author$project$Language$Syntax$DCtt = F2(
	function (a, b) {
		return {$: 'DCtt', a: a, b: b};
	});
var $author$project$Language$Syntax$DError = function (a) {
	return {$: 'DError', a: a};
};
var $author$project$Language$Syntax$DRewr = function (a) {
	return {$: 'DRewr', a: a};
};
var $author$project$Language$Syntax$DTuple = F2(
	function (a, b) {
		return {$: 'DTuple', a: a, b: b};
	});
var $author$project$Language$UtilsFD$dmatch = F2(
	function (p, param) {
		var _v0 = _Utils_Tuple2(p, param);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 'PVar':
					var _v1 = _v0.a;
					var s = _v1.b;
					return $elm$core$Maybe$Just(
						_List_fromArray(
							[
								_Utils_Tuple2(s, param)
							]));
				case 'PNil':
					if (_v0.b.$ === 'ANil') {
						var _v2 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$9;
					}
				case 'PEmpList':
					if (_v0.b.$ === 'ANil') {
						var _v3 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$9;
					}
				case 'PTrue':
					if (_v0.b.$ === 'ATrue') {
						var _v4 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$9;
					}
				case 'PFalse':
					if (_v0.b.$ === 'AFalse') {
						var _v5 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$9;
					}
				case 'PFloat':
					if (_v0.b.$ === 'AFloat') {
						var _v6 = _v0.a;
						var f1 = _v6.b;
						var f2 = _v0.b.a;
						return _Utils_eq(f1, f2) ? $elm$core$Maybe$Just(_List_Nil) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$9;
					}
				case 'PCons':
					if (_v0.b.$ === 'ACons') {
						var _v7 = _v0.a;
						var p1 = _v7.b;
						var p2 = _v7.c;
						var _v8 = _v0.b;
						var a1 = _v8.a;
						var a2 = _v8.b;
						var _v9 = _Utils_Tuple2(
							A2($author$project$Language$UtilsFD$dmatch, p1, a1),
							A2($author$project$Language$UtilsFD$dmatch, p2, a2));
						if ((_v9.a.$ === 'Just') && (_v9.b.$ === 'Just')) {
							var ctx1 = _v9.a.a;
							var ctx2 = _v9.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(ctx1, ctx2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$9;
					}
				case 'PList':
					if (_v0.b.$ === 'ACons') {
						var _v10 = _v0.a;
						var p1 = _v10.b;
						var p2 = _v10.c;
						var _v11 = _v0.b;
						var a1 = _v11.a;
						var a2 = _v11.b;
						var _v12 = _Utils_Tuple2(
							A2($author$project$Language$UtilsFD$dmatch, p1, a1),
							A2($author$project$Language$UtilsFD$dmatch, p2, a2));
						if ((_v12.a.$ === 'Just') && (_v12.b.$ === 'Just')) {
							var ctx1 = _v12.a.a;
							var ctx2 = _v12.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(ctx1, ctx2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$9;
					}
				case 'PTuple':
					if (_v0.b.$ === 'ATuple') {
						var _v13 = _v0.a;
						var p1 = _v13.b;
						var p2 = _v13.c;
						var _v14 = _v0.b;
						var a1 = _v14.a;
						var a2 = _v14.b;
						var _v15 = _Utils_Tuple2(
							A2($author$project$Language$UtilsFD$dmatch, p1, a1),
							A2($author$project$Language$UtilsFD$dmatch, p2, a2));
						if ((_v15.a.$ === 'Just') && (_v15.b.$ === 'Just')) {
							var ctx1 = _v15.a.a;
							var ctx2 = _v15.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(ctx1, ctx2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$9;
					}
				default:
					break _v0$9;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Language$Syntax$ACons = F2(
	function (a, b) {
		return {$: 'ACons', a: a, b: b};
	});
var $author$project$Language$Syntax$AError = function (a) {
	return {$: 'AError', a: a};
};
var $author$project$Language$Syntax$AFalse = {$: 'AFalse'};
var $author$project$Language$Syntax$AGraphic = F2(
	function (a, b) {
		return {$: 'AGraphic', a: a, b: b};
	});
var $author$project$Language$Syntax$ATrue = {$: 'ATrue'};
var $author$project$Language$Syntax$ATuple = F2(
	function (a, b) {
		return {$: 'ATuple', a: a, b: b};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Utils$lookup = F2(
	function (key, list) {
		var _v0 = A2(
			$elm$core$List$filter,
			function (_v1) {
				var k = _v1.a;
				return _Utils_eq(k, key);
			},
			list);
		if (!_v0.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v2 = _v0.a;
			var v = _v2.b;
			return $elm$core$Maybe$Just(v);
		}
	});
var $author$project$Language$DEval$peval = F2(
	function (ctx, param) {
		peval:
		while (true) {
			switch (param.$) {
				case 'AVar':
					var s = param.a;
					var _v1 = A2($author$project$Utils$lookup, s, ctx);
					if (_v1.$ === 'Just') {
						var p = _v1.a;
						return p;
					} else {
						return $author$project$Language$Syntax$AError('Error 40');
					}
				case 'AAdd':
					var p1 = param.a;
					var p2 = param.b;
					var _v2 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v2.a.$ === 'AFloat') && (_v2.b.$ === 'AFloat')) {
						var f1 = _v2.a.a;
						var f2 = _v2.b.a;
						return $author$project$Language$Syntax$AFloat(f1 + f2);
					} else {
						return $author$project$Language$Syntax$AError('Error 41');
					}
				case 'ASub':
					var p1 = param.a;
					var p2 = param.b;
					var _v3 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v3.a.$ === 'AFloat') && (_v3.b.$ === 'AFloat')) {
						var f1 = _v3.a.a;
						var f2 = _v3.b.a;
						return $author$project$Language$Syntax$AFloat(f1 - f2);
					} else {
						return $author$project$Language$Syntax$AError('Error 41 sub');
					}
				case 'AMul':
					var p1 = param.a;
					var p2 = param.b;
					var _v4 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v4.a.$ === 'AFloat') && (_v4.b.$ === 'AFloat')) {
						var f1 = _v4.a.a;
						var f2 = _v4.b.a;
						return $author$project$Language$Syntax$AFloat(f1 * f2);
					} else {
						return $author$project$Language$Syntax$AError('Error 42');
					}
				case 'ADiv':
					var p1 = param.a;
					var p2 = param.b;
					var _v5 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v5.a.$ === 'AFloat') && (_v5.b.$ === 'AFloat')) {
						var f1 = _v5.a.a;
						var f2 = _v5.b.a;
						return $author$project$Language$Syntax$AFloat(f1 / f2);
					} else {
						return $author$project$Language$Syntax$AError('Error 42 div');
					}
				case 'ALt':
					var p1 = param.a;
					var p2 = param.b;
					var _v6 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v6.a.$ === 'AFloat') && (_v6.b.$ === 'AFloat')) {
						var f1 = _v6.a.a;
						var f2 = _v6.b.a;
						return (_Utils_cmp(f1, f2) < 0) ? $author$project$Language$Syntax$ATrue : $author$project$Language$Syntax$AFalse;
					} else {
						return $author$project$Language$Syntax$AError('Error 43');
					}
				case 'ALe':
					var p1 = param.a;
					var p2 = param.b;
					var _v7 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v7.a.$ === 'AFloat') && (_v7.b.$ === 'AFloat')) {
						var f1 = _v7.a.a;
						var f2 = _v7.b.a;
						return (_Utils_cmp(f1, f2) < 1) ? $author$project$Language$Syntax$ATrue : $author$project$Language$Syntax$AFalse;
					} else {
						return $author$project$Language$Syntax$AError('Error 44');
					}
				case 'AEq':
					var p1 = param.a;
					var p2 = param.b;
					var _v8 = _Utils_Tuple2(
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
					if ((_v8.a.$ === 'AFloat') && (_v8.b.$ === 'AFloat')) {
						var f1 = _v8.a.a;
						var f2 = _v8.b.a;
						return _Utils_eq(f1, f2) ? $author$project$Language$Syntax$ATrue : $author$project$Language$Syntax$AFalse;
					} else {
						return $author$project$Language$Syntax$AError('Error 45');
					}
				case 'ACons':
					var p1 = param.a;
					var p2 = param.b;
					return A2(
						$author$project$Language$Syntax$ACons,
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
				case 'ATuple':
					var p1 = param.a;
					var p2 = param.b;
					return A2(
						$author$project$Language$Syntax$ATuple,
						A2($author$project$Language$DEval$peval, ctx, p1),
						A2($author$project$Language$DEval$peval, ctx, p2));
				case 'AGraphic':
					var s = param.a;
					var p = param.b;
					return A2(
						$author$project$Language$Syntax$AGraphic,
						s,
						A2($author$project$Language$DEval$peval, ctx, p));
				case 'AParens':
					var p = param.a;
					var $temp$ctx = ctx,
						$temp$param = p;
					ctx = $temp$ctx;
					param = $temp$param;
					continue peval;
				default:
					return param;
			}
		}
	});
var $author$project$Language$DEval$deval = F2(
	function (ctx, delta) {
		deval:
		while (true) {
			_v0$18:
			while (true) {
				switch (delta.$) {
					case 'DId':
						return delta;
					case 'DAdd':
						var p = delta.a;
						return $author$project$Language$Syntax$DAdd(
							A2($author$project$Language$DEval$peval, ctx, p));
					case 'DMul':
						var p = delta.a;
						return $author$project$Language$Syntax$DMul(
							A2($author$project$Language$DEval$peval, ctx, p));
					case 'DCons':
						var d1 = delta.a;
						var d2 = delta.b;
						return A2(
							$author$project$Language$Syntax$DCons,
							A2($author$project$Language$DEval$deval, ctx, d1),
							A2($author$project$Language$DEval$deval, ctx, d2));
					case 'DTuple':
						var d1 = delta.a;
						var d2 = delta.b;
						return A2(
							$author$project$Language$Syntax$DTuple,
							A2($author$project$Language$DEval$deval, ctx, d1),
							A2($author$project$Language$DEval$deval, ctx, d2));
					case 'DCopy':
						return delta;
					case 'DDelete':
						return delta;
					case 'DModify':
						var n = delta.a;
						var d = delta.b;
						return A2(
							$author$project$Language$Syntax$DModify,
							n,
							A2($author$project$Language$DEval$deval, ctx, d));
					case 'DInsert':
						var n = delta.a;
						var p = delta.b;
						return A2(
							$author$project$Language$Syntax$DInsert,
							n,
							A2($author$project$Language$DEval$peval, ctx, p));
					case 'DMap':
						var d = delta.a;
						return $author$project$Language$Syntax$DMap(
							A2($author$project$Language$DEval$deval, ctx, d));
					case 'DGen':
						var e = delta.a;
						var d = delta.b;
						var p = delta.c;
						return A3(
							$author$project$Language$Syntax$DGen,
							e,
							d,
							A2($author$project$Language$DEval$peval, ctx, p));
					case 'DRewr':
						var p = delta.a;
						var _v1 = A2($author$project$Language$DEval$peval, ctx, p);
						if (_v1.$ === 'AError') {
							return delta;
						} else {
							var pv = _v1;
							return $author$project$Language$Syntax$DRewr(pv);
						}
					case 'DAbst':
						return delta;
					case 'DCtt':
						var p = delta.a;
						var d = delta.b;
						return A2(
							$author$project$Language$Syntax$DCtt,
							p,
							A2($author$project$Language$DEval$deval, ctx, d));
					case 'DMem':
						return delta;
					case 'DGroup':
						return delta;
					case 'DCom':
						var d1 = delta.a;
						var d2 = delta.b;
						return A2(
							$author$project$Language$Syntax$DCom,
							A2($author$project$Language$DEval$deval, ctx, d1),
							A2($author$project$Language$DEval$deval, ctx, d2));
					case 'DApp':
						if (delta.a.$ === 'DFun') {
							var _v2 = delta.a;
							var p = _v2.a;
							var d = _v2.b;
							var pr = delta.b;
							var _v3 = A2(
								$author$project$Language$UtilsFD$dmatch,
								p,
								A2($author$project$Language$DEval$peval, ctx, pr));
							if (_v3.$ === 'Just') {
								var ctxm = _v3.a;
								var $temp$ctx = _Utils_ap(ctxm, ctx),
									$temp$delta = d;
								ctx = $temp$ctx;
								delta = $temp$delta;
								continue deval;
							} else {
								return $author$project$Language$Syntax$DError('Error 19');
							}
						} else {
							break _v0$18;
						}
					default:
						break _v0$18;
				}
			}
			return $author$project$Language$Syntax$DError('Error 22');
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Language$Syntax$Cat = {$: 'Cat'};
var $author$project$Language$Syntax$DFix = F2(
	function (a, b) {
		return {$: 'DFix', a: a, b: b};
	});
var $author$project$Language$Syntax$VChar = function (a) {
	return {$: 'VChar', a: a};
};
var $author$project$Language$Syntax$VClosure = F3(
	function (a, b, c) {
		return {$: 'VClosure', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$VCons = F2(
	function (a, b) {
		return {$: 'VCons', a: a, b: b};
	});
var $author$project$Language$Syntax$VError = function (a) {
	return {$: 'VError', a: a};
};
var $author$project$Language$Syntax$VFalse = {$: 'VFalse'};
var $author$project$Language$Syntax$VFloat = function (a) {
	return {$: 'VFloat', a: a};
};
var $author$project$Language$Syntax$VGraphic = F2(
	function (a, b) {
		return {$: 'VGraphic', a: a, b: b};
	});
var $author$project$Language$Syntax$VNil = {$: 'VNil'};
var $author$project$Language$Syntax$VString = function (a) {
	return {$: 'VString', a: a};
};
var $author$project$Language$Syntax$VTrue = {$: 'VTrue'};
var $author$project$Language$Syntax$VTuple = F2(
	function (a, b) {
		return {$: 'VTuple', a: a, b: b};
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Language$Syntax$DId = {$: 'DId'};
var $author$project$Language$Utils$value2DId = function (v) {
	switch (v.$) {
		case 'VFix':
			var env1 = v.a;
			var e1 = v.b;
			return A2($author$project$Language$Syntax$DFix, env1, e1);
		case 'VClosure':
			var env1 = v.a;
			var p1 = v.b;
			var e1 = v.c;
			return A3($author$project$Language$Syntax$DClosure, env1, p1, e1);
		case 'VCons':
			var v1 = v.a;
			var v2 = v.b;
			return A2(
				$author$project$Language$Syntax$DCons,
				$author$project$Language$Utils$value2DId(v1),
				$author$project$Language$Utils$value2DId(v2));
		case 'VTuple':
			var v1 = v.a;
			var v2 = v.b;
			return A2(
				$author$project$Language$Syntax$DTuple,
				$author$project$Language$Utils$value2DId(v1),
				$author$project$Language$Utils$value2DId(v2));
		default:
			return $author$project$Language$Syntax$DId;
	}
};
var $author$project$Language$Utils$match = F2(
	function (p, v) {
		var _v0 = _Utils_Tuple2(p, v);
		_v0$11:
		while (true) {
			switch (_v0.a.$) {
				case 'PVar':
					var _v1 = _v0.a;
					var s = _v1.b;
					return $elm$core$Maybe$Just(
						_List_fromArray(
							[
								_Utils_Tuple2(
								s,
								_Utils_Tuple2(
									v,
									$author$project$Language$Utils$value2DId(v)))
							]));
				case 'PNil':
					if (_v0.b.$ === 'VNil') {
						var _v2 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$11;
					}
				case 'PEmpList':
					if (_v0.b.$ === 'VNil') {
						var _v3 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$11;
					}
				case 'PTrue':
					if (_v0.b.$ === 'VTrue') {
						var _v4 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$11;
					}
				case 'PFalse':
					if (_v0.b.$ === 'VFalse') {
						var _v5 = _v0.b;
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						break _v0$11;
					}
				case 'PCons':
					if (_v0.b.$ === 'VCons') {
						var _v6 = _v0.a;
						var p1 = _v6.b;
						var p2 = _v6.c;
						var _v7 = _v0.b;
						var v1 = _v7.a;
						var v2 = _v7.b;
						var _v8 = _Utils_Tuple2(
							A2($author$project$Language$Utils$match, p1, v1),
							A2($author$project$Language$Utils$match, p2, v2));
						if ((_v8.a.$ === 'Just') && (_v8.b.$ === 'Just')) {
							var m1 = _v8.a.a;
							var m2 = _v8.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(m1, m2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$11;
					}
				case 'PList':
					if (_v0.b.$ === 'VCons') {
						var _v9 = _v0.a;
						var p1 = _v9.b;
						var p2 = _v9.c;
						var _v10 = _v0.b;
						var v1 = _v10.a;
						var v2 = _v10.b;
						var _v11 = _Utils_Tuple2(
							A2($author$project$Language$Utils$match, p1, v1),
							A2($author$project$Language$Utils$match, p2, v2));
						if ((_v11.a.$ === 'Just') && (_v11.b.$ === 'Just')) {
							var m1 = _v11.a.a;
							var m2 = _v11.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(m1, m2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$11;
					}
				case 'PTuple':
					if (_v0.b.$ === 'VTuple') {
						var _v12 = _v0.a;
						var p1 = _v12.b;
						var p2 = _v12.c;
						var _v13 = _v0.b;
						var v1 = _v13.a;
						var v2 = _v13.b;
						var _v14 = _Utils_Tuple2(
							A2($author$project$Language$Utils$match, p1, v1),
							A2($author$project$Language$Utils$match, p2, v2));
						if ((_v14.a.$ === 'Just') && (_v14.b.$ === 'Just')) {
							var m1 = _v14.a.a;
							var m2 = _v14.b.a;
							return $elm$core$Maybe$Just(
								_Utils_ap(m1, m2));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$11;
					}
				case 'PFloat':
					if (_v0.b.$ === 'VFloat') {
						var _v15 = _v0.a;
						var f = _v15.b;
						var g = _v0.b.a;
						return _Utils_eq(f, g) ? $elm$core$Maybe$Just(_List_Nil) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$11;
					}
				case 'PString':
					if (_v0.b.$ === 'VString') {
						var _v16 = _v0.a;
						var s = _v16.b;
						var t = _v0.b.a;
						return _Utils_eq(s, t) ? $elm$core$Maybe$Just(_List_Nil) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$11;
					}
				case 'PChar':
					if (_v0.b.$ === 'VChar') {
						var _v17 = _v0.a;
						var c1 = _v17.b;
						var c2 = _v0.b.a;
						return _Utils_eq(c1, c2) ? $elm$core$Maybe$Just(_List_Nil) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$11;
					}
				default:
					break _v0$11;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Language$Utils$matchBranch = F3(
	function (v, b, cnt) {
		matchBranch:
		while (true) {
			if (b.$ === 'BSin') {
				var p = b.b;
				var e = b.c;
				var _v1 = A2($author$project$Language$Utils$match, p, v);
				if (_v1.$ === 'Nothing') {
					return {
						choice: cnt + 1,
						ei: $author$project$Language$Syntax$EError('match error'),
						envm: _List_Nil,
						pi: p
					};
				} else {
					var envm = _v1.a;
					return {choice: cnt + 1, ei: e, envm: envm, pi: p};
				}
			} else {
				var b1 = b.b;
				var b2 = b.c;
				var res = A3($author$project$Language$Utils$matchBranch, v, b1, cnt);
				var _v2 = res.ei;
				if (_v2.$ === 'EError') {
					var $temp$v = v,
						$temp$b = b2,
						$temp$cnt = res.choice;
					v = $temp$v;
					b = $temp$b;
					cnt = $temp$cnt;
					continue matchBranch;
				} else {
					return res;
				}
			}
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Language$FEval$feval = F2(
	function (env, exp) {
		feval:
		while (true) {
			switch (exp.$) {
				case 'ETrue':
					return $author$project$Language$Syntax$VTrue;
				case 'EFalse':
					return $author$project$Language$Syntax$VFalse;
				case 'EFloat':
					var f = exp.b;
					return $author$project$Language$Syntax$VFloat(f);
				case 'EChar':
					var c = exp.b;
					return $author$project$Language$Syntax$VChar(c);
				case 'EString':
					var s = exp.b;
					return $author$project$Language$Syntax$VString(s);
				case 'EVar':
					var x = exp.b;
					var _v1 = A2($author$project$Utils$lookup, x, env);
					if (_v1.$ === 'Just') {
						var _v2 = _v1.a;
						var v = _v2.a;
						if (v.$ === 'VFix') {
							var env_ = v.a;
							var e = v.b;
							return A2(
								$author$project$Language$FEval$feval,
								env_,
								A2($author$project$Language$Syntax$EFix, _List_Nil, e));
						} else {
							return v;
						}
					} else {
						return $author$project$Language$Syntax$VError('Unbound variable: ' + x);
					}
				case 'ELam':
					var p = exp.b;
					var e = exp.c;
					return A3($author$project$Language$Syntax$VClosure, env, p, e);
				case 'EApp':
					var e1 = exp.b;
					var e2 = exp.c;
					var _v4 = A2($author$project$Language$FEval$feval, env, e1);
					if (_v4.$ === 'VClosure') {
						var envf = _v4.a;
						var p = _v4.b;
						var ef = _v4.c;
						if (e2.$ === 'EFix') {
							var e = e2.b;
							if (p.$ === 'PVar') {
								var s = p.b;
								var $temp$env = A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										s,
										_Utils_Tuple2(
											A2($author$project$Language$Syntax$VFix, env, e),
											A2($author$project$Language$Syntax$DFix, env, e))),
									envf),
									$temp$exp = ef;
								env = $temp$env;
								exp = $temp$exp;
								continue feval;
							} else {
								return $author$project$Language$Syntax$VError('Error 46');
							}
						} else {
							var _v7 = A2(
								$author$project$Language$Utils$match,
								p,
								A2($author$project$Language$FEval$feval, env, e2));
							if (_v7.$ === 'Just') {
								var envm = _v7.a;
								var $temp$env = _Utils_ap(envm, envf),
									$temp$exp = ef;
								env = $temp$env;
								exp = $temp$exp;
								continue feval;
							} else {
								return $author$project$Language$Syntax$VError('Error 10');
							}
						}
					} else {
						return $author$project$Language$Syntax$VError('Error 11');
					}
				case 'EFix':
					var e = exp.b;
					return A2(
						$author$project$Language$FEval$feval,
						env,
						A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							e,
							A2($author$project$Language$Syntax$EFix, _List_Nil, e)));
				case 'ECase':
					var e = exp.b;
					var bs = exp.c;
					var v = A2($author$project$Language$FEval$feval, env, e);
					var res = A3($author$project$Language$Utils$matchBranch, v, bs, 0);
					var _v8 = res.ei;
					if (_v8.$ === 'EError') {
						return $author$project$Language$Syntax$VError('Error 12');
					} else {
						var $temp$env = _Utils_ap(res.envm, env),
							$temp$exp = res.ei;
						env = $temp$env;
						exp = $temp$exp;
						continue feval;
					}
				case 'ENil':
					return $author$project$Language$Syntax$VNil;
				case 'EEmpList':
					return $author$project$Language$Syntax$VNil;
				case 'ECons':
					var e1 = exp.b;
					var e2 = exp.c;
					return A2(
						$author$project$Language$Syntax$VCons,
						A2($author$project$Language$FEval$feval, env, e1),
						A2($author$project$Language$FEval$feval, env, e2));
				case 'EList':
					var e1 = exp.b;
					var e2 = exp.c;
					return A2(
						$author$project$Language$Syntax$VCons,
						A2($author$project$Language$FEval$feval, env, e1),
						A2($author$project$Language$FEval$feval, env, e2));
				case 'ETuple':
					var e1 = exp.b;
					var e2 = exp.c;
					return A2(
						$author$project$Language$Syntax$VTuple,
						A2($author$project$Language$FEval$feval, env, e1),
						A2($author$project$Language$FEval$feval, env, e2));
				case 'EParens':
					var e = exp.b;
					var $temp$env = env,
						$temp$exp = e;
					env = $temp$env;
					exp = $temp$exp;
					continue feval;
				case 'EError':
					var info = exp.a;
					return $author$project$Language$Syntax$VError('Error 13: ' + info);
				case 'EBPrim':
					var bop = exp.b;
					var e1 = exp.c;
					var e2 = exp.d;
					var _v9 = _Utils_Tuple2(
						A2($author$project$Language$FEval$feval, env, e1),
						A2($author$project$Language$FEval$feval, env, e2));
					_v9$2:
					while (true) {
						switch (_v9.a.$) {
							case 'VFloat':
								if (_v9.b.$ === 'VFloat') {
									var f1 = _v9.a.a;
									var f2 = _v9.b.a;
									switch (bop.$) {
										case 'Add':
											return $author$project$Language$Syntax$VFloat(f1 + f2);
										case 'Mul':
											return $author$project$Language$Syntax$VFloat(f1 * f2);
										case 'Sub':
											return $author$project$Language$Syntax$VFloat(f1 - f2);
										case 'Div':
											return $author$project$Language$Syntax$VFloat(f1 / f2);
										case 'Mod':
											return $author$project$Language$Syntax$VFloat(
												A2(
													$elm$core$Basics$modBy,
													$elm$core$Basics$round(f2),
													$elm$core$Basics$round(f1)));
										case 'Lt':
											return (_Utils_cmp(f1, f2) < 0) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
										case 'Gt':
											return (_Utils_cmp(f1, f2) > 0) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
										case 'Le':
											return (_Utils_cmp(f1, f2) < 1) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
										case 'Ge':
											return (_Utils_cmp(f1, f2) > -1) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
										case 'Eq':
											return _Utils_eq(f1, f2) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
										default:
											return $author$project$Language$Syntax$VError('49');
									}
								} else {
									break _v9$2;
								}
							case 'VString':
								if (_v9.b.$ === 'VString') {
									var s1 = _v9.a.a;
									var s2 = _v9.b.a;
									return _Utils_eq(bop, $author$project$Language$Syntax$Cat) ? $author$project$Language$Syntax$VString(
										_Utils_ap(s1, s2)) : $author$project$Language$Syntax$VError('50');
								} else {
									break _v9$2;
								}
							default:
								break _v9$2;
						}
					}
					var v1 = _v9.a;
					var v2 = _v9.b;
					switch (bop.$) {
						case 'Eq':
							return _Utils_eq(v1, v2) ? $author$project$Language$Syntax$VTrue : $author$project$Language$Syntax$VFalse;
						case 'And':
							var _v12 = _Utils_Tuple2(v1, v2);
							_v12$4:
							while (true) {
								switch (_v12.a.$) {
									case 'VTrue':
										switch (_v12.b.$) {
											case 'VTrue':
												var _v13 = _v12.a;
												var _v14 = _v12.b;
												return $author$project$Language$Syntax$VTrue;
											case 'VFalse':
												var _v15 = _v12.a;
												var _v16 = _v12.b;
												return $author$project$Language$Syntax$VFalse;
											default:
												break _v12$4;
										}
									case 'VFalse':
										switch (_v12.b.$) {
											case 'VTrue':
												var _v17 = _v12.a;
												var _v18 = _v12.b;
												return $author$project$Language$Syntax$VFalse;
											case 'VFalse':
												var _v19 = _v12.a;
												var _v20 = _v12.b;
												return $author$project$Language$Syntax$VFalse;
											default:
												break _v12$4;
										}
									default:
										break _v12$4;
								}
							}
							return $author$project$Language$Syntax$VError('Error 47');
						case 'Or':
							var _v21 = _Utils_Tuple2(v1, v2);
							_v21$4:
							while (true) {
								switch (_v21.a.$) {
									case 'VTrue':
										switch (_v21.b.$) {
											case 'VTrue':
												var _v22 = _v21.a;
												var _v23 = _v21.b;
												return $author$project$Language$Syntax$VTrue;
											case 'VFalse':
												var _v24 = _v21.a;
												var _v25 = _v21.b;
												return $author$project$Language$Syntax$VTrue;
											default:
												break _v21$4;
										}
									case 'VFalse':
										switch (_v21.b.$) {
											case 'VTrue':
												var _v26 = _v21.a;
												var _v27 = _v21.b;
												return $author$project$Language$Syntax$VTrue;
											case 'VFalse':
												var _v28 = _v21.a;
												var _v29 = _v21.b;
												return $author$project$Language$Syntax$VFalse;
											default:
												break _v21$4;
										}
									default:
										break _v21$4;
								}
							}
							return $author$project$Language$Syntax$VError('Error 48');
						default:
							return $author$project$Language$Syntax$VError('TODO');
					}
				case 'EUPrim':
					var uop = exp.b;
					var e = exp.c;
					if (uop.$ === 'Neg') {
						var _v31 = A2($author$project$Language$FEval$feval, env, e);
						if (_v31.$ === 'VFloat') {
							var f = _v31.a;
							return $author$project$Language$Syntax$VFloat(-f);
						} else {
							return $author$project$Language$Syntax$VError('Error 14');
						}
					} else {
						var _v32 = A2($author$project$Language$FEval$feval, env, e);
						switch (_v32.$) {
							case 'VTrue':
								return $author$project$Language$Syntax$VFalse;
							case 'VFalse':
								return $author$project$Language$Syntax$VTrue;
							default:
								return $author$project$Language$Syntax$VError('Error 15');
						}
					}
				case 'EGraphic':
					var s = exp.b;
					var e = exp.c;
					return A2(
						$author$project$Language$Syntax$VGraphic,
						s,
						A2($author$project$Language$FEval$feval, env, e));
				case 'EMap':
					var e1 = exp.b;
					var e2 = exp.c;
					var _v33 = _Utils_Tuple2(
						A2($author$project$Language$FEval$feval, env, e1),
						A2($author$project$Language$FEval$feval, env, e2));
					if ((_v33.a.$ === 'VClosure') && (_v33.b.$ === 'VGraphic')) {
						var _v34 = _v33.a;
						var envf = _v34.a;
						var p = _v34.b;
						var ef = _v34.c;
						var _v35 = _v33.b;
						var s = _v35.a;
						var pars = _v35.b;
						var _v36 = A2($author$project$Language$Utils$match, p, pars);
						if (_v36.$ === 'Just') {
							var envm = _v36.a;
							return A2(
								$author$project$Language$Syntax$VGraphic,
								s,
								A2(
									$author$project$Language$FEval$feval,
									_Utils_ap(envm, envf),
									ef));
						} else {
							return $author$project$Language$Syntax$VError('Error 52');
						}
					} else {
						return $author$project$Language$Syntax$VError('Error 55');
					}
				default:
					var e = exp.b;
					var _v37 = A2($author$project$Language$FEval$feval, env, e);
					if (_v37.$ === 'VGraphic') {
						var v = _v37.b;
						return v;
					} else {
						return $author$project$Language$Syntax$VError('Error 56');
					}
			}
		}
	});
var $author$project$Language$UtilsFD$fixCheck = F2(
	function (v, d) {
		var _v0 = _Utils_Tuple2(v, d);
		if ((((((_v0.a.$ === 'VFix') && (_v0.b.$ === 'DClosure')) && _v0.b.a.b) && (_v0.b.a.a.b.b.$ === 'DFix')) && (_v0.b.a.a.b.b.b.$ === 'ELam')) && (_v0.b.a.a.b.b.b.c.$ === 'ELam')) {
			var _v1 = _v0.a;
			var _v2 = _v0.b;
			var _v3 = _v2.a;
			var _v4 = _v3.a;
			var _v5 = _v4.b;
			var _v6 = _v5.b;
			var _v7 = _v6.b;
			var ws1 = _v7.a;
			var p1 = _v7.b;
			var _v8 = _v7.c;
			var ws2 = _v8.a;
			var p2 = _v8.b;
			var e1 = _v8.c;
			var env2 = _v3.b;
			var e2 = _v2.c;
			return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
				A2(
					$author$project$Language$Syntax$DFix,
					env2,
					A3(
						$author$project$Language$Syntax$ELam,
						ws1,
						p1,
						A3($author$project$Language$Syntax$ELam, ws2, p2, e2)))) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Just(d);
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Language$Utils$varsInPattern = function (pattern) {
	switch (pattern.$) {
		case 'PVar':
			var s = pattern.b;
			return _List_fromArray(
				[s]);
		case 'PCons':
			var p1 = pattern.b;
			var p2 = pattern.c;
			return _Utils_ap(
				$author$project$Language$Utils$varsInPattern(p1),
				$author$project$Language$Utils$varsInPattern(p2));
		case 'PList':
			var p1 = pattern.b;
			var p2 = pattern.c;
			return _Utils_ap(
				$author$project$Language$Utils$varsInPattern(p1),
				$author$project$Language$Utils$varsInPattern(p2));
		case 'PTuple':
			var p1 = pattern.b;
			var p2 = pattern.c;
			return _Utils_ap(
				$author$project$Language$Utils$varsInPattern(p1),
				$author$project$Language$Utils$varsInPattern(p2));
		default:
			return _List_Nil;
	}
};
var $author$project$Language$Utils$freeVars = function (exp) {
	freeVars:
	while (true) {
		switch (exp.$) {
			case 'EVar':
				var s = exp.b;
				return _List_fromArray(
					[s]);
			case 'ELam':
				var p = exp.b;
				var e = exp.c;
				return A2(
					$elm$core$List$filter,
					function (s) {
						return !A2(
							$elm$core$List$member,
							s,
							$author$project$Language$Utils$varsInPattern(p));
					},
					$author$project$Language$Utils$freeVars(e));
			case 'EApp':
				var e1 = exp.b;
				var e2 = exp.c;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e1),
					$author$project$Language$Utils$freeVars(e2));
			case 'ECase':
				var e = exp.b;
				var bs = exp.c;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e),
					$author$project$Language$Utils$varsInBranch(bs));
			case 'EBPrim':
				var e1 = exp.c;
				var e2 = exp.d;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e1),
					$author$project$Language$Utils$freeVars(e2));
			case 'ECons':
				var e1 = exp.b;
				var e2 = exp.c;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e1),
					$author$project$Language$Utils$freeVars(e2));
			case 'EList':
				var e1 = exp.b;
				var e2 = exp.c;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e1),
					$author$project$Language$Utils$freeVars(e2));
			case 'ETuple':
				var e1 = exp.b;
				var e2 = exp.c;
				return _Utils_ap(
					$author$project$Language$Utils$freeVars(e1),
					$author$project$Language$Utils$freeVars(e2));
			case 'EUPrim':
				var e = exp.c;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			case 'EParens':
				var e = exp.b;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			case 'EFix':
				var e = exp.b;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			case 'EGraphic':
				var e = exp.c;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			case 'EMap':
				var e = exp.c;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			case 'EUnwrap':
				var e = exp.b;
				var $temp$exp = e;
				exp = $temp$exp;
				continue freeVars;
			default:
				return _List_Nil;
		}
	}
};
var $author$project$Language$Utils$varsInBranch = function (branch) {
	if (branch.$ === 'BSin') {
		var p = branch.b;
		var e = branch.c;
		return A2(
			$elm$core$List$filter,
			function (s) {
				return !A2(
					$elm$core$List$member,
					s,
					$author$project$Language$Utils$varsInPattern(p));
			},
			$author$project$Language$Utils$freeVars(e));
	} else {
		var b1 = branch.b;
		var b2 = branch.c;
		return _Utils_ap(
			$author$project$Language$Utils$varsInBranch(b1),
			$author$project$Language$Utils$varsInBranch(b2));
	}
};
var $author$project$Language$Fusion$checkDeltaToFuse = F2(
	function (delta, flag) {
		checkDeltaToFuse:
		while (true) {
			switch (delta.$) {
				case 'DCons':
					var d1 = delta.a;
					var d2 = delta.b;
					return A2($author$project$Language$Fusion$checkDeltaToFuse, d1, flag) && A2($author$project$Language$Fusion$checkDeltaToFuse, d2, flag);
				case 'DTuple':
					var d1 = delta.a;
					var d2 = delta.b;
					return A2($author$project$Language$Fusion$checkDeltaToFuse, d1, flag) && A2($author$project$Language$Fusion$checkDeltaToFuse, d2, flag);
				case 'DCom':
					var d1 = delta.a;
					var d2 = delta.b;
					return A2($author$project$Language$Fusion$checkDeltaToFuse, d1, flag) && A2($author$project$Language$Fusion$checkDeltaToFuse, d2, flag);
				case 'DModify':
					var d = delta.b;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DMap':
					var d = delta.a;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DGen':
					var d = delta.b;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DGroup':
					var d = delta.b;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DApp':
					var d = delta.a;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DFun':
					var d = delta.b;
					var $temp$delta = d,
						$temp$flag = flag;
					delta = $temp$delta;
					flag = $temp$flag;
					continue checkDeltaToFuse;
				case 'DCtt':
					return true;
				case 'DAbst':
					return false;
				case 'DError':
					return false;
				case 'DRewr':
					return true;
				default:
					return true;
			}
		}
	});
var $author$project$Language$Syntax$AVar = function (a) {
	return {$: 'AVar', a: a};
};
var $author$project$Language$Syntax$BCom = F3(
	function (a, b, c) {
		return {$: 'BCom', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$BSin = F3(
	function (a, b, c) {
		return {$: 'BSin', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$PCons = F3(
	function (a, b, c) {
		return {$: 'PCons', a: a, b: b, c: c};
	});
var $author$project$Language$Syntax$PEmpList = function (a) {
	return {$: 'PEmpList', a: a};
};
var $author$project$Language$Syntax$PTuple = F3(
	function (a, b, c) {
		return {$: 'PTuple', a: a, b: b, c: c};
	});
var $author$project$Language$UtilsFD$isEveryDId = function (delta) {
	switch (delta.$) {
		case 'DId':
			return true;
		case 'DCom':
			var d1 = delta.a;
			var d2 = delta.b;
			return $author$project$Language$UtilsFD$isEveryDId(d1) && $author$project$Language$UtilsFD$isEveryDId(d2);
		case 'DCons':
			var d1 = delta.a;
			var d2 = delta.b;
			return $author$project$Language$UtilsFD$isEveryDId(d1) && $author$project$Language$UtilsFD$isEveryDId(d2);
		case 'DTuple':
			var d1 = delta.a;
			var d2 = delta.b;
			return $author$project$Language$UtilsFD$isEveryDId(d1) && $author$project$Language$UtilsFD$isEveryDId(d2);
		default:
			return false;
	}
};
var $author$project$Language$UtilsFD$eqDelta = F2(
	function (d1, d2) {
		if (_Utils_eq(d1, d2)) {
			return true;
		} else {
			if (_Utils_eq(d1, $author$project$Language$Syntax$DId) && _Utils_eq(
				d2,
				$author$project$Language$Syntax$DAdd(
					$author$project$Language$Syntax$AFloat(0)))) {
				return true;
			} else {
				if (_Utils_eq(d1, $author$project$Language$Syntax$DId) && _Utils_eq(
					d2,
					$author$project$Language$Syntax$DMul(
						$author$project$Language$Syntax$AFloat(1)))) {
					return true;
				} else {
					if (_Utils_eq(
						d1,
						$author$project$Language$Syntax$DAdd(
							$author$project$Language$Syntax$AFloat(0))) && _Utils_eq(d2, $author$project$Language$Syntax$DId)) {
						return true;
					} else {
						if (_Utils_eq(
							d1,
							$author$project$Language$Syntax$DMul(
								$author$project$Language$Syntax$AFloat(1))) && _Utils_eq(d2, $author$project$Language$Syntax$DId)) {
							return true;
						} else {
							if (_Utils_eq(d1, $author$project$Language$Syntax$DId) && $author$project$Language$UtilsFD$isEveryDId(d2)) {
								return true;
							} else {
								if (_Utils_eq(d2, $author$project$Language$Syntax$DId) && $author$project$Language$UtilsFD$isEveryDId(d1)) {
									return true;
								} else {
									var _v0 = _Utils_Tuple2(d1, d2);
									_v0$5:
									while (true) {
										switch (_v0.a.$) {
											case 'DCom':
												if (_v0.b.$ === 'DCom') {
													var _v1 = _v0.a;
													var d11 = _v1.a;
													var d12 = _v1.b;
													var _v2 = _v0.b;
													var d21 = _v2.a;
													var d22 = _v2.b;
													return A2($author$project$Language$UtilsFD$eqDelta, d11, d21) && A2($author$project$Language$UtilsFD$eqDelta, d12, d22);
												} else {
													break _v0$5;
												}
											case 'DCons':
												if (_v0.b.$ === 'DCons') {
													var _v3 = _v0.a;
													var d11 = _v3.a;
													var d12 = _v3.b;
													var _v4 = _v0.b;
													var d21 = _v4.a;
													var d22 = _v4.b;
													return A2($author$project$Language$UtilsFD$eqDelta, d11, d21) && A2($author$project$Language$UtilsFD$eqDelta, d12, d22);
												} else {
													break _v0$5;
												}
											case 'DTuple':
												if (_v0.b.$ === 'DTuple') {
													var _v5 = _v0.a;
													var d11 = _v5.a;
													var d12 = _v5.b;
													var _v6 = _v0.b;
													var d21 = _v6.a;
													var d22 = _v6.b;
													return A2($author$project$Language$UtilsFD$eqDelta, d11, d21) && A2($author$project$Language$UtilsFD$eqDelta, d12, d22);
												} else {
													break _v0$5;
												}
											case 'DCtt':
												if (_v0.b.$ === 'DCtt') {
													var _v7 = _v0.a;
													var p1 = _v7.a;
													var del1 = _v7.b;
													var _v8 = _v0.b;
													var p2 = _v8.a;
													var del2 = _v8.b;
													return A2($author$project$Language$UtilsFD$eqDelta, del1, del2) && _Utils_eq(p1, p2);
												} else {
													break _v0$5;
												}
											case 'DGen':
												if (_v0.b.$ === 'DGen') {
													var _v9 = _v0.a;
													var e1 = _v9.a;
													var del1 = _v9.b;
													var p1 = _v9.c;
													var _v10 = _v0.b;
													var e2 = _v10.a;
													var del2 = _v10.b;
													var p2 = _v10.c;
													return A2($author$project$Language$UtilsFD$eqDelta, del1, del2) && (_Utils_eq(p1, p2) && _Utils_eq(e1, e2));
												} else {
													break _v0$5;
												}
											default:
												break _v0$5;
										}
									}
									return false;
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$Language$Fusion$expandDCons = function (d) {
	if (d.$ === 'DCons') {
		var d1 = d.a;
		var d2 = d.b;
		return A2(
			$elm$core$List$cons,
			d1,
			$author$project$Language$Fusion$expandDCons(d2));
	} else {
		return _List_fromArray(
			[d]);
	}
};
var $author$project$Language$Syntax$EChar = F2(
	function (a, b) {
		return {$: 'EChar', a: a, b: b};
	});
var $author$project$Language$Syntax$EFalse = function (a) {
	return {$: 'EFalse', a: a};
};
var $author$project$Language$Syntax$EString = F2(
	function (a, b) {
		return {$: 'EString', a: a, b: b};
	});
var $author$project$Language$Syntax$ETrue = function (a) {
	return {$: 'ETrue', a: a};
};
var $author$project$Utils$setLast = F2(
	function (item, list) {
		var _v0 = $elm$core$List$reverse(list);
		if (!_v0.b) {
			return _List_fromArray(
				[item]);
		} else {
			var rest = _v0.b;
			return $elm$core$List$reverse(
				A2($elm$core$List$cons, item, rest));
		}
	});
var $author$project$Language$Fusion$setLastSpaces = F2(
	function (str, exp) {
		_v1$11:
		while (true) {
			switch (exp.$) {
				case 'ETrue':
					var ws = exp.a;
					return $author$project$Language$Syntax$ETrue(
						A2($author$project$Utils$setLast, str, ws));
				case 'EFalse':
					var ws = exp.a;
					return $author$project$Language$Syntax$EFalse(
						A2($author$project$Utils$setLast, str, ws));
				case 'ENil':
					var ws = exp.a;
					return $author$project$Language$Syntax$ENil(
						A2($author$project$Utils$setLast, str, ws));
				case 'EEmpList':
					var ws = exp.a;
					return $author$project$Language$Syntax$EEmpList(
						A2($author$project$Utils$setLast, str, ws));
				case 'EFloat':
					var ws = exp.a;
					var f = exp.b;
					return A2(
						$author$project$Language$Syntax$EFloat,
						A2($author$project$Utils$setLast, str, ws),
						f);
				case 'EChar':
					var ws = exp.a;
					var c = exp.b;
					return A2(
						$author$project$Language$Syntax$EChar,
						A2($author$project$Utils$setLast, str, ws),
						c);
				case 'EString':
					var ws = exp.a;
					var s = exp.b;
					return A2(
						$author$project$Language$Syntax$EString,
						A2($author$project$Utils$setLast, str, ws),
						s);
				case 'EVar':
					var ws = exp.a;
					var s = exp.b;
					return A2(
						$author$project$Language$Syntax$EVar,
						A2($author$project$Utils$setLast, str, ws),
						s);
				case 'ELam':
					var ws = exp.a;
					var p = exp.b;
					var e = exp.c;
					return A3(
						$author$project$Language$Syntax$ELam,
						ws,
						p,
						A2($author$project$Language$Fusion$setLastSpaces, str, e));
				case 'EApp':
					if (exp.a.b) {
						switch (exp.a.a) {
							case 'LET':
								var _v2 = exp.a;
								var ws = _v2.b;
								var e1 = exp.b;
								var e2 = exp.c;
								return A3(
									$author$project$Language$Syntax$EApp,
									A2($elm$core$List$cons, 'LET', ws),
									A2($author$project$Language$Fusion$setLastSpaces, str, e1),
									e2);
							case 'LETREC':
								var _v3 = exp.a;
								var ws = _v3.b;
								var e1 = exp.b;
								var e2 = exp.c;
								return A3(
									$author$project$Language$Syntax$EApp,
									A2($elm$core$List$cons, 'LETREC', ws),
									A2($author$project$Language$Fusion$setLastSpaces, str, e1),
									e2);
							default:
								break _v1$11;
						}
					} else {
						break _v1$11;
					}
				case 'ECase':
					var ws = exp.a;
					var e = exp.b;
					var bs = exp.c;
					return A3(
						$author$project$Language$Syntax$ECase,
						ws,
						e,
						A2($author$project$Language$Fusion$setLastSpacesBranch, str, bs));
				case 'EUPrim':
					var ws = exp.a;
					var uop = exp.b;
					var e = exp.c;
					return A3(
						$author$project$Language$Syntax$EUPrim,
						ws,
						uop,
						A2($author$project$Language$Fusion$setLastSpaces, str, e));
				case 'EBPrim':
					var ws = exp.a;
					var bop = exp.b;
					var e1 = exp.c;
					var e2 = exp.d;
					return A4(
						$author$project$Language$Syntax$EBPrim,
						ws,
						bop,
						e1,
						A2($author$project$Language$Fusion$setLastSpaces, str, e2));
				case 'ECons':
					var ws = exp.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return A3(
						$author$project$Language$Syntax$ECons,
						ws,
						e1,
						A2($author$project$Language$Fusion$setLastSpaces, str, e2));
				case 'EList':
					var ws = exp.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return A3(
						$author$project$Language$Syntax$EList,
						A2($author$project$Utils$setLast, str, ws),
						e1,
						e2);
				case 'ETuple':
					var ws = exp.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return A3(
						$author$project$Language$Syntax$ETuple,
						A2($author$project$Utils$setLast, str, ws),
						e1,
						e2);
				case 'EParens':
					var ws = exp.a;
					var e = exp.b;
					return A2(
						$author$project$Language$Syntax$EParens,
						A2($author$project$Utils$setLast, str, ws),
						e);
				case 'EGraphic':
					var ws = exp.a;
					var s = exp.b;
					var e = exp.c;
					return A3(
						$author$project$Language$Syntax$EGraphic,
						ws,
						s,
						A2($author$project$Language$Fusion$setLastSpaces, str, e));
				case 'EMap':
					var ws = exp.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return A3(
						$author$project$Language$Syntax$EMap,
						ws,
						e1,
						A2($author$project$Language$Fusion$setLastSpaces, str, e2));
				default:
					return exp;
			}
		}
		var ws = exp.a;
		var e1 = exp.b;
		var e2 = exp.c;
		return A3(
			$author$project$Language$Syntax$EApp,
			ws,
			e1,
			A2($author$project$Language$Fusion$setLastSpaces, str, e2));
	});
var $author$project$Language$Fusion$setLastSpacesBranch = F2(
	function (str, bs) {
		if (bs.$ === 'BSin') {
			var ws = bs.a;
			var p = bs.b;
			var e = bs.c;
			return A3(
				$author$project$Language$Syntax$BSin,
				ws,
				p,
				A2($author$project$Language$Fusion$setLastSpaces, str, e));
		} else {
			var ws = bs.a;
			var b1 = bs.b;
			var b2 = bs.c;
			return A3(
				$author$project$Language$Syntax$BCom,
				ws,
				b1,
				A2($author$project$Language$Fusion$setLastSpacesBranch, str, b2));
		}
	});
var $author$project$Language$Fusion$pars = F2(
	function (str, e) {
		switch (e.$) {
			case 'ELam':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EApp':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'ECase':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EUPrim':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EBPrim':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'ECons':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EGraphic':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EMap':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			case 'EUnwrap':
				return A2(
					$author$project$Language$Syntax$EParens,
					_List_fromArray(
						['', str]),
					A2($author$project$Language$Fusion$setLastSpaces, '', e));
			default:
				return A2($author$project$Language$Fusion$setLastSpaces, str, e);
		}
	});
var $author$project$Language$Fusion$genFunByPath = function (path) {
	_v0$5:
	while (true) {
		if (!path.b) {
			return A2(
				$author$project$Language$Syntax$EVar,
				_List_fromArray(
					['']),
				'obj');
		} else {
			switch (path.a.a) {
				case 'Graphic':
					if (!path.a.b) {
						var _v1 = path.a;
						var path_ = path.b;
						return A2(
							$author$project$Language$Syntax$EUnwrap,
							_List_fromArray(
								[' ']),
							A2(
								$author$project$Language$Fusion$pars,
								'',
								$author$project$Language$Fusion$genFunByPath(path_)));
					} else {
						break _v0$5;
					}
				case 'Tuple':
					switch (path.a.b) {
						case 1:
							var _v2 = path.a;
							var path_ = path.b;
							return A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'first'),
								A2(
									$author$project$Language$Fusion$pars,
									'',
									$author$project$Language$Fusion$genFunByPath(path_)));
						case 2:
							var _v3 = path.a;
							var path_ = path.b;
							return A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'second'),
								A2(
									$author$project$Language$Fusion$pars,
									'',
									$author$project$Language$Fusion$genFunByPath(path_)));
						default:
							break _v0$5;
					}
				case 'List':
					var _v4 = path.a;
					var n = _v4.b;
					var path_ = path.b;
					return A3(
						$author$project$Language$Syntax$EApp,
						_List_Nil,
						A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									[' ']),
								'nth'),
							A2(
								$author$project$Language$Syntax$EFloat,
								_List_fromArray(
									[' ']),
								n)),
						A2(
							$author$project$Language$Fusion$pars,
							'',
							$author$project$Language$Fusion$genFunByPath(path_)));
				default:
					break _v0$5;
			}
		}
	}
	return $author$project$Language$Syntax$EError('genFunByPath Failed');
};
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$Language$Fusion$genNPCons = function (n) {
	if (!n) {
		return A2(
			$author$project$Language$Syntax$PVar,
			_List_fromArray(
				['']),
			't0');
	} else {
		return A3(
			$author$project$Language$Syntax$PCons,
			_List_fromArray(
				['']),
			A2(
				$author$project$Language$Syntax$PVar,
				_List_fromArray(
					['']),
				't' + $elm$core$Debug$toString(n)),
			$author$project$Language$Fusion$genNPCons(n - 1));
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Language$Fusion$getCttParamDCons = F4(
	function (delta, param, path, index) {
		getCttParamDCons:
		while (true) {
			if (delta.$ === 'DCons') {
				var d1 = delta.a;
				var d2 = delta.b;
				var _v4 = A3(
					$author$project$Language$Fusion$getCttParamPath,
					d1,
					param,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2('List', index),
						path));
				if (_v4.$ === 'Just') {
					var p = _v4.a;
					return $elm$core$Maybe$Just(p);
				} else {
					var $temp$delta = d2,
						$temp$param = param,
						$temp$path = path,
						$temp$index = index + 1;
					delta = $temp$delta;
					param = $temp$param;
					path = $temp$path;
					index = $temp$index;
					continue getCttParamDCons;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Language$Fusion$getCttParamPath = F3(
	function (delta, param, path) {
		getCttParamPath:
		while (true) {
			switch (delta.$) {
				case 'DAbst':
					var p = delta.a;
					return _Utils_eq(p, param) ? $elm$core$Maybe$Just(path) : $elm$core$Maybe$Nothing;
				case 'DCons':
					return A4($author$project$Language$Fusion$getCttParamDCons, delta, param, path, 0);
				case 'DCtt':
					var d = delta.b;
					var $temp$delta = d,
						$temp$param = param,
						$temp$path = path;
					delta = $temp$delta;
					param = $temp$param;
					path = $temp$path;
					continue getCttParamPath;
				case 'DTuple':
					var d1 = delta.a;
					var d2 = delta.b;
					var _v1 = A3(
						$author$project$Language$Fusion$getCttParamPath,
						d1,
						param,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2('Tuple', 1),
							path));
					if (_v1.$ === 'Just') {
						var p = _v1.a;
						return $elm$core$Maybe$Just(p);
					} else {
						var $temp$delta = d2,
							$temp$param = param,
							$temp$path = A2(
							$elm$core$List$cons,
							_Utils_Tuple2('Tuple', 2),
							path);
						delta = $temp$delta;
						param = $temp$param;
						path = $temp$path;
						continue getCttParamPath;
					}
				case 'DCom':
					var d1 = delta.a;
					var d2 = delta.b;
					var _v2 = A3($author$project$Language$Fusion$getCttParamPath, d1, param, path);
					if (_v2.$ === 'Just') {
						var p = _v2.a;
						return $elm$core$Maybe$Just(p);
					} else {
						var $temp$delta = d2,
							$temp$param = param,
							$temp$path = path;
						delta = $temp$delta;
						param = $temp$param;
						path = $temp$path;
						continue getCttParamPath;
					}
				case 'DModify':
					var n = delta.a;
					var d = delta.b;
					return A2(
						$elm$core$Maybe$map,
						function (p) {
							return p;
						},
						A3(
							$author$project$Language$Fusion$getCttParamPath,
							d,
							param,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2('List', n),
								path)));
				case 'DMap':
					var d = delta.a;
					return A2(
						$elm$core$Maybe$map,
						function (p) {
							return p;
						},
						A3(
							$author$project$Language$Fusion$getCttParamPath,
							d,
							param,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2('Graphic', 0),
								path)));
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$Printer$Pattern$printPattern = function (p) {
	_v0$12:
	while (true) {
		switch (p.$) {
			case 'PVar':
				if (p.a.b && (!p.a.b.b)) {
					var _v1 = p.a;
					var spc = _v1.a;
					var s = p.b;
					return _Utils_ap(s, spc);
				} else {
					break _v0$12;
				}
			case 'PCons':
				var ws = p.a;
				var p1 = p.b;
				var p2 = p.c;
				if (ws.b && (!ws.b.b)) {
					var spc = ws.a;
					return $author$project$Printer$Pattern$printPattern(p1) + ('::' + (spc + $author$project$Printer$Pattern$printPattern(p2)));
				} else {
					return 'Error 27';
				}
			case 'PNil':
				if (p.a.b && (!p.a.b.b)) {
					var _v3 = p.a;
					var spc = _v3.a;
					return 'nil' + spc;
				} else {
					break _v0$12;
				}
			case 'PList':
				var ws = p.a;
				var p1 = p.b;
				var p2 = p.c;
				_v4$2:
				while (true) {
					if (ws.b) {
						if (ws.b.b) {
							if (!ws.b.b.b) {
								var spc1 = ws.a;
								var _v5 = ws.b;
								var spc2 = _v5.a;
								return '[' + (spc1 + ($author$project$Printer$Pattern$printPattern(p1) + ($author$project$Printer$Pattern$printPattern(p2) + (']' + spc2))));
							} else {
								break _v4$2;
							}
						} else {
							var spc = ws.a;
							return ',' + (spc + ($author$project$Printer$Pattern$printPattern(p1) + $author$project$Printer$Pattern$printPattern(p2)));
						}
					} else {
						break _v4$2;
					}
				}
				return 'Error 28';
			case 'PEmpList':
				if (p.a.b) {
					if (p.a.b.b && (!p.a.b.b.b)) {
						var _v6 = p.a;
						var spc1 = _v6.a;
						var _v7 = _v6.b;
						var spc2 = _v7.a;
						return '[' + (spc1 + (']' + spc2));
					} else {
						break _v0$12;
					}
				} else {
					return '';
				}
			case 'PFloat':
				if (p.a.b && (!p.a.b.b)) {
					var _v8 = p.a;
					var spc = _v8.a;
					var n = p.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v0$12;
				}
			case 'PTrue':
				if (p.a.b && (!p.a.b.b)) {
					var _v9 = p.a;
					var spc = _v9.a;
					return 'true' + spc;
				} else {
					break _v0$12;
				}
			case 'PFalse':
				if (p.a.b && (!p.a.b.b)) {
					var _v10 = p.a;
					var spc = _v10.a;
					return 'false' + spc;
				} else {
					break _v0$12;
				}
			case 'PChar':
				if (p.a.b && (!p.a.b.b)) {
					var _v11 = p.a;
					var spc = _v11.a;
					var c = p.b;
					return '\'' + ($elm$core$String$fromChar(c) + ('\'' + spc));
				} else {
					break _v0$12;
				}
			case 'PString':
				if (p.a.b && (!p.a.b.b)) {
					var _v12 = p.a;
					var spc = _v12.a;
					var s = p.b;
					return '\"' + (s + ('\"' + spc));
				} else {
					break _v0$12;
				}
			case 'PTuple':
				if (((p.a.b && p.a.b.b) && p.a.b.b.b) && (!p.a.b.b.b.b)) {
					var _v13 = p.a;
					var spc1 = _v13.a;
					var _v14 = _v13.b;
					var spc2 = _v14.a;
					var _v15 = _v14.b;
					var spc3 = _v15.a;
					var t1 = p.b;
					var t2 = p.c;
					return '(' + (spc1 + ($author$project$Printer$Pattern$printPattern(t1) + (',' + (spc2 + ($author$project$Printer$Pattern$printPattern(t2) + (')' + spc3))))));
				} else {
					break _v0$12;
				}
			default:
				break _v0$12;
		}
	}
	return 'Error 29' + $elm$core$Debug$toString(p);
};
var $author$project$Printer$Exp$printParamList = function (pls) {
	if (!pls.b) {
		return '';
	} else {
		var p = pls.a;
		var pls_ = pls.b;
		return _Utils_ap(
			$author$project$Printer$Pattern$printPattern(p),
			$author$project$Printer$Exp$printParamList(pls_));
	}
};
var $author$project$Printer$Exp$splitFuncDef = F2(
	function (params, exp) {
		splitFuncDef:
		while (true) {
			if ((exp.$ === 'ELam') && (!exp.a.b)) {
				var p = exp.b;
				var e = exp.c;
				var $temp$params = A2($elm$core$List$cons, p, params),
					$temp$exp = e;
				params = $temp$params;
				exp = $temp$exp;
				continue splitFuncDef;
			} else {
				return _Utils_Tuple2(
					$elm$core$List$reverse(params),
					exp);
			}
		}
	});
var $author$project$Printer$Exp$print = function (exp) {
	_v5$26:
	while (true) {
		switch (exp.$) {
			case 'EFloat':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v6 = exp.a;
					var spc = _v6.a;
					var n = exp.b;
					return _Utils_ap(
						$elm$core$Debug$toString(n),
						spc);
				} else {
					break _v5$26;
				}
			case 'ETrue':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v7 = exp.a;
					var spc = _v7.a;
					return 'true' + spc;
				} else {
					break _v5$26;
				}
			case 'EFalse':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v8 = exp.a;
					var spc = _v8.a;
					return 'false' + spc;
				} else {
					break _v5$26;
				}
			case 'EChar':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v9 = exp.a;
					var spc = _v9.a;
					var c = exp.b;
					return '\'' + ($elm$core$String$fromChar(c) + ('\'' + spc));
				} else {
					break _v5$26;
				}
			case 'EString':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v10 = exp.a;
					var spc = _v10.a;
					var s = exp.b;
					return '\"' + (s + ('\"' + spc));
				} else {
					break _v5$26;
				}
			case 'EVar':
				var ws = exp.a;
				var s = exp.b;
				if (!ws.b) {
					return (s === 'main') ? '' : 'Error 16';
				} else {
					if (!ws.b.b) {
						var spc = ws.a;
						return _Utils_ap(s, spc);
					} else {
						return 'Error 17';
					}
				}
			case 'ELam':
				if (exp.a.b) {
					if (exp.a.b.b && (!exp.a.b.b.b)) {
						var _v12 = exp.a;
						var spc1 = _v12.a;
						var _v13 = _v12.b;
						var spc2 = _v13.a;
						var p = exp.b;
						var e = exp.c;
						return '\\' + (spc1 + ($author$project$Printer$Pattern$printPattern(p) + ('->' + (spc2 + $author$project$Printer$Exp$print(e)))));
					} else {
						break _v5$26;
					}
				} else {
					var p = exp.b;
					var e = exp.c;
					return '\\' + ($author$project$Printer$Pattern$printPattern(p) + ('-> ' + $author$project$Printer$Exp$print(e)));
				}
			case 'EApp':
				if (exp.a.b) {
					if ((((exp.a.b.b && exp.a.b.b.b) && exp.a.b.b.b.b) && (!exp.a.b.b.b.b.b)) && (exp.b.$ === 'ELam')) {
						switch (exp.a.a) {
							case 'LET':
								var _v14 = exp.a;
								var _v15 = _v14.b;
								var spc1 = _v15.a;
								var _v16 = _v15.b;
								var spc2 = _v16.a;
								var _v17 = _v16.b;
								var spc3 = _v17.a;
								var _v18 = exp.b;
								var p = _v18.b;
								var e2 = _v18.c;
								var e1 = exp.c;
								return 'let' + (spc1 + ($author$project$Printer$Pattern$printPattern(p) + ('=' + (spc2 + ($author$project$Printer$Exp$print(e1) + ('in' + (spc3 + $author$project$Printer$Exp$print(e2))))))));
							case 'LETREC':
								if (((((!exp.b.a.b) && (exp.c.$ === 'EFix')) && (!exp.c.a.b)) && (exp.c.b.$ === 'ELam')) && (!exp.c.b.a.b)) {
									var _v19 = exp.a;
									var _v20 = _v19.b;
									var spc1 = _v20.a;
									var _v21 = _v20.b;
									var spc2 = _v21.a;
									var _v22 = _v21.b;
									var spc3 = _v22.a;
									var _v23 = exp.b;
									var p = _v23.b;
									var e2 = _v23.c;
									var _v24 = exp.c;
									var _v25 = _v24.b;
									var e1 = _v25.c;
									return 'letrec' + (spc1 + ($author$project$Printer$Pattern$printPattern(p) + ('=' + (spc2 + ($author$project$Printer$Exp$print(e1) + ('in' + (spc3 + $author$project$Printer$Exp$print(e2))))))));
								} else {
									break _v5$26;
								}
							case 'EQ':
								if (!exp.b.a.b) {
									var _v26 = exp.a;
									var _v27 = _v26.b;
									var spc1 = _v27.a;
									var _v28 = _v27.b;
									var spc2 = _v28.a;
									var _v29 = _v28.b;
									var spc3 = _v29.a;
									var _v30 = exp.b;
									var p = _v30.b;
									var e2 = _v30.c;
									var e1 = exp.c;
									var _v31 = A2($author$project$Printer$Exp$splitFuncDef, _List_Nil, e1);
									var paramList = _v31.a;
									var tFunc = _v31.b;
									return $author$project$Printer$Pattern$printPattern(p) + (spc1 + ($author$project$Printer$Exp$printParamList(paramList) + ('=' + (spc2 + ($author$project$Printer$Exp$print(tFunc) + (';' + (spc3 + $author$project$Printer$Exp$print(e2))))))));
								} else {
									break _v5$26;
								}
							case 'Rec':
								if (((!exp.b.a.b) && (exp.c.$ === 'EFix')) && (exp.c.b.$ === 'ELam')) {
									var _v32 = exp.a;
									var _v33 = _v32.b;
									var spc1 = _v33.a;
									var _v34 = _v33.b;
									var spc2 = _v34.a;
									var _v35 = _v34.b;
									var spc3 = _v35.a;
									var _v36 = exp.b;
									var p = _v36.b;
									var e2 = _v36.c;
									var _v37 = exp.c;
									var _v38 = _v37.b;
									var e1 = _v38.c;
									var _v39 = A2($author$project$Printer$Exp$splitFuncDef, _List_Nil, e1);
									var paramList = _v39.a;
									var tFunc = _v39.b;
									return $author$project$Printer$Pattern$printPattern(p) + (spc1 + ($author$project$Printer$Exp$printParamList(paramList) + (':=' + (spc2 + ($author$project$Printer$Exp$print(tFunc) + (';' + (spc3 + $author$project$Printer$Exp$print(e2))))))));
								} else {
									break _v5$26;
								}
							default:
								break _v5$26;
						}
					} else {
						break _v5$26;
					}
				} else {
					var e1 = exp.b;
					var e2 = exp.c;
					return _Utils_ap(
						$author$project$Printer$Exp$print(e1),
						$author$project$Printer$Exp$print(e2));
				}
			case 'EFix':
				var e = exp.b;
				return 'fix ' + $author$project$Printer$Exp$print(e);
			case 'ECase':
				if ((exp.a.b && exp.a.b.b) && (!exp.a.b.b.b)) {
					var _v40 = exp.a;
					var spc1 = _v40.a;
					var _v41 = _v40.b;
					var spc2 = _v41.a;
					var e = exp.b;
					var b = exp.c;
					return 'case' + (spc1 + ($author$project$Printer$Exp$print(e) + ('of' + (spc2 + $author$project$Printer$Exp$printBranch(b)))));
				} else {
					break _v5$26;
				}
			case 'ECons':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v42 = exp.a;
					var spc = _v42.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return $author$project$Printer$Exp$print(e1) + ('::' + (spc + $author$project$Printer$Exp$print(e2)));
				} else {
					break _v5$26;
				}
			case 'EList':
				var ws = exp.a;
				var e1 = exp.b;
				var e2 = exp.c;
				_v43$2:
				while (true) {
					if (ws.b) {
						if (ws.b.b) {
							if (!ws.b.b.b) {
								var spc1 = ws.a;
								var _v44 = ws.b;
								var spc2 = _v44.a;
								return '[' + (spc1 + ($author$project$Printer$Exp$print(e1) + ($author$project$Printer$Exp$printList(e2) + (']' + spc2))));
							} else {
								break _v43$2;
							}
						} else {
							var spc = ws.a;
							return '[' + (spc + ($author$project$Printer$Exp$print(e1) + ($author$project$Printer$Exp$printList(e2) + ']')));
						}
					} else {
						break _v43$2;
					}
				}
				return 'Error 23';
			case 'EEmpList':
				var ws = exp.a;
				if (ws.b) {
					if (ws.b.b && (!ws.b.b.b)) {
						var spc1 = ws.a;
						var _v46 = ws.b;
						var spc2 = _v46.a;
						return '[' + (spc1 + (']' + spc2));
					} else {
						return 'Error 54';
					}
				} else {
					return '[]';
				}
			case 'ENil':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v47 = exp.a;
					var spc = _v47.a;
					return 'nil' + spc;
				} else {
					break _v5$26;
				}
			case 'ETuple':
				if (((exp.a.b && exp.a.b.b) && exp.a.b.b.b) && (!exp.a.b.b.b.b)) {
					var _v48 = exp.a;
					var spc1 = _v48.a;
					var _v49 = _v48.b;
					var spc2 = _v49.a;
					var _v50 = _v49.b;
					var spc3 = _v50.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return '(' + (spc1 + ($author$project$Printer$Exp$print(e1) + (',' + (spc2 + ($author$project$Printer$Exp$print(e2) + (')' + spc3))))));
				} else {
					break _v5$26;
				}
			case 'EBPrim':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v51 = exp.a;
					var spc = _v51.a;
					var op = exp.b;
					var e1 = exp.c;
					var e2 = exp.d;
					var sop = function () {
						switch (op.$) {
							case 'Add':
								return '+';
							case 'Sub':
								return '-';
							case 'Mul':
								return '*';
							case 'Div':
								return '/';
							case 'Mod':
								return '%';
							case 'Eq':
								return '==';
							case 'Lt':
								return '<';
							case 'Gt':
								return '>';
							case 'Le':
								return '<=';
							case 'Ge':
								return '>=';
							case 'And':
								return '&&';
							case 'Or':
								return '||';
							default:
								return '++';
						}
					}();
					return _Utils_ap(
						$author$project$Printer$Exp$print(e1),
						_Utils_ap(
							sop,
							_Utils_ap(
								spc,
								$author$project$Printer$Exp$print(e2))));
				} else {
					break _v5$26;
				}
			case 'EUPrim':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v53 = exp.a;
					var spc = _v53.a;
					var op = exp.b;
					var e = exp.c;
					var sop = function () {
						if (op.$ === 'Neg') {
							return '-';
						} else {
							return '~';
						}
					}();
					return _Utils_ap(
						sop,
						_Utils_ap(
							spc,
							$author$project$Printer$Exp$print(e)));
				} else {
					break _v5$26;
				}
			case 'EParens':
				if ((exp.a.b && exp.a.b.b) && (!exp.a.b.b.b)) {
					var _v55 = exp.a;
					var spc1 = _v55.a;
					var _v56 = _v55.b;
					var spc2 = _v56.a;
					var e = exp.b;
					return '(' + (spc1 + ($author$project$Printer$Exp$print(e) + (')' + spc2)));
				} else {
					break _v5$26;
				}
			case 'EGraphic':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v57 = exp.a;
					var spc = _v57.a;
					var s = exp.b;
					var e = exp.c;
					return _Utils_ap(
						s,
						_Utils_ap(
							spc,
							$author$project$Printer$Exp$print(e)));
				} else {
					break _v5$26;
				}
			case 'EMap':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v58 = exp.a;
					var spc = _v58.a;
					var e1 = exp.b;
					var e2 = exp.c;
					return 'Graphic.map' + (spc + ($author$project$Printer$Exp$print(e1) + $author$project$Printer$Exp$print(e2)));
				} else {
					break _v5$26;
				}
			case 'EUnwrap':
				if (exp.a.b && (!exp.a.b.b)) {
					var _v59 = exp.a;
					var spc = _v59.a;
					var e = exp.b;
					return 'Graphic.unwrap' + (spc + $author$project$Printer$Exp$print(e));
				} else {
					break _v5$26;
				}
			default:
				break _v5$26;
		}
	}
	return 'Error 24' + $elm$core$Debug$toString(exp);
};
var $author$project$Printer$Exp$printBranch = function (b) {
	_v2$2:
	while (true) {
		if (b.$ === 'BSin') {
			if (b.a.b && (!b.a.b.b)) {
				var _v3 = b.a;
				var spc = _v3.a;
				var p = b.b;
				var e = b.c;
				return $author$project$Printer$Pattern$printPattern(p) + ('->' + (spc + $author$project$Printer$Exp$print(e)));
			} else {
				break _v2$2;
			}
		} else {
			if (b.a.b && (!b.a.b.b)) {
				var _v4 = b.a;
				var spc = _v4.a;
				var b1 = b.b;
				var b2 = b.c;
				return $author$project$Printer$Exp$printBranch(b1) + ('|' + (spc + $author$project$Printer$Exp$printBranch(b2)));
			} else {
				break _v2$2;
			}
		}
	}
	return 'Error 25';
};
var $author$project$Printer$Exp$printList = function (ls) {
	switch (ls.$) {
		case 'EEmpList':
			return '';
		case 'EList':
			if (ls.a.b && (!ls.a.b.b)) {
				var _v1 = ls.a;
				var spc = _v1.a;
				var e1 = ls.b;
				var e2 = ls.c;
				return ',' + (spc + ($author$project$Printer$Exp$print(e1) + $author$project$Printer$Exp$printList(e2)));
			} else {
				var e1 = ls.b;
				var e2 = ls.c;
				return ', ' + ($author$project$Printer$Exp$print(e1) + $author$project$Printer$Exp$printList(e2));
			}
		default:
			return 'Error 26';
	}
};
var $elm$core$String$reverse = _String_reverse;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Language$Fusion$getLastSpaces = function (exp) {
	var isSpace = function (c) {
		return (_Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')))) ? true : false;
	};
	var helper = F2(
		function (chars, acc) {
			helper:
			while (true) {
				if (!chars.b) {
					return acc;
				} else {
					var x = chars.a;
					var xs = chars.b;
					if (isSpace(x)) {
						var $temp$chars = xs,
							$temp$acc = A2($elm$core$String$cons, x, acc);
						chars = $temp$chars;
						acc = $temp$acc;
						continue helper;
					} else {
						return acc;
					}
				}
			}
		});
	return A2(
		helper,
		$elm$core$String$toList(
			$elm$core$String$reverse(
				$author$project$Printer$Exp$print(exp))),
		'');
};
var $author$project$Language$Syntax$Div = {$: 'Div'};
var $author$project$Language$Syntax$Eq = {$: 'Eq'};
var $author$project$Language$Syntax$Le = {$: 'Le'};
var $author$project$Language$Syntax$Lt = {$: 'Lt'};
var $author$project$Language$UtilsFD$param2EList = function (param) {
	switch (param.$) {
		case 'ANil':
			return $author$project$Language$Syntax$EEmpList(_List_Nil);
		case 'ACons':
			var a1 = param.a;
			var a2 = param.b;
			return A3(
				$author$project$Language$Syntax$EList,
				_List_fromArray(
					[' ', '']),
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2EList(a2));
		default:
			return $author$project$Language$Syntax$EError('Error 06');
	}
};
var $author$project$Language$UtilsFD$param2Exp = function (param) {
	switch (param.$) {
		case 'ANil':
			return $author$project$Language$Syntax$ENil(
				_List_fromArray(
					['']));
		case 'ATrue':
			return $author$project$Language$Syntax$ETrue(
				_List_fromArray(
					['']));
		case 'AFalse':
			return $author$project$Language$Syntax$EFalse(
				_List_fromArray(
					['']));
		case 'AVar':
			var s = param.a;
			return A2(
				$author$project$Language$Syntax$EVar,
				_List_fromArray(
					['']),
				s);
		case 'AFloat':
			var f = param.a;
			return A2(
				$author$project$Language$Syntax$EFloat,
				_List_fromArray(
					['']),
				f);
		case 'AAdd':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Add,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ASub':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Sub,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'AMul':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Mul,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ADiv':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Div,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ALt':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Lt,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ALe':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Le,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'AEq':
			var a1 = param.a;
			var a2 = param.b;
			return A4(
				$author$project$Language$Syntax$EBPrim,
				_List_fromArray(
					['']),
				$author$project$Language$Syntax$Eq,
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ACons':
			var a1 = param.a;
			var a2 = param.b;
			return A3(
				$author$project$Language$Syntax$ECons,
				_List_fromArray(
					['']),
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'ATuple':
			var a1 = param.a;
			var a2 = param.b;
			return A3(
				$author$project$Language$Syntax$ETuple,
				_List_fromArray(
					['', '', '']),
				$author$project$Language$UtilsFD$param2Exp(a1),
				$author$project$Language$UtilsFD$param2Exp(a2));
		case 'AGraphic':
			var s = param.a;
			var a = param.b;
			return A3(
				$author$project$Language$Syntax$EGraphic,
				_List_fromArray(
					[' ']),
				s,
				$author$project$Language$UtilsFD$param2EList(a));
		case 'AParens':
			var a = param.a;
			return A2(
				$author$project$Language$Syntax$EParens,
				_List_fromArray(
					['', '']),
				$author$project$Language$UtilsFD$param2Exp(a));
		default:
			var info = param.a;
			return $author$project$Language$Syntax$EError(info);
	}
};
var $author$project$Language$Fusion$fuse_ = F2(
	function (delta, exp) {
		_v1$15:
		while (true) {
			switch (delta.$) {
				case 'DId':
					return exp;
				case 'DAbst':
					var p = delta.a;
					return $author$project$Language$UtilsFD$param2Exp(p);
				case 'DRewr':
					var p = delta.a;
					return $author$project$Language$UtilsFD$param2Exp(p);
				case 'DCtt':
					var p = delta.a;
					var d = delta.b;
					if (p.$ === 'PVar') {
						var _var = p.b;
						var _v3 = A3(
							$author$project$Language$Fusion$getCttParamPath,
							d,
							$author$project$Language$Syntax$AVar(_var),
							_List_Nil);
						if (_v3.$ === 'Just') {
							var path = _v3.a;
							var getCttParam = A3(
								$author$project$Language$Syntax$ELam,
								_List_fromArray(
									['', '']),
								A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										['']),
									'obj'),
								$author$project$Language$Fusion$genFunByPath(path));
							var cttFun = A3(
								$author$project$Language$Syntax$ELam,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										['']),
									'obj'),
								A3(
									$author$project$Language$Syntax$EApp,
									_List_Nil,
									A3(
										$author$project$Language$Syntax$EApp,
										_List_Nil,
										A2(
											$author$project$Language$Syntax$EVar,
											_List_fromArray(
												[' ']),
											'setCttFun'),
										A2(
											$author$project$Language$Fusion$pars,
											' ',
											A3(
												$author$project$Language$Syntax$EApp,
												_List_Nil,
												A2(
													$author$project$Language$Syntax$EVar,
													_List_fromArray(
														[' ']),
													'getCttParam'),
												A2(
													$author$project$Language$Syntax$EVar,
													_List_fromArray(
														['']),
													'obj')))),
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											['']),
										'obj')));
							var body = A2(
								$author$project$Language$Fusion$fuse_,
								d,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										['']),
									'obj'));
							var setCttFun = A3(
								$author$project$Language$Syntax$ELam,
								_List_fromArray(
									['', '']),
								p,
								A3(
									$author$project$Language$Syntax$ELam,
									_List_fromArray(
										['', '']),
									A2(
										$author$project$Language$Syntax$PVar,
										_List_fromArray(
											['']),
										'obj'),
									body));
							return A3(
								$author$project$Language$Syntax$EApp,
								_List_fromArray(
									['LET', ' ', ' ', '\n']),
								A3(
									$author$project$Language$Syntax$ELam,
									_List_Nil,
									A2(
										$author$project$Language$Syntax$PVar,
										_List_fromArray(
											['']),
										'getCttParam'),
									A3(
										$author$project$Language$Syntax$EApp,
										_List_fromArray(
											['LET', ' ', ' ', '\n']),
										A3(
											$author$project$Language$Syntax$ELam,
											_List_Nil,
											A2(
												$author$project$Language$Syntax$PVar,
												_List_fromArray(
													['']),
												'setCttFun'),
											A3(
												$author$project$Language$Syntax$EApp,
												_List_fromArray(
													['LET', ' ', ' ', '\n']),
												cttFun,
												A2($author$project$Language$Fusion$pars, ' ', exp))),
										A2($author$project$Language$Fusion$setLastSpaces, ' ', setCttFun))),
								A2($author$project$Language$Fusion$setLastSpaces, ' ', getCttParam));
						} else {
							return $author$project$Language$Syntax$EError('Error 57');
						}
					} else {
						return $author$project$Language$Syntax$EError('Error 58');
					}
				case 'DAdd':
					var p = delta.a;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					return A2(
						$author$project$Language$Fusion$pars,
						spc,
						A4(
							$author$project$Language$Syntax$EBPrim,
							_List_fromArray(
								['']),
							$author$project$Language$Syntax$Add,
							A2(
								$author$project$Language$Fusion$setLastSpaces,
								'',
								A2($author$project$Language$Fusion$pars, '', exp)),
							$author$project$Language$UtilsFD$param2Exp(p)));
				case 'DMul':
					var p = delta.a;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					return A2(
						$author$project$Language$Fusion$pars,
						spc,
						A4(
							$author$project$Language$Syntax$EBPrim,
							_List_fromArray(
								['']),
							$author$project$Language$Syntax$Mul,
							A2($author$project$Language$Fusion$pars, '', exp),
							$author$project$Language$UtilsFD$param2Exp(p)));
				case 'DMap':
					var d = delta.a;
					if (A2($author$project$Language$UtilsFD$eqDelta, d, $author$project$Language$Syntax$DId)) {
						return exp;
					} else {
						var spc = $author$project$Language$Fusion$getLastSpaces(exp);
						var funBody = A2(
							$author$project$Language$Fusion$fuse_,
							d,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									['']),
								'params'));
						return A3(
							$author$project$Language$Syntax$EMap,
							_List_fromArray(
								[' ']),
							A2(
								$author$project$Language$Fusion$pars,
								' ',
								A3(
									$author$project$Language$Syntax$ELam,
									_List_fromArray(
										['', '']),
									A2(
										$author$project$Language$Syntax$PVar,
										_List_fromArray(
											['']),
										'params'),
									funBody)),
							A2($author$project$Language$Fusion$pars, spc, exp));
					}
				case 'DCopy':
					var n = delta.a;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					return A3(
						$author$project$Language$Syntax$EApp,
						_List_Nil,
						A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									[' ']),
								'cp'),
							A2(
								$author$project$Language$Syntax$EFloat,
								_List_fromArray(
									[' ']),
								n)),
						A2($author$project$Language$Fusion$pars, spc, exp));
				case 'DDelete':
					var n = delta.a;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					return A3(
						$author$project$Language$Syntax$EApp,
						_List_Nil,
						A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									[' ']),
								'del'),
							A2(
								$author$project$Language$Syntax$EFloat,
								_List_fromArray(
									[' ']),
								n)),
						A2($author$project$Language$Fusion$pars, spc, exp));
				case 'DModify':
					var n = delta.a;
					var d = delta.b;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					if (A2($author$project$Language$UtilsFD$eqDelta, d, $author$project$Language$Syntax$DId)) {
						return exp;
					} else {
						var funBody = A2(
							$author$project$Language$Fusion$fuse_,
							d,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									['']),
								'x'));
						return A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A3(
									$author$project$Language$Syntax$EApp,
									_List_Nil,
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											[' ']),
										'mod'),
									A2(
										$author$project$Language$Syntax$EFloat,
										_List_fromArray(
											[' ']),
										n)),
								A2(
									$author$project$Language$Fusion$pars,
									' ',
									A3(
										$author$project$Language$Syntax$ELam,
										_List_fromArray(
											['', '']),
										A2(
											$author$project$Language$Syntax$PVar,
											_List_fromArray(
												['']),
											'x'),
										funBody))),
							A2($author$project$Language$Fusion$pars, spc, exp));
					}
				case 'DInsert':
					var n = delta.a;
					var p = delta.b;
					var spc = $author$project$Language$Fusion$getLastSpaces(exp);
					return A3(
						$author$project$Language$Syntax$EApp,
						_List_Nil,
						A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'ins'),
								A2(
									$author$project$Language$Syntax$EFloat,
									_List_fromArray(
										[' ']),
									n)),
							A2(
								$author$project$Language$Fusion$setLastSpaces,
								' ',
								$author$project$Language$UtilsFD$param2Exp(p))),
						A2($author$project$Language$Fusion$pars, spc, exp));
				case 'DCons':
					var d1 = delta.a;
					var d2 = delta.b;
					if (A2($author$project$Language$UtilsFD$eqDelta, delta, $author$project$Language$Syntax$DId)) {
						return exp;
					} else {
						switch (exp.$) {
							case 'ECons':
								var ws = exp.a;
								var e1 = exp.b;
								var e2 = exp.c;
								var e2_ = A2($author$project$Language$Fusion$fuse_, d2, e2);
								var e1_ = A2($author$project$Language$Fusion$fuse_, d1, e1);
								return A3($author$project$Language$Syntax$ECons, ws, e1_, e2_);
							case 'EList':
								var ws = exp.a;
								var e1 = exp.b;
								var e2 = exp.c;
								var e2_ = A2($author$project$Language$Fusion$fuse_, d2, e2);
								var e1_ = A2($author$project$Language$Fusion$fuse_, d1, e1);
								return A3($author$project$Language$Syntax$EList, ws, e1_, e2_);
							default:
								var deltas = A2(
									$elm$core$List$cons,
									d1,
									$author$project$Language$Fusion$expandDCons(d2));
								var varNum = $elm$core$List$length(deltas);
								var par = $author$project$Language$Fusion$genNPCons(varNum - 1);
								var body = A2($author$project$Language$Fusion$genNFusedECons, delta, varNum - 1);
								var fun = A3(
									$author$project$Language$Syntax$ELam,
									_List_fromArray(
										['', '']),
									par,
									body);
								return A3(
									$author$project$Language$Syntax$EApp,
									_List_Nil,
									A2($author$project$Language$Fusion$pars, ' ', fun),
									A2($author$project$Language$Fusion$pars, '', exp));
						}
					}
				case 'DTuple':
					var d1 = delta.a;
					var d2 = delta.b;
					if (A2($author$project$Language$UtilsFD$eqDelta, delta, $author$project$Language$Syntax$DId)) {
						return exp;
					} else {
						if (exp.$ === 'ETuple') {
							var ws = exp.a;
							var e1 = exp.b;
							var e2 = exp.c;
							var e2_ = A2($author$project$Language$Fusion$fuse_, d2, e2);
							var e1_ = A2($author$project$Language$Fusion$fuse_, d1, e1);
							return A3($author$project$Language$Syntax$ETuple, ws, e1_, e2_);
						} else {
							var e2_ = A2(
								$author$project$Language$Fusion$fuse_,
								d2,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										['']),
									'y'));
							var e1_ = A2(
								$author$project$Language$Fusion$fuse_,
								d1,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										['']),
									'x'));
							var fun = A2(
								$author$project$Language$Fusion$pars,
								' ',
								A3(
									$author$project$Language$Syntax$ELam,
									_List_fromArray(
										['', '']),
									A3(
										$author$project$Language$Syntax$PTuple,
										_List_fromArray(
											['', '', '']),
										A2(
											$author$project$Language$Syntax$PVar,
											_List_fromArray(
												['']),
											'x'),
										A2(
											$author$project$Language$Syntax$PVar,
											_List_fromArray(
												['']),
											'y')),
									A3(
										$author$project$Language$Syntax$ETuple,
										_List_fromArray(
											['', '', '']),
										e1_,
										e2_)));
							return A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								fun,
								A2($author$project$Language$Fusion$pars, '', exp));
						}
					}
				case 'DGen':
					if (delta.b.$ === 'DFun') {
						var e = delta.a;
						var _v6 = delta.b;
						var p = _v6.a;
						var d = _v6.b;
						var prm = delta.c;
						var fusedExp = A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A3(
									$author$project$Language$Syntax$EApp,
									_List_Nil,
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											[' ']),
										'rec'),
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											[' ']),
										'expand')),
								A2(
									$author$project$Language$Fusion$setLastSpaces,
									' ',
									$author$project$Language$UtilsFD$param2Exp(prm))),
							A2($author$project$Language$Fusion$pars, ' ', exp));
						var editBody = A2(
							$author$project$Language$Fusion$fuse_,
							d,
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									['']),
								'graphic'));
						var editF = A3(
							$author$project$Language$Syntax$ELam,
							_List_fromArray(
								['', '']),
							A2(
								$author$project$Language$Syntax$PVar,
								_List_fromArray(
									['']),
								'graphic'),
							A3(
								$author$project$Language$Syntax$ELam,
								_List_fromArray(
									['', '']),
								p,
								editBody));
						var e2 = A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A3(
									$author$project$Language$Syntax$EApp,
									_List_Nil,
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											[' ']),
										'rec'),
									A2(
										$author$project$Language$Syntax$EVar,
										_List_fromArray(
											[' ']),
										'next')),
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'nextSeed')),
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									['\n    ']),
								'xs'));
						var e1 = A3(
							$author$project$Language$Syntax$EApp,
							_List_Nil,
							A3(
								$author$project$Language$Syntax$EApp,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'editF'),
								A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[' ']),
									'x')),
							A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									[' ']),
								'a'));
						var rec_fun = A3(
							$author$project$Language$Syntax$ELam,
							_List_fromArray(
								['', '']),
							A2(
								$author$project$Language$Syntax$PVar,
								_List_fromArray(
									['']),
								'next'),
							A3(
								$author$project$Language$Syntax$ELam,
								_List_fromArray(
									['', '']),
								A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										['']),
									'seed'),
								A3(
									$author$project$Language$Syntax$ELam,
									_List_fromArray(
										['', '\n    ']),
									A2(
										$author$project$Language$Syntax$PVar,
										_List_fromArray(
											['']),
										'ls'),
									A3(
										$author$project$Language$Syntax$ECase,
										_List_fromArray(
											[' ', '\n    ']),
										A2(
											$author$project$Language$Syntax$EVar,
											_List_fromArray(
												[' ']),
											'ls'),
										A3(
											$author$project$Language$Syntax$BCom,
											_List_fromArray(
												[' ']),
											A3(
												$author$project$Language$Syntax$BSin,
												_List_fromArray(
													[' ']),
												$author$project$Language$Syntax$PEmpList(
													_List_fromArray(
														['', ' '])),
												$author$project$Language$Syntax$EEmpList(
													_List_fromArray(
														['', '\n    ']))),
											A3(
												$author$project$Language$Syntax$BSin,
												_List_fromArray(
													['\n        ']),
												A3(
													$author$project$Language$Syntax$PCons,
													_List_fromArray(
														['']),
													A2(
														$author$project$Language$Syntax$PVar,
														_List_fromArray(
															['']),
														'x'),
													A2(
														$author$project$Language$Syntax$PVar,
														_List_fromArray(
															[' ']),
														'xs')),
												A3(
													$author$project$Language$Syntax$ECase,
													_List_fromArray(
														[' ', '\n        ']),
													A3(
														$author$project$Language$Syntax$EApp,
														_List_Nil,
														A2(
															$author$project$Language$Syntax$EVar,
															_List_fromArray(
																[' ']),
															'next'),
														A2(
															$author$project$Language$Syntax$EVar,
															_List_fromArray(
																[' ']),
															'seed')),
													A3(
														$author$project$Language$Syntax$BSin,
														_List_fromArray(
															[' ']),
														A3(
															$author$project$Language$Syntax$PTuple,
															_List_fromArray(
																['', ' ', ' ']),
															A2(
																$author$project$Language$Syntax$PVar,
																_List_fromArray(
																	['']),
																'a'),
															A2(
																$author$project$Language$Syntax$PVar,
																_List_fromArray(
																	['']),
																'nextSeed')),
														A3(
															$author$project$Language$Syntax$ECons,
															_List_fromArray(
																[' ']),
															e1,
															e2)))))))));
						var recEdit = A3(
							$author$project$Language$Syntax$EApp,
							_List_fromArray(
								['LETREC', ' ', ' ', '\n']),
							A3(
								$author$project$Language$Syntax$ELam,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										[' ']),
									'rec'),
								fusedExp),
							A2(
								$author$project$Language$Syntax$EFix,
								_List_Nil,
								A3(
									$author$project$Language$Syntax$ELam,
									_List_Nil,
									A2(
										$author$project$Language$Syntax$PVar,
										_List_fromArray(
											[' ']),
										'rec'),
									rec_fun)));
						return A3(
							$author$project$Language$Syntax$EApp,
							_List_fromArray(
								['LET', ' ', ' ', '\n']),
							A3(
								$author$project$Language$Syntax$ELam,
								_List_Nil,
								A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										['']),
									'editF'),
								A3(
									$author$project$Language$Syntax$EApp,
									_List_fromArray(
										['LET', ' ', ' ', '\n']),
									A3(
										$author$project$Language$Syntax$ELam,
										_List_Nil,
										A2(
											$author$project$Language$Syntax$PVar,
											_List_fromArray(
												['']),
											'expand'),
										recEdit),
									A2($author$project$Language$Fusion$setLastSpaces, ' ', e))),
							A2($author$project$Language$Fusion$setLastSpaces, ' ', editF));
					} else {
						break _v1$15;
					}
				case 'DCom':
					var d1 = delta.a;
					var d2 = delta.b;
					var exp1 = A2($author$project$Language$Fusion$fuse_, d1, exp);
					var exp2 = A2($author$project$Language$Fusion$fuse_, d2, exp1);
					return exp2;
				default:
					break _v1$15;
			}
		}
		return $author$project$Language$Syntax$EError('Fusion Failed');
	});
var $author$project$Language$Fusion$genNFusedECons = F2(
	function (delta, n) {
		if (delta.$ === 'DCons') {
			var d1 = delta.a;
			var d2 = delta.b;
			var e2 = A2($author$project$Language$Fusion$genNFusedECons, d2, n - 1);
			var e1 = A2(
				$author$project$Language$Fusion$fuse_,
				d1,
				A2(
					$author$project$Language$Syntax$EVar,
					_List_fromArray(
						['']),
					't' + $elm$core$Debug$toString(n)));
			return A3(
				$author$project$Language$Syntax$ECons,
				_List_fromArray(
					['']),
				e1,
				e2);
		} else {
			return A2(
				$author$project$Language$Fusion$fuse_,
				delta,
				A2(
					$author$project$Language$Syntax$EVar,
					_List_fromArray(
						['']),
					't0'));
		}
	});
var $author$project$Language$Fusion$fuse = F2(
	function (delta, exp) {
		return (!A2($author$project$Language$Fusion$checkDeltaToFuse, delta, true)) ? $author$project$Language$Syntax$EError('Fusion Failed') : A2($author$project$Language$Fusion$fuse_, delta, exp);
	});
var $author$project$Language$Fusion$fuseVar = F3(
	function (delta, _var, exp) {
		switch (exp.$) {
			case 'EVar':
				var s = exp.b;
				return _Utils_eq(s, _var) ? A2($author$project$Language$Fusion$fuse, delta, exp) : exp;
			case 'ELam':
				var p = exp.b;
				var e = exp.c;
				if (!A2(
					$elm$core$List$member,
					_var,
					$author$project$Language$Utils$varsInPattern(p))) {
					var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
					return A3($author$project$Language$Syntax$ELam, _List_Nil, p, e_);
				} else {
					return exp;
				}
			case 'EApp':
				var ws = exp.a;
				var e1 = exp.b;
				var e2 = exp.c;
				var e2_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e2);
				var e1_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e1);
				return A3($author$project$Language$Syntax$EApp, ws, e1_, e2_);
			case 'ECase':
				var ws = exp.a;
				var e = exp.b;
				var bs = exp.c;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				var bs_ = A3($author$project$Language$Fusion$fuseVarBranch, delta, _var, bs);
				return A3($author$project$Language$Syntax$ECase, ws, e_, bs_);
			case 'EBPrim':
				var ws = exp.a;
				var bop = exp.b;
				var e1 = exp.c;
				var e2 = exp.d;
				var e2_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e2);
				var e1_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e1);
				return A4($author$project$Language$Syntax$EBPrim, ws, bop, e1_, e2_);
			case 'ECons':
				var ws = exp.a;
				var e1 = exp.b;
				var e2 = exp.c;
				var e2_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e2);
				var e1_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e1);
				return A3($author$project$Language$Syntax$ECons, ws, e1_, e2_);
			case 'EList':
				var ws = exp.a;
				var e1 = exp.b;
				var e2 = exp.c;
				var e2_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e2);
				var e1_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e1);
				return A3($author$project$Language$Syntax$EList, ws, e1_, e2_);
			case 'ETuple':
				var ws = exp.a;
				var e1 = exp.b;
				var e2 = exp.c;
				var e2_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e2);
				var e1_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e1);
				return A3($author$project$Language$Syntax$ETuple, ws, e1_, e2_);
			case 'EUPrim':
				var ws = exp.a;
				var uop = exp.b;
				var e = exp.c;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A3($author$project$Language$Syntax$EUPrim, ws, uop, e_);
			case 'EParens':
				var ws = exp.a;
				var e = exp.b;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A2($author$project$Language$Syntax$EParens, ws, e_);
			case 'EFix':
				var ws = exp.a;
				var e = exp.b;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A2($author$project$Language$Syntax$EFix, ws, e_);
			case 'EGraphic':
				var ws = exp.a;
				var s = exp.b;
				var e = exp.c;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A3($author$project$Language$Syntax$EGraphic, ws, s, e_);
			case 'EMap':
				var ws = exp.a;
				var f = exp.b;
				var e = exp.c;
				var f_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, f);
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A3($author$project$Language$Syntax$EMap, ws, f_, e_);
			case 'EUnwrap':
				var ws = exp.a;
				var e = exp.b;
				var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
				return A2($author$project$Language$Syntax$EUnwrap, ws, e_);
			default:
				return exp;
		}
	});
var $author$project$Language$Fusion$fuseVarBranch = F3(
	function (delta, _var, bs) {
		if (bs.$ === 'BSin') {
			var ws = bs.a;
			var p = bs.b;
			var e = bs.c;
			var e_ = A3($author$project$Language$Fusion$fuseVar, delta, _var, e);
			return A3($author$project$Language$Syntax$BSin, ws, p, e_);
		} else {
			var ws = bs.a;
			var b1 = bs.b;
			var b2 = bs.c;
			var b2_ = A3($author$project$Language$Fusion$fuseVarBranch, delta, _var, b2);
			var b1_ = A3($author$project$Language$Fusion$fuseVarBranch, delta, _var, b1);
			return A3($author$project$Language$Syntax$BCom, ws, b1_, b2_);
		}
	});
var $author$project$Language$Fusion$fuseEnv = F2(
	function (deltas, exp) {
		if (!deltas.b) {
			return exp;
		} else {
			var _v1 = deltas.a;
			var _var = _v1.a;
			var delta = _v1.b;
			var rest = deltas.b;
			if (!A2($author$project$Language$Fusion$checkDeltaToFuse, delta, true)) {
				return $author$project$Language$Syntax$EError('Fusion Failed');
			} else {
				var exp1 = A2($author$project$Language$Fusion$fuseEnv, rest, exp);
				var exp2 = A3($author$project$Language$Fusion$fuseVar, delta, _var, exp1);
				return exp2;
			}
		}
	});
var $author$project$Language$UtilsFD$mergeST = F2(
	function (st1, st2) {
		var _v0 = _Utils_Tuple2(st1, st2);
		_v0$3:
		while (true) {
			if (_v0.a.b) {
				if (_v0.b.b) {
					if (_v0.b.a.b.b.$ === 'EError') {
						var _v1 = _v0.a;
						var _v2 = _v1.a;
						var s1 = _v2.a;
						var _v3 = _v2.b;
						var env1 = _v3.a;
						var e1 = _v3.b;
						var st1_ = _v1.b;
						var _v4 = _v0.b;
						var _v5 = _v4.a;
						var _v6 = _v5.b;
						var st2_ = _v4.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								s1,
								_Utils_Tuple2(env1, e1)),
							A2($author$project$Language$UtilsFD$mergeST, st1_, st2_));
					} else {
						if (_v0.a.a.b.b.$ === 'EError') {
							var _v7 = _v0.a;
							var _v8 = _v7.a;
							var s1 = _v8.a;
							var _v9 = _v8.b;
							var env1 = _v9.a;
							var st1_ = _v7.b;
							var _v10 = _v0.b;
							var _v11 = _v10.a;
							var _v12 = _v11.b;
							var e2 = _v12.b;
							var st2_ = _v10.b;
							return A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(env1, e2)),
								A2($author$project$Language$UtilsFD$mergeST, st1_, st2_));
						} else {
							break _v0$3;
						}
					}
				} else {
					break _v0$3;
				}
			} else {
				if (!_v0.b.b) {
					return _List_Nil;
				} else {
					break _v0$3;
				}
			}
		}
		return _List_Nil;
	});
var $author$project$Language$Utils$substDelta = F2(
	function (p, env) {
		switch (p.$) {
			case 'PVar':
				var s = p.b;
				var _v1 = A2($author$project$Utils$lookup, s, env);
				if (_v1.$ === 'Nothing') {
					return $author$project$Language$Syntax$DError('substDelta: not found');
				} else {
					var _v2 = _v1.a;
					var d = _v2.b;
					return d;
				}
			case 'PCons':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$Language$Syntax$DCons,
					A2($author$project$Language$Utils$substDelta, p1, env),
					A2($author$project$Language$Utils$substDelta, p2, env));
			case 'PList':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$Language$Syntax$DCons,
					A2($author$project$Language$Utils$substDelta, p1, env),
					A2($author$project$Language$Utils$substDelta, p2, env));
			case 'PTuple':
				var p1 = p.b;
				var p2 = p.c;
				return A2(
					$author$project$Language$Syntax$DTuple,
					A2($author$project$Language$Utils$substDelta, p1, env),
					A2($author$project$Language$Utils$substDelta, p2, env));
			default:
				return $author$project$Language$Syntax$DId;
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Language$Utils$two_wayMerge = F4(
	function (fv1, fv2, env1, env2) {
		var _v0 = _Utils_Tuple2(env1, env2);
		_v0$2:
		while (true) {
			if (_v0.a.b) {
				if (_v0.b.b) {
					var _v1 = _v0.a;
					var _v2 = _v1.a;
					var s1 = _v2.a;
					var _v3 = _v2.b;
					var v1 = _v3.a;
					var d1 = _v3.b;
					var env1_ = _v1.b;
					var _v4 = _v0.b;
					var _v5 = _v4.a;
					var s2 = _v5.a;
					var _v6 = _v5.b;
					var d2 = _v6.b;
					var env2_ = _v4.b;
					if (_Utils_eq(s1, s2)) {
						var _v7 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1_, env2_);
						var env = _v7.a;
						var denv1 = _v7.b;
						var denv2 = _v7.c;
						return A2($elm$core$String$startsWith, '*', s1) ? ((!A2($author$project$Language$UtilsFD$eqDelta, d1, $author$project$Language$Syntax$DId)) ? _Utils_Tuple3(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(v1, d1)),
								env),
							denv1,
							denv2) : _Utils_Tuple3(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(v1, d2)),
								env),
							denv1,
							denv2)) : ((A2($author$project$Language$UtilsFD$eqDelta, d1, d2) || (!A2($elm$core$List$member, s1, fv2))) ? _Utils_Tuple3(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(v1, d1)),
								env),
							denv1,
							denv2) : ((!A2($elm$core$List$member, s1, fv1)) ? _Utils_Tuple3(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(v1, d2)),
								env),
							denv1,
							denv2) : _Utils_Tuple3(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									s1,
									_Utils_Tuple2(v1, $author$project$Language$Syntax$DId)),
								env),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(s1, d1),
								denv1),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(s2, d2),
								denv2))));
					} else {
						return _Utils_Tuple3(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'Two-way Merge Error',
									_Utils_Tuple2(
										$author$project$Language$Syntax$VError(''),
										$author$project$Language$Syntax$DError('')))
								]),
							_List_Nil,
							_List_Nil);
					}
				} else {
					break _v0$2;
				}
			} else {
				if (!_v0.b.b) {
					return _Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil);
				} else {
					break _v0$2;
				}
			}
		}
		return _Utils_Tuple3(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Two-way Merge Error',
					_Utils_Tuple2(
						$author$project$Language$Syntax$VError(''),
						$author$project$Language$Syntax$DError('')))
				]),
			_List_Nil,
			_List_Nil);
	});
var $author$project$Language$Utils$updateBranch = F4(
	function (b, cnt, choice, new_ei) {
		if (b.$ === 'BSin') {
			var ws = b.a;
			var p = b.b;
			var e = b.c;
			return _Utils_eq(cnt + 1, choice) ? _Utils_Tuple2(
				A3($author$project$Language$Syntax$BSin, ws, p, new_ei),
				cnt + 1) : _Utils_Tuple2(
				A3($author$project$Language$Syntax$BSin, ws, p, e),
				cnt + 1);
		} else {
			var ws = b.a;
			var b1 = b.b;
			var b2 = b.c;
			var _v1 = A4($author$project$Language$Utils$updateBranch, b1, cnt, choice, new_ei);
			var new_b1 = _v1.a;
			var cnt1 = _v1.b;
			var _v2 = A4($author$project$Language$Utils$updateBranch, b2, cnt1, choice, new_ei);
			var new_b2 = _v2.a;
			var cnt2 = _v2.b;
			return _Utils_Tuple2(
				A3($author$project$Language$Syntax$BCom, ws, new_b1, new_b2),
				cnt2);
		}
	});
var $author$project$Language$Utils$updateDelta = F3(
	function (env, s, d) {
		if (!env.b) {
			return _List_Nil;
		} else {
			var _v1 = env.a;
			var s1 = _v1.a;
			var _v2 = _v1.b;
			var v1 = _v2.a;
			var d1 = _v2.b;
			var env1 = env.b;
			return _Utils_eq(s, s1) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					s1,
					_Utils_Tuple2(v1, d)),
				env1) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					s1,
					_Utils_Tuple2(v1, d1)),
				A3($author$project$Language$Utils$updateDelta, env1, s, d));
		}
	});
var $author$project$Language$UtilsFD$updateST = F3(
	function (st, s, e) {
		if (!st.b) {
			return _List_Nil;
		} else {
			var _v1 = st.a;
			var s1 = _v1.a;
			var _v2 = _v1.b;
			var env1 = _v2.a;
			var e1 = _v2.b;
			var st_ = st.b;
			return _Utils_eq(s, s1) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					s1,
					_Utils_Tuple2(env1, e)),
				st_) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					s1,
					_Utils_Tuple2(env1, e1)),
				A3($author$project$Language$UtilsFD$updateST, st_, s, e));
		}
	});
var $author$project$Language$Syntax$ANil = {$: 'ANil'};
var $author$project$Language$UtilsFD$value2Param = function (value) {
	switch (value.$) {
		case 'VNil':
			return $author$project$Language$Syntax$ANil;
		case 'VFloat':
			var f = value.a;
			return $author$project$Language$Syntax$AFloat(f);
		case 'VCons':
			var v1 = value.a;
			var v2 = value.b;
			return A2(
				$author$project$Language$Syntax$ACons,
				$author$project$Language$UtilsFD$value2Param(v1),
				$author$project$Language$UtilsFD$value2Param(v2));
		case 'VTuple':
			var v1 = value.a;
			var v2 = value.b;
			return A2(
				$author$project$Language$Syntax$ATuple,
				$author$project$Language$UtilsFD$value2Param(v1),
				$author$project$Language$UtilsFD$value2Param(v2));
		case 'VError':
			var info = value.a;
			return $author$project$Language$Syntax$AError(info);
		default:
			return $author$project$Language$Syntax$AError('Error in value2Param');
	}
};
var $author$project$Language$BEval$beval = F4(
	function (env, exp, delta, st) {
		var _v0 = _Utils_Tuple2(exp, delta);
		_v0$2:
		while (true) {
			_v0$11:
			while (true) {
				_v0$13:
				while (true) {
					_v0$15:
					while (true) {
						_v0$31:
						while (true) {
							_v0$39:
							while (true) {
								_v0$46:
								while (true) {
									switch (_v0.b.$) {
										case 'DId':
											var _v1 = _v0.b;
											return _Utils_Tuple3(env, exp, st);
										case 'DRewr':
											var p = _v0.b.a;
											var lastSP = $author$project$Language$Fusion$getLastSpaces(exp);
											return _Utils_Tuple3(
												env,
												A2(
													$author$project$Language$Fusion$setLastSpaces,
													lastSP,
													$author$project$Language$UtilsFD$param2Exp(p)),
												st);
										case 'DAbst':
											switch (_v0.a.$) {
												case 'EVar':
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$11;
													}
												case 'EApp':
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$13;
													}
												case 'ECase':
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$15;
													}
												case 'EParens':
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$31;
													}
												case 'EUnwrap':
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$39;
													}
												default:
													if (_v0.b.a.$ === 'AVar') {
														break _v0$2;
													} else {
														break _v0$46;
													}
											}
										case 'DClosure':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'ELam':
													var _v18 = _v0.a;
													var ws = _v18.a;
													var _v19 = _v0.b;
													var env1 = _v19.a;
													var p1 = _v19.b;
													var e1 = _v19.c;
													return _Utils_Tuple3(
														env1,
														A3($author$project$Language$Syntax$ELam, ws, p1, e1),
														st);
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DFix':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'EFix':
													var _v32 = _v0.a;
													var ws1 = _v32.a;
													var _v33 = _v0.b;
													var env1 = _v33.a;
													var e1 = _v33.b;
													return _Utils_Tuple3(
														env1,
														A2($author$project$Language$Syntax$EFix, ws1, e1),
														st);
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DCons':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v41 = _v0.a;
													var ws = _v41.a;
													var e1 = _v41.b;
													var e2 = _v41.c;
													var _v42 = _v0.b;
													var d1 = _v42.a;
													var d2 = _v42.b;
													var _v43 = A4($author$project$Language$BEval$beval, env, e2, d2, st);
													var env2 = _v43.a;
													var new_e2 = _v43.b;
													var st2 = _v43.c;
													var _v44 = A4($author$project$Language$BEval$beval, env, e1, d1, st);
													var env1 = _v44.a;
													var new_e1 = _v44.b;
													var st1 = _v44.c;
													var new_ST = A2($author$project$Language$UtilsFD$mergeST, st1, st2);
													if (_Utils_eq(
														new_e1,
														$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
														new_e2,
														$author$project$Language$Syntax$EError('Fusion Failed'))) {
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Fusion$fuse, delta, exp),
															st);
													} else {
														var _v45 = A4(
															$author$project$Language$Utils$two_wayMerge,
															$author$project$Language$Utils$freeVars(e1),
															$author$project$Language$Utils$freeVars(e2),
															env1,
															env2);
														if ((!_v45.b.b) && (!_v45.c.b)) {
															var new_env = _v45.a;
															return _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$ECons, ws, new_e1, new_e2),
																new_ST);
														} else {
															var new_env = _v45.a;
															var denv1 = _v45.b;
															var denv2 = _v45.c;
															var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
															var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
															return (_Utils_eq(
																fusedE1,
																$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																fusedE2,
																$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st) : _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$ECons, ws, fusedE1, fusedE2),
																new_ST);
														}
													}
												case 'EList':
													var _v75 = _v0.a;
													var ws = _v75.a;
													var e1 = _v75.b;
													var e2 = _v75.c;
													var _v76 = _v0.b;
													var d1 = _v76.a;
													var d2 = _v76.b;
													var _v77 = A4($author$project$Language$BEval$beval, env, e2, d2, st);
													var env2 = _v77.a;
													var new_e2 = _v77.b;
													var st2 = _v77.c;
													var _v78 = A4($author$project$Language$BEval$beval, env, e1, d1, st);
													var env1 = _v78.a;
													var new_e1 = _v78.b;
													var st1 = _v78.c;
													var new_ST = A2($author$project$Language$UtilsFD$mergeST, st1, st2);
													if (_Utils_eq(
														new_e1,
														$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
														new_e2,
														$author$project$Language$Syntax$EError('Fusion Failed'))) {
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Fusion$fuse, delta, exp),
															st);
													} else {
														var _v79 = A4(
															$author$project$Language$Utils$two_wayMerge,
															$author$project$Language$Utils$freeVars(e1),
															$author$project$Language$Utils$freeVars(e2),
															env1,
															env2);
														if ((!_v79.b.b) && (!_v79.c.b)) {
															var new_env = _v79.a;
															return _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$EList, ws, new_e1, new_e2),
																new_ST);
														} else {
															var new_env = _v79.a;
															var denv1 = _v79.b;
															var denv2 = _v79.c;
															var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
															var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
															return (_Utils_eq(
																new_e1,
																$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																new_e2,
																$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st) : _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$EList, ws, fusedE1, fusedE2),
																new_ST);
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DInsert':
											switch (_v0.a.$) {
												case 'ENil':
													if (!_v0.b.a) {
														var ws = _v0.a.a;
														var _v6 = _v0.b;
														var p = _v6.b;
														return _Utils_Tuple3(
															env,
															A3(
																$author$project$Language$Syntax$ECons,
																_List_fromArray(
																	['']),
																$author$project$Language$UtilsFD$param2Exp(p),
																$author$project$Language$Syntax$ENil(ws)),
															st);
													} else {
														break _v0$46;
													}
												case 'EEmpList':
													if (!_v0.b.a) {
														var ws = _v0.a.a;
														var _v7 = _v0.b;
														var p = _v7.b;
														return _Utils_Tuple3(
															env,
															A3(
																$author$project$Language$Syntax$EList,
																ws,
																$author$project$Language$UtilsFD$param2Exp(p),
																$author$project$Language$Syntax$EEmpList(_List_Nil)),
															st);
													} else {
														break _v0$46;
													}
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v46 = _v0.a;
													var ws = _v46.a;
													var e1 = _v46.b;
													var e2 = _v46.c;
													var _v47 = _v0.b;
													var n = _v47.a;
													var p = _v47.b;
													if (!n) {
														return _Utils_Tuple3(
															env,
															A3(
																$author$project$Language$Syntax$ECons,
																ws,
																$author$project$Language$UtilsFD$param2Exp(p),
																exp),
															st);
													} else {
														var _v48 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DInsert, n - 1, p),
															st);
														var env2 = _v48.a;
														var new_e2 = _v48.b;
														var st_ = _v48.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v49 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v49.b.b) && (!_v49.c.b)) {
																var new_env = _v49.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v49.a;
																var denv2 = _v49.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EList':
													var _v80 = _v0.a;
													var ws = _v80.a;
													var e1 = _v80.b;
													var e2 = _v80.c;
													var _v81 = _v0.b;
													var n = _v81.a;
													var p = _v81.b;
													if (!n) {
														return _Utils_Tuple3(
															env,
															A3(
																$author$project$Language$Syntax$EList,
																ws,
																$author$project$Language$UtilsFD$param2Exp(p),
																exp),
															st);
													} else {
														var _v82 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DInsert, n - 1, p),
															st);
														var env2 = _v82.a;
														var new_e2 = _v82.b;
														var st_ = _v82.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v83 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v83.b.b) && (!_v83.c.b)) {
																var new_env = _v83.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v83.a;
																var denv2 = _v83.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DDelete':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v50 = _v0.a;
													var ws = _v50.a;
													var e1 = _v50.b;
													var e2 = _v50.c;
													var n = _v0.b.a;
													if (!n) {
														return _Utils_Tuple3(env, e2, st);
													} else {
														var _v51 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															$author$project$Language$Syntax$DDelete(n - 1),
															st);
														var env2 = _v51.a;
														var new_e2 = _v51.b;
														var st_ = _v51.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v52 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v52.b.b) && (!_v52.c.b)) {
																var new_env = _v52.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v52.a;
																var denv2 = _v52.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EList':
													var _v84 = _v0.a;
													var ws = _v84.a;
													var e1 = _v84.b;
													var e2 = _v84.c;
													var n = _v0.b.a;
													if (!n) {
														if (ws.b && (!ws.b.b)) {
															return _Utils_Tuple3(env, e2, st);
														} else {
															switch (e2.$) {
																case 'EList':
																	var e21 = e2.b;
																	var e22 = e2.c;
																	return _Utils_Tuple3(
																		env,
																		A3($author$project$Language$Syntax$EList, ws, e21, e22),
																		st);
																case 'EEmpList':
																	return _Utils_Tuple3(
																		env,
																		$author$project$Language$Syntax$EEmpList(
																			_List_fromArray(
																				['', ''])),
																		st);
																default:
																	return _Utils_Tuple3(
																		env,
																		$author$project$Language$Syntax$EError('Error 03'),
																		st);
															}
														}
													} else {
														var _v87 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															$author$project$Language$Syntax$DDelete(n - 1),
															st);
														var env2 = _v87.a;
														var new_e2 = _v87.b;
														var st_ = _v87.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v88 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v88.b.b) && (!_v88.c.b)) {
																var new_env = _v88.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v88.a;
																var denv2 = _v88.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DCopy':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v53 = _v0.a;
													var ws = _v53.a;
													var e1 = _v53.b;
													var e2 = _v53.c;
													var n = _v0.b.a;
													if (!n) {
														return _Utils_Tuple3(
															env,
															A3(
																$author$project$Language$Syntax$ECons,
																ws,
																e1,
																A3($author$project$Language$Syntax$ECons, ws, e1, e2)),
															st);
													} else {
														var _v54 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															$author$project$Language$Syntax$DCopy(n - 1),
															st);
														var env2 = _v54.a;
														var new_e2 = _v54.b;
														var st_ = _v54.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v55 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v55.b.b) && (!_v55.c.b)) {
																var new_env = _v55.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v55.a;
																var denv2 = _v55.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EList':
													var _v89 = _v0.a;
													var ws = _v89.a;
													var e1 = _v89.b;
													var e2 = _v89.c;
													var n = _v0.b.a;
													if (!n) {
														if (ws.b && (!ws.b.b)) {
															return _Utils_Tuple3(
																env,
																A3(
																	$author$project$Language$Syntax$EList,
																	ws,
																	e1,
																	A3($author$project$Language$Syntax$EList, ws, e1, e2)),
																st);
														} else {
															return _Utils_Tuple3(
																env,
																A3(
																	$author$project$Language$Syntax$EList,
																	ws,
																	e1,
																	A3(
																		$author$project$Language$Syntax$EList,
																		_List_fromArray(
																			[' ']),
																		e1,
																		e2)),
																st);
														}
													} else {
														var _v91 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															$author$project$Language$Syntax$DCopy(n - 1),
															st);
														var env2 = _v91.a;
														var new_e2 = _v91.b;
														var st_ = _v91.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v92 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v92.b.b) && (!_v92.c.b)) {
																var new_env = _v92.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v92.a;
																var denv2 = _v92.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DModify':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v56 = _v0.a;
													var ws = _v56.a;
													var e1 = _v56.b;
													var e2 = _v56.c;
													var _v57 = _v0.b;
													var n = _v57.a;
													var d = _v57.b;
													if (!n) {
														var _v58 = A4($author$project$Language$BEval$beval, env, e1, d, st);
														var env1 = _v58.a;
														var new_e1 = _v58.b;
														var st_ = _v58.c;
														if (_Utils_eq(
															new_e1,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v59 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env1,
																env);
															if ((!_v59.b.b) && (!_v59.c.b)) {
																var new_env = _v59.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, new_e1, e2),
																	st_);
															} else {
																var new_env = _v59.a;
																var denv1 = _v59.b;
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return _Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, fusedE1, e2),
																	st_);
															}
														}
													} else {
														var _v60 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DModify, n - 1, d),
															st);
														var env2 = _v60.a;
														var new_e2 = _v60.b;
														var st_ = _v60.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v61 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v61.b.b) && (!_v61.c.b)) {
																var new_env = _v61.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v61.a;
																var denv2 = _v61.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EList':
													var _v93 = _v0.a;
													var ws = _v93.a;
													var e1 = _v93.b;
													var e2 = _v93.c;
													var _v94 = _v0.b;
													var n = _v94.a;
													var d = _v94.b;
													if (!n) {
														var _v95 = A4($author$project$Language$BEval$beval, env, e1, d, st);
														var env1 = _v95.a;
														var new_e1 = _v95.b;
														var st_ = _v95.c;
														if (_Utils_eq(
															new_e1,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v96 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env1,
																env);
															if ((!_v96.b.b) && (!_v96.c.b)) {
																var new_env = _v96.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, new_e1, e2),
																	st_);
															} else {
																var new_env = _v96.a;
																var denv1 = _v96.b;
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return _Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, fusedE1, e2),
																	st_);
															}
														}
													} else {
														var _v97 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DModify, n - 1, d),
															st);
														var env2 = _v97.a;
														var new_e2 = _v97.b;
														var st_ = _v97.c;
														if (_Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v98 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env,
																env2);
															if ((!_v98.b.b) && (!_v98.c.b)) {
																var new_env = _v98.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, new_e2),
																	st_);
															} else {
																var new_env = _v98.a;
																var denv2 = _v98.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																return _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, e1, fusedE2),
																	st_);
															}
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DGen':
											switch (_v0.a.$) {
												case 'ENil':
													var _v8 = _v0.b;
													return _Utils_Tuple3(env, exp, st);
												case 'EEmpList':
													var _v9 = _v0.b;
													return _Utils_Tuple3(env, exp, st);
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													var _v62 = _v0.a;
													var ws = _v62.a;
													var e1 = _v62.b;
													var e2 = _v62.c;
													var _v63 = _v0.b;
													var next = _v63.a;
													var df = _v63.b;
													var p = _v63.c;
													var _v64 = A2(
														$author$project$Language$FEval$feval,
														env,
														A3(
															$author$project$Language$Syntax$EApp,
															_List_Nil,
															next,
															$author$project$Language$UtilsFD$param2Exp(p)));
													if (_v64.$ === 'VTuple') {
														var v1 = _v64.a;
														var v2 = _v64.b;
														var d2 = A3(
															$author$project$Language$Syntax$DGen,
															next,
															df,
															$author$project$Language$UtilsFD$value2Param(v2));
														var d1 = A2(
															$author$project$Language$DEval$deval,
															_List_Nil,
															A2(
																$author$project$Language$Syntax$DApp,
																df,
																$author$project$Language$UtilsFD$value2Param(v1)));
														var _v65 = A4($author$project$Language$BEval$beval, env, e2, d2, st);
														var env2 = _v65.a;
														var new_e2 = _v65.b;
														var st2 = _v65.c;
														var _v66 = A4($author$project$Language$BEval$beval, env, e1, d1, st);
														var env1 = _v66.a;
														var new_e1 = _v66.b;
														var st1 = _v66.c;
														var new_ST = A2($author$project$Language$UtilsFD$mergeST, st1, st2);
														if (_Utils_eq(
															new_e1,
															$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v67 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env1,
																env2);
															if ((!_v67.b.b) && (!_v67.c.b)) {
																var new_env = _v67.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, e1, new_e2),
																	new_ST);
															} else {
																var new_env = _v67.a;
																var denv1 = _v67.b;
																var denv2 = _v67.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return (_Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$ECons, ws, fusedE1, fusedE2),
																	new_ST);
															}
														}
													} else {
														return _Utils_Tuple3(
															_List_Nil,
															$author$project$Language$Syntax$EError('Error 32'),
															_List_Nil);
													}
												case 'EList':
													var _v99 = _v0.a;
													var ws = _v99.a;
													var e1 = _v99.b;
													var e2 = _v99.c;
													var _v100 = _v0.b;
													var next = _v100.a;
													var df = _v100.b;
													var p = _v100.c;
													var _v101 = A2(
														$author$project$Language$FEval$feval,
														env,
														A3(
															$author$project$Language$Syntax$EApp,
															_List_Nil,
															next,
															$author$project$Language$UtilsFD$param2Exp(p)));
													if (_v101.$ === 'VTuple') {
														var v1 = _v101.a;
														var v2 = _v101.b;
														var d2 = A3(
															$author$project$Language$Syntax$DGen,
															next,
															df,
															$author$project$Language$UtilsFD$value2Param(v2));
														var d1 = A2(
															$author$project$Language$DEval$deval,
															_List_Nil,
															A2(
																$author$project$Language$Syntax$DApp,
																df,
																$author$project$Language$UtilsFD$value2Param(v1)));
														var _v102 = A4($author$project$Language$BEval$beval, env, e2, d2, st);
														var env2 = _v102.a;
														var new_e2 = _v102.b;
														var st2 = _v102.c;
														var _v103 = A4($author$project$Language$BEval$beval, env, e1, d1, st);
														var env1 = _v103.a;
														var new_e1 = _v103.b;
														var st1 = _v103.c;
														var new_ST = A2($author$project$Language$UtilsFD$mergeST, st1, st2);
														if (_Utils_eq(
															new_e1,
															$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
															new_e2,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															var _v104 = A4(
																$author$project$Language$Utils$two_wayMerge,
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2),
																env1,
																env2);
															if ((!_v104.b.b) && (!_v104.c.b)) {
																var new_env = _v104.a;
																return _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, new_e1, new_e2),
																	new_ST);
															} else {
																var new_env = _v104.a;
																var denv1 = _v104.b;
																var denv2 = _v104.c;
																var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return (_Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																	fusedE2,
																	$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A3($author$project$Language$Syntax$EList, ws, fusedE1, fusedE2),
																	new_ST);
															}
														}
													} else {
														return _Utils_Tuple3(
															_List_Nil,
															$author$project$Language$Syntax$EError('Error 33'),
															_List_Nil);
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DMem':
											switch (_v0.a.$) {
												case 'ENil':
													if (_v0.b.b.$ === 'ANil') {
														var _v10 = _v0.b;
														var _v11 = _v10.b;
														return _Utils_Tuple3(env, exp, st);
													} else {
														break _v0$46;
													}
												case 'EEmpList':
													if (_v0.b.b.$ === 'ANil') {
														var _v12 = _v0.b;
														var _v13 = _v12.b;
														return _Utils_Tuple3(env, exp, st);
													} else {
														break _v0$46;
													}
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ECons':
													if (_v0.b.b.$ === 'ACons') {
														var _v68 = _v0.a;
														var ws = _v68.a;
														var e1 = _v68.b;
														var e2 = _v68.c;
														var _v69 = _v0.b;
														var s = _v69.a;
														var _v70 = _v69.b;
														var a1 = _v70.a;
														var a2 = _v70.b;
														var _v71 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DMem, s, a2),
															st);
														var env_ = _v71.a;
														var e2_ = _v71.b;
														var st_ = _v71.c;
														switch (a1.$) {
															case 'ATrue':
																var _v73 = A2($author$project$Utils$lookup, s, st_);
																if (_v73.$ === 'Just') {
																	var _v74 = _v73.a;
																	var ls = _v74.b;
																	return _Utils_Tuple3(
																		env_,
																		e2_,
																		A3(
																			$author$project$Language$UtilsFD$updateST,
																			st_,
																			s,
																			A3(
																				$author$project$Language$Syntax$EList,
																				_List_fromArray(
																					['']),
																				e1,
																				ls)));
																} else {
																	return _Utils_Tuple3(
																		_List_Nil,
																		$author$project$Language$Syntax$EError('Error 01'),
																		_List_Nil);
																}
															case 'AFalse':
																return _Utils_Tuple3(
																	env_,
																	A3($author$project$Language$Syntax$ECons, ws, e1, e2_),
																	st_);
															default:
																return _Utils_Tuple3(
																	_List_Nil,
																	$author$project$Language$Syntax$EError('Error 02'),
																	_List_Nil);
														}
													} else {
														break _v0$46;
													}
												case 'EList':
													if (_v0.b.b.$ === 'ACons') {
														var _v105 = _v0.a;
														var ws = _v105.a;
														var e1 = _v105.b;
														var e2 = _v105.c;
														var _v106 = _v0.b;
														var s = _v106.a;
														var _v107 = _v106.b;
														var a1 = _v107.a;
														var a2 = _v107.b;
														var _v108 = A4(
															$author$project$Language$BEval$beval,
															env,
															e2,
															A2($author$project$Language$Syntax$DMem, s, a2),
															st);
														var env_ = _v108.a;
														var e2_ = _v108.b;
														var st_ = _v108.c;
														switch (a1.$) {
															case 'ATrue':
																var _v110 = A2($author$project$Utils$lookup, s, st_);
																if (_v110.$ === 'Just') {
																	var _v111 = _v110.a;
																	var ls = _v111.b;
																	return _Utils_Tuple3(
																		env_,
																		e2_,
																		A3(
																			$author$project$Language$UtilsFD$updateST,
																			st_,
																			s,
																			A3(
																				$author$project$Language$Syntax$EList,
																				_List_fromArray(
																					['']),
																				e1,
																				ls)));
																} else {
																	return _Utils_Tuple3(
																		_List_Nil,
																		$author$project$Language$Syntax$EError('Error 04'),
																		_List_Nil);
																}
															case 'AFalse':
																return _Utils_Tuple3(
																	env_,
																	A3($author$project$Language$Syntax$EList, ws, e1, e2_),
																	st_);
															default:
																return _Utils_Tuple3(
																	_List_Nil,
																	$author$project$Language$Syntax$EError('Error 34'),
																	_List_Nil);
														}
													} else {
														break _v0$46;
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DTuple':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'ETuple':
													var _v112 = _v0.a;
													var ws = _v112.a;
													var e1 = _v112.b;
													var e2 = _v112.c;
													var _v113 = _v0.b;
													var d1 = _v113.a;
													var d2 = _v113.b;
													var _v114 = A4($author$project$Language$BEval$beval, env, e2, d2, st);
													var env2 = _v114.a;
													var new_e2 = _v114.b;
													var st2 = _v114.c;
													var _v115 = A4($author$project$Language$BEval$beval, env, e1, d1, st);
													var env1 = _v115.a;
													var new_e1 = _v115.b;
													var st1 = _v115.c;
													var new_ST = A2($author$project$Language$UtilsFD$mergeST, st1, st2);
													if (_Utils_eq(
														new_e1,
														$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
														new_e2,
														$author$project$Language$Syntax$EError('Fusion Failed'))) {
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Fusion$fuse, delta, exp),
															st);
													} else {
														var _v116 = A4(
															$author$project$Language$Utils$two_wayMerge,
															$author$project$Language$Utils$freeVars(e1),
															$author$project$Language$Utils$freeVars(e2),
															env1,
															env2);
														if ((!_v116.b.b) && (!_v116.c.b)) {
															var new_env = _v116.a;
															return _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$ETuple, ws, new_e1, new_e2),
																new_ST);
														} else {
															var new_env = _v116.a;
															var denv1 = _v116.b;
															var denv2 = _v116.c;
															var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
															var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
															return (_Utils_eq(
																fusedE1,
																$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																fusedE2,
																$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st) : _Utils_Tuple3(
																new_env,
																A3($author$project$Language$Syntax$ETuple, ws, fusedE1, fusedE2),
																new_ST);
														}
													}
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DAdd':
											switch (_v0.a.$) {
												case 'EFloat':
													if (_v0.b.a.$ === 'AFloat') {
														var _v4 = _v0.a;
														var ws = _v4.a;
														var f = _v4.b;
														var f1 = _v0.b.a.a;
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Syntax$EFloat, ws, f + f1),
															st);
													} else {
														break _v0$46;
													}
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EBPrim':
													switch (_v0.a.b.$) {
														case 'Add':
															var _v119 = _v0.a;
															var ws = _v119.a;
															var _v120 = _v119.b;
															var e1 = _v119.c;
															var e2 = _v119.d;
															var _v121 = A4($author$project$Language$BEval$beval, env, e1, delta, _List_Nil);
															var env1 = _v121.a;
															var new_e1 = _v121.b;
															var _v122 = _Utils_Tuple2(
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2));
															var fv1 = _v122.a;
															var fv2 = _v122.b;
															var _v123 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env);
															if ((!_v123.b.b) && (!_v123.c.b)) {
																var new_env = _v123.a;
																return _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Add, new_e1, e2),
																	st);
															} else {
																var new_env = _v123.a;
																var denv1 = _v123.b;
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return _Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Add, fusedE1, e2),
																	st);
															}
														case 'Sub':
															var _v124 = _v0.a;
															var ws = _v124.a;
															var _v125 = _v124.b;
															var e1 = _v124.c;
															var e2 = _v124.d;
															var _v126 = A4($author$project$Language$BEval$beval, env, e1, delta, _List_Nil);
															var env1 = _v126.a;
															var new_e1 = _v126.b;
															var _v127 = _Utils_Tuple2(
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2));
															var fv1 = _v127.a;
															var fv2 = _v127.b;
															var _v128 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env);
															if ((!_v128.b.b) && (!_v128.c.b)) {
																var new_env = _v128.a;
																return _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Sub, new_e1, e2),
																	st);
															} else {
																var new_env = _v128.a;
																var denv1 = _v128.b;
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return _Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Sub, fusedE1, e2),
																	st);
															}
														case 'Mul':
															if (_v0.b.a.$ === 'AFloat') {
																var _v129 = _v0.a;
																var ws = _v129.a;
																var _v130 = _v129.b;
																var e1 = _v129.c;
																var e2 = _v129.d;
																var f = _v0.b.a.a;
																var _v131 = A2($author$project$Language$FEval$feval, env, e2);
																if (_v131.$ === 'VFloat') {
																	var f2 = _v131.a;
																	var _v132 = A4(
																		$author$project$Language$BEval$beval,
																		env,
																		e1,
																		$author$project$Language$Syntax$DAdd(
																			$author$project$Language$Syntax$AFloat(f / f2)),
																		_List_Nil);
																	var env1 = _v132.a;
																	var new_e1 = _v132.b;
																	var _v133 = _Utils_Tuple2(
																		$author$project$Language$Utils$freeVars(e1),
																		$author$project$Language$Utils$freeVars(e2));
																	var fv1 = _v133.a;
																	var fv2 = _v133.b;
																	var _v134 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env);
																	if ((!_v134.b.b) && (!_v134.c.b)) {
																		var new_env = _v134.a;
																		return _Utils_Tuple3(
																			new_env,
																			A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Mul, new_e1, e2),
																			st);
																	} else {
																		var new_env = _v134.a;
																		var denv1 = _v134.b;
																		var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																		return _Utils_eq(
																			fusedE1,
																			$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																			env,
																			A2($author$project$Language$Fusion$fuse, delta, exp),
																			st) : _Utils_Tuple3(
																			new_env,
																			A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Mul, fusedE1, e2),
																			st);
																	}
																} else {
																	return _Utils_Tuple3(
																		_List_Nil,
																		$author$project$Language$Syntax$EError('Error 35'),
																		_List_Nil);
																}
															} else {
																break _v0$46;
															}
														default:
															break _v0$46;
													}
												case 'EUPrim':
													if ((_v0.a.b.$ === 'Neg') && (_v0.b.a.$ === 'AFloat')) {
														var _v146 = _v0.a;
														var ws = _v146.a;
														var _v147 = _v146.b;
														var e1 = _v146.c;
														var f = _v0.b.a.a;
														var _v148 = A4(
															$author$project$Language$BEval$beval,
															env,
															e1,
															$author$project$Language$Syntax$DAdd(
																$author$project$Language$Syntax$AFloat(-f)),
															_List_Nil);
														var env1 = _v148.a;
														var new_e1 = _v148.b;
														return _Utils_Tuple3(
															env1,
															A3($author$project$Language$Syntax$EUPrim, ws, $author$project$Language$Syntax$Neg, new_e1),
															st);
													} else {
														break _v0$46;
													}
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DMul':
											switch (_v0.a.$) {
												case 'EFloat':
													if (_v0.b.a.$ === 'AFloat') {
														var _v5 = _v0.a;
														var ws = _v5.a;
														var f = _v5.b;
														var f1 = _v0.b.a.a;
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Syntax$EFloat, ws, f * f1),
															st);
													} else {
														break _v0$46;
													}
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EBPrim':
													switch (_v0.a.b.$) {
														case 'Add':
															if (_v0.b.a.$ === 'AFloat') {
																var _v135 = _v0.a;
																var ws = _v135.a;
																var _v136 = _v135.b;
																var e1 = _v135.c;
																var e2 = _v135.d;
																var f = _v0.b.a.a;
																var _v137 = _Utils_Tuple3(
																	A2($author$project$Language$FEval$feval, env, exp),
																	A2($author$project$Language$FEval$feval, env, e1),
																	A2($author$project$Language$FEval$feval, env, e2));
																if (((_v137.a.$ === 'VFloat') && (_v137.b.$ === 'VFloat')) && (_v137.c.$ === 'VFloat')) {
																	var sum = _v137.a.a;
																	var f1 = _v137.b.a;
																	var f2 = _v137.c.a;
																	var delta1 = $author$project$Language$Syntax$DMul(
																		$author$project$Language$Syntax$AFloat(((f * sum) - f2) / f1));
																	var _v138 = A4($author$project$Language$BEval$beval, env, e1, delta1, _List_Nil);
																	var env1 = _v138.a;
																	var new_e1 = _v138.b;
																	var _v139 = _Utils_Tuple2(
																		$author$project$Language$Utils$freeVars(e1),
																		$author$project$Language$Utils$freeVars(e2));
																	var fv1 = _v139.a;
																	var fv2 = _v139.b;
																	var _v140 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env);
																	if ((!_v140.b.b) && (!_v140.c.b)) {
																		var new_env = _v140.a;
																		return _Utils_Tuple3(
																			new_env,
																			A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Add, new_e1, e2),
																			st);
																	} else {
																		var new_env = _v140.a;
																		var denv1 = _v140.b;
																		var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																		return _Utils_eq(
																			fusedE1,
																			$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																			env,
																			A2($author$project$Language$Fusion$fuse, delta, exp),
																			st) : _Utils_Tuple3(
																			new_env,
																			A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Add, fusedE1, e2),
																			st);
																	}
																} else {
																	return _Utils_Tuple3(
																		_List_Nil,
																		$author$project$Language$Syntax$EError('Error 36'),
																		st);
																}
															} else {
																break _v0$46;
															}
														case 'Mul':
															var _v141 = _v0.a;
															var ws = _v141.a;
															var _v142 = _v141.b;
															var e1 = _v141.c;
															var e2 = _v141.d;
															var _v143 = A4($author$project$Language$BEval$beval, env, e1, delta, _List_Nil);
															var env1 = _v143.a;
															var new_e1 = _v143.b;
															var _v144 = _Utils_Tuple2(
																$author$project$Language$Utils$freeVars(e1),
																$author$project$Language$Utils$freeVars(e2));
															var fv1 = _v144.a;
															var fv2 = _v144.b;
															var _v145 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env);
															if ((!_v145.b.b) && (!_v145.c.b)) {
																var new_env = _v145.a;
																return _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Mul, new_e1, e2),
																	st);
															} else {
																var new_env = _v145.a;
																var denv1 = _v145.b;
																var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																return _Utils_eq(
																	fusedE1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
																	env,
																	A2($author$project$Language$Fusion$fuse, delta, exp),
																	st) : _Utils_Tuple3(
																	new_env,
																	A4($author$project$Language$Syntax$EBPrim, ws, $author$project$Language$Syntax$Mul, fusedE1, e2),
																	st);
															}
														default:
															break _v0$46;
													}
												case 'EUPrim':
													if (_v0.a.b.$ === 'Neg') {
														var _v149 = _v0.a;
														var ws = _v149.a;
														var _v150 = _v149.b;
														var e1 = _v149.c;
														var _v151 = A4($author$project$Language$BEval$beval, env, e1, delta, _List_Nil);
														var env1 = _v151.a;
														var new_e1 = _v151.b;
														return _Utils_Tuple3(
															env1,
															A3($author$project$Language$Syntax$EUPrim, ws, $author$project$Language$Syntax$Neg, new_e1),
															st);
													} else {
														break _v0$46;
													}
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
										case 'DMap':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												case 'EMap':
													var _v154 = _v0.a;
													var ws = _v154.a;
													var e1 = _v154.b;
													var e2 = _v154.c;
													var d = _v0.b.a;
													var _v155 = A2($author$project$Language$FEval$feval, env, e1);
													if (_v155.$ === 'VClosure') {
														var envf = _v155.a;
														var p = _v155.b;
														var ef = _v155.c;
														var _v156 = A2($author$project$Language$FEval$feval, env, e2);
														if (_v156.$ === 'VGraphic') {
															var v = _v156.b;
															var _v157 = A2($author$project$Language$Utils$match, p, v);
															if (_v157.$ === 'Just') {
																var envm = _v157.a;
																var _v158 = A4(
																	$author$project$Language$BEval$beval,
																	_Utils_ap(envm, envf),
																	ef,
																	d,
																	st);
																var env_ = _v158.a;
																var ef_ = _v158.b;
																var st_ = _v158.c;
																var _v159 = _Utils_Tuple2(
																	$author$project$Language$Utils$freeVars(e1),
																	$author$project$Language$Utils$freeVars(e2));
																var fv1 = _v159.a;
																var fv2 = _v159.b;
																var _v160 = _Utils_Tuple2(
																	A2(
																		$elm$core$List$take,
																		$elm$core$List$length(envm),
																		env_),
																	A2(
																		$elm$core$List$drop,
																		$elm$core$List$length(envm),
																		env_));
																var envm_ = _v160.a;
																var envf_ = _v160.b;
																var _v161 = A4(
																	$author$project$Language$BEval$beval,
																	env,
																	e1,
																	A3($author$project$Language$Syntax$DClosure, envf_, p, ef_),
																	_List_Nil);
																var env1 = _v161.a;
																var new_e1 = _v161.b;
																var _v162 = A4(
																	$author$project$Language$BEval$beval,
																	env,
																	e2,
																	$author$project$Language$Syntax$DMap(
																		A2($author$project$Language$Utils$substDelta, p, envm_)),
																	_List_Nil);
																var env2 = _v162.a;
																var new_e2 = _v162.b;
																if (_Utils_eq(
																	new_e1,
																	$author$project$Language$Syntax$EError('Recursion Conflict')) || (_Utils_eq(
																	new_e1,
																	$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																	new_e2,
																	$author$project$Language$Syntax$EError('Fusion Failed')))) {
																	return _Utils_Tuple3(
																		env,
																		A2($author$project$Language$Fusion$fuse, delta, exp),
																		st);
																} else {
																	var _v163 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env2);
																	if ((!_v163.b.b) && (!_v163.c.b)) {
																		var new_env = _v163.a;
																		return _Utils_Tuple3(
																			new_env,
																			A3($author$project$Language$Syntax$EMap, ws, new_e1, new_e2),
																			st_);
																	} else {
																		var new_env = _v163.a;
																		var denv1 = _v163.b;
																		var denv2 = _v163.c;
																		var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
																		var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
																		return (_Utils_eq(
																			fusedE1,
																			$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
																			fusedE2,
																			$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
																			env,
																			A2($author$project$Language$Fusion$fuse, delta, exp),
																			st) : _Utils_Tuple3(
																			new_env,
																			A3($author$project$Language$Syntax$EMap, ws, fusedE1, fusedE2),
																			st_);
																	}
																}
															} else {
																return _Utils_Tuple3(
																	_List_Nil,
																	$author$project$Language$Syntax$EError('Error 50'),
																	_List_Nil);
															}
														} else {
															return _Utils_Tuple3(
																_List_Nil,
																$author$project$Language$Syntax$EError(''),
																_List_Nil);
														}
													} else {
														return _Utils_Tuple3(
															_List_Nil,
															$author$project$Language$Syntax$EError('Error 51'),
															_List_Nil);
													}
												case 'EGraphic':
													var _v164 = _v0.a;
													var ws = _v164.a;
													var s = _v164.b;
													var e = _v164.c;
													var d = _v0.b.a;
													var _v165 = A4($author$project$Language$BEval$beval, env, e, d, st);
													var env1 = _v165.a;
													var new_e = _v165.b;
													var st_ = _v165.c;
													return _Utils_Tuple3(
														env1,
														A3($author$project$Language$Syntax$EGraphic, ws, s, new_e),
														st_);
												default:
													break _v0$46;
											}
										case 'DCtt':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													if (_v0.b.a.$ === 'PVar') {
														var e = _v0.a;
														var _v166 = _v0.b;
														var _v167 = _v166.a;
														var s = _v167.b;
														var d = _v166.b;
														var _v168 = A4(
															$author$project$Language$BEval$beval,
															env,
															e,
															d,
															A2(
																$elm$core$List$cons,
																_Utils_Tuple2(
																	s,
																	_Utils_Tuple2(
																		env,
																		$author$project$Language$Syntax$EError('IIIegal Constraint'))),
																st));
														var env_ = _v168.a;
														var e_ = _v168.b;
														var st1 = _v168.c;
														if (_Utils_eq(
															e_,
															$author$project$Language$Syntax$EError('Fusion Failed'))) {
															return _Utils_Tuple3(
																env,
																A2($author$project$Language$Fusion$fuse, delta, exp),
																st);
														} else {
															if (st1.b) {
																if (st1.a.b.b.$ === 'EError') {
																	var _v170 = st1.a;
																	var _v171 = _v170.b;
																	var st_ = st1.b;
																	return _Utils_Tuple3(
																		env,
																		A2($author$project$Language$Fusion$fuse, delta, exp),
																		st_);
																} else {
																	var _v172 = st1.a;
																	var _v173 = _v172.b;
																	var sub = _v173.b;
																	var st_ = st1.b;
																	var fun = A3(
																		$author$project$Language$Syntax$ELam,
																		_List_Nil,
																		A2(
																			$author$project$Language$Syntax$PVar,
																			_List_fromArray(
																				['']),
																			s),
																		e_);
																	return _Utils_Tuple3(
																		env_,
																		A3(
																			$author$project$Language$Syntax$EApp,
																			_List_fromArray(
																				['LET', ' ', ' ', '\n']),
																			fun,
																			A2($author$project$Language$Fusion$pars, ' ', sub)),
																		st_);
																}
															} else {
																return _Utils_Tuple3(
																	_List_Nil,
																	$author$project$Language$Syntax$EError('Error 21'),
																	_List_Nil);
															}
														}
													} else {
														break _v0$46;
													}
											}
										case 'DGroup':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													var e = _v0.a;
													var _v174 = _v0.b;
													var s = _v174.a;
													var d = _v174.b;
													var _v175 = A4(
														$author$project$Language$BEval$beval,
														env,
														e,
														d,
														A2(
															$elm$core$List$cons,
															_Utils_Tuple2(
																s,
																_Utils_Tuple2(
																	_List_Nil,
																	$author$project$Language$Syntax$EEmpList(_List_Nil))),
															st));
													var env_ = _v175.a;
													var e_ = _v175.b;
													var st1 = _v175.c;
													if (st1.b) {
														var _v177 = st1.a;
														var _v178 = _v177.b;
														var ls = _v178.b;
														var st_ = st1.b;
														var group = A3(
															$author$project$Language$Syntax$EGraphic,
															_List_fromArray(
																[' ']),
															'g',
															A3(
																$author$project$Language$Syntax$EList,
																_List_fromArray(
																	['', '']),
																A2(
																	$author$project$Language$Syntax$EFloat,
																	_List_fromArray(
																		['']),
																	0),
																A3(
																	$author$project$Language$Syntax$EList,
																	_List_fromArray(
																		['']),
																	ls,
																	$author$project$Language$Syntax$EEmpList(_List_Nil))));
														return _Utils_Tuple3(
															env_,
															A3(
																$author$project$Language$Syntax$EApp,
																_List_fromArray(
																	['LET', ' ', ' ', '\n']),
																A3(
																	$author$project$Language$Syntax$ELam,
																	_List_Nil,
																	A2(
																		$author$project$Language$Syntax$PVar,
																		_List_fromArray(
																			['']),
																		s),
																	A3(
																		$author$project$Language$Syntax$ECons,
																		_List_fromArray(
																			['']),
																		A2(
																			$author$project$Language$Syntax$EVar,
																			_List_fromArray(
																				['']),
																			s),
																		e_)),
																A2($author$project$Language$Fusion$setLastSpaces, ' ', group)),
															st_);
													} else {
														return _Utils_Tuple3(
															_List_Nil,
															$author$project$Language$Syntax$EError('Error 05'),
															_List_Nil);
													}
											}
										case 'DCom':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													var e = _v0.a;
													var _v179 = _v0.b;
													var d1 = _v179.a;
													var d2 = _v179.b;
													var _v180 = A4($author$project$Language$BEval$beval, env, e, d1, st);
													var env1 = _v180.a;
													var e1 = _v180.b;
													var st1 = _v180.c;
													if (_Utils_eq(
														e1,
														$author$project$Language$Syntax$EError('Fusion Failed'))) {
														return _Utils_Tuple3(
															env,
															A2($author$project$Language$Fusion$fuse, delta, exp),
															st);
													} else {
														var _v181 = A4($author$project$Language$BEval$beval, env1, e1, d2, st);
														var env2 = _v181.a;
														var e2 = _v181.b;
														var st2 = _v181.c;
														return _Utils_eq(
															e2,
															$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
															env,
															A2($author$project$Language$Fusion$fuse, delta, exp),
															st) : _Utils_Tuple3(
															env2,
															e2,
															A2($author$project$Language$UtilsFD$mergeST, st1, st2));
													}
											}
										case 'DError':
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													var info = _v0.b.a;
													return _Utils_Tuple3(
														_List_Nil,
														$author$project$Language$Syntax$EError(info),
														_List_Nil);
											}
										default:
											switch (_v0.a.$) {
												case 'EVar':
													break _v0$11;
												case 'EApp':
													break _v0$13;
												case 'ECase':
													break _v0$15;
												case 'EParens':
													break _v0$31;
												case 'EUnwrap':
													break _v0$39;
												default:
													break _v0$46;
											}
									}
								}
								return _Utils_Tuple3(
									_List_Nil,
									$author$project$Language$Syntax$EError('Cannot Handle This Delta'),
									_List_Nil);
							}
							var _v152 = _v0.a;
							var ws = _v152.a;
							var e = _v152.b;
							var _v153 = A4(
								$author$project$Language$BEval$beval,
								env,
								e,
								$author$project$Language$Syntax$DMap(delta),
								st);
							var env1 = _v153.a;
							var new_e = _v153.b;
							var st_ = _v153.c;
							return _Utils_Tuple3(
								env1,
								A2($author$project$Language$Syntax$EUnwrap, ws, new_e),
								st_);
						}
						var _v117 = _v0.a;
						var ws = _v117.a;
						var e1 = _v117.b;
						var _v118 = A4($author$project$Language$BEval$beval, env, e1, delta, st);
						var env1 = _v118.a;
						var new_e1 = _v118.b;
						var st_ = _v118.c;
						return _Utils_eq(
							new_e1,
							$author$project$Language$Syntax$EError('Fusion Failed')) ? _Utils_Tuple3(
							env,
							$author$project$Language$Syntax$EError('Fusion Failed'),
							st_) : _Utils_Tuple3(
							env1,
							A2($author$project$Language$Syntax$EParens, ws, new_e1),
							st_);
					}
					var _v34 = _v0.a;
					var ws = _v34.a;
					var e1 = _v34.b;
					var bs = _v34.c;
					var v1 = A2($author$project$Language$FEval$feval, env, e1);
					var res = A3($author$project$Language$Utils$matchBranch, v1, bs, 0);
					var _v35 = res.ei;
					if (_v35.$ === 'EError') {
						var info = _v35.a;
						return _Utils_Tuple3(
							_List_Nil,
							$author$project$Language$Syntax$EError(info),
							_List_Nil);
					} else {
						var _v36 = A4(
							$author$project$Language$BEval$beval,
							_Utils_ap(res.envm, env),
							res.ei,
							delta,
							st);
						var env_ = _v36.a;
						var ei_ = _v36.b;
						var st_ = _v36.c;
						var _v37 = _Utils_Tuple2(
							$author$project$Language$Utils$freeVars(e1),
							$author$project$Language$Utils$freeVars(res.ei));
						var fv1 = _v37.a;
						var fv2 = _v37.b;
						var _v38 = _Utils_Tuple2(
							A2(
								$elm$core$List$take,
								$elm$core$List$length(res.envm),
								env_),
							A2(
								$elm$core$List$drop,
								$elm$core$List$length(res.envm),
								env_));
						var envm_ = _v38.a;
						var env2 = _v38.b;
						var _v39 = A4(
							$author$project$Language$BEval$beval,
							env,
							e1,
							A2($author$project$Language$Utils$substDelta, res.pi, envm_),
							_List_Nil);
						var env1 = _v39.a;
						var new_e1 = _v39.b;
						if (_Utils_eq(
							new_e1,
							$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
							ei_,
							$author$project$Language$Syntax$EError('Fusion Failed'))) {
							return _Utils_Tuple3(
								env,
								A2($author$project$Language$Fusion$fuse, delta, exp),
								st);
						} else {
							var _v40 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env2);
							if ((!_v40.b.b) && (!_v40.c.b)) {
								var new_env = _v40.a;
								return _Utils_Tuple3(
									new_env,
									A3(
										$author$project$Language$Syntax$ECase,
										ws,
										new_e1,
										A4($author$project$Language$Utils$updateBranch, bs, 0, res.choice, ei_).a),
									st_);
							} else {
								var new_env = _v40.a;
								var denv1 = _v40.b;
								var denv2 = _v40.c;
								var fusedEi = A2($author$project$Language$Fusion$fuseEnv, denv2, ei_);
								var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
								return (_Utils_eq(
									fusedE1,
									$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
									fusedEi,
									$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
									env,
									A2($author$project$Language$Fusion$fuse, delta, exp),
									st) : _Utils_Tuple3(
									new_env,
									A3(
										$author$project$Language$Syntax$ECase,
										ws,
										fusedE1,
										A4($author$project$Language$Utils$updateBranch, bs, 0, res.choice, fusedEi).a),
									st_);
							}
						}
					}
				}
				var _v20 = _v0.a;
				var ws = _v20.a;
				var e1 = _v20.b;
				var e2 = _v20.c;
				var _v21 = A2($author$project$Language$FEval$feval, env, e1);
				if (_v21.$ === 'VClosure') {
					var envf = _v21.a;
					var p = _v21.b;
					var ef = _v21.c;
					var envm_res = function () {
						if (e2.$ === 'EFix') {
							var e2_ = e2.b;
							return A2(
								$author$project$Language$Utils$match,
								p,
								A2($author$project$Language$Syntax$VFix, env, e2_));
						} else {
							return A2(
								$author$project$Language$Utils$match,
								p,
								A2($author$project$Language$FEval$feval, env, e2));
						}
					}();
					if (envm_res.$ === 'Just') {
						var envm = envm_res.a;
						var _v23 = A4(
							$author$project$Language$BEval$beval,
							_Utils_ap(envm, envf),
							ef,
							delta,
							st);
						var env_ = _v23.a;
						var ef_ = _v23.b;
						var st_ = _v23.c;
						var _v24 = _Utils_Tuple2(
							$author$project$Language$Utils$freeVars(e1),
							$author$project$Language$Utils$freeVars(e2));
						var fv1 = _v24.a;
						var fv2 = _v24.b;
						var _v25 = _Utils_Tuple2(
							A2(
								$elm$core$List$take,
								$elm$core$List$length(envm),
								env_),
							A2(
								$elm$core$List$drop,
								$elm$core$List$length(envm),
								env_));
						var envm_ = _v25.a;
						var envf_ = _v25.b;
						var _v26 = A4(
							$author$project$Language$BEval$beval,
							env,
							e1,
							A3($author$project$Language$Syntax$DClosure, envf_, p, ef_),
							_List_Nil);
						var env1 = _v26.a;
						var new_e1 = _v26.b;
						var _v27 = A4(
							$author$project$Language$BEval$beval,
							env,
							e2,
							A2($author$project$Language$Utils$substDelta, p, envm_),
							_List_Nil);
						var env2 = _v27.a;
						var new_e2 = _v27.b;
						if (_Utils_eq(
							new_e1,
							$author$project$Language$Syntax$EError('Recursion Conflict')) || (_Utils_eq(
							new_e1,
							$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
							new_e2,
							$author$project$Language$Syntax$EError('Fusion Failed')))) {
							return _Utils_Tuple3(
								env,
								A2($author$project$Language$Fusion$fuse, delta, exp),
								st);
						} else {
							if (ws.b && (ws.a === 'EQ')) {
								var _v29 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env2);
								if ((!_v29.b.b) && (!_v29.c.b)) {
									var new_env = _v29.a;
									return _Utils_Tuple3(
										new_env,
										A3($author$project$Language$Syntax$EApp, ws, new_e1, new_e2),
										st_);
								} else {
									var new_env = _v29.a;
									var denv1 = _v29.b;
									var denv2 = _v29.c;
									var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
									var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
									return (_Utils_eq(
										fusedE1,
										$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
										fusedE2,
										$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
										env,
										A2($author$project$Language$Fusion$fuse, delta, exp),
										st) : _Utils_Tuple3(
										new_env,
										A3($author$project$Language$Syntax$EApp, ws, fusedE1, fusedE2),
										st_);
								}
							} else {
								var _v30 = A4($author$project$Language$Utils$two_wayMerge, fv1, fv2, env1, env2);
								if ((!_v30.b.b) && (!_v30.c.b)) {
									var new_env = _v30.a;
									return _Utils_Tuple3(
										new_env,
										A3($author$project$Language$Syntax$EApp, ws, new_e1, new_e2),
										st_);
								} else {
									var new_env = _v30.a;
									var denv1 = _v30.b;
									var denv2 = _v30.c;
									var fusedE2 = A2($author$project$Language$Fusion$fuseEnv, denv2, new_e2);
									var fusedE1 = A2($author$project$Language$Fusion$fuseEnv, denv1, new_e1);
									return (_Utils_eq(
										fusedE1,
										$author$project$Language$Syntax$EError('Fusion Failed')) || _Utils_eq(
										fusedE2,
										$author$project$Language$Syntax$EError('Fusion Failed'))) ? _Utils_Tuple3(
										env,
										A2($author$project$Language$Fusion$fuse, delta, exp),
										st) : _Utils_Tuple3(
										new_env,
										A3($author$project$Language$Syntax$EApp, ws, fusedE1, fusedE2),
										st_);
								}
							}
						}
					} else {
						return _Utils_Tuple3(
							_List_Nil,
							$author$project$Language$Syntax$EError('Error 30'),
							_List_Nil);
					}
				} else {
					return _Utils_Tuple3(
						_List_Nil,
						$author$project$Language$Syntax$EError('Error 31'),
						_List_Nil);
				}
			}
			var _v14 = _v0.a;
			var x = _v14.b;
			var _v15 = A2($author$project$Utils$lookup, x, env);
			if (_v15.$ === 'Just') {
				var _v16 = _v15.a;
				var v = _v16.a;
				var od = _v16.b;
				var _v17 = A2($author$project$Language$UtilsFD$fixCheck, v, delta);
				if (_v17.$ === 'Just') {
					var d = _v17.a;
					return _Utils_Tuple3(
						A3(
							$author$project$Language$Utils$updateDelta,
							env,
							x,
							A2($author$project$Language$Syntax$DCom, od, d)),
						exp,
						st);
				} else {
					return _Utils_Tuple3(
						_List_Nil,
						$author$project$Language$Syntax$EError('Recursion Conflict'),
						_List_Nil);
				}
			} else {
				return _Utils_Tuple3(
					_List_Nil,
					$author$project$Language$Syntax$EError('Error 37'),
					_List_Nil);
			}
		}
		var s = _v0.b.a.a;
		var _v2 = A2($author$project$Utils$lookup, s, st);
		if (_v2.$ === 'Just') {
			var _v3 = _v2.a;
			var env1 = _v3.a;
			if (_Utils_eq(env1, env)) {
				var lastSP = $author$project$Language$Fusion$getLastSpaces(exp);
				return _Utils_Tuple3(
					env,
					A2(
						$author$project$Language$Syntax$EVar,
						_List_fromArray(
							[lastSP]),
						s),
					A3($author$project$Language$UtilsFD$updateST, st, s, exp));
			} else {
				return _Utils_Tuple3(env, exp, st);
			}
		} else {
			return _Utils_Tuple3(
				_List_Nil,
				$author$project$Language$Syntax$EError('Error 20'),
				_List_Nil);
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$genCanvas = _Platform_outgoingPort('genCanvas', $elm$json$Json$Encode$string);
var $author$project$Language$Preclude$library = 'cp n ls :=\n    case ls of\n    []    -> [] |\n    x::xs ->\n        case n of\n        0     -> x::x::xs |\n        other -> x::cp (n-1) xs;\n\ndel n ls :=\n    case ls of\n    []    -> [] |\n    x::xs ->\n        case n of\n        0     -> xs |\n        other -> x::del (n-1) xs;\n\nmod n f ls :=\n    case ls of\n    []    -> [] |\n    x::xs ->\n        case n of\n        0     -> f x::xs |\n        other -> x::mod (n-1) f xs;\n\nins n x ls :=\n    case ls of\n    []    -> [x] |\n    y::ys ->\n        case n of\n        0     -> x::y::ys |\n        other -> y::ins (n-1) x ys;\n\nnth n ls :=\n    case ls of\n    []    -> 9999 |\n    x::xs ->\n        case n of\n        0     -> x |\n        other -> nth (n-1) xs;\n\nfirst (x,y) = x;\nsecond (x,y) = y;\n\n';
var $elm$core$Debug$log = _Debug_log;
var $author$project$Language$Syntax$DFun = F2(
	function (a, b) {
		return {$: 'DFun', a: a, b: b};
	});
var $author$project$Language$Syntax$DGroup = F2(
	function (a, b) {
		return {$: 'DGroup', a: a, b: b};
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $author$project$Language$Syntax$DAbst = function (a) {
	return {$: 'DAbst', a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $author$project$Language$Syntax$AParens = function (a) {
	return {$: 'AParens', a: a};
};
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $Punie$elm_parser_extras$Parser$Expression$initOps = {lassoc: _List_Nil, nassoc: _List_Nil, postfix: _List_Nil, prefix: _List_Nil, rassoc: _List_Nil};
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $Punie$elm_parser_extras$Parser$Expression$splitOp = F2(
	function (operator, ops) {
		var rassoc = ops.rassoc;
		var lassoc = ops.lassoc;
		var nassoc = ops.nassoc;
		var prefix = ops.prefix;
		var postfix = ops.postfix;
		switch (operator.$) {
			case 'Infix':
				switch (operator.b.$) {
					case 'AssocNone':
						var op = operator.a;
						var _v1 = operator.b;
						return _Utils_update(
							ops,
							{
								nassoc: A2($elm$core$List$cons, op, ops.nassoc)
							});
					case 'AssocLeft':
						var op = operator.a;
						var _v2 = operator.b;
						return _Utils_update(
							ops,
							{
								lassoc: A2($elm$core$List$cons, op, ops.lassoc)
							});
					default:
						var op = operator.a;
						var _v3 = operator.b;
						return _Utils_update(
							ops,
							{
								rassoc: A2($elm$core$List$cons, op, ops.rassoc)
							});
				}
			case 'Prefix':
				var op = operator.a;
				return _Utils_update(
					ops,
					{
						prefix: A2($elm$core$List$cons, op, ops.prefix)
					});
			default:
				var op = operator.a;
				return _Utils_update(
					ops,
					{
						postfix: A2($elm$core$List$cons, op, ops.postfix)
					});
		}
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $Punie$elm_parser_extras$Parser$Expression$makeParser = F2(
	function (ops, term) {
		var ambiguous = F2(
			function (assoc, op) {
				return $elm$parser$Parser$backtrackable(
					A2(
						$elm$parser$Parser$andThen,
						function (_v3) {
							return $elm$parser$Parser$problem('ambiguous use of a ' + (assoc + ' associative operator'));
						},
						op));
			});
		var _v0 = A3($elm$core$List$foldr, $Punie$elm_parser_extras$Parser$Expression$splitOp, $Punie$elm_parser_extras$Parser$Expression$initOps, ops);
		var rassoc = _v0.rassoc;
		var lassoc = _v0.lassoc;
		var nassoc = _v0.nassoc;
		var prefix = _v0.prefix;
		var postfix = _v0.postfix;
		var lassocOp = $elm$parser$Parser$oneOf(lassoc);
		var ambiguousLeft = A2(ambiguous, 'left', lassocOp);
		var nassocOp = $elm$parser$Parser$oneOf(nassoc);
		var ambiguousNon = A2(ambiguous, 'non', nassocOp);
		var postfixOp = $elm$parser$Parser$oneOf(postfix);
		var postfixP = $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					postfixOp,
					$elm$parser$Parser$succeed($elm$core$Basics$identity)
				]));
		var prefixOp = $elm$parser$Parser$oneOf(prefix);
		var prefixP = $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					prefixOp,
					$elm$parser$Parser$succeed($elm$core$Basics$identity)
				]));
		var termP = A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						F3(
							function (pre, x, post) {
								return post(
									pre(x));
							})),
					prefixP),
				term),
			postfixP);
		var rassocOp = $elm$parser$Parser$oneOf(rassoc);
		var ambiguousRight = A2(ambiguous, 'right', rassocOp);
		var lassocP = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$andThen,
						function (_v2) {
							var f = _v2.a;
							var y = _v2.b;
							return lassocP1(
								A2(f, x, y));
						},
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								$elm$parser$Parser$succeed($elm$core$Tuple$pair),
								lassocOp),
							termP)),
						ambiguousRight,
						ambiguousNon
					]));
		};
		var lassocP1 = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						lassocP(x),
						$elm$parser$Parser$succeed(x)
					]));
		};
		var nassocP = function (x) {
			return A2(
				$elm$parser$Parser$andThen,
				function (_v1) {
					var f = _v1.a;
					var y = _v1.b;
					return $elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								ambiguousRight,
								ambiguousLeft,
								ambiguousNon,
								$elm$parser$Parser$succeed(
								A2(f, x, y))
							]));
				},
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed($elm$core$Tuple$pair),
						nassocOp),
					termP));
		};
		var rassocP = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(
								F2(
									function (f, y) {
										return A2(f, x, y);
									})),
							rassocOp),
						A2($elm$parser$Parser$andThen, rassocP1, termP)),
						ambiguousLeft,
						ambiguousNon
					]));
		};
		var rassocP1 = function (x) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						rassocP(x),
						$elm$parser$Parser$succeed(x)
					]));
		};
		return A2(
			$elm$parser$Parser$andThen,
			function (x) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							rassocP(x),
							lassocP(x),
							nassocP(x),
							$elm$parser$Parser$succeed(x)
						]));
			},
			termP);
	});
var $Punie$elm_parser_extras$Parser$Expression$buildExpressionParser = F2(
	function (operators, simpleExpr) {
		return A3($elm$core$List$foldl, $Punie$elm_parser_extras$Parser$Expression$makeParser, simpleExpr, operators);
	});
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 'ExpectingKeyword', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return (_Utils_eq(newOffset, -1) || (0 <= A3(
				$elm$parser$Parser$Advanced$isSubChar,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
						c,
						_Utils_chr('_'));
				},
				newOffset,
				s.src))) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $author$project$Parser$Delta$paramListToACons = function (ls) {
	if (!ls.b) {
		return $author$project$Language$Syntax$ANil;
	} else {
		var a = ls.a;
		var ls_ = ls.b;
		return A2(
			$author$project$Language$Syntax$ACons,
			a,
			$author$project$Parser$Delta$paramListToACons(ls_));
	}
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $author$project$Parser$Delta$pfalse = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$AFalse),
		$elm$parser$Parser$keyword('false')),
	$elm$parser$Parser$spaces);
var $elm$parser$Parser$ExpectingFloat = {$: 'ExpectingFloat'};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {col: s.col + (newOffset - s.offset), context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 'Err') {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.offset, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.src);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.row, s.col - (floatOffset + s.offset), invalid, s.context));
		} else {
			if (_Utils_eq(s.offset, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.offset, intPair, s);
				} else {
					if (floatSettings.$ === 'Err') {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.offset, floatOffset, s.src));
						if (_v1.$ === 'Nothing') {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.offset, s.src)) {
				var zeroOffset = s.offset + 1;
				var baseOffset = zeroOffset + 1;
				return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.hex,
					baseOffset,
					A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.octal,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.binary,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.src),
					s) : A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					_Utils_Tuple2(zeroOffset, 0),
					s)));
			} else {
				return A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					A3($elm$parser$Parser$Advanced$consumeBase, 10, s.offset, s.src),
					s);
			}
		});
};
var $elm$parser$Parser$Advanced$float = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Ok($elm$core$Basics$identity),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$toFloat),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$float = A2($elm$parser$Parser$Advanced$float, $elm$parser$Parser$ExpectingFloat, $elm$parser$Parser$ExpectingFloat);
var $elm$parser$Parser$ExpectingBinary = {$: 'ExpectingBinary'};
var $elm$parser$Parser$ExpectingHex = {$: 'ExpectingHex'};
var $elm$parser$Parser$ExpectingInt = {$: 'ExpectingInt'};
var $elm$parser$Parser$ExpectingNumber = {$: 'ExpectingNumber'};
var $elm$parser$Parser$ExpectingOctal = {$: 'ExpectingOctal'};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$parser$Parser$number = function (i) {
	return $elm$parser$Parser$Advanced$number(
		{
			binary: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingBinary, i.binary),
			expecting: $elm$parser$Parser$ExpectingNumber,
			_float: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingFloat, i._float),
			hex: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingHex, i.hex),
			_int: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingInt, i._int),
			invalid: $elm$parser$Parser$ExpectingNumber,
			octal: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingOctal, i.octal)
		});
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Parser$Delta$pfloat = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$AFloat),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Nothing,
						_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
						hex: $elm$core$Maybe$Nothing,
						_int: $elm$core$Maybe$Just($elm$core$Basics$toFloat),
						octal: $elm$core$Maybe$Nothing
					}),
				$elm$parser$Parser$spaces)),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (n) {
						return $author$project$Language$Syntax$AFloat(-n);
					}),
				$elm$parser$Parser$symbol('-')),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$float, $elm$parser$Parser$spaces))
		]));
var $author$project$Parser$Delta$pnil = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$ANil),
		$elm$parser$Parser$symbol('nil')),
	$elm$parser$Parser$spaces);
var $author$project$Language$Syntax$AAdd = F2(
	function (a, b) {
		return {$: 'AAdd', a: a, b: b};
	});
var $author$project$Language$Syntax$ADiv = F2(
	function (a, b) {
		return {$: 'ADiv', a: a, b: b};
	});
var $author$project$Language$Syntax$AEq = F2(
	function (a, b) {
		return {$: 'AEq', a: a, b: b};
	});
var $author$project$Language$Syntax$ALe = F2(
	function (a, b) {
		return {$: 'ALe', a: a, b: b};
	});
var $author$project$Language$Syntax$ALt = F2(
	function (a, b) {
		return {$: 'ALt', a: a, b: b};
	});
var $author$project$Language$Syntax$AMul = F2(
	function (a, b) {
		return {$: 'AMul', a: a, b: b};
	});
var $author$project$Language$Syntax$ASub = F2(
	function (a, b) {
		return {$: 'ASub', a: a, b: b};
	});
var $Punie$elm_parser_extras$Parser$Expression$AssocRight = {$: 'AssocRight'};
var $Punie$elm_parser_extras$Parser$Expression$Infix = F2(
	function (a, b) {
		return {$: 'Infix', a: a, b: b};
	});
var $author$project$Parser$Delta$pop = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$AMul),
					$elm$parser$Parser$symbol('*')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$AAdd),
					$elm$parser$Parser$symbol('+')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ASub),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ADiv),
					$elm$parser$Parser$symbol('/')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ALt),
					$elm$parser$Parser$symbol('<')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ALe),
					$elm$parser$Parser$symbol('<=')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$AEq),
					$elm$parser$Parser$symbol('==')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ACons),
					$elm$parser$Parser$symbol('::')),
				$elm$parser$Parser$spaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Parser$Delta$ptrue = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$ATrue),
		$elm$parser$Parser$keyword('true')),
	$elm$parser$Parser$spaces);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$parser$Parser$ExpectingVariable = {$: 'ExpectingVariable'};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {col: col, context: context, indent: indent, offset: offset, row: row, src: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
			if (_Utils_eq(firstOffset, -1)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting));
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : A7($elm$parser$Parser$Advanced$varHelp, i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($elm$core$String$slice, s.offset, s1.offset, s.src);
				return A2($elm$core$Set$member, name, i.reserved) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
			}
		});
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{expecting: $elm$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start});
};
var $author$project$Parser$Utils$varName = $elm$parser$Parser$variable(
	{
		inner: function (c) {
			return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
				c,
				_Utils_chr('_'));
		},
		reserved: $elm$core$Set$fromList(
			_List_fromArray(
				['rect', 'circle', 'ellipse', 'line', 'polygon', 'g', 'if', 'id', 'in', 'of', 'not', 'let', 'nil', 'then', 'else', 'true', 'rewr', 'case', 'false', 'letrec', 'copy', 'insert', 'delete', 'modify', 'mem', 'group', 'Graphic.map', 'Graphic.unwrap'])),
		start: $elm$core$Char$isAlpha
	});
var $author$project$Parser$Delta$pvar = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$AVar),
			A2($elm$parser$Parser$ignorer, $author$project$Parser$Utils$varName, $elm$parser$Parser$spaces)),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (n) {
						return $author$project$Language$Syntax$AVar('*' + n);
					}),
				$elm$parser$Parser$symbol('*')),
			A2($elm$parser$Parser$ignorer, $author$project$Parser$Utils$varName, $elm$parser$Parser$spaces))
		]));
var $author$project$Parser$Delta$plistHelper = function (revParams) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							function (a) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, a, revParams));
							}),
						$elm$parser$Parser$symbol(',')),
					$elm$parser$Parser$spaces),
				$elm$parser$Parser$lazy(
					function (_v3) {
						return $author$project$Parser$Delta$cyclic$param();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v4) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revParams));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser$Delta$cyclic$param() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser$Delta$pop,
		$author$project$Parser$Delta$cyclic$pterm());
}
function $author$project$Parser$Delta$cyclic$pterm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser$Delta$pnil,
				$author$project$Parser$Delta$ptrue,
				$author$project$Parser$Delta$pfalse,
				$elm$parser$Parser$backtrackable($author$project$Parser$Delta$pfloat),
				$author$project$Parser$Delta$pvar,
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Delta$cyclic$pparens()),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Delta$cyclic$ptuple()),
				$author$project$Parser$Delta$cyclic$prect(),
				$author$project$Parser$Delta$cyclic$pcircle(),
				$author$project$Parser$Delta$cyclic$pellipse(),
				$author$project$Parser$Delta$cyclic$pline(),
				$author$project$Parser$Delta$cyclic$ppolygon(),
				$author$project$Parser$Delta$cyclic$plist()
			]));
}
function $author$project$Parser$Delta$cyclic$pcircle() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (a) {
						return A2($author$project$Language$Syntax$AGraphic, 'circle', a);
					}),
				$elm$parser$Parser$keyword('circle')),
			$elm$parser$Parser$spaces),
		$author$project$Parser$Delta$cyclic$plist());
}
function $author$project$Parser$Delta$cyclic$pellipse() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (a) {
						return A2($author$project$Language$Syntax$AGraphic, 'ellipse', a);
					}),
				$elm$parser$Parser$keyword('ellipse')),
			$elm$parser$Parser$spaces),
		$author$project$Parser$Delta$cyclic$plist());
}
function $author$project$Parser$Delta$cyclic$pline() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (a) {
						return A2($author$project$Language$Syntax$AGraphic, 'line', a);
					}),
				$elm$parser$Parser$keyword('line')),
			$elm$parser$Parser$spaces),
		$author$project$Parser$Delta$cyclic$plist());
}
function $author$project$Parser$Delta$cyclic$prect() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (a) {
						return A2($author$project$Language$Syntax$AGraphic, 'rect', a);
					}),
				$elm$parser$Parser$keyword('rect')),
			$elm$parser$Parser$spaces),
		$author$project$Parser$Delta$cyclic$plist());
}
function $author$project$Parser$Delta$cyclic$ppolygon() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (a) {
						return A2($author$project$Language$Syntax$AGraphic, 'polygon', a);
					}),
				$elm$parser$Parser$keyword('polygon')),
			$elm$parser$Parser$spaces),
		$author$project$Parser$Delta$cyclic$plist());
}
function $author$project$Parser$Delta$cyclic$plist() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (a1, a2) {
								return A2($author$project$Language$Syntax$ACons, a1, a2);
							})),
					$elm$parser$Parser$symbol('[')),
				$elm$parser$Parser$spaces),
			$elm$parser$Parser$lazy(
				function (_v5) {
					return $author$project$Parser$Delta$cyclic$param();
				})),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser$Delta$cyclic$plistloop(),
				$elm$parser$Parser$symbol(']')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$plistloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser$Delta$paramListToACons,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Delta$plistHelper));
}
function $author$project$Parser$Delta$cyclic$pparens() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Language$Syntax$AParens),
				$elm$parser$Parser$symbol('(')),
			$elm$parser$Parser$spaces),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$Parser$Delta$cyclic$param();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$ptuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$ATuple),
					$elm$parser$Parser$symbol('(')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v0) {
							return $author$project$Parser$Delta$cyclic$param();
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v1) {
						return $author$project$Parser$Delta$cyclic$param();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
try {
	var $author$project$Parser$Delta$param = $author$project$Parser$Delta$cyclic$param();
	$author$project$Parser$Delta$cyclic$param = function () {
		return $author$project$Parser$Delta$param;
	};
	var $author$project$Parser$Delta$pterm = $author$project$Parser$Delta$cyclic$pterm();
	$author$project$Parser$Delta$cyclic$pterm = function () {
		return $author$project$Parser$Delta$pterm;
	};
	var $author$project$Parser$Delta$pcircle = $author$project$Parser$Delta$cyclic$pcircle();
	$author$project$Parser$Delta$cyclic$pcircle = function () {
		return $author$project$Parser$Delta$pcircle;
	};
	var $author$project$Parser$Delta$pellipse = $author$project$Parser$Delta$cyclic$pellipse();
	$author$project$Parser$Delta$cyclic$pellipse = function () {
		return $author$project$Parser$Delta$pellipse;
	};
	var $author$project$Parser$Delta$pline = $author$project$Parser$Delta$cyclic$pline();
	$author$project$Parser$Delta$cyclic$pline = function () {
		return $author$project$Parser$Delta$pline;
	};
	var $author$project$Parser$Delta$prect = $author$project$Parser$Delta$cyclic$prect();
	$author$project$Parser$Delta$cyclic$prect = function () {
		return $author$project$Parser$Delta$prect;
	};
	var $author$project$Parser$Delta$ppolygon = $author$project$Parser$Delta$cyclic$ppolygon();
	$author$project$Parser$Delta$cyclic$ppolygon = function () {
		return $author$project$Parser$Delta$ppolygon;
	};
	var $author$project$Parser$Delta$plist = $author$project$Parser$Delta$cyclic$plist();
	$author$project$Parser$Delta$cyclic$plist = function () {
		return $author$project$Parser$Delta$plist;
	};
	var $author$project$Parser$Delta$plistloop = $author$project$Parser$Delta$cyclic$plistloop();
	$author$project$Parser$Delta$cyclic$plistloop = function () {
		return $author$project$Parser$Delta$plistloop;
	};
	var $author$project$Parser$Delta$pparens = $author$project$Parser$Delta$cyclic$pparens();
	$author$project$Parser$Delta$cyclic$pparens = function () {
		return $author$project$Parser$Delta$pparens;
	};
	var $author$project$Parser$Delta$ptuple = $author$project$Parser$Delta$cyclic$ptuple();
	$author$project$Parser$Delta$cyclic$ptuple = function () {
		return $author$project$Parser$Delta$ptuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser.Delta` are causing infinite recursion:\n\n  ┌─────┐\n  │    param\n  │     ↓\n  │    pterm\n  │     ↓\n  │    pcircle\n  │     ↓\n  │    pellipse\n  │     ↓\n  │    pline\n  │     ↓\n  │    prect\n  │     ↓\n  │    ppolygon\n  │     ↓\n  │    plist\n  │     ↓\n  │    plistloop\n  │     ↓\n  │    plistHelper\n  │     ↓\n  │    pparens\n  │     ↓\n  │    ptuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$Parser$Delta$abst = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$DAbst),
			$elm$parser$Parser$symbol('&')),
		$elm$parser$Parser$spaces),
	$author$project$Parser$Delta$param);
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Err(invalid),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$identity),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $author$project$Parser$Delta$copy = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$DCopy),
			$elm$parser$Parser$keyword('copy')),
		$elm$parser$Parser$spaces),
	A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces));
var $author$project$Parser$Delta$dadd = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$DAdd),
		$elm$parser$Parser$symbol('+')),
	A2($elm$parser$Parser$ignorer, $author$project$Parser$Delta$param, $elm$parser$Parser$spaces));
var $author$project$Parser$Delta$delete = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$DDelete),
			$elm$parser$Parser$keyword('delete')),
		$elm$parser$Parser$spaces),
	A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces));
var $author$project$Parser$Delta$deltaListToDCons = function (ls) {
	if (!ls.b) {
		return $author$project$Language$Syntax$DId;
	} else {
		var d = ls.a;
		var ts = ls.b;
		return A2(
			$author$project$Language$Syntax$DCons,
			d,
			$author$project$Parser$Delta$deltaListToDCons(ts));
	}
};
var $author$project$Parser$Delta$did = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$DId),
		$elm$parser$Parser$keyword('id')),
	$elm$parser$Parser$spaces);
var $author$project$Parser$Delta$dmul = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$DMul),
		$elm$parser$Parser$symbol('*')),
	A2($elm$parser$Parser$ignorer, $author$project$Parser$Delta$param, $elm$parser$Parser$spaces));
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $author$project$Parser$WhiteSpace$isWhiteSpace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || (_Utils_eq(
		c,
		_Utils_chr('\n')) || _Utils_eq(
		c,
		_Utils_chr('\r')));
};
var $author$project$Parser$WhiteSpace$mspaces = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompWhile($author$project$Parser$WhiteSpace$isWhiteSpace));
var $author$project$Parser$Exp$branchOp = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						function (spc) {
							return $author$project$Language$Syntax$BCom(
								_List_fromArray(
									[spc]));
						}),
					$elm$parser$Parser$symbol('|')),
				$author$project$Parser$WhiteSpace$mspaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Parser$Utils$charhelper = function (s) {
	var _v0 = $elm$core$String$uncons(s);
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var c = _v1.a;
		return c;
	} else {
		return _Utils_chr(' ');
	}
};
var $elm$parser$Parser$UnexpectedChar = {$: 'UnexpectedChar'};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $author$project$Parser$Utils$mchar = A2(
	$elm$parser$Parser$map,
	$author$project$Parser$Utils$charhelper,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf(
			function (_v0) {
				return true;
			})));
var $author$project$Parser$Exp$char = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, spc) {
						return A2(
							$author$project$Language$Syntax$EChar,
							_List_fromArray(
								[spc]),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Utils$mchar,
			$elm$parser$Parser$symbol('\''))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$empList = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (spc1, spc2) {
						return $author$project$Language$Syntax$EEmpList(
							_List_fromArray(
								[spc1, spc2]));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$WhiteSpace$mspaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$exprListToEList = function (ls) {
	if (!ls.b) {
		return $author$project$Language$Syntax$EEmpList(_List_Nil);
	} else {
		var _v1 = ls.a;
		var e = _v1.a;
		var ws = _v1.b;
		var ts = ls.b;
		return A3(
			$author$project$Language$Syntax$EList,
			ws,
			e,
			$author$project$Parser$Exp$exprListToEList(ts));
	}
};
var $author$project$Parser$Exp$false = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$EFalse(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$flip = F3(
	function (f, x, y) {
		return A2(f, y, x);
	});
var $author$project$Parser$Exp$mfloat = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			F2(
				function (n, spc) {
					return A2(
						$author$project$Language$Syntax$EFloat,
						_List_fromArray(
							[spc]),
						n);
				})),
		$elm$parser$Parser$number(
			{
				binary: $elm$core$Maybe$Nothing,
				_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
				hex: $elm$core$Maybe$Nothing,
				_int: $elm$core$Maybe$Just($elm$core$Basics$toFloat),
				octal: $elm$core$Maybe$Nothing
			})),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$nil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$ENil(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol('nil')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Language$Syntax$And = {$: 'And'};
var $Punie$elm_parser_extras$Parser$Expression$AssocLeft = {$: 'AssocLeft'};
var $Punie$elm_parser_extras$Parser$Expression$AssocNone = {$: 'AssocNone'};
var $author$project$Language$Syntax$Ge = {$: 'Ge'};
var $author$project$Language$Syntax$Gt = {$: 'Gt'};
var $author$project$Language$Syntax$Mod = {$: 'Mod'};
var $author$project$Language$Syntax$Not = {$: 'Not'};
var $author$project$Language$Syntax$Or = {$: 'Or'};
var $Punie$elm_parser_extras$Parser$Expression$Prefix = function (a) {
	return {$: 'Prefix', a: a};
};
var $author$project$Parser$Exp$bopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (spc) {
						return A2(
							$author$project$Language$Syntax$EBPrim,
							_List_fromArray(
								[spc]),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$Parser$WhiteSpace$mspaces);
	});
var $author$project$Parser$Exp$cons = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$ECons(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$symbol('::')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$uopParser = F2(
	function (s, op) {
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					function (spc) {
						return A2(
							$author$project$Language$Syntax$EUPrim,
							_List_fromArray(
								[spc]),
							op);
					}),
				$elm$parser$Parser$symbol(s)),
			$author$project$Parser$WhiteSpace$mspaces);
	});
var $author$project$Parser$Exp$operators = _List_fromArray(
	[
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser$Exp$uopParser, '-', $author$project$Language$Syntax$Neg)))
		]),
		_List_fromArray(
		[
			$Punie$elm_parser_extras$Parser$Expression$Prefix(
			A2($author$project$Parser$Exp$uopParser, '!', $author$project$Language$Syntax$Not))
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '%', $author$project$Language$Syntax$Mod),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '*', $author$project$Language$Syntax$Mul),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '/', $author$project$Language$Syntax$Div),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser$Exp$bopParser, '+', $author$project$Language$Syntax$Add)),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '-', $author$project$Language$Syntax$Sub),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '++', $author$project$Language$Syntax$Cat),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser$Exp$bopParser, '<', $author$project$Language$Syntax$Lt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			$elm$parser$Parser$backtrackable(
				A2($author$project$Parser$Exp$bopParser, '>', $author$project$Language$Syntax$Gt)),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '<=', $author$project$Language$Syntax$Le),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone),
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '>=', $author$project$Language$Syntax$Ge),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '==', $author$project$Language$Syntax$Eq),
			$Punie$elm_parser_extras$Parser$Expression$AssocNone)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '&&', $author$project$Language$Syntax$And),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2($author$project$Parser$Exp$bopParser, '||', $author$project$Language$Syntax$Or),
			$Punie$elm_parser_extras$Parser$Expression$AssocLeft)
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$Parser$Exp$cons, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Language$Syntax$PList = F3(
	function (a, b, c) {
		return {$: 'PList', a: a, b: b, c: c};
	});
var $author$project$Parser$Pattern$pConsOp = _List_fromArray(
	[
		_List_fromArray(
		[
			A2(
			$Punie$elm_parser_extras$Parser$Expression$Infix,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						function (spc) {
							return $author$project$Language$Syntax$PCons(
								_List_fromArray(
									[spc]));
						}),
					$elm$parser$Parser$symbol('::')),
				$author$project$Parser$WhiteSpace$mspaces),
			$Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Language$Syntax$PChar = F2(
	function (a, b) {
		return {$: 'PChar', a: a, b: b};
	});
var $author$project$Parser$Pattern$pchar = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (c, spc) {
						return A2(
							$author$project$Language$Syntax$PChar,
							_List_fromArray(
								[spc]),
							c);
					})),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Utils$mchar,
			$elm$parser$Parser$symbol('\''))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Pattern$pempList = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (spc1, spc2) {
						return $author$project$Language$Syntax$PEmpList(
							_List_fromArray(
								[spc1, spc2]));
					})),
			$elm$parser$Parser$symbol('[')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$WhiteSpace$mspaces,
			$elm$parser$Parser$symbol(']'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Language$Syntax$PFalse = function (a) {
	return {$: 'PFalse', a: a};
};
var $author$project$Parser$Pattern$pfalse = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$PFalse(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('false')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Language$Syntax$PFloat = F2(
	function (a, b) {
		return {$: 'PFloat', a: a, b: b};
	});
var $author$project$Parser$Pattern$pfloat = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (n, spc) {
							return A2(
								$author$project$Language$Syntax$PFloat,
								_List_fromArray(
									[spc]),
								n);
						})),
				$elm$parser$Parser$number(
					{
						binary: $elm$core$Maybe$Nothing,
						_float: $elm$core$Maybe$Just($elm$core$Basics$identity),
						hex: $elm$core$Maybe$Nothing,
						_int: $elm$core$Maybe$Just($elm$core$Basics$toFloat),
						octal: $elm$core$Maybe$Nothing
					})),
			$author$project$Parser$WhiteSpace$mspaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (n, spc) {
								return A2(
									$author$project$Language$Syntax$PFloat,
									_List_fromArray(
										[spc]),
									-n);
							})),
					$elm$parser$Parser$symbol('-')),
				$elm$parser$Parser$float),
			$author$project$Parser$WhiteSpace$mspaces)
		]));
var $author$project$Language$Syntax$PNil = function (a) {
	return {$: 'PNil', a: a};
};
var $author$project$Parser$Pattern$pnil = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$PNil(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('nil')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Language$Syntax$PString = F2(
	function (a, b) {
		return {$: 'PString', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.context)) : A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, newOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$chompUntil = function (str) {
	return $elm$parser$Parser$Advanced$chompUntil(
		$elm$parser$Parser$toToken(str));
};
var $author$project$Parser$Utils$mstring = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompUntil('\"'));
var $author$project$Parser$Pattern$pstring = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, spc) {
						return A2(
							$author$project$Language$Syntax$PString,
							_List_fromArray(
								[spc]),
							s);
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Utils$mstring,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Pattern$ptermListToPList = function (ls) {
	if (!ls.b) {
		return $author$project$Language$Syntax$PEmpList(_List_Nil);
	} else {
		var _v1 = ls.a;
		var p = _v1.a;
		var ws = _v1.b;
		var ps = ls.b;
		return A3(
			$author$project$Language$Syntax$PList,
			ws,
			p,
			$author$project$Parser$Pattern$ptermListToPList(ps));
	}
};
var $author$project$Language$Syntax$PTrue = function (a) {
	return {$: 'PTrue', a: a};
};
var $author$project$Parser$Pattern$ptrue = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$PTrue(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Pattern$pvar = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (vn, spc) {
							return A2(
								$author$project$Language$Syntax$PVar,
								_List_fromArray(
									[spc]),
								vn);
						})),
				$author$project$Parser$Utils$varName),
			$author$project$Parser$WhiteSpace$mspaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (vn, spc) {
								return A2(
									$author$project$Language$Syntax$PVar,
									_List_fromArray(
										[spc]),
									'*' + vn);
							})),
					$elm$parser$Parser$symbol('*')),
				$author$project$Parser$Utils$varName),
			$author$project$Parser$WhiteSpace$mspaces)
		]));
var $author$project$Parser$Pattern$pListHelper = function (revPats) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F2(
								function (spc, p) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												p,
												_List_fromArray(
													[spc])),
											revPats));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$Parser$WhiteSpace$mspaces),
				$elm$parser$Parser$lazy(
					function (_v3) {
						return $author$project$Parser$Pattern$cyclic$pattern();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v4) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revPats));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser$Pattern$cyclic$pterm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser$Pattern$pvar,
				$author$project$Parser$Pattern$pnil,
				$elm$parser$Parser$backtrackable($author$project$Parser$Pattern$pempList),
				$author$project$Parser$Pattern$cyclic$pList(),
				$elm$parser$Parser$backtrackable($author$project$Parser$Pattern$pfloat),
				$author$project$Parser$Pattern$ptrue,
				$author$project$Parser$Pattern$pfalse,
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Pattern$cyclic$ptuple()),
				$author$project$Parser$Pattern$pstring,
				$author$project$Parser$Pattern$pchar
			]));
}
function $author$project$Parser$Pattern$cyclic$pList() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (spc1, p, ps, spc2) {
									return A3(
										$author$project$Language$Syntax$PList,
										_List_fromArray(
											[spc1, spc2]),
										p,
										ps);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$Parser$WhiteSpace$mspaces),
				$elm$parser$Parser$lazy(
					function (_v5) {
						return $author$project$Parser$Pattern$cyclic$pattern();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser$Pattern$cyclic$pListloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$Parser$WhiteSpace$mspaces);
}
function $author$project$Parser$Pattern$cyclic$pListloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser$Pattern$ptermListToPList,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Pattern$pListHelper));
}
function $author$project$Parser$Pattern$cyclic$pattern() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser$Pattern$pConsOp,
		$elm$parser$Parser$lazy(
			function (_v2) {
				return $author$project$Parser$Pattern$cyclic$pterm();
			}));
}
function $author$project$Parser$Pattern$cyclic$ptuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								F5(
									function (spc1, p1, spc2, p2, spc3) {
										return A3(
											$author$project$Language$Syntax$PTuple,
											_List_fromArray(
												[spc1, spc2, spc3]),
											p1,
											p2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$Parser$WhiteSpace$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v0) {
								return $author$project$Parser$Pattern$cyclic$pattern();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser$WhiteSpace$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v1) {
						return $author$project$Parser$Pattern$cyclic$pattern();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser$WhiteSpace$mspaces);
}
try {
	var $author$project$Parser$Pattern$pterm = $author$project$Parser$Pattern$cyclic$pterm();
	$author$project$Parser$Pattern$cyclic$pterm = function () {
		return $author$project$Parser$Pattern$pterm;
	};
	var $author$project$Parser$Pattern$pList = $author$project$Parser$Pattern$cyclic$pList();
	$author$project$Parser$Pattern$cyclic$pList = function () {
		return $author$project$Parser$Pattern$pList;
	};
	var $author$project$Parser$Pattern$pListloop = $author$project$Parser$Pattern$cyclic$pListloop();
	$author$project$Parser$Pattern$cyclic$pListloop = function () {
		return $author$project$Parser$Pattern$pListloop;
	};
	var $author$project$Parser$Pattern$pattern = $author$project$Parser$Pattern$cyclic$pattern();
	$author$project$Parser$Pattern$cyclic$pattern = function () {
		return $author$project$Parser$Pattern$pattern;
	};
	var $author$project$Parser$Pattern$ptuple = $author$project$Parser$Pattern$cyclic$ptuple();
	$author$project$Parser$Pattern$cyclic$ptuple = function () {
		return $author$project$Parser$Pattern$ptuple;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser.Pattern` are causing infinite recursion:\n\n  ┌─────┐\n  │    pterm\n  │     ↓\n  │    pList\n  │     ↓\n  │    pListloop\n  │     ↓\n  │    pListHelper\n  │     ↓\n  │    pattern\n  │     ↓\n  │    ptuple\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $Punie$elm_parser_extras$Parser$Extras$manyHelp = F2(
	function (p, vs) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						function (v) {
							return $elm$parser$Parser$Loop(
								A2($elm$core$List$cons, v, vs));
						}),
					A2($elm$parser$Parser$ignorer, p, $elm$parser$Parser$spaces)),
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return $elm$parser$Parser$Done(
							$elm$core$List$reverse(vs));
					},
					$elm$parser$Parser$succeed(_Utils_Tuple0))
				]));
	});
var $Punie$elm_parser_extras$Parser$Extras$many = function (p) {
	return A2(
		$elm$parser$Parser$loop,
		_List_Nil,
		$Punie$elm_parser_extras$Parser$Extras$manyHelp(p));
};
var $Punie$elm_parser_extras$Parser$Extras$some = function (p) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			A2($elm$parser$Parser$ignorer, p, $elm$parser$Parser$spaces)),
		$Punie$elm_parser_extras$Parser$Extras$many(p));
};
var $author$project$Parser$Exp$string = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				F2(
					function (s, spc) {
						return A2(
							$author$project$Language$Syntax$EString,
							_List_fromArray(
								[spc]),
							s);
					})),
			$elm$parser$Parser$symbol('\"')),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Utils$mstring,
			$elm$parser$Parser$symbol('\"'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$true = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (spc) {
				return $author$project$Language$Syntax$ETrue(
					_List_fromArray(
						[spc]));
			}),
		$elm$parser$Parser$keyword('true')),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$var = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (vn, spc) {
							return A2(
								$author$project$Language$Syntax$EVar,
								_List_fromArray(
									[spc]),
								vn);
						})),
				$author$project$Parser$Utils$varName),
			$author$project$Parser$WhiteSpace$mspaces),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (vn, spc) {
								return A2(
									$author$project$Language$Syntax$EVar,
									_List_fromArray(
										[spc]),
									'*' + vn);
							})),
					$elm$parser$Parser$symbol('*')),
				$author$project$Parser$Utils$varName),
			$author$project$Parser$WhiteSpace$mspaces)
		]));
var $author$project$Parser$Exp$listHelper = function (revExps) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F2(
								function (spc, e) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												e,
												_List_fromArray(
													[spc])),
											revExps));
								})),
						$elm$parser$Parser$symbol(',')),
					$author$project$Parser$WhiteSpace$mspaces),
				$elm$parser$Parser$lazy(
					function (_v7) {
						return $author$project$Parser$Exp$cyclic$exp();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v8) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revExps));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser$Exp$cyclic$term_app() {
	var foldl1 = F2(
		function (f, _v17) {
			var x = _v17.a;
			var xs = _v17.b;
			return A3(
				$elm$core$List$foldl,
				$author$project$Parser$Exp$flip(f),
				x,
				xs);
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed(
			foldl1(
				$author$project$Language$Syntax$EApp(_List_Nil))),
		$Punie$elm_parser_extras$Parser$Extras$some(
			$author$project$Parser$Exp$cyclic$aexpr()));
}
function $author$project$Parser$Exp$cyclic$aexpr() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser$Exp$cyclic$emap(),
				$author$project$Parser$Exp$cyclic$unwrap(),
				$author$project$Parser$Exp$cyclic$rect(),
				$author$project$Parser$Exp$cyclic$circle(),
				$author$project$Parser$Exp$cyclic$ellipse(),
				$author$project$Parser$Exp$cyclic$line(),
				$author$project$Parser$Exp$cyclic$polygon(),
				$author$project$Parser$Exp$cyclic$group(),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Exp$cyclic$mparens()),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Exp$cyclic$tuple()),
				$author$project$Parser$Exp$true,
				$author$project$Parser$Exp$false,
				$elm$parser$Parser$backtrackable($author$project$Parser$Exp$mfloat),
				$elm$parser$Parser$backtrackable($author$project$Parser$Exp$var),
				$author$project$Parser$Exp$cyclic$abs(),
				$author$project$Parser$Exp$cyclic$mlet(),
				$author$project$Parser$Exp$cyclic$letrec(),
				$author$project$Parser$Exp$cyclic$caseOf(),
				$elm$parser$Parser$backtrackable($author$project$Parser$Exp$nil),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Exp$cyclic$list()),
				$author$project$Parser$Exp$char,
				$author$project$Parser$Exp$string,
				$elm$parser$Parser$backtrackable($author$project$Parser$Exp$empList)
			]));
}
function $author$project$Parser$Exp$cyclic$abs() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (spc1, p, spc2, e) {
									return A3(
										$author$project$Language$Syntax$ELam,
										_List_fromArray(
											[spc1, spc2]),
										p,
										e);
								})),
						$elm$parser$Parser$symbol('\\')),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Pattern$pattern,
					$elm$parser$Parser$symbol('->'))),
			$author$project$Parser$WhiteSpace$mspaces),
		$elm$parser$Parser$lazy(
			function (_v16) {
				return $author$project$Parser$Exp$cyclic$exp();
			}));
}
function $author$project$Parser$Exp$cyclic$caseOf() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (spc1, e, spc2, b) {
									return A3(
										$author$project$Language$Syntax$ECase,
										_List_fromArray(
											[spc1, spc2]),
										e,
										b);
								})),
						$elm$parser$Parser$keyword('case')),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v15) {
							return $author$project$Parser$Exp$cyclic$exp();
						}),
					$elm$parser$Parser$keyword('of'))),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$branch());
}
function $author$project$Parser$Exp$cyclic$branch() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser$Exp$branchOp,
		$author$project$Parser$Exp$cyclic$sinBranch());
}
function $author$project$Parser$Exp$cyclic$circle() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'circle',
								e);
						})),
				$elm$parser$Parser$keyword('circle')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$ellipse() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'ellipse',
								e);
						})),
				$elm$parser$Parser$keyword('ellipse')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$emap() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F3(
							function (spc, e1, e2) {
								return A3(
									$author$project$Language$Syntax$EMap,
									_List_fromArray(
										[spc]),
									e1,
									e2);
							})),
					$elm$parser$Parser$keyword('Graphic.map')),
				$author$project$Parser$WhiteSpace$mspaces),
			$elm$parser$Parser$lazy(
				function (_v13) {
					return $author$project$Parser$Exp$cyclic$aexpr();
				})),
		$elm$parser$Parser$lazy(
			function (_v14) {
				return $author$project$Parser$Exp$cyclic$aexpr();
			}));
}
function $author$project$Parser$Exp$cyclic$exp() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser$Exp$operators,
		$elm$parser$Parser$lazy(
			function (_v12) {
				return $author$project$Parser$Exp$cyclic$term_app();
			}));
}
function $author$project$Parser$Exp$cyclic$group() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'g',
								e);
						})),
				$elm$parser$Parser$keyword('g')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$letrec() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(
									F6(
										function (spc1, p, spc2, e1, spc3, e2) {
											return A3(
												$author$project$Language$Syntax$EApp,
												_List_fromArray(
													['LETREC', spc1, spc2, spc3]),
												A3($author$project$Language$Syntax$ELam, _List_Nil, p, e2),
												A2(
													$author$project$Language$Syntax$EFix,
													_List_Nil,
													A3($author$project$Language$Syntax$ELam, _List_Nil, p, e1)));
										})),
								$elm$parser$Parser$keyword('letrec')),
							$author$project$Parser$WhiteSpace$mspaces),
						A2(
							$elm$parser$Parser$ignorer,
							$author$project$Parser$Pattern$pattern,
							$elm$parser$Parser$symbol('='))),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v10) {
							return $author$project$Parser$Exp$cyclic$exp();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$Parser$WhiteSpace$mspaces),
		$elm$parser$Parser$lazy(
			function (_v11) {
				return $author$project$Parser$Exp$cyclic$exp();
			}));
}
function $author$project$Parser$Exp$cyclic$line() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'line',
								e);
						})),
				$elm$parser$Parser$keyword('line')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$rect() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'rect',
								e);
						})),
				$elm$parser$Parser$keyword('rect')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$polygon() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (s, e) {
							return A3(
								$author$project$Language$Syntax$EGraphic,
								_List_fromArray(
									[s]),
								'polygon',
								e);
						})),
				$elm$parser$Parser$keyword('polygon')),
			$author$project$Parser$WhiteSpace$mspaces),
		$author$project$Parser$Exp$cyclic$list());
}
function $author$project$Parser$Exp$cyclic$list() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F4(
								function (spc1, e1, e2, spc2) {
									return A3(
										$author$project$Language$Syntax$EList,
										_List_fromArray(
											[spc1, spc2]),
										e1,
										e2);
								})),
						$elm$parser$Parser$symbol('[')),
					$author$project$Parser$WhiteSpace$mspaces),
				$elm$parser$Parser$lazy(
					function (_v9) {
						return $author$project$Parser$Exp$cyclic$exp();
					})),
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser$Exp$cyclic$listloop(),
				$elm$parser$Parser$symbol(']'))),
		$author$project$Parser$WhiteSpace$mspaces);
}
function $author$project$Parser$Exp$cyclic$listloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser$Exp$exprListToEList,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Exp$listHelper));
}
function $author$project$Parser$Exp$cyclic$mlet() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(
									F6(
										function (spc1, p, spc2, e1, spc3, e2) {
											return A3(
												$author$project$Language$Syntax$EApp,
												_List_fromArray(
													['LET', spc1, spc2, spc3]),
												A3($author$project$Language$Syntax$ELam, _List_Nil, p, e2),
												e1);
										})),
								$elm$parser$Parser$keyword('let')),
							$author$project$Parser$WhiteSpace$mspaces),
						A2(
							$elm$parser$Parser$ignorer,
							$author$project$Parser$Pattern$pattern,
							$elm$parser$Parser$symbol('='))),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v5) {
							return $author$project$Parser$Exp$cyclic$exp();
						}),
					$elm$parser$Parser$keyword('in'))),
			$author$project$Parser$WhiteSpace$mspaces),
		$elm$parser$Parser$lazy(
			function (_v6) {
				return $author$project$Parser$Exp$cyclic$exp();
			}));
}
function $author$project$Parser$Exp$cyclic$mparens() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F3(
							function (spc1, e, spc2) {
								return A2(
									$author$project$Language$Syntax$EParens,
									_List_fromArray(
										[spc1, spc2]),
									e);
							})),
					$elm$parser$Parser$symbol('(')),
				$author$project$Parser$WhiteSpace$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v4) {
						return $author$project$Parser$Exp$cyclic$exp();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser$WhiteSpace$mspaces);
}
function $author$project$Parser$Exp$cyclic$sinBranch() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (p, spc, e) {
							return A3(
								$author$project$Language$Syntax$BSin,
								_List_fromArray(
									[spc]),
								p,
								e);
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Pattern$pattern,
					$elm$parser$Parser$symbol('->'))),
			$author$project$Parser$WhiteSpace$mspaces),
		$elm$parser$Parser$lazy(
			function (_v3) {
				return $author$project$Parser$Exp$cyclic$exp();
			}));
}
function $author$project$Parser$Exp$cyclic$tuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								F5(
									function (spc1, e1, spc2, e2, spc3) {
										return A3(
											$author$project$Language$Syntax$ETuple,
											_List_fromArray(
												[spc1, spc2, spc3]),
											e1,
											e2);
									})),
							$elm$parser$Parser$symbol('(')),
						$author$project$Parser$WhiteSpace$mspaces),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$Parser$Exp$cyclic$exp();
							}),
						$elm$parser$Parser$symbol(','))),
				$author$project$Parser$WhiteSpace$mspaces),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v2) {
						return $author$project$Parser$Exp$cyclic$exp();
					}),
				$elm$parser$Parser$symbol(')'))),
		$author$project$Parser$WhiteSpace$mspaces);
}
function $author$project$Parser$Exp$cyclic$unwrap() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(
					F2(
						function (spc, e) {
							return A2(
								$author$project$Language$Syntax$EUnwrap,
								_List_fromArray(
									[spc]),
								e);
						})),
				$elm$parser$Parser$keyword('Graphic.unwrap')),
			$author$project$Parser$WhiteSpace$mspaces),
		$elm$parser$Parser$lazy(
			function (_v0) {
				return $author$project$Parser$Exp$cyclic$aexpr();
			}));
}
try {
	var $author$project$Parser$Exp$term_app = $author$project$Parser$Exp$cyclic$term_app();
	$author$project$Parser$Exp$cyclic$term_app = function () {
		return $author$project$Parser$Exp$term_app;
	};
	var $author$project$Parser$Exp$aexpr = $author$project$Parser$Exp$cyclic$aexpr();
	$author$project$Parser$Exp$cyclic$aexpr = function () {
		return $author$project$Parser$Exp$aexpr;
	};
	var $author$project$Parser$Exp$abs = $author$project$Parser$Exp$cyclic$abs();
	$author$project$Parser$Exp$cyclic$abs = function () {
		return $author$project$Parser$Exp$abs;
	};
	var $author$project$Parser$Exp$caseOf = $author$project$Parser$Exp$cyclic$caseOf();
	$author$project$Parser$Exp$cyclic$caseOf = function () {
		return $author$project$Parser$Exp$caseOf;
	};
	var $author$project$Parser$Exp$branch = $author$project$Parser$Exp$cyclic$branch();
	$author$project$Parser$Exp$cyclic$branch = function () {
		return $author$project$Parser$Exp$branch;
	};
	var $author$project$Parser$Exp$circle = $author$project$Parser$Exp$cyclic$circle();
	$author$project$Parser$Exp$cyclic$circle = function () {
		return $author$project$Parser$Exp$circle;
	};
	var $author$project$Parser$Exp$ellipse = $author$project$Parser$Exp$cyclic$ellipse();
	$author$project$Parser$Exp$cyclic$ellipse = function () {
		return $author$project$Parser$Exp$ellipse;
	};
	var $author$project$Parser$Exp$emap = $author$project$Parser$Exp$cyclic$emap();
	$author$project$Parser$Exp$cyclic$emap = function () {
		return $author$project$Parser$Exp$emap;
	};
	var $author$project$Parser$Exp$exp = $author$project$Parser$Exp$cyclic$exp();
	$author$project$Parser$Exp$cyclic$exp = function () {
		return $author$project$Parser$Exp$exp;
	};
	var $author$project$Parser$Exp$group = $author$project$Parser$Exp$cyclic$group();
	$author$project$Parser$Exp$cyclic$group = function () {
		return $author$project$Parser$Exp$group;
	};
	var $author$project$Parser$Exp$letrec = $author$project$Parser$Exp$cyclic$letrec();
	$author$project$Parser$Exp$cyclic$letrec = function () {
		return $author$project$Parser$Exp$letrec;
	};
	var $author$project$Parser$Exp$line = $author$project$Parser$Exp$cyclic$line();
	$author$project$Parser$Exp$cyclic$line = function () {
		return $author$project$Parser$Exp$line;
	};
	var $author$project$Parser$Exp$rect = $author$project$Parser$Exp$cyclic$rect();
	$author$project$Parser$Exp$cyclic$rect = function () {
		return $author$project$Parser$Exp$rect;
	};
	var $author$project$Parser$Exp$polygon = $author$project$Parser$Exp$cyclic$polygon();
	$author$project$Parser$Exp$cyclic$polygon = function () {
		return $author$project$Parser$Exp$polygon;
	};
	var $author$project$Parser$Exp$list = $author$project$Parser$Exp$cyclic$list();
	$author$project$Parser$Exp$cyclic$list = function () {
		return $author$project$Parser$Exp$list;
	};
	var $author$project$Parser$Exp$listloop = $author$project$Parser$Exp$cyclic$listloop();
	$author$project$Parser$Exp$cyclic$listloop = function () {
		return $author$project$Parser$Exp$listloop;
	};
	var $author$project$Parser$Exp$mlet = $author$project$Parser$Exp$cyclic$mlet();
	$author$project$Parser$Exp$cyclic$mlet = function () {
		return $author$project$Parser$Exp$mlet;
	};
	var $author$project$Parser$Exp$mparens = $author$project$Parser$Exp$cyclic$mparens();
	$author$project$Parser$Exp$cyclic$mparens = function () {
		return $author$project$Parser$Exp$mparens;
	};
	var $author$project$Parser$Exp$sinBranch = $author$project$Parser$Exp$cyclic$sinBranch();
	$author$project$Parser$Exp$cyclic$sinBranch = function () {
		return $author$project$Parser$Exp$sinBranch;
	};
	var $author$project$Parser$Exp$tuple = $author$project$Parser$Exp$cyclic$tuple();
	$author$project$Parser$Exp$cyclic$tuple = function () {
		return $author$project$Parser$Exp$tuple;
	};
	var $author$project$Parser$Exp$unwrap = $author$project$Parser$Exp$cyclic$unwrap();
	$author$project$Parser$Exp$cyclic$unwrap = function () {
		return $author$project$Parser$Exp$unwrap;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser.Exp` are causing infinite recursion:\n\n  ┌─────┐\n  │    term_app\n  │     ↓\n  │    aexpr\n  │     ↓\n  │    abs\n  │     ↓\n  │    caseOf\n  │     ↓\n  │    branch\n  │     ↓\n  │    circle\n  │     ↓\n  │    ellipse\n  │     ↓\n  │    emap\n  │     ↓\n  │    exp\n  │     ↓\n  │    group\n  │     ↓\n  │    letrec\n  │     ↓\n  │    line\n  │     ↓\n  │    rect\n  │     ↓\n  │    polygon\n  │     ↓\n  │    list\n  │     ↓\n  │    listloop\n  │     ↓\n  │    listHelper\n  │     ↓\n  │    mlet\n  │     ↓\n  │    mparens\n  │     ↓\n  │    sinBranch\n  │     ↓\n  │    tuple\n  │     ↓\n  │    unwrap\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$Parser$Delta$insert = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Language$Syntax$DInsert),
				$elm$parser$Parser$keyword('insert')),
			$elm$parser$Parser$spaces),
		A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces)),
	A2($elm$parser$Parser$ignorer, $author$project$Parser$Delta$param, $elm$parser$Parser$spaces));
var $author$project$Parser$Delta$mem = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Language$Syntax$DMem),
				$elm$parser$Parser$keyword('mem')),
			$elm$parser$Parser$spaces),
		A2($elm$parser$Parser$ignorer, $author$project$Parser$Utils$varName, $elm$parser$Parser$spaces)),
	$author$project$Parser$Delta$plist);
var $author$project$Parser$Delta$dcom = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$DCom),
		$elm$parser$Parser$symbol('.')),
	$elm$parser$Parser$spaces);
var $author$project$Parser$Delta$dcons = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($author$project$Language$Syntax$DCons),
		$elm$parser$Parser$symbol('::')),
	$elm$parser$Parser$spaces);
var $author$project$Parser$Delta$operators = _List_fromArray(
	[
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$Parser$Delta$dcons, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		]),
		_List_fromArray(
		[
			A2($Punie$elm_parser_extras$Parser$Expression$Infix, $author$project$Parser$Delta$dcom, $Punie$elm_parser_extras$Parser$Expression$AssocRight)
		])
	]);
var $author$project$Parser$Delta$rewr = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Language$Syntax$DRewr),
			$elm$parser$Parser$keyword('rewr')),
		$elm$parser$Parser$spaces),
	$author$project$Parser$Delta$param);
var $author$project$Parser$Delta$listHelper = function (revDeltas) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							function (d) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, d, revDeltas));
							}),
						$elm$parser$Parser$symbol(',')),
					$elm$parser$Parser$spaces),
				$elm$parser$Parser$lazy(
					function (_v1) {
						return $author$project$Parser$Delta$cyclic$delta();
					})),
				A2(
				$elm$parser$Parser$map,
				function (_v2) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revDeltas));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
function $author$project$Parser$Delta$cyclic$temp() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Parser$Delta$did,
				$author$project$Parser$Delta$cyclic$dmap(),
				$author$project$Parser$Delta$dadd,
				$author$project$Parser$Delta$dmul,
				$author$project$Parser$Delta$cyclic$list(),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Delta$cyclic$dparens()),
				$elm$parser$Parser$backtrackable(
				$author$project$Parser$Delta$cyclic$dtuple()),
				$author$project$Parser$Delta$cyclic$dfun(),
				$author$project$Parser$Delta$cyclic$dapp(),
				$author$project$Parser$Delta$cyclic$dgen(),
				$author$project$Parser$Delta$copy,
				$author$project$Parser$Delta$insert,
				$author$project$Parser$Delta$delete,
				$author$project$Parser$Delta$cyclic$modify(),
				$author$project$Parser$Delta$rewr,
				$author$project$Parser$Delta$abst,
				$author$project$Parser$Delta$cyclic$ctt(),
				$author$project$Parser$Delta$mem,
				$author$project$Parser$Delta$cyclic$group()
			]));
}
function $author$project$Parser$Delta$cyclic$ctt() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DCtt),
					$elm$parser$Parser$symbol('?')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Pattern$pattern,
					$elm$parser$Parser$symbol('=>')),
				$elm$parser$Parser$spaces)),
		$author$project$Parser$Delta$cyclic$delta());
}
function $author$project$Parser$Delta$cyclic$dapp() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed(
				F2(
					function (p, d) {
						return A2($author$project$Language$Syntax$DApp, d, p);
					})),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Delta$param,
					$elm$parser$Parser$symbol('|>')),
				$elm$parser$Parser$spaces)),
		$elm$parser$Parser$lazy(
			function (_v12) {
				return $author$project$Parser$Delta$cyclic$delta();
			}));
}
function $author$project$Parser$Delta$cyclic$delta() {
	return A2(
		$Punie$elm_parser_extras$Parser$Expression$buildExpressionParser,
		$author$project$Parser$Delta$operators,
		$elm$parser$Parser$lazy(
			function (_v11) {
				return $author$project$Parser$Delta$cyclic$temp();
			}));
}
function $author$project$Parser$Delta$cyclic$dfun() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DFun),
					$elm$parser$Parser$symbol('\\')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Pattern$pattern,
					$elm$parser$Parser$symbol('->')),
				$elm$parser$Parser$spaces)),
		$elm$parser$Parser$lazy(
			function (_v10) {
				return $author$project$Parser$Delta$cyclic$delta();
			}));
}
function $author$project$Parser$Delta$cyclic$dgen() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							F3(
								function (d, e, p) {
									return A3($author$project$Language$Syntax$DGen, e, d, p);
								})),
						$elm$parser$Parser$symbol('{')),
					$elm$parser$Parser$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v9) {
								return $author$project$Parser$Delta$cyclic$delta();
							}),
						$elm$parser$Parser$symbol('|')),
					$elm$parser$Parser$spaces)),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Exp$exp,
					$elm$parser$Parser$symbol('<|')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser$Delta$param,
				$elm$parser$Parser$symbol('}')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$dmap() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Language$Syntax$DMap),
				$elm$parser$Parser$keyword('Graphic.map')),
			$elm$parser$Parser$spaces),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$lazy(
				function (_v8) {
					return $author$project$Parser$Delta$cyclic$delta();
				}),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$dparens() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$symbol('(')),
			$elm$parser$Parser$spaces),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v7) {
						return $author$project$Parser$Delta$cyclic$delta();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$dtuple() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DTuple),
					$elm$parser$Parser$symbol('(')),
				$elm$parser$Parser$spaces),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v5) {
							return $author$project$Parser$Delta$cyclic$delta();
						}),
					$elm$parser$Parser$symbol(',')),
				$elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v6) {
						return $author$project$Parser$Delta$cyclic$delta();
					}),
				$elm$parser$Parser$symbol(')')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$group() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DGroup),
					$elm$parser$Parser$keyword('group')),
				$elm$parser$Parser$spaces),
			A2($elm$parser$Parser$ignorer, $author$project$Parser$Utils$varName, $elm$parser$Parser$spaces)),
		$elm$parser$Parser$lazy(
			function (_v4) {
				return $author$project$Parser$Delta$cyclic$delta();
			}));
}
function $author$project$Parser$Delta$cyclic$list() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DCons),
					$elm$parser$Parser$symbol('[')),
				$elm$parser$Parser$spaces),
			$elm$parser$Parser$lazy(
				function (_v3) {
					return $author$project$Parser$Delta$cyclic$delta();
				})),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$author$project$Parser$Delta$cyclic$listloop(),
				$elm$parser$Parser$symbol(']')),
			$elm$parser$Parser$spaces));
}
function $author$project$Parser$Delta$cyclic$listloop() {
	return A2(
		$elm$parser$Parser$map,
		$author$project$Parser$Delta$deltaListToDCons,
		A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Delta$listHelper));
}
function $author$project$Parser$Delta$cyclic$modify() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($author$project$Language$Syntax$DModify),
					$elm$parser$Parser$keyword('modify')),
				$elm$parser$Parser$spaces),
			A2($elm$parser$Parser$ignorer, $elm$parser$Parser$int, $elm$parser$Parser$spaces)),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$lazy(
				function (_v0) {
					return $author$project$Parser$Delta$cyclic$delta();
				}),
			$elm$parser$Parser$spaces));
}
try {
	var $author$project$Parser$Delta$temp = $author$project$Parser$Delta$cyclic$temp();
	$author$project$Parser$Delta$cyclic$temp = function () {
		return $author$project$Parser$Delta$temp;
	};
	var $author$project$Parser$Delta$ctt = $author$project$Parser$Delta$cyclic$ctt();
	$author$project$Parser$Delta$cyclic$ctt = function () {
		return $author$project$Parser$Delta$ctt;
	};
	var $author$project$Parser$Delta$dapp = $author$project$Parser$Delta$cyclic$dapp();
	$author$project$Parser$Delta$cyclic$dapp = function () {
		return $author$project$Parser$Delta$dapp;
	};
	var $author$project$Parser$Delta$delta = $author$project$Parser$Delta$cyclic$delta();
	$author$project$Parser$Delta$cyclic$delta = function () {
		return $author$project$Parser$Delta$delta;
	};
	var $author$project$Parser$Delta$dfun = $author$project$Parser$Delta$cyclic$dfun();
	$author$project$Parser$Delta$cyclic$dfun = function () {
		return $author$project$Parser$Delta$dfun;
	};
	var $author$project$Parser$Delta$dgen = $author$project$Parser$Delta$cyclic$dgen();
	$author$project$Parser$Delta$cyclic$dgen = function () {
		return $author$project$Parser$Delta$dgen;
	};
	var $author$project$Parser$Delta$dmap = $author$project$Parser$Delta$cyclic$dmap();
	$author$project$Parser$Delta$cyclic$dmap = function () {
		return $author$project$Parser$Delta$dmap;
	};
	var $author$project$Parser$Delta$dparens = $author$project$Parser$Delta$cyclic$dparens();
	$author$project$Parser$Delta$cyclic$dparens = function () {
		return $author$project$Parser$Delta$dparens;
	};
	var $author$project$Parser$Delta$dtuple = $author$project$Parser$Delta$cyclic$dtuple();
	$author$project$Parser$Delta$cyclic$dtuple = function () {
		return $author$project$Parser$Delta$dtuple;
	};
	var $author$project$Parser$Delta$group = $author$project$Parser$Delta$cyclic$group();
	$author$project$Parser$Delta$cyclic$group = function () {
		return $author$project$Parser$Delta$group;
	};
	var $author$project$Parser$Delta$list = $author$project$Parser$Delta$cyclic$list();
	$author$project$Parser$Delta$cyclic$list = function () {
		return $author$project$Parser$Delta$list;
	};
	var $author$project$Parser$Delta$listloop = $author$project$Parser$Delta$cyclic$listloop();
	$author$project$Parser$Delta$cyclic$listloop = function () {
		return $author$project$Parser$Delta$listloop;
	};
	var $author$project$Parser$Delta$modify = $author$project$Parser$Delta$cyclic$modify();
	$author$project$Parser$Delta$cyclic$modify = function () {
		return $author$project$Parser$Delta$modify;
	};
} catch ($) {
	throw 'Some top-level definitions from `Parser.Delta` are causing infinite recursion:\n\n  ┌─────┐\n  │    temp\n  │     ↓\n  │    ctt\n  │     ↓\n  │    dapp\n  │     ↓\n  │    delta\n  │     ↓\n  │    dfun\n  │     ↓\n  │    dgen\n  │     ↓\n  │    dmap\n  │     ↓\n  │    dparens\n  │     ↓\n  │    dtuple\n  │     ↓\n  │    group\n  │     ↓\n  │    list\n  │     ↓\n  │    listloop\n  │     ↓\n  │    listHelper\n  │     ↓\n  │    modify\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Parser$Delta$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$Parser$Delta$delta, $elm$parser$Parser$end));
var $author$project$Parser$Exp$getFuncDef = F2(
	function (params, e) {
		if (!params.b) {
			return e;
		} else {
			var p = params.a;
			var ps = params.b;
			return A3(
				$author$project$Language$Syntax$ELam,
				_List_Nil,
				p,
				A2($author$project$Parser$Exp$getFuncDef, ps, e));
		}
	});
var $author$project$Parser$Exp$paramHelper = function (revExps) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (p) {
						return $elm$parser$Parser$Loop(
							A2($elm$core$List$cons, p, revExps));
					}),
				$author$project$Parser$Pattern$pattern),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revExps));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$Parser$Exp$paramLoop = A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Exp$paramHelper);
var $author$project$Parser$Exp$equation = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							F6(
								function (p, spc1, params, spc2, e1, spc3) {
									return function (e2) {
										return A3(
											$author$project$Language$Syntax$EApp,
											_List_fromArray(
												['EQ', spc1, spc2, spc3]),
											A3($author$project$Language$Syntax$ELam, _List_Nil, p, e2),
											A2($author$project$Parser$Exp$getFuncDef, params, e1));
									};
								})),
						$author$project$Parser$Pattern$pvar),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Exp$paramLoop,
					$elm$parser$Parser$symbol('='))),
			$author$project$Parser$WhiteSpace$mspaces),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Exp$exp,
			$elm$parser$Parser$symbol(';'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$recursion = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							F6(
								function (p, spc1, params, spc2, e1, spc3) {
									return function (e2) {
										return A3(
											$author$project$Language$Syntax$EApp,
											_List_fromArray(
												['Rec', spc1, spc2, spc3]),
											A3($author$project$Language$Syntax$ELam, _List_Nil, p, e2),
											A2(
												$author$project$Language$Syntax$EFix,
												_List_Nil,
												A3(
													$author$project$Language$Syntax$ELam,
													_List_Nil,
													p,
													A2($author$project$Parser$Exp$getFuncDef, params, e1))));
									};
								})),
						$author$project$Parser$Pattern$pvar),
					$author$project$Parser$WhiteSpace$mspaces),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$Parser$Exp$paramLoop,
					$elm$parser$Parser$symbol(':='))),
			$author$project$Parser$WhiteSpace$mspaces),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Parser$Exp$exp,
			$elm$parser$Parser$symbol(';'))),
	$author$project$Parser$WhiteSpace$mspaces);
var $author$project$Parser$Exp$statement = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$backtrackable($author$project$Parser$Exp$equation),
			$author$project$Parser$Exp$recursion
		]));
var $author$project$Parser$Exp$equationHelper = function (revExps) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (f) {
						return $elm$parser$Parser$Loop(
							A2($elm$core$List$cons, f, revExps));
					}),
				$author$project$Parser$Exp$statement),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revExps));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $author$project$Parser$Exp$equationLoop = A2(
	$elm$parser$Parser$andThen,
	function (ls) {
		return $elm$parser$Parser$succeed(
			A3(
				$elm$core$List$foldr,
				F2(
					function (f, e) {
						return f(e);
					}),
				A2($author$project$Language$Syntax$EVar, _List_Nil, 'main'),
				ls));
	},
	A2($elm$parser$Parser$loop, _List_Nil, $author$project$Parser$Exp$equationHelper));
var $author$project$Parser$Exp$parse = $elm$parser$Parser$run(
	A2($elm$parser$Parser$ignorer, $author$project$Parser$Exp$equationLoop, $elm$parser$Parser$end));
var $author$project$Printer$Value$printParam = function (param) {
	switch (param.$) {
		case 'ANil':
			return 'nil';
		case 'ATrue':
			return 'true';
		case 'AFalse':
			return 'false';
		case 'AVar':
			var s = param.a;
			return s;
		case 'AFloat':
			var f = param.a;
			return $elm$core$Debug$toString(f);
		case 'AAdd':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' + ' + $author$project$Printer$Value$printParam(p2));
		case 'ASub':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' - ' + $author$project$Printer$Value$printParam(p2));
		case 'AMul':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' * ' + $author$project$Printer$Value$printParam(p2));
		case 'ADiv':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' / ' + $author$project$Printer$Value$printParam(p2));
		case 'ALt':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' < ' + $author$project$Printer$Value$printParam(p2));
		case 'ALe':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' <= ' + $author$project$Printer$Value$printParam(p2));
		case 'AEq':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' == ' + $author$project$Printer$Value$printParam(p2));
		case 'ACons':
			var p1 = param.a;
			var p2 = param.b;
			return $author$project$Printer$Value$printParam(p1) + (' :: ' + $author$project$Printer$Value$printParam(p2));
		case 'ATuple':
			var p1 = param.a;
			var p2 = param.b;
			return '(' + ($author$project$Printer$Value$printParam(p1) + (', ' + ($author$project$Printer$Value$printParam(p2) + ')')));
		case 'AGraphic':
			var s = param.a;
			var p = param.b;
			return s + (' ' + $author$project$Printer$Value$printParam(p));
		case 'AParens':
			var p = param.a;
			return '(' + ($author$project$Printer$Value$printParam(p) + ')');
		default:
			var info = param.a;
			return info;
	}
};
var $author$project$Printer$Value$print = function (v) {
	switch (v.$) {
		case 'VNil':
			return '[]';
		case 'VFloat':
			var n = v.a;
			return $elm$core$Debug$toString(n);
		case 'VTrue':
			return 'true';
		case 'VFalse':
			return 'false';
		case 'VString':
			var s = v.a;
			return '\"' + (s + '\"');
		case 'VChar':
			var c = v.a;
			return '\'' + ($elm$core$String$fromChar(c) + '\'');
		case 'VCons':
			var v1 = v.a;
			var v2 = v.b;
			return '[' + (A2($author$project$Printer$Value$printList, v1, v2) + ']');
		case 'VClosure':
			var env = v.a;
			var p = v.b;
			var e = v.c;
			return '<<< ' + ($author$project$Printer$Value$printEnv(env) + (', ' + ('λ ' + ($author$project$Printer$Pattern$printPattern(p) + ('. ' + ($author$project$Printer$Exp$print(e) + ' >>> '))))));
		case 'VFix':
			var env = v.a;
			var e = v.b;
			return 'fix ' + ($author$project$Printer$Value$printEnv(env) + $author$project$Printer$Exp$print(e));
		case 'VTuple':
			var v1 = v.a;
			var v2 = v.b;
			return '( ' + ($author$project$Printer$Value$print(v1) + (', ' + ($author$project$Printer$Value$print(v2) + ' )')));
		case 'VError':
			var info = v.a;
			return info;
		default:
			return $author$project$Printer$Value$printGraphic(v);
	}
};
var $author$project$Printer$Value$printDelta = function (delta) {
	switch (delta.$) {
		case 'DId':
			return 'id ';
		case 'DAdd':
			var p = delta.a;
			return '+ ' + ($author$project$Printer$Value$printParam(p) + ' ');
		case 'DMul':
			var p = delta.a;
			return '* ' + ($author$project$Printer$Value$printParam(p) + ' ');
		case 'DFix':
			var env = delta.a;
			var e = delta.b;
			return 'fix ' + ($author$project$Printer$Value$printEnv(env) + (' ' + $author$project$Printer$Exp$print(e)));
		case 'DClosure':
			var env = delta.a;
			var p = delta.b;
			var e = delta.c;
			return '( ' + ($author$project$Printer$Value$printEnv(env) + (', ' + ('λ ' + ($author$project$Printer$Pattern$printPattern(p) + ('. ' + ($author$project$Printer$Exp$print(e) + ' ) '))))));
		case 'DCons':
			var d1 = delta.a;
			var d2 = delta.b;
			return $author$project$Printer$Value$printDelta(d1) + (' :: ' + $author$project$Printer$Value$printDelta(d2));
		case 'DInsert':
			var n = delta.a;
			var p = delta.b;
			return 'insert ' + ($elm$core$Debug$toString(n) + (' ' + $author$project$Printer$Value$printParam(p)));
		case 'DModify':
			var n = delta.a;
			var d = delta.b;
			return 'modify ' + ($elm$core$Debug$toString(n) + (' ' + $author$project$Printer$Value$printDelta(d)));
		case 'DDelete':
			var n = delta.a;
			return 'delete ' + $elm$core$Debug$toString(n);
		case 'DCopy':
			var n = delta.a;
			return 'copy ' + $elm$core$Debug$toString(n);
		case 'DTuple':
			var d1 = delta.a;
			var d2 = delta.b;
			return '(' + ($author$project$Printer$Value$printDelta(d1) + (', ' + ($author$project$Printer$Value$printDelta(d2) + ') ')));
		case 'DFun':
			var p = delta.a;
			var d = delta.b;
			return '\\' + ($author$project$Printer$Pattern$printPattern(p) + ('->' + $author$project$Printer$Value$printDelta(d)));
		case 'DApp':
			var d = delta.a;
			var p = delta.b;
			return $author$project$Printer$Value$printParam(p) + ('|>' + $author$project$Printer$Value$printDelta(d));
		case 'DGen':
			var e = delta.a;
			var d = delta.b;
			var p = delta.c;
			return '{' + ($author$project$Printer$Value$printDelta(d) + ('|' + ($author$project$Printer$Exp$print(e) + ('<|' + ($author$project$Printer$Value$printParam(p) + '}')))));
		case 'DRewr':
			var p = delta.a;
			return 'rewr ' + $author$project$Printer$Value$printParam(p);
		case 'DAbst':
			var p = delta.a;
			return '& ' + $author$project$Printer$Value$printParam(p);
		case 'DCtt':
			var p = delta.a;
			var d = delta.b;
			return '? ' + ($author$project$Printer$Pattern$printPattern(p) + ('=> ' + $author$project$Printer$Value$printDelta(d)));
		case 'DCom':
			var d1 = delta.a;
			var d2 = delta.b;
			return $author$project$Printer$Value$printDelta(d1) + (' . ' + $author$project$Printer$Value$printDelta(d2));
		case 'DMem':
			var s = delta.a;
			var ls = delta.b;
			return 'mem ' + (s + (' ' + $elm$core$Debug$toString(ls)));
		case 'DGroup':
			var s = delta.a;
			var d = delta.b;
			return 'group ' + (s + (' ' + $author$project$Printer$Value$printDelta(d)));
		case 'DMap':
			var d = delta.a;
			return 'Graphic.map ' + $author$project$Printer$Value$printDelta(d);
		default:
			var info = delta.a;
			return info;
	}
};
var $author$project$Printer$Value$printEnv = function (env) {
	return '{ ' + ($author$project$Printer$Value$printEnv_(
		A2(
			$elm$core$List$take,
			$elm$core$List$length(env) - 7,
			env)) + '}');
};
var $author$project$Printer$Value$printEnv_ = function (env) {
	if (!env.b) {
		return '';
	} else {
		var _v41 = env.a;
		var s = _v41.a;
		var _v42 = _v41.b;
		var v = _v42.a;
		var d = _v42.b;
		var env_ = env.b;
		return s + (' |-> ' + ($author$project$Printer$Value$print(v) + ('\n' + ('Delta: ' + ($author$project$Printer$Value$printDelta(d) + ('\n\n' + $author$project$Printer$Value$printEnv_(env_)))))));
	}
};
var $author$project$Printer$Value$printFill = function (color) {
	return 'fill=\"hsl(' + ($author$project$Printer$Value$print(color) + ', 100%, 50%)\"');
};
var $author$project$Printer$Value$printGraphic = function (value) {
	_v4$6:
	while (true) {
		if (((value.$ === 'VGraphic') && (value.b.$ === 'VCons')) && (value.b.b.$ === 'VCons')) {
			switch (value.b.b.b.$) {
				case 'VCons':
					switch (value.b.b.b.b.$) {
						case 'VCons':
							if (value.b.b.b.b.b.$ === 'VCons') {
								switch (value.b.b.b.b.b.b.$) {
									case 'VNil':
										if (value.a === 'circle') {
											var _v12 = value.b;
											var rd = _v12.a;
											var _v13 = _v12.b;
											var color = _v13.a;
											var _v14 = _v13.b;
											var x = _v14.a;
											var _v15 = _v14.b;
											var y = _v15.a;
											var _v16 = _v15.b;
											var r = _v16.a;
											var _v17 = _v16.b;
											return '<circle ' + ($author$project$Printer$Value$printFill(color) + (' cx=\"' + ($author$project$Printer$Value$print(x) + ('\" cy=\"' + ($author$project$Printer$Value$print(y) + ('\" r=\"' + ($author$project$Printer$Value$print(r) + ('\" transform=\"rotate(' + ($author$project$Printer$Value$print(rd) + ')\"></circle>')))))))));
										} else {
											break _v4$6;
										}
									case 'VCons':
										if (value.b.b.b.b.b.b.b.$ === 'VNil') {
											switch (value.a) {
												case 'rect':
													var _v5 = value.b;
													var rd = _v5.a;
													var _v6 = _v5.b;
													var color = _v6.a;
													var _v7 = _v6.b;
													var x = _v7.a;
													var _v8 = _v7.b;
													var y = _v8.a;
													var _v9 = _v8.b;
													var w = _v9.a;
													var _v10 = _v9.b;
													var h = _v10.a;
													var _v11 = _v10.b;
													return '<rect ' + ($author$project$Printer$Value$printFill(color) + (' x=\"' + ($author$project$Printer$Value$print(x) + ('\" y=\"' + ($author$project$Printer$Value$print(y) + ('\" width=\"' + ($author$project$Printer$Value$print(w) + ('\" height=\"' + ($author$project$Printer$Value$print(h) + ('\" transform=\"rotate(' + ($author$project$Printer$Value$print(rd) + ')\"></rect>')))))))))));
												case 'ellipse':
													var _v18 = value.b;
													var rd = _v18.a;
													var _v19 = _v18.b;
													var color = _v19.a;
													var _v20 = _v19.b;
													var x = _v20.a;
													var _v21 = _v20.b;
													var y = _v21.a;
													var _v22 = _v21.b;
													var rx = _v22.a;
													var _v23 = _v22.b;
													var ry = _v23.a;
													var _v24 = _v23.b;
													return '<ellipse ' + ($author$project$Printer$Value$printFill(color) + (' cx=\"' + ($author$project$Printer$Value$print(x) + ('\" cy=\"' + ($author$project$Printer$Value$print(y) + ('\" rx=\"' + ($author$project$Printer$Value$print(rx) + ('\" ry=\"' + ($author$project$Printer$Value$print(ry) + ('\" transform=\"rotate(' + ($author$project$Printer$Value$print(rd) + ')\"></ellipse>')))))))))));
												case 'line':
													var _v25 = value.b;
													var rd = _v25.a;
													var _v26 = _v25.b;
													var color = _v26.a;
													var _v27 = _v26.b;
													var x1 = _v27.a;
													var _v28 = _v27.b;
													var y1 = _v28.a;
													var _v29 = _v28.b;
													var x2 = _v29.a;
													var _v30 = _v29.b;
													var y2 = _v30.a;
													var _v31 = _v30.b;
													return '<line ' + ($author$project$Printer$Value$printStroke(color) + (' x1=\"' + ($author$project$Printer$Value$print(x1) + ('\" y1=\"' + ($author$project$Printer$Value$print(y1) + ('\" x2=\"' + ($author$project$Printer$Value$print(x2) + ('\" y2=\"' + ($author$project$Printer$Value$print(y2) + ('\" stroke-width=\"3\" ' + ('transform=\"rotate(' + ($author$project$Printer$Value$print(rd) + ')\"></line>'))))))))))));
												default:
													break _v4$6;
											}
										} else {
											break _v4$6;
										}
									default:
										break _v4$6;
								}
							} else {
								break _v4$6;
							}
						case 'VNil':
							if (value.a === 'polygon') {
								var _v32 = value.b;
								var rd = _v32.a;
								var _v33 = _v32.b;
								var color = _v33.a;
								var _v34 = _v33.b;
								var points = _v34.a;
								var _v35 = _v34.b;
								return '<polygon ' + ($author$project$Printer$Value$printFill(color) + (' points=\"' + ($author$project$Printer$Value$printPoints(points) + ('\" transform=\"rotate(' + ($author$project$Printer$Value$print(rd) + ')\"></polygon>')))));
							} else {
								break _v4$6;
							}
						default:
							break _v4$6;
					}
				case 'VNil':
					if (value.a === 'g') {
						var _v36 = value.b;
						var ra = _v36.a;
						var _v37 = _v36.b;
						var childs = _v37.a;
						var _v38 = _v37.b;
						return '<g transform=\"rotate(' + ($author$project$Printer$Value$print(ra) + (')\">' + ($author$project$Printer$Value$printGraphics(childs) + '</g>')));
					} else {
						break _v4$6;
					}
				default:
					break _v4$6;
			}
		} else {
			break _v4$6;
		}
	}
	var _v39 = A2($elm$core$Debug$log, 'value', value);
	return 'Error 39';
};
var $author$project$Printer$Value$printGraphics = function (value) {
	switch (value.$) {
		case 'VCons':
			var v1 = value.a;
			var v2 = value.b;
			return _Utils_ap(
				$author$project$Printer$Value$print(v1),
				$author$project$Printer$Value$printGraphics(v2));
		case 'VNil':
			return '';
		default:
			return 'Error 49';
	}
};
var $author$project$Printer$Value$printList = F2(
	function (v, vs) {
		switch (vs.$) {
			case 'VNil':
				return $author$project$Printer$Value$print(v);
			case 'VCons':
				var v1 = vs.a;
				var v2 = vs.b;
				return $author$project$Printer$Value$print(v) + (', ' + A2($author$project$Printer$Value$printList, v1, v2));
			default:
				return 'Error 08';
		}
	});
var $author$project$Printer$Value$printPoints = function (points) {
	_v0$2:
	while (true) {
		switch (points.$) {
			case 'VNil':
				return '';
			case 'VCons':
				if (points.a.$ === 'VTuple') {
					var _v1 = points.a;
					var x = _v1.a;
					var y = _v1.b;
					var ps = points.b;
					return $author$project$Printer$Value$print(x) + (',' + ($author$project$Printer$Value$print(y) + (' ' + $author$project$Printer$Value$printPoints(ps))));
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return 'Error 07';
};
var $author$project$Printer$Value$printStroke = function (color) {
	return 'stroke=\"hsl(' + ($author$project$Printer$Value$print(color) + ', 100%, 50%)\"');
};
var $author$project$Main$retCodeFile = _Platform_outgoingPort('retCodeFile', $elm$json$Json$Encode$string);
var $author$project$Main$retNewCode = _Platform_outgoingPort('retNewCode', $elm$json$Json$Encode$string);
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Execute':
				var code = msg.a;
				var _v1 = $author$project$Parser$Exp$parse(
					_Utils_ap($author$project$Language$Preclude$library, code));
				if (_v1.$ === 'Ok') {
					var exp = _v1.a;
					var v = A2($author$project$Language$FEval$feval, _List_Nil, exp);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{exp: exp}),
						$author$project$Main$genCanvas(
							$author$project$Printer$Value$printGraphics(v)));
				} else {
					var info = _v1.a;
					var _v2 = A2(
						$elm$core$Debug$log,
						'Parse Exp',
						$elm$core$Debug$toString(info));
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'Change':
				var d = msg.a;
				var _v3 = $author$project$Parser$Delta$parse(d);
				if (_v3.$ === 'Ok') {
					var delta = _v3.a;
					var _v4 = A4($author$project$Language$BEval$beval, _List_Nil, model.exp, delta, _List_Nil);
					var exp1 = _v4.b;
					var newCode = A2(
						$elm$core$String$dropLeft,
						$elm$core$String$length($author$project$Language$Preclude$library),
						$author$project$Printer$Exp$print(exp1));
					var _v5 = A2(
						$elm$core$Debug$log,
						'Parse Delta',
						$elm$core$Debug$toString(delta));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{exp: exp1}),
						$author$project$Main$retNewCode(newCode));
				} else {
					var info = _v3.a;
					var _v6 = A2(
						$elm$core$Debug$log,
						'Parse Delta',
						$elm$core$Debug$toString(info));
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var f = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$retCodeFile(f));
		}
	});
var $author$project$Model$SelectFile = function (a) {
	return {$: 'SelectFile', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('body')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('menu-bar')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('title'),
								A2($elm$html$Html$Attributes$style, 'width', '70px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('FuseDM')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Model$SelectFile),
								$elm$html$Html$Attributes$class('btn')
							]),
						A2(
							$elm$core$List$map,
							function (s) {
								return A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(s)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(s)
										]));
							},
							model.fileList))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('execute-button'),
						$elm$html$Html$Attributes$class('bx-btn')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('back-button'),
						$elm$html$Html$Attributes$class('bx-btn')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('output-div')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$svg,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('output-svg')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Main$view = $author$project$View$view;
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));