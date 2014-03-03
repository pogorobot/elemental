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
    this.requires('Actor, Swappable');
    this._globalZ = 1;
    this.requires(this.possible_sprites[Math.floor(Math.random() * this.possible_sprites.length)]);
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

Crafty.c('Swappable', {
  init: function() {
    this.requires('Actor, Draggable, Tween');
    this.doneSwapping = false;

    //bind events to swap on drag
    this.bind('Dragging', function() {
      this.disableDrag();
      this.swap(this.getDirection());
    });
  },

  // Desc:   Grabs the direction this was moved.
  // Return: Array Array [x_or_y_axis, postive_or_negative_1_for_direction_on_axis]

  getDirection: function() {
    if (Math.abs(this.y - this._oldY) > Math.abs(this.x - this._oldX)) {
      if (this.y > this._oldY) {
        return ['y', 1];
      }
      else {
        return ['y', -1];
      }
    } else {
      if (this.x > this._oldX) {
        return ['x', 1];
      }
      else {
        return ['x', -1];
      }
    }
  },

  //TODO:    Finish the swap!
  // Desc:   Swaps two gems placement based on direction 'dir'
  //         If no gem adjacent to the one that was dragged, return.
  // Params: 
  //         - Array [x_or_y_axis, positive_or_negative_1_for_direction_on_axis]
  swap: function(direction) {
    if (this.doneSwapping) {
      this.doneSwapping = false;
      this.enableDrag();
      this.unbind('TweenEnd');
      return;
    }
    //x or y
    var axis = direction[0];
    //1 gem-width in the specified direction
    var destination = this[axis] + (direction[1] * this.w);
    //object that will specify what attributes to tween and what values to tween them to
    var tweenTo = {};
    tweenTo[axis] = destination;

    this.lastTweenAxis = axis;
    this.lastTweenDist = this[axis];

    this.tween(tweenTo, 500);
    //Once you've gone over, come right back (for now)
    this.bind('TweenEnd', function() {
      this.swap([axis, direction[1] * -1]);
      this.doneSwapping = true;
    });
  }
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
});

// TODO:   Finish canMove
// Desc:   Checks if there is an adjacent gem.
// Params: 
//         - Entity (Gem)
//         - Array [x_or_y_axis, postive_or_negative_1_for_direction_on_axis]
// Return: boolean

function canMove(gem, dir) {
  //Me need some code
}
