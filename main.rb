require 'nokogiri'
require 'open-uri'
require 'colorize'

u = URI.parse('http://status.aws.amazon.com/')
html = Nokogiri::HTML(open(u))

reds = html.css('#current_events_block td img').select { |i| i.attributes['src'].value == '/images/status3.gif' }
yellas = html.css('#current_events_block td img').select { |i| i.attributes['src'].value == '/images/status2.gif' }
infos = html.css('#current_events_block td img').select { |i| i.attributes['src'].value == '/images/status1.gif' }

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
