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

foam.model.define ({
  conf: {
    name: 'array',
    added_items: [],
    removed_items: [],
    order_changed: false,
    catch_events: [
      {name: 'changed', path: ['?'], call_method: 'on_item_adding_or_removing'},
      {name: 'removed', path: ['?'], call_method: 'on_item_removing'},
      ]
    },

  // массив и обычный объект - не одно и то же! Надо их разделить.
  // Для массивов можно не учитывать attribute
  // При этом, для sortable стоит учитывать изменения в сортировке, каким-либо образом (???)
  
  on_item_adding_or_removing: function(event){
    if (foam.locks.importing_data_from_storage) return;
    
    this.conf.order_changed = true
    
    if(event.changed_from)
      this.removed_items_push(changed_from)
    
    this.added_items_push(event.objects.first())
  },

  on_item_removing: function(event){
    if (foam.locks.importing_data_from_storage) return;
    
    this.conf.order_changed = true

    this.removed_items_push(event.objects.first())
  },

  added_items_push: function(added){
    if(!this.conf.removed_items.remove_one(added))
      this.conf.added_items.push(added)
  },
  
  removed_items_push: function(removed){
    if(!this.conf.added_items.remove_one(removed))
      this.conf.removed_items.push(removed)
  },
    
  find_id: function (id){
    var i = this.find_id_index (id)

    if (i == undefined) return i
    else return this[i]
  },
  
  find_id_index: function (id){
    for(var i=0; i<this.length; i++)
      if(this[i].id.value == id) return i
    
    return undefined
  },
  
  push: function(){
    if (!this.length) this.length=0
    
    for(var i=0; i<arguments.length; i++)
      this.set (this.length, arguments[i])
    
    return this.length
  },
  
  remove_id: function (id){
    var index = this.find_id_index(id)
    
    if (index != undefined) {
      return this.remove (index)
    
    } else return false
  },
  
  absorb: function (from){
    var changed = false
    
    for(var i=0; i<from.length; i++)
      if(this.find_id_index(from[i].id.value) == undefined){
        this.push(from[i])
        from.remove(i)
        i--
        changed = true
      }
      
    return changed
  },
  
  annihilate: function (antiparticle){
    var changed = false
    
    for(var found, i=0; i<antiparticle.length; i++)
      if((found = this.find_id_index(antiparticle[i].id.value)) != undefined){
        this.remove(found)
        antiparticle.remove(i)
        i--
        changed = true
      }

    return changed
  }
})
