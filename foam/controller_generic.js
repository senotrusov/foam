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

foam.controller.generic = Class.create_mixable ({
  instanceof_controller: function(){},
  
  initialize: function(def){

    this.conf = Object.deep_extend({}, this.conf)
    
    if (typeof(def) == 'object'){
      if (def.conf) {Object.deep_extend (this.conf, def.conf); delete def.conf }
      Object.extend(this, def)
    }
    
    this.id           = (this.parent) ? this.parent.id+'.'+this.name : this.name
  //this.name
  //this.class_name
    this.html_class   = (this.name.indexOf('[')==-1) ? this.name : this.name.slice(0, this.name.indexOf('['))
  //this.conf.mixin
  //this.conf.placeholder

  //this.parent
    this.root         = this.root || this
    this.group_vertex = this.group_vertex || (this.parent && this.parent.class_name == this.class_name) ? this.parent.group_vertex : this

  //this.conf.catch_events
    this.controls     = {}
    this.serial       =     ++ foam.serial
  },
  
  control: function(def){
    if (typeof def == 'string') def = {name: def}
    return (foam.controller.is_instance(this[def.name]) ? this[def.name] : this.create_control(def)).view_with_placeholder()
  },
  
  create_control: function(def){
    def.parent = this
    def.root = this.root || this
    def.class_name = def.class_name || def.name

    if(!foam.controller[ def.class_name ]) log('~ERROR! Control class #{def.class_name} not defined. Check interface set.~')
  
    return this[def.name] = this.controls[def.name] = new foam.controller[ def.class_name ](def)
  },
  
  do_recursive: function(action){
    this[action] && 
    this[action] ()  

    for(var control in this.controls)
      this.controls[control].do_recursive(action)
  },
  
  render: function (){
    if (!$(this.id+'#placeholder')) return;
    
    $(this.id+'#placeholder').update(this.view_with_debug())
    this.do_recursive('after_render')
  },
  
  insert: function (insertion, element){
    new insertion(element, this.view_with_placeholder())
    this.do_recursive('after_render')
  },

  call_mixin: function(controller, method, def){
    foam.controller[ controller ].prototype[ method ] &&
    foam.controller[ controller ].prototype[ method ].call(this, def)
  }
})

foam.controller.is_instance = function (obj){
  if (typeof(obj) == 'object' && obj.instanceof_controller) return true
  else return false
}
