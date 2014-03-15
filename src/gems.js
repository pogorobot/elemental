Crafty.c('Air', {
  init: function() {
    this.requires('spr_air');
    this.gemType = 'Air';
  }
});
Crafty.c('Earth', {
  init: function() {
    this.requires('spr_earth');
    this.gemType = 'Earth';
  }
});
Crafty.c('Fire', {
  init: function() {
    this.requires('spr_fire');
    this.gemType = 'Fire';
  }
});
Crafty.c('Water', {
  init: function() {
    this.requires('spr_water');
    this.gemType = 'Water';
  }
});
Crafty.c('Metal', {
  init: function() {
    this.requires('spr_metal');
    this.gemType = 'Metal';
  }
});
Crafty.c('Wood', {
  init: function() {
    this.requires('spr_wood');
    this.gemType = 'Wood';
  }
});

Crafty.c('Falling', {
  init: function() {
    this.destination = {x: this.x, y: this.y + this.h}
    this.bind('EnterFrame', this.keepFalling);
    this.speed = 5;
  },

  keepFalling: function() {
    if (this.x >= this.destination.x && this.y >= this.destination.y) {
      this.x = this.destination.x;
      this.y = this.destination.y;
      this.unbind('EnterFrame', this.keepFalling);
      if (this.board.gemAt(this.at().x, this.at().y + 1) === undefined) {
        this.init();
      }
      else {
        this.removeComponent('Falling');
      }
    }
    else {
      this.y += this.speed;
    }
  }
});