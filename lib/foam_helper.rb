 
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

module FoamHelper
  def foam_init options={}
    ERB.new(%{
      <script type="text/javascript">
        var application_path='<%= url_for :controller=>'' %>'
        var controller_path='<%= url_for :action=>'' %>'
        //var body_onclick_pool = new task_pool
      </script>
    }).result(binding)
  end
  
  def foam_show_tray
    '<script type="text/javascript">foam.console.show_tray()</script>'
  end
  
  def foam_debug_area state = :on
    "<span id=\"debug\" style=\"display: #{state == :on ? 'inline' : 'none'}\"></span>"
  end
  
  def foam_include_tag url
    content_tag("script", "", { "type" => "text/javascript", "src" => url_for(url)})
  end
end