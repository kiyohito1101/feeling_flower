require 'net/https'

class StaticPageController < ApplicationController
  before_action :set_feeling

  def index
    gon.emotional_states = @feeling.emotional_states
  end

  def apipost

    unless URI.regexp =~ params[:sent]
      redirect_to root_path and return
    end

    binding.pry

    target_uri = URI.parse(params[:sent])

    charset = nil
    html = open(target_uri.to_s) do |f|
      charset = f.charset # 文字種別を取得
      f.read.encode("UTF-8", charset, invalid: :replace, undef: :replace) # encodeしてからhtmlを読み込んで変数htmlに渡す
    end
    # htmlをパース(解析)してオブジェクトを生成
    doc = Nokogiri::HTML(html, nil)

    body = doc.xpath("/html/body")

    content = ""
    body.each do |node|
      content << node.text
    end

    content.gsub!(/[ -~｡-ﾟ\r\n\t：★）（　＠＼／]/,"")
    item = content.split(/[。、？！・]/)
    item.reject!(&:blank?)

    apiuri = URI.parse("https://lr.capio.jp/webapis/iminos/synana_k/1_1/")
    http = Net::HTTP.new(apiuri.host, apiuri.port)
    if apiuri.scheme == 'https'
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    end

    @feeling.emotional_states = 0
    @feeling.save

    item.each do |text|

      req = Net::HTTP::Post.new(apiuri.path)
      req.set_form_data({'acckey' => ENV["SYNANA_ACESS_KEY"], 'sent' => text})

      res = http.request(req)

      synana = ActiveSupport::JSON.decode(res.body)

      if (synana["results"].empty?) || (synana["results"][0]["err"] == "1")
        redirect_to root_path and return
      end

      synana["results"][0]["sensibilities"].each do |sensibilities|
        case sensibilities
        when '気質','覚醒','生理'
        when '感覚','習慣','模倣'
        when '要望','呼吸','におい'
        when '厳格'
        when 'のんびり'
        when '控え目'
        when '刺激','味わい'
        when '夢中'
        when '元気'
          @feeling.emotional_states += 1
        when '有能','賢い','優遇'
          @feeling.emotional_states += 1
        when '喜ぶ','感謝','笑う'
          @feeling.emotional_states += 1
        when '愛好','尊敬','純粋'
          @feeling.emotional_states += 1
        when '幸福','快感','感動'
          @feeling.emotional_states += 1
        when '勇ましい','感じが良い'
          @feeling.emotional_states += 1
        when '自信','真面目','優しい'
          @feeling.emotional_states += 1
        when '配慮','丁寧','真心'
          @feeling.emotional_states += 1
        when '性悪','下品','侮辱','下手'
          @feeling.emotional_states -= 1
        when '慌てる','偽装','困る','鈍い'
          @feeling.emotional_states -= 1
        when '不幸','悲しむ','乱暴','間違う'
          @feeling.emotional_states -= 1
        when '責める','媚びる','愚か','排泄'
          @feeling.emotional_states -= 1
        when '嫌悪','恐怖','疑惑'
          @feeling.emotional_states -= 1
        when '飢渇','摂食','後悔'
          @feeling.emotional_states -= 1
        when '執着','情け','傲慢'
          @feeling.emotional_states -= 1
        when 'つまらない','わがまま'
          @feeling.emotional_states -= 1
        when '怒る、不満','態度（悪）','身上（悪）'
          @feeling.emotional_states -= 3
        end
      end

      case synana["results"][0]["spn"]
      when '1'
        @feeling.emotional_states += 1
      when '2'
        @feeling.emotional_states += -1
      end

      @feeling.save
    end

    redirect_to root_path
  end

  private

  def set_feeling
    unless @feeling = Feeling.first
      @feeling = Feeling.new
    end
  end

end
