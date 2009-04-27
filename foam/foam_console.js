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

foam.console = {
  msg: [],
  msg_last: 0,
  
  history: [],
  history_current: 0,
  
  
  // Initialyze
  
  show_tray: function(){
    this.tray = document.createElement('div')
    this.tray.className = 'foam_console_tray'
    this.tray.innerHTML = '<a onclick="foam.console.create_window()">show console</a>'
    document.body.appendChild(this.tray)
  },
  
  opened: function (){
    this.document = this.window.document
    this.console  = this.document.getElementById('console')
    this.input    = this.document.getElementById('input')
    this.command  = this.document.getElementById('command')
    
    this.window.onresize = function(){ foam.console.onresize() }
    this.onresize()
    this.scrolldown()
    this.render()
    this.window.focus()
  },
  
  
  // Render
  
  create_window: function(){
    this.msg_last = 0
    
    this.window = window.open('','foam_console', 'width=700, height=600, menubar=yes, toolbar=no, scrollbars=no, status=yes, location=no, resizable=yes')
    this.window.document.open("text/html","replace")
    this.window.document.write('~<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
      <html>
        <head>
          <title>Foam console</title>
          <link href="/stylesheets/inspect_foam.css" media="screen" rel="Stylesheet" type="text/css" />
        </head>
        <body onload="window.opener.foam.console.opened()">
          <div id="console">
            #{this.view()}
          </div>
          <div id="input"><div>
            <form onsubmit="window.opener.foam.console.execute(); return false;">
              <div><input type="text" id="command" autocomplete="off" onkeyup="if (event.keyCode == 38 || event.keyCode == 40) window.opener.foam.console.roll_history((event.keyCode == 38)?\'up\':\'down\')"></div>
              <div>#{this.view_buttons()}</div>
            </form>
          </div></div>
        </body>
      </html>~')

    this.window.document.close()
  },
  
  onresize: function(){
    var window_height = this.window.innerHeight || this.document.documentElement.clientHeight || this.document.body.clientHeight
    this.console.style.height = (window_height - this.input.clientHeight - 22) + 'px'
   },    

  render: function(){
    if (this.console) {
      var msg = this.document.createElement('div')
      msg.innerHTML = this.view()
      this.console.appendChild(msg)
      this.scrolldown()
    }
  },
  
  view: function (){
    var content = ''
    
    for (; this.msg_last<this.msg.length; this.msg_last++)
      content += '<div class="'+this.msg[this.msg_last].group+'">'+this.msg[this.msg_last].msg+"</div>\n"
      
    return content
  },
  
  scrolldown: function(){
    this.console.scrollTop = this.console.scrollHeight
  },
  

  // Log message
  
  log: function (msg, group){
    this.msg.push ({msg: msg, group: group || 'notice'})
    this.render()
  },
  
  notice:    function (msg){ this.log(msg, 'notice') },
  inspect:   function (msg){ this.log(msg, 'inspect') },
  event:     function (msg){ this.log(msg, 'event') },
  milestone: function (msg){ this.log('---- '+msg, 'milestone') },
  exception: function (ex) { this.log('~Exception #{ex.name}: #{ex.message} at line #{ex.lineNumber} in file #{ex.fileName}<br><pre>#{ex.stack}</pre>~', 'exception') },
  
  
  // Execute command
  
  execute: function(){
    this.history.push(this.command.value)
    this.history_current = this.history.length
    
    this.log(this.command.value, 'milestone')
    
    try {
      var result = eval (this.command.value)
      
      if (typeof(result)=='object' && typeof(result.inspect)=='function')
        result.inspect()
      else if (typeof(result)=='object')
        foam.inspect.inspect(result)
      else
        this.log(result, 'command result')
      
    } catch (ex) {
      this.exception(ex)
    }
    
    this.command.value = ''
  },
  
  roll_history: function(direction){
    if (direction=='up') this.history_current --
    else this.history_current ++
    
    if (this.history_current < 0){
      this.history_current = -1
      this.command.value = ''
      
    } else if (this.history_current >= this.history.length){
      this.history_current = this.history.length
      this.command.value = ''
      
    } else {
      this.command.value = this.history[ this.history_current ]
    }
  },

  
  // Buttons
  
  buttons: {
    show_hide: 'show/hide all',
    clear: 'clear'
  },  
  
  show_hide: function(){
    var style = (this.document.styleSheets[0].cssRules) ? 
                this.document.styleSheets[0].cssRules[0].style :
                this.document.styleSheets[0].rules[0].style
                
    style.display = (style.display == 'none') ? 'block' : 'none'
  },
  
  clear: function(){
    this.msg = []
    this.create_window()
  },
  
  view_buttons: function(){
    var content = ''
    for (var i in this.buttons) content += '<input type="button" class="button" onclick="window.opener.foam.console.'+i+'()" value="'+this.buttons[i]+'">'
    return content
  }
}