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

foam.controller.define({
  name: 'text',
  conf: {
    mixin: ['helpers']
    },

  view: function(){
    return '~<input type="text" id="#{this.id}" value="#{this.data || ''}" class="#{this.html_class}" #{this.is_disabled()} #{this.event_handlers()}~' +
    ((this.autocomplete) ? '~ autocomplete="off"><div id="#{this.id}#autocomplete" class="autocomplete"></div>~' : '>')
  },

  onchange: function(){
    this.data.set( $(this.id).value )
  },
  
  data_changed: function(){
    this.render()
  },
  
  after_render: function(){
    if (this.autocomplete && !this.disabled){
      var This = this
      new Ajax.Autocompleter(this.id, this.id+'#autocomplete', this.autocomplete.url || controller_path + this.name + '_autocomplete',
        { paramName: this.autocomplete.paramName || 'typed',
          tokens: this.autocomplete.tokens || [],
          frequency: this.autocomplete.frequency || 0.2,
          minChars: this.autocomplete.minChars || 1,
          afterUpdateElement: function(input,selected){
            if (selected.id)
              try { eval('var json ='+selected.id) } catch (ex) { log_exception(ex); }
  
            input.focus()
            This.after_autocomplete &&
            This.after_autocomplete (json || undefined, selected)
            }
        }
      )
    }
  },
})
