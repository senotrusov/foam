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

foam.model.inspect = Class.create_mixable ({
  inspect_summary: function(){
    var inspect = '<span class=model_summary>'
  
    inspect += '*'+this.conf.serial
  
    if (this.conf.name != 'dummy') inspect += ' ' + this.conf.name
  
    if (this.id) inspect += ' #' + Number(this.id)
      
    if (this.title) inspect += ' ' + this.title
    
    return inspect + '</span>'
  },

  inspect_detail: function(){
    var inspect = ''

    inspect += foam.inspect.inspect_detail(this.conf, 'CONFIG', 'conf')
    
    inspect += '<div class=area_one><div>PARENTS:</div> '
      for (var i=0; i<this.conf.parents.length; i++)
        inspect += '<div>['+i+'] <span class=attribute>['+this.conf.parents[i].attribute+']</span>: ' + this.conf.parents[i].object.inspect_summary() + '</div>'
    inspect += '</div>'

    inspect += '<div class=area_two><div>ATTRIBUTES:</div>' + foam.inspect.attributes(this, {conf: true}) + '</div>'
    
    return inspect
  },

	inspect_vars: function(obj, join_string){
    var list = []
    
    for (var i in obj)
      list.push(i)
    
    return list.join(join_string || ' ')
  },
})