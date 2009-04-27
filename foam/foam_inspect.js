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

foam.model.inspect_generic = foam.controller.inspect_generic = Class.create_mixable ({
  
  // public methods
  inspect: function (attribute){
		foam.inspect.inspect(this, attribute)
  }, 

  inspect_value: function(){
    if (this.value != undefined) return '<span class=value>' + this.value + '</span> '
    else return ''
  },
  

  // event log
  attribute_changed: function(event){
    var attribute = event.path.first()
    foam.console.event('<div class=message>' + this.inspect_summary() + ' attribute_changed <span class=attribute>[' + attribute + ']</span> to ' + this[attribute].inspect_value() + this[attribute].inspect_summary() + '</div>')
  },
  
  attribute_removed: function(event){
    var attribute = event.path.first()
    foam.console.event('<div class=message>'+this.inspect_summary()+' attribute_removed <span class=attribute>[' + attribute + ']</span></div>')
  },
    
  changed: function(){
    foam.console.event('<div class=message>'+this.inspect_summary()+' changed to <span class=value>' + this.value + '</span></div>')
  }
})


foam.inspect = {
  serial: 0,
  objects: {},

  show_detail_link: function(serial){
    return '~window.opener.foam.inspect.show_detail(#{serial})~'
  },

  show_detail: function(serial){
    var record = foam.console.document.getElementById('record_'+serial)
    
    if (this.objects && this.objects[serial])
      record.innerHTML = '<dir>' + foam.inspect.inspect_object(this.objects[serial].obj, this.objects[serial].name) + '</dir>'
    
    if(record.style.display=='block')
      record.style.display='none'
    else
      record.style.display='block'
  },

  attributes: function(obj, skiplist){
    var inspect = ''
    
    for (var i in obj)
      if ((typeof (obj[i]) != 'function') && (typeof (obj[i]) != 'undefined') && (!skiplist[i])){
          if (typeof (obj[i]) == 'object'){
            foam.inspect.serial ++

            try{
            inspect += '~
              <div><a class=show_detail onclick="#{foam.inspect.show_detail_link(foam.inspect.serial)}">
                <span class=attribute>[#{i}]</span>
                #{obj[i].inspect_value && obj[i].inspect_value() || ''}
                #{obj[i].inspect_summary && obj[i].inspect_summary() || foam.inspect.inspect_summary(obj[i])}
                <span class="show_detail_button">show detail</span>
              </a></div>
              <div id=record_'+foam.inspect.serial+' class=hidden><dir>
                #{obj[i].inspect_object && obj[i].inspect_object(i) || ''}
              </dir></div>~'
            
            if (!obj[i].inspect_object){
              foam.inspect.objects[foam.inspect.serial] = {obj: obj[i], name: i}
            }
            } catch (ex) {
              foam.console.exception(ex)
              inspect += '~<div><span class=attribute>[#{i}]</span> CAN NOT INSPECT THIS OBJECT</div>~'
            }
          }
          else inspect += '~<div><span class=attribute>[#{i}]</span> <span class=value>#{obj[i]}</span></div>~'
        }
    
    return inspect
  },
  
  inspect: function (obj, attribute){
    foam.console.inspect (this.inspect_object(obj, attribute))
  }, 

  inspect_object: function(obj, attribute){
    try {
      attribute = (attribute) ? '<span class=attribute>[' + attribute + ']</span> ' : ''
    
      return '<div class=inspection>INSPECTION OF ' + attribute + (obj.inspect_summary ? obj.inspect_summary() : this.inspect_summary(obj)) + (obj.inspect_detail ? obj.inspect_detail() : this.inspect_detail(obj)) + '</div>'
    } catch (ex) {
      foam.console.exception(ex)
      return 'CAN NOT INSPECT THIS OBJECT ' + attribute
    }
  }, 

  inspect_summary: function(obj){
    var inspect = '<span class=regular_summary>Object'
  
    if (obj.id)      inspect += ' #'+ obj.id
    if (obj.title)   inspect += ' ' + obj.title
    if (obj.name)    inspect += ' ' + obj.name
    if (obj.tagName) inspect += ' ' + obj.tagName
    
    return inspect + '</span> '
  },

  inspect_detail: function(obj, title, class_name){
    return '~<div class=#{class_name || "area_two"}><div>#{title || "ATTRIBUTES"}:</div>~' + foam.inspect.attributes(obj, {inspect: true, inspect_model: true, inspect_controller: true, inspect_regular: true}) + '</div>'
  }
}


