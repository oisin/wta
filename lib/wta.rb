require 'nokogiri'
require 'open-uri'

module Wta
  RED   = 3
  YELLA = 2
  INFO  = 1

  def self.reds
    bo_selecta RED
  end

  def self.yellows
    bo_selecta YELLA
  end

  def self.infos
    bo_selecta INFO
  end

  def self.bo_selecta(statusnum)
    pull_statuses
    @all_status_images.select { |img|
      img.attributes['src'].value == "/images/status#{statusnum}.gif"
    }.map { |img|
      img.parent.parent.children[3].children[0]
    }
  end

  def self.pull_statuses
    @html = Nokogiri::HTML(open(URI.parse('http://status.aws.amazon.com/')))
    @all_status_images = @html.css('#current_events_block td img')
  end
end
