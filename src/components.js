Crafty.c('Tile', {
  init: function() {
    this.requires('Actor, Color');
    this._globalZ = 0;
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
    this._globalZ = 1;
    this.requires(this.possible_sprites[Math.floor(Math.random() * this.possible_sprites.length)]);

    this.bind('TweenEnd', function() {
      var props = {};
      props[this.lastTweenAxis] = this.lastTweenDist;

      this.tween(props, 500);
      this.enableDrag();
    });

    this.bind('Dragging', function() {
      this.disableDrag();
      var dir = getDir(this);
      swap(this, dir);
    });
  },

  possible_sprites: [
    'spr_air',
    'spr_earth',
    'spr_fire',
    'spr_water',
    'spr_metal',
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


// Desc:   Grabs the direction a gem was moved.
// Params:
//         - Entity (Gem)
// Return: Array Array [x_or_y_axis, postive_or_negative_1_for_direction_on_axis]

function getDir(gem) {
  var x    = gem.x;
  var y    = gem.y;
  var oldX = gem._oldX;
  var oldY = gem._oldY;
  var dir;

  // No diagonal moving!
  if(Math.abs(y-oldY) > Math.abs(x-oldX)) {
    if(y > oldY) {
      dir = ['y', 1];
    } else if(y < oldY) {
      dir = ['y', -1];
    }
  } else {
    if(x > oldX) {
      dir = ['x', 1];
    } else if(x < oldX) {
      dir = ['x', -1];
    }
  }

  return dir;
}


// TODO:   Finish canMove
// Desc:   Checks if there is an adjacent gem.
// Params: 
//         - Entity (Gem)
//         - Array [x_or_y_axis, postive_or_negative_1_for_direction_on_axis]
// Return: boolean

function canMove(gem, dir) {
  //Me need some code
}

//TODO:    Finish the swap!
// Desc:   Swaps two gems placement based on direction 'dir'
//         If no gem adjacent to the one that was dragged, return.
// Params: 
//         - Entity (Gem) 
//         - Array [x_or_y_axis, positive_or_negative_1_for_direction_on_axis]
// Return: void

function swap(gem, dir) {
  var axis    = dir[0];
  var dist    = gem[axis] + (dir[1]*72);
  var props   = {};

  props[axis] = dist;
  entity.lastTweenAxis = axis;
  entity.lastTweenDist = entity[axis];

  entity.tween(props, 500);
}
