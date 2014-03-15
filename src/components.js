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
  init:         function() {
                  this.requires('Actor, Motion, BoardGemProxy, Draggable, Statable, RandomGemType');
                  this._globalZ = 1;
                  this.initStatable(this);
                },
  
  gem:          function(board) {
                  this.setBoard(board);
                  this['original_x'] = this.x;
                  this['original_y'] = this.y;
                },

  initStatable: function(gem) {
                  var _prepareToAsk            = function() { return new function(){ gem.setDirection(); gem.disableDrag(); }; };
                  var _setStateToCheckForMatch = function() { window.setTimeout(function(){gem.setState('checkForMatch');}, 550); };
                  var _askToMove               = function() { gem.askToMove(gem.getBoard()); };
                  var _checkForMatch           = function() { gem.checkForMatch(gem.getBoard()); };
                  var _setStateToRemoving      = function() { gem.setState('removing'); };
                  var _move                    = function() { gem.move(); };

                  var states = [{name: "idle",          onSet: null,          nextState: null,                     event: null},
                                {name: "askToMove",     onSet: _prepareToAsk, nextState: _askToMove,               event: "Dragging"},
                                {name: "moving",        onSet: _move,         nextState: _setStateToCheckForMatch, event: null},
                                {name: "checkForMatch", onSet: null,          nextState: _checkForMatch,           event: null},
                                {name: "falling",       onSet: gem.fall,      nextState: _setStateToRemoving,      event: null},
                                {name: "removing",      onSet: gem.remove,    nextState: null,                     event: null}];
                  
                  gem.addStates(states);
                  gem.state = 'idle'; //start idle
                },

});

Crafty.c('RandomGemType', {

  init: function() {
    this.requires(this.possible_types[Math.floor(Math.random() * this.possible_types.length)]);
  },

  possible_types: [
    'Air',
    'Earth',
    'Fire',
    'Water',
    'Metal',
    'Wood'
  ]

});

Crafty.c('BoardGemProxy', {
  init:           function() {
                    this.requires('Motion, Statable');
                    this.moveCount = 0;
                  },

  setBoard:       function(board) {
                    this.board = board;
                  },

  getBoard:       function() {
                    return this.board;
                  },

  askToMove:      function(board) {
                    if(board.ask('move', this.direction, this.getId())) {
                      this.moveCount = 1;
                      this.setState('moving');
                    }
                    else {
                      this.x = this._oldX;
                      this.y = this._oldY;
                      this.setState('idle');
                      this.enableDrag();
                    }
                  },

  checkForMatch: function(board) {
                    if(this.moveCount >= 2) {
                      this.moveCount = 0;
                      this.enableDrag();
                      this.setState('idle');
                    } else if(board.ask('match', this.getId())) {
                      this.setState('falling');
                    } else {
                      this.reverseDirection();
                      this.moveCount = 2;
                      this.setState('moving');
                    } 
                  },
});

Crafty.c('Motion', {
  init:             function() {
                      this.requires('Actor, Draggable, Tween');
                      this.time_to_tween = 500;
                    },

  reverseDirection: function() {
                      this.direction[1] *= -1;
                    },

  setSouth:         function() {
                      this.direction = ['y', 1];
                    },

  setDirection:     function() {
                      if (Math.abs(this.y - this._oldY) > Math.abs(this.x - this._oldX)) {
                        if (this.y > this._oldY) {
                          this.direction = ['y', 1];
                        } else {
                          this.direction = ['y', -1];
                        }
                      } else {
                        if (this.x > this._oldX) {
                          this.direction = ['x', 1];
                        } else {
                          this.direction = ['x', -1];
                        }
                      }
                    },

  move:             function() {
                      var axis        = this.direction[0];
                      var destination = this['original_' + axis] + (this.direction[1] * this.w);

                      var tweenTo     = {};
                      tweenTo[axis]   = destination;

                      this.tween(tweenTo, this.time_to_tween);
    
                      this.lastTweenAxis       = axis;
                      this.lastTweenDirection  = this.direction[1];
                      this['original_' + axis] = destination;
                    },

  fall:             function() {
                      this.setSouth();
                      this.move();
                      this.move();
                      this.move();
                    },

  remove:           function() {
                      //selfDESTRUCTTTTTT();
                    },
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

Crafty.c('Statable', {
  init:           function() {
                    this.state  = '';
                    this.states = {};
                  },

  addStates:      function(states) {
                    for(var i = 0, z = states.length; i < z; i++) {
                      this.addState(states[i]);
                    }
                  },

  addState:       function(state) {
                    this.states[state.name] = state;

                    if(this.states[state.name].event !== null)
                      this.bind(this.states[state.name].event, function(){this.setState(this.states[state.name].name);}); 
                  },

  getState:       function() {
                    return this.states[this.state];
                  },

  setState:       function(newState){
                    this.state = newState;

                    this._onSetListener();
                    this._nextState();
                  },

  _onSetListener: function() {
                    if(typeof this.states[this.state].onSet === 'function') {
                      this.states[this.state].onSet();
                    }
                  },

  _nextState:     function() {
                    if(typeof this.states[this.state].nextState === 'function') {
                      this.states[this.state].nextState();
                    }
                  },
});

Crafty.c('Board', {
  init:           function() {
                    this.gems     = [];
                    this.barriers = [];
                    this.pieces   = this.gems + this.barriers;
                    this.grid     = Game.map_grid;
                    this.totalMatches = 0;
                  },

  ask:            function() {
                    var argumentArray = [].slice.apply(arguments); 
                    var what = argumentArray[0];
                    var args = argumentArray.slice(1, argumentArray.length);

                    switch(what)
                    {
                    case 'move':
                      return this._checkForSpace(args);
                    case 'match':
                      return this._checkForMatch(args);
                    default: 
                      console.log("Do something");
                    }
                  },

  _checkForSpace: function(args) {                   
                    var direction    = args[0];
                    var id           = args[1];
                    var multiplier   = (direction[0] === 'x') ? 16 : 2 //(8 Tiles + 8 Gems = NextSibling). 
                    var targetId     = id + (direction[1] * multiplier); 
                    var targetEntity = Crafty(targetId);
       

                    if(targetEntity.__c.Gem) {
                      if (targetEntity.state == 'idle') {
                        targetEntity.direction = [direction[0], direction[1] * -1];
                        targetEntity.setState('moving');
                        targetEntity.disableDrag();
                        return true;
                      }
                    }
                    return false;
                  },

  _checkForMatch: function(args) {
                    this.makeMatches();
                    return false;
                  },

  makeMatches: function() {
    console.log('Matching');
    this.findAllGems();
    for (var x = 0; x < this.grid.width - 2; x++) {
      for (var y = 0; y < this.grid.height - 2; y++) {
        gem = this.gemAt(x, y);
        secondGem = this.gemAt(x + 1, y);
        thirdGem = this.gemAt(x + 2, y);
        this.tryMatching(gem, secondGem, thirdGem);
        secondGem = this.gemAt(x, y + 1);
        thirdGem = this.gemAt(x, y + 2);
        this.tryMatching(gem, secondGem, thirdGem);
      }
    }
    Crafty('Matched').destroy(); 
  },

  tryMatching: function(gem, secondGem, thirdGem) {
    if (gem.gemType === secondGem.gemType && gem.gemType === thirdGem.gemType) {
      gem.requires('Matched');
      secondGem.requires('Matched');
      thirdGem.requires('Matched');
      this.totalMatches++;
    }
  },

  gemAt: function(x, y) {
    return this.gemLayout[x][y];
  },

  findAllGems: function() {
    this.gemLayout = [];
    for (var x = 0; x < this.grid.width; x++) {
      this.gemLayout[x] = new Array(this.grid.height);
    }
    var gem;
    var x;
    var y;
    //the 'each' function changes the meaning of 'this'
    Crafty('Gem').each(function() {
      this.board.gemLayout[this.at().x][this.at().y] = this;
    });
  },
});
