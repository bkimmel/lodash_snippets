var lodash = require("lodash");
var should = require("should");

var int_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var falsy_array = ["hello", false, NaN, undefined, 0, null, false, "world"];
var obj_array = [{"propA": "value", "propB": 3, "propC": true}, {"propA": "value2", "propB": 4, "propC": false}, {"propA": "value2", "propB": 4, "propC": false}];
var some_object = {
	"one": {},
	"two": [0,0,3,4,1,0,9,9],
	"three": {
		"three_one": 20
	},
	"four": null,
	"five": false
};
var food = [
  { 'name': 'apple',  'type': 'fruit', 'organic': true },
  { 'name': 'cucumber',   'type': 'vegetable', 'organic': false },
  { 'name': 'banana', 'type': 'fruit', 'organic': true },
  { 'name': 'beet',   'type': 'vegetable', 'organic': true },
  { 'name': 'orange', 'type': 'fruit', 'organic': false }
];

var t = {};

//LODASH ARRAY STUFF
t.firsttest = some_object.should.have.property('two').with.lengthOf(8);
//_.compact(array): returns array with all falsy things taken out
t.secondtest = lodash.compact(falsy_array).should.have.lengthOf(2);
//_.difference(subject_array, remove_from_subject) : removes elements from first array that === elements from second
t.thirdtest = lodash.difference(int_array, [3,4,5,6,7,8,9]).should.have.lengthOf(3);
//_.first "query style": returns things until it finds one that doesn't match the JSON query
var lodashfirst_query = lodash.first(food, { 'organic': true });
console.log(JSON.stringify(lodashfirst_query));
//_.first "callback style": returns things until the callback returns falsy
var lodashfirst_cb = lodash.first(food, function(value, index, array){ return value.name.length > 4; });
console.log('\n' + JSON.stringify(lodashfirst_cb));

//_.unzip: rearranges array elements by ordinals...kind of cool, seems like it would be pretty useful 
var lodashunzip = lodash.unzip([['moe', 30, true], ['larry', 40, false]]);
console.log('\nUnzip:\n' + JSON.stringify(lodashunzip) + '\n');

//_.zip: opposite of unzip:
var lodashzip = lodash.zip(['moe', 'larry'],[30, 40],[true, false]);
console.log('\nZip:\n' + JSON.stringify(lodashzip) + '\n');

//_.zipobject: 
var lodashzipobject = lodash.zipObject(['name', 'age', 'isStooge'], ["Curly", 40, true, 'other nonbalanced prop']);
console.log('\nZip Object:\n' + JSON.stringify(lodashzipobject) + '\n');

//FUNCTIONAL

//_.partial : apply function left to right and return a function that takes the rest of the args
var greet = function(greeting, name) { return greeting + ' ' + name; };
var hi = lodash.partial(greet, 'hi');
console.log(hi('moe'));

//_.partialRight : wait to get args from final function, apply left to right, then apply args
var greetRight = function(greeting, name) { return greeting + ' ' + name; };
var hiRight = lodash.partialRight(greet, 'curly');
console.log(hiRight('hi'));
console.log(hiRight('hi', 'larry'));

//COLLECTIONS

//_.map *callback way : run the collection (1st arg) through the callback, and return the resulting array
var mapresult = lodash.map(food, function(fooditem){
	return fooditem.organic && (fooditem.type == "fruit") && fooditem.name;
});

console.log('\nmapresult:\n' + JSON.stringify(mapresult) + '\n');

//_.map the 'pluck' way
mapresult = lodash.map(food, "name");
console.log('\nmapresult, pluck:\n' + JSON.stringify(mapresult) + '\n');

//_.map the 'json query' way
mapresult = lodash.map(food, {"type": "vegetable"});
console.log('\nmapresult, json query:\n' + JSON.stringify(mapresult) + '\n');

//OBJECTS

//transform is like reduce, but it mutates the accumulator along the way
var tranformresult = lodash.transform(food, function(acc, val) {
	var ins_type = val.type;
	var ins_name = val.name;
	if (!(acc[ins_type]))
	{
		acc[ins_type] = [];
	}
	
	acc[ins_type].push(ins_name);
	
}, {});

console.log('_transform:\n' + JSON.stringify(tranformresult));

//shortcut for above transform would be _groupBy
var groupByResult = lodash.groupBy(food, "type");
console.log('_groupBy:\n' + JSON.stringify(groupByResult));

//UTILITIES

//_.times : call a function n times and return results in array
var diceRolls = lodash.times(3, (function(){return lodash.random(1, 6);}));
console.log('\n_times:\n' + JSON.stringify(diceRolls) + '\n');

console.log(JSON.stringify(t));

//_.mixin : make your own lodash stuff
lodash.mixin({
	"average": function(inarr){
		return lodash.isArray(inarr) && (function(_i){
			var x = 0;
			for (var i = 0, lim = _i.length; i < lim; i++)
			{
				x = x + _i[i];
			}
			console.log('x: ' + x + ', i_len: ' + _i.length)
			return (_i.length != 0 || 0) && (x / _i.length);
		})(inarr)
	}
});

var avg = lodash.average([2,3,4, 4, 0, 3, 0, 0]);
console.log("avg:\n" + avg);

//templating
var temptext = '<div class="fac"><span class="lastname"><%= lastname %></span><span class="fname"><%= firstname %></span>';
temptext += '<span class="tp">Type: <%= type %></span><span class="em">Email: <%= email %></span>';
temptext += '<span class="car">Career Status: <%= careerstatus %></span><span class="gender">Gender: <%= gender %></span>';
temptext += '\n<span class="schoolname"><%= schoolname %></span>';
temptext += '\n<span class="indcst">ind_key: <%= ind_cst %></span><span class="orgcst">org_key: <%= org_cst %></span>';
temptext += '</div>';

var compiled = lo_.template(temptext);

// compiled(e) === your templated html