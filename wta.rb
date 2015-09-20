require 'nokogiri'
require 'open-uri'
require 'colorize'

u = URI.parse('http://status.aws.amazon.com/')
html = Nokogiri::HTML(open(u))

all_status_images = html.css('#current_events_block td img')
reds = all_status_images.select { |i| i.attributes['src'].value == '/images/status3.gif' }
yellas = all_status_images.select { |i| i.attributes['src'].value == '/images/status2.gif' }
infos = all_status_images.select { |i| i.attributes['src'].value == '/images/status1.gif' }
greens = all_status_images.select { |i| i.attributes['src'].value == '/images/status0.gif' }

status_str = ""
red_str = "Service disruption: #{reds.length} ".colorize(:black ).colorize( :background => :red)
if reds.length > 0 then status_str << red_str end
yellas_str = "Performance issues: #{yellas.length} ".colorize(:black ).colorize( :background => :yellow)
if yellas.length > 0 then status_str << yellas_str end
infos_str = "Informational messages: #{infos.length} ".colorize(:light_blue )
if infos.length > 0 then status_str << infos_str end
greens_str = "Operationing normally: #{greens.length} ".colorize(:green )
if greens.length > 0 then status_str << greens_str end

puts status_str + "\n\n"

reds.each_with_index { |r, inx|
  str = sprintf "%3i", inx + 1
  puts "#{str}:  #{r.parent.parent.children[3].children[0]}".black.on_red
}

yellas.each_with_index { |y, inx|
  str = sprintf "%3i", inx + 1
  puts "#{str}:  #{y.parent.parent.children[3].children[0]}".black.on_yellow
}

infos.each_with_index { |i, inx|
  str = sprintf "%3i", inx + 1
  puts "#{str}:  #{i.parent.parent.children[3].children[0]}".light_blue
}
