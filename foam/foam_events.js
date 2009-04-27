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

foam.model.events = foam.controller.events = Class.create_mixable ({

  conf: {
    catch_events: [
      {name: undefined, path: [],    call_method: 'event_on_me_default_callback'},
      {name: undefined, path: ['?'], call_method: 'event_on_my_attribute_default_callback'},
      {name: 'changed', path: [],    call_method: 'set_changed_state'}
    ]
  },

  fire_event: function(event){
    event.path = event.path || []
    event.objects = event.objects || []

    foam.console.event('~#{this.inspect_summary()} event name:#{event.name} path:#{event.path.inspect()}~')

    this.catch_event(event)
    
    if (this.instanceof_model){
      for(var i = 0; i < this.conf.parents.length; i++)
        this.fire_event_to_parent(event, this.conf.parents[i].object, this.conf.parents[i].attribute)
    } else if (this.instanceof_controller){
      if (this.parent) this.fire_event_to_parent(event, this.parent, this.name)
    }
  },

  fire_event_to_parent: function(event, parent, my_attribute_in_parent){ // В controller исполняется вот эта функция
    new_event = Object.extend({}, event)

    new_event.path = event.path.clone()
    new_event.path.unshift(my_attribute_in_parent)

    new_event.objects = event.objects.clone()
    new_event.objects.unshift(parent)
    
    parent.fire_event(new_event)
  },

  catch_event: function(event){
    for(var rule, i = 0; i < this.conf.catch_events.length; i++){
      rule = this.conf.catch_events[i]
      if (!rule.name || rule.name == event.name) {
        
        if(event.path.length == rule.path.length || rule.path.last() == '*' && event.path.length > 0){
          var matched = true // case for zero path in event & rule
    
          for (var r = 0; r < rule.path.length && r < event.path.length; r++){
            if (event.path[r] == rule.path[r]) matched = true
            else if (rule.path[r] == '?') matched = true
            else if (rule.path[r] == '*') { matched = true ; break }
            else { matched = false ; break }
          }
  
          if(matched && typeof(this[rule.call_method]) == 'function') this[rule.call_method] (event)
        }
      }
    }
  },
  
  set_changed_state: function(){
    if(this.conf && !foam.locks.importing_data_from_storage) this.conf.changed = true
  },

  event_on_me_default_callback: function (event){
    if (typeof(this[event.name]) == 'function') this[event.name]()
  },
  
  event_on_my_attribute_default_callback: function (event){
    if (typeof(this['attribute_'+event.name]) == 'function')
      this['attribute_'+event.name] (event)

    if (typeof(event.path.first()) != 'number' && typeof(this[event.path.first()+'_'+event.name]) == 'function')
      this[event.path.first()+'_'+event.name] (event)
  }
})
