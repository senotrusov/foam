 
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

module FoamIncluder
  
  def foam_include_file file
    @foam_set += "\n\n// ==== #{file} ====\n\n" if RAILS_ENV == 'development'

    @foam_set += render_to_string :file => "#{RAILS_ROOT}/#{file}"
  rescue StandardError, ScriptError => ex
    @foam_set += "alert('foam_include error: ' + #{ex.message.to_json});\n"
  end
  
  # foam_include :domain, :directory_one, :directory_two, :directory_three => [:file_one, :file_two], :directory_four => :defaults
  # 
  # :domain may be <plugin name>, :models or :controllers
  # 
  # If domain was specified without any directories, defaults will be used.
  # If directory was specified without any files, or with :defaults as a file, defaults will be used.
  # 
  # To define defaults you must define class <DomainName>FoamInclude the way like FoamFoamInclude is defined. 
  # (vendor/plugins/foam/lib/foam_foam_include.rb)
  # 
  # Note, that :directory_three and :directory_four are passed to foam_include as a hash,
  # so there are no warranty of strict include order. To workaround it, use several foam_include calls.
  # 
  def foam_include(*args)
    @foam_set ||= ''
    
    domain = args.shift
    directories = {}
    
    args = "#{domain.to_s.classify}FoamInclude".constantize.defaults? if args.empty?

    args.each do |item|
      if item.kind_of?(Symbol)
        foam_include(domain, {item => :defaults})
      elsif item.kind_of?(Hash)
        directories.merge!(item)
      end
    end

    domain_directory = case domain
      when :models      : "app/models"
      when :controllers : "app/controllers"
      else                "vendor/plugins/#{domain}"
    end

    directories.each do |directory, files|
      files = "#{domain.to_s.classify}FoamInclude".constantize.defaults_for?(directory) if files == :defaults
      files.each { |file| foam_include_file "#{domain_directory}/#{directory}/#{file}.js" }
    end
  end
    
  def foam_send
    render_javascript @foam_set
  end
end