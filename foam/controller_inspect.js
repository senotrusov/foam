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

foam.controller.inspect = Class.create_mixable ({
  inspect_summary: function(){
    return '<span class=controller_summary>*' + this.serial + ' #' + this.id + (this.title || '') + '</span>'
  },

  inspect_detail: function(){
    var inspect = ''
    
    inspect += '<div class=conf>CONFIG: '
      inspect += 'id: <b>' + this.id + '</b>, '
      inspect += 'name: <b>' + this.name + '</b>, '
      inspect += 'class_name: <b>' + this.class_name + '</b>, '
      inspect += 'html_class: <b>' + this.html_class + '</b>, '
      inspect += 'mixin: <b>' + this.conf.mixin.join(' ') + '</b>, '
      inspect += 'placeholder: &lt;<b>'+this.conf.placeholder.tag+'</b> style=<b>'+this.conf.placeholder.style+'</b> onclick=<b>'+this.conf.placeholder.onclick+'</b>&gt;, '
      
      inspect += 'parent: <b>' + (this.parent && this.parent.inspect_summary() || 'none') + '</b>, '
      inspect += 'root: <b>' + this.root.inspect_summary() + '</b>, '
      inspect += 'group_vertex: <b>' + this.group_vertex.inspect_summary() + '</b>, '

      inspect += 'catch_events: <b>' + 'CATCH_EVENTS' + '</b>'
    inspect += '</div>'
    
    inspect += '<div class=area_one><div>CONTROLS:</div>' + foam.inspect.attributes(this.controls, {}) + '</div>'
    
    inspect += '<div class=area_two><div>ATTRIBUTES:</div>' + foam.inspect.attributes(this, Object.extend({
      id: true,
      name: true,
      class_name: true,
      html_class: true,
      conf: true,
      
      parent: true,
      root: true,
      group_vertex: true,
      
      controls: true,
      serial: true
    }, this.controls)) + '</div>'
      
    return inspect
  }
})
