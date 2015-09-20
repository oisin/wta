require 'nokogiri'
require 'open-uri'

module Wta
  RED   = 3
  YELLA = 2
  INFO  = 1
  FINE  = 0

  NA="NA"
  SA="SA"
  EU="EU"
  AP="AP"

  def self.regions
    [NA, SA, EU, AP]
  end

  def self.reds(region=NA)
    bo_selecta(RED, region)
  end

  def self.yellows(region=NA)
    bo_selecta(YELLA, region)
  end

  def self.infos(region=NA)
    bo_selecta(INFO, region)
  end

  def self.operating(region=NA)
    bo_selecta(FINE, region)
  end

  def self.bo_selecta(statusnum, region)
    pull_statuses(region)
    @all_status_images.select { |img|
      img.attributes['src'].value == "/images/status#{statusnum}.gif"
    }.map { |img|
      img.parent.parent.children[3].children[0]
    }
  end

  def self.pull_statuses(region)
    @html = Nokogiri::HTML(open(URI.parse('http://status.aws.amazon.com/')))
    @all_status_images = @html.css('#current_events_block #' + region.upcase + '_block td img')
  end
end
