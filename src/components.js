Crafty.c('Tile', {
  init: function() {
    this.requires('Actor, Color');
  },
  getColorRight: function() {
    if ((this.tileX + this.tileY) % 2 == 0) {
      this.color("#4c4233");
    }
    else {
      this.color("#73624d");
    }
  },
});

Crafty.c('Gem', {
  init: function() {
    this.requires('Actor');
    this.requires(this.possible_sprites[Math.floor(Math.random() * this.possible_sprites.length)]);
  },
  possible_sprites: [
    'spr_air',
    'spr_chaos',
    'spr_earth',
    'spr_fire',
    'spr_spirit',
    'spr_water',
    'spr_wood',
  ]
});

//The Grid component allows an element to be located
//on a grid of tiles
Crafty.c('Grid', {
  tileX: 0,
  tileY: 0,
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
  
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    //at() means you're asking
    if (x === undefined && y === undefined) {
      return { x: Math.round(this.x/this.w), y: Math.round(this.y/this.h) }
    }
    //at(here) means you're telling
    else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height, tileX: x, tileY: y });
      return this;
    }
  }
});

//An "Actor" is an entity that is drawn in 2D on canvas
//via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
  placeInRoom: function(room) {
    this.room = room;
  }
});
