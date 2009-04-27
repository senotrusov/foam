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

foam.model.generic = Class.create_mixable ({
  instanceof_model: function (){},
  
  initialize: function (def){
    this.conf = Object.deep_extend({}, this.conf)
    
    if (typeof(def) == 'object'){
      if (def.conf) {Object.deep_extend (this.conf, def.conf); delete def.conf }
      Object.extend(this, def)
      
    } else if (def != undefined)
      this.value = def
    

    this.conf.serial = ++ foam.serial

    if (this.value != undefined)
      this.fire_event ({name: 'changed'})
  },
 
  call_mixin: function(model, method, argv){
    foam.model[ model ].prototype[ method ] &&
    foam.model[ model ].prototype[ method ].call(this, argv)
  },
  
  toString: function(){ return this.value }
})

foam.model.is_instance = function (obj){
  if (typeof(obj) == 'object' && obj.instanceof_model) return true
  else return false
}
