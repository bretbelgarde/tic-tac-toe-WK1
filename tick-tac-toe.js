var game = new Phaser.Game(600, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create
});
var boardData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var playerTurn = 1;
var text = '';
var turns = 0;
var board;

function preload() {
    game.load.image('board', 'assets/background.png');
    game.load.image('marker1', 'assets/marker1.png');
    game.load.image('marker2', 'assets/marker2.png');
}

function create() {
    board = game.add.sprite(0, 0, 'board');
    board.inputEnabled = true;
    board.events.onInputDown.add(clicked, this);
    
    text = game.add.text(16, 550, '', {fill: '#cc0000', z: 1});
    
}

function clicked() {
    var locX = game.input.mousePointer.x,
        locY = game.input.mousePointer.y,
        winner = '',
        markerX,
        markerY,
        col = checkX(locX),
        row = checkY(locY);
    
    // The board "Squares" are 200 x 200  the makers are 150x150, 25px is the offeset to
    // center the markers.
    
    markerX = col * 200 + 25;
    markerY = row * 200 + 25;
    
    if (col >= 0 || row >= 0) {
        // Check boardData to see if a marker has been placed
        if (boardData[row][col] === 0) {
            // if no place marker
            marker = 'marker' + playerTurn;
            // Add Marker to screen and set boardData
            game.add.sprite(markerX, markerY, marker );
            boardData[row][col] = playerTurn;
            // Check if move was a winner
            winner = checkVictory(col, row);
            if (winner.length > 1) {
                text.setText(winner + 'is the winner!');
                game.input.mousePointer.disable = true;
            } 
            // change player var to next player
            playerTurn = (playerTurn === 1) ? 2 : 1;
        }
    }
}

function checkX(locX) {
    if (locX > 0 && locX < 200) {
        return 0;
    } else if (locX >= 200 && locX < 400) {
        return 1;
    } else if (locX >= 400 && locX < 600) {
        return 2;
    } else {
        return -1;
    }
}

function checkY(locY) {
    if (locY > 0 && locY < 200) {
        return 0;
    } else if (locY >= 200 && locY < 400) {
        return 1;
    } else if (locY >= 400 && locY < 600) {
        return 2;
    } else {
        return -1;
    }
}

function checkVictory(col, row) {
    var markerCount = 0,
        winner = '';
        
    turns += 1; // Increment turn counter for tie detection
    
    // Check horiz
    boardData[row].forEach(function(element, index, array) {
        markerCount += (element === playerTurn) ? 1 : 0;
        if (markerCount === 3) {
            winner = 'player ' + playerTurn;
            
        }
    });
    
    // Check vert
    markerCount = 0; // Reset markerCount before counting
    boardData.forEach(function(element, index, array) {
        markerCount += (element[col] === playerTurn) ? 1 : 0;
        if (markerCount === 3) {
            winner = 'player ' + playerTurn;
        }
    });
    
    markerCount = 0;
    // Check Diag
    if (boardData[1][1] === playerTurn) {
        if ((boardData[0][0] === playerTurn && boardData[2][2] === playerTurn) 
            || (boardData[0][2] === playerTurn && boardData[2][0] === playerTurn)) {
            winner = 'player ' + playerTurn;
        }
    }
    
    // Check Move
    if (winner.length <= 1 && turns === 9) {
        winner = 'No one ';
    }

    return winner;
}
                        