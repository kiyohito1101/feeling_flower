enchant();

window.onload = function() {
  var game = new Game(960, 640);
  game.fps = 5;
  game.preload('map1.png', 'monster1.gif', 'monster2.gif', 'monster7.gif', 'monster6.gif', 'bigmonster1.gif', 'bigmonster2.gif');
  game.onload = function() {
    var scene = new Scene();
    var feeling = gon.emotional_states;

    if (feeling < -50){
      feeling = -50
    } else if (feeling > 50){
      feeling = 50
    }

    if (feeling < 0){
      var map = new Map(16, 16);
      map.image = game.assets['map1.png'];
      var baseMap = [];
      for(var i = 0; i < 40; i++){
        baseMap[i] = [];
        for(var j = 0; j < 60; j++){
          baseMap[i][j] = (16 * 13)+1;
        }
      }
    } else if (feeling == 0){
      var map = new Map(16, 16);
      map.image = game.assets['map1.png'];
      var baseMap = [];
      for(var i = 0; i < 40; i++){
        baseMap[i] = [];
        for(var j = 0; j < 60; j++){
          baseMap[i][j] = (16 * 6)+4;
        }
      }
    } else {
      var map = new Map(16, 16);
      map.image = game.assets['map1.png'];
      var baseMap = [];
      for(var i = 0; i < 40; i++){
        baseMap[i] = [];
        for(var j = 0; j < 60; j++){
          baseMap[i][j] = 1;
        }
      }
    }

    map.loadData(baseMap);
    scene.addChild(map);

    var set_location = [];
    for(var i = 0; i < 15; i++){
      for(var j = 0; j < 10; j++){
        set_location[(j + (i * 10))] = (j + (i * 10));
      }
    }

    if (feeling < 0){
      var Dragon = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 80, 80);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['bigmonster1.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 3) + 2;
            this.x -= 1;
            if (this.x < -80){
              this.x = 960 + rand(200);
              this.y = rand(560);
            }
          });
          scene.addChild(this);
        }
      });

      var Minotaur = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 80, 80);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['bigmonster2.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 3) + 2;
            this.x -= 1;
            if (this.x < -80){
              this.x = 960 + rand(200);
              this.y = rand(560);
            }
          });
          scene.addChild(this);
        }
      });

      var Caterpillar = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 48, 48);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['monster1.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 3) + 2;
            this.x -= 2;
            if (this.x < -48){
              this.x = 960 + rand(200);
              this.y = rand(560);
            }
          });
          scene.addChild(this);
        }
      });

      var Scorpion = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 48, 48);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['monster7.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 3) + 2;
            this.x -= 3;
            if (this.x < -48){
              this.x = 960 + rand(200);
              this.y = rand(560);
            }
          });
          scene.addChild(this);
        }
      });

      var Spider = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 64, 64);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['monster2.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 3) + 2;
            this.x -= 4;
            if (this.x < -48){
              this.x = 960 + rand(200);
              this.y = rand(560);
            }
          });
          scene.addChild(this);
        }
      });

      var dragons = [];
      var caterpillar = [];
      var scorpion = [];
      var spider = [];
      var minotaur = [];
      for(var i = 0; i < (feeling * -1); i++){
        dragons[i] = new Dragon(960 + (rand(200)), rand(560));
        caterpillar[i] = new Caterpillar(960 + (rand(200)), rand(560));
        scorpion[i] = new Scorpion(960 + (rand(200)), rand(560));
        spider[i] = new Spider(960 + (rand(200)), rand(560));
        minotaur[i] = new Minotaur(960 + (rand(200)), rand(560));
      }

    } else if (feeling == 0){

    } else {

      var Flower = Class.create(Sprite,{
        initialize: function(x, y){
          Sprite.call(this, 64, 64);
          this.x = x;
          this.y = y;
          this.age = rand(100);
          this.image = game.assets['monster6.gif'];
          this.on('enterframe', function(){
            this.frame = (this.age % 5) + 2;
          });
          scene.addChild(this);
        }
      });

      var flower_seed = [];
      for(var i = 0; i < feeling; i++){
        var x = rand(149 - i);
        flower_seed[i] = set_location[x];
        set_location.splice(x, 1);
      }
      var flowers = [];
      for(var i = 0; i < feeling; i++){
        flowers[i] = new Flower((Math.floor(flower_seed[i] / 10) * 64), ((flower_seed[i] % 10)* 64));
        // console.log((Math.floor(flower_seed[i] / 10)), (Math.floor(flower_seed[i] % 10)));
      }
      /*
      for(var i = 0; i < 15; i++){
        for(var j = 0; j < 10; j++){
          flowers[(j + (i * 10))] = new Flower( i * 64, j * 64);
        }
      }*/
    }


    var label = new Label();
    label.x = 915;
    label.y = 5;
    label.color = 'red';
    label.font = '30px "Arial"';
    label.text = feeling;
    scene.addChild(label);

    game.pushScene(scene);

  };
  game.start();
}

function rand(n){
  return Math.floor(Math.random() * (n + 1));
}
