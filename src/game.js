//Game.js defines the Game object, which is in charge of:
//	Initializing the grid of tiles
//	Setting the background color
//	Defining the height and width of the game window

Game = {

	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:   8,
		height:  8,
		//to access this: e.g. Game.map_grid.tile.width
		tile: {
			width:  72,
			height: 72
		}
	},
	
	//Here is where we define the height and width of the game window (as opposed to the grid)
	//Right now the grid takes up the whole screen. That could change in the future!
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	//Call Game.chance() for an intuitive percent-chance function.
	chance: function(percent) {
		return Math.random() * 100 < percent;
	},
	
	// Initialize and start our game
	start: function() {
		//Initialize Crafty, creating a canvas window
		Crafty.init(Game.width(), Game.height()); 
		//Set the background color - let's go with a nice frosty blue
		Crafty.background("#4c4233");
		//Begin with the Loading scene - see 'scenes.js'
		Crafty.scene('Loading');
	},
}

$text_css = { 'font-size': '24px', 
	'font-family': 'Arial', 
	'color': 'white', 
	'text-align': 'center' 
}
