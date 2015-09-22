require 'net/https'

class StaticPageController < ApplicationController
  before_action :set_feeling

  def index
    gon.emotional_states = @feeling.emotional_states
  end

  def apipost
    uri = URI.parse("https://lr.capio.jp/webapis/iminos/synana_k/1_1/")
    http = Net::HTTP.new(uri.host, uri.port)
    if uri.scheme == 'https'
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    end

    req = Net::HTTP::Post.new(uri.path)
    req.set_form_data({'acckey' => 'jd6KqNqNNcdP3sFg', 'sent' => params[:sent]})

    res = http.request(req)

    synana = ActiveSupport::JSON.decode(res.body)

    case synana["results"][0]["spn"]
    when '1'
      @feeling.emotional_states += 1
    when '2'
      @feeling.emotional_states += -1
    end

    @feeling.save

    redirect_to root_path
  end

  private

  def set_feeling
    unless @feeling = Feeling.first
      @feeling = Feeling.new
    end
  end

end
