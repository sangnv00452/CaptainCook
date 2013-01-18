var GameVars = {
	ROW: 8,
	COLUMN : 8,
	command:{
		STARTGAME : 0,
	},
	swapStatus : {
		NONE : 0,
		TRUE : 1,
		FALSE :-1
	},
	roomStatus : {
		EMPTY: 0,
		WAITING : 1,
		FULL : 2
	}
}
if(!( typeof exports === 'undefined')) {
	module.exports = GameVars;
}