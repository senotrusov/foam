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

Date.prototype.monthDimensionData = [31,28,31,30,31,30,31,31,30,31,30,31]

Date.prototype.getMonthDimension = function(){
    var month = this.getMonth()
    var year  = this.getFullYear()

    if (month == 1 && (((year%4) == 0) && ( ((year%100) != 0) || ((year%400) == 0))) ) return 29
    else return this.monthDimensionData[month]
  }

Date.prototype.setMonthClosingDate = function(){
  this.setDate(this.getMonthDimension())
  }

Date.prototype.getUnixTime = function(){
  return this.getTime() / 1000
  }

Date.prototype.type = 'german'

//Date.prototype.setDay
//Date.prototype.setWeekStartingDate(weeknum)
//Date.prototype.setWeekClosingDate(weeknum)
