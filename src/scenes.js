
Crafty.scene('Loading', function() {

  var loadingText = Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: 5 * Game.height() / 12, w: Game.width() })
    .textFont({ size: '24px', family: 'Arial', color: 'white', align: 'center' });

  Crafty.load([
    'assets/air.png',
    'assets/chaos.png',
    'assets/earth.png',
    'assets/fire.png',
    'assets/spirit.png',
    'assets/water.png',
    'assets/wood.png'
  ], function() {
    Crafty.sprite(72, 'assets/air.png', {
      spr_air: [0, 0]
    });
    Crafty.sprite(72, 'assets/chaos.png', {
      spr_chaos: [0, 0]
    });
    Crafty.sprite(72, 'assets/earth.png', {
      spr_earth: [0, 0]
    });
    Crafty.sprite(72, 'assets/fire.png', {
      spr_fire: [0, 0]
    });
    Crafty.sprite(72, 'assets/spirit.png', {
      spr_spirit: [0, 0]
    });
    Crafty.sprite(72, 'assets/water.png', {
      spr_water: [0, 0]
    });
    Crafty.sprite(72, 'assets/wood.png', {
      spr_wood: [0, 0]
    });

    Crafty.scene('Game');
  });
});

Crafty.scene('Game', function() {
  var w, h;
  for (w = 0; w < Game.map_grid.width; w++) {
    for (h = 0; h < Game.map_grid.height; h++) {
      Crafty.e('Tile').at(w, h).getColorRight();
      Crafty.e('Gem, Draggable').at(w, h);
    }
  }
});
