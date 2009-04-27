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

foam.model.relations = foam.controller.relations = Class.create_mixable ({
  // public
  set: function(attribute, value){
    if (arguments.length == 1){ //foo_model.set(value)
      value = arguments[0]

      if (foam.model.is_instance(value)){ //foo_model.set(bar_model)
        this.replace (value)
				
      } else { //foo_model.set(data)
        this.value = value
        this.fire_event ({name: 'changed'})
      }
      
      return this

    } else { // В controller исполняется вот этот блок
      
      var changed_from = this[attribute]
      if (foam.model.is_instance(this[attribute])){
        if (this[attribute] === value)
          return this[attribute]
        else
          this[attribute].remove_parent ({object: this, attribute: attribute})
      }
      
      if (foam.model.is_instance(value))
        this[attribute] = value
      else
        this[attribute] = new foam.model.dummy(value)

      if (typeof(attribute)=='number' && (attribute >= this.length || typeof(this.length) != 'number'))
        this.length = attribute + 1

      this[attribute].add_parent ({object: this, attribute: attribute})
      this.fire_event ({name: 'changed', path: [attribute], objects: [this[attribute]], changed_from: changed_from })
      return this[attribute]
    }
  },
  
  remove: function(attribute){
    var deleted_attribute = this[attribute]
		
    if (foam.model.is_instance(this[attribute])){
      this[attribute].remove_parent ({object: this, attribute: attribute})
      
      if (typeof(attribute)=='number') {
        for (var i=attribute+1; i<this.length; i++){
          this[i-1] = this[i]
          
          if(foam.model.is_instance(this[i-1])){
            this[i-1].remove_parent ({object: this, attribute: i})
            this[i-1].add_parent ({object: this, attribute: i-1})
          }
        }
        
        this.length--
        delete this[this.length]
        
      } else delete this[attribute]
    } else delete this[attribute]
    
    this.fire_event ({name: 'removed', path: [attribute], objects: [deleted_attribute] })
  },
  
  replace: function (value){
    var parent, notify_list = []
    
    while ((parent = this.conf.parents.splice(0,1)[0])){
      parent.object[parent.attribute] = value
      value.add_parent (parent)
      notify_list.push (parent)
      }

    for( var i=0; i<notify_list.length; i++)
      notify_list[i].object.fire_event ({name: 'changed', path: [notify_list[i].attribute], objects: [notify_list[i].object], changed_from: this })
  },
  
  add_parent: function (new_parent){
    if (foam.conf.debug_relations) { foam.console.notice('~<span class="model_summary">*#{new_parent.object.conf.serial}</span>.#{new_parent.attribute} is parent for <span class="model_summary">*#{this.conf.serial}</span>~')} //!PRODUCTION
    
    this.conf.parents.push (new_parent)
  },
  
  remove_parent: function (remove_parent){
    if (foam.conf.debug_relations) { foam.console.notice('~<span class="model_summary">*#{remove_parent.object.conf.serial}</span>.#{remove_parent.attribute} is removed from parents for <span class="model_summary">*#{this.conf.serial}</span>~')} //!PRODUCTION
    
    for(var i = 0; i < this.conf.parents.length; i++)
      if (this.conf.parents[i].object == remove_parent.object && this.conf.parents[i].attribute == remove_parent.attribute)
        return this.conf.parents.splice(i,1)
      
    return false
  },

  check_parents: function (){
    for (var parent, i = 0; i<this.conf.parents.length; i++){
      parent = this.conf.parents[i]

      if (parent.object[parent.attribute] != this){
        log('found attribute "' + parent.attribute + '" redefined manualy instead of .set() method, in the following object:')
        log(parent.object)
      }
    }
  }
})
