/* 
# Copyright (c) 2005-2007 Stanislav Senotrusov <senotrusov@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Class.create_mixable = function(prototype) {
  var created = function() {
    var mixin = this.conf && this.conf.mixin || this.mixin || false
    
    if(mixin) for(var i=0; i<mixin.length; i++)
      this.call_mixin (mixin[i], 'initialize', arguments[0])
      
    this.initialize && this.initialize.apply(this, arguments);
  }
  
  created.prototype = prototype || {}
  return created
}

// 1. Escapes \ to \\
// 2. Normalizing line breaks to \n
// 3. Escapes ' and " to \' and \"
String.prototype.to_json = function(){
  return '"' + this.replace(/\\/g, '\\\\').replace(/\r\n|\n|\r/g, "\\n").replace(/(["'])/g, "\\$&") + '"'
}

Array.prototype.push_if_defined = function(item){
  if(item != undefined) this.push(item)
}

Array.prototype.remove_one = function(item){
  for (var i=0; i<this.length; ++i)
    if(this[i] == item) { this.splice(i,1); return true; }
    
  return false
}

// Для клонирования объекта clone = Object.deep_extend({}, source)
// Для расширения объекта destination_extended = Object.deep_extend(destination, source)

Object.deep_extend = function(destination, source) {
  if (typeof(source) != 'object') return source
  
  for (var property in source) {
    if (typeof(source[property]) == 'object'){
      if (source[property] instanceof Array) {
        
        if (!(typeof(destination[property]) == 'object' && destination[property] instanceof Array))
          destination[property] = []
        
        for(var i=0, length = source[property].length; i < length; ++i )
          destination[property].push( Object.deep_extend({}, source[property][i]) )
        
      } else {
        if (typeof(destination[property]) != 'object') destination[property] = {}
        
        Object.deep_extend(destination[property], source[property])
      }
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}


function log(msg){
  alert('LOGGING -- ' + msg);
}

function log_exception(ex){
  alert("fileName: " + ex.fileName + "\n" +
        "lineNumber: " + ex.lineNumber + "\n" +
        "name: " + ex.name + "\n" +
        "message: " + ex.message + "\n" +
        "stack: " + ex.stack + "\n");
}