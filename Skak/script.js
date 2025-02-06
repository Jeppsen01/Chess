document.addEventListener("DOMContentLoaded", () => {
    const chessboard = document.querySelector(".chessboard");

    if (!chessboard) {
        console.error("FEJL: .chessboard kunne ikke findes i DOM'en!");
        return;
    }
    const pieces = {
        'white_rook': 'https://pics.clipartpng.com/midle/Rook_White_Chess_Piece_PNG_Clip_Art-2754.png',
        'white_knight': 'https://pics.clipartpng.com/midle/Knight_White_Chess_Piece_PNG_Clip_Art-2756.png',
        'white_bishop': 'https://pics.clipartpng.com/midle/Bishop_White_Chess_Piece_PNG_Clip_Art-2752.png',
        'white_queen': 'https://pics.clipartpng.com/midle/Queen_White_Chess_Piece_PNG_Clip_Art-2757.png',
        'white_king': 'https://pics.clipartpng.com/midle/King_White_Chess_Piece_PNG_Clip_Art-2755.png',
        'white_pawn': 'https://pics.clipartpng.com/midle/Pawn_White_Chess_Piece_PNG_Clip_Art-2751.png',
        'black_rook': 'https://pics.clipartpng.com/midle/Rook_Black_Chess_Piece_PNG_Clip_Art-2765.png',
        'black_knight': 'https://pics.clipartpng.com/midle/Knight_Black_Chess_Piece_PNG_Clip_Art-2766.png',
        'black_bishop': 'https://pics.clipartpng.com/midle/Bishop_Black_Chess_Piece_PNG_Clip_Art-2768.png',
        'black_queen': 'https://pics.clipartpng.com/midle/Queen_Black_Chess_Piece_PNG_Clip_Art-2767.png',
        'black_king': 'https://pics.clipartpng.com/midle/King_Black_Chess_Piece_PNG_Clip_Art-2769.png',
        'black_pawn': 'https://pics.clipartpng.com/midle/Pawn_Black_Chess_Piece_PNG_Clip_Art-2764.png'
    };

    function createPiece(color, type, row, col) {
        let piece = document.createElement("img");
        piece.src = pieces[color + "_" + type];
        piece.classList.add("piece", color);
        piece.draggable = true;
        piece.dataset.row = row;
        piece.dataset.col = col;
        piece.dataset.color = color;
        piece.id = `${color}_${type}_${row}_${col}`;
        piece.addEventListener("dragstart", dragStart);
        return piece;
    }

    function dragStart(event) {
        event.dataTransfer.setData("pieceId", event.target.id);
        
    }
    

    function dragOver(event) {
        event.preventDefault();
        if (!event.target.classList.contains("square")) {
            return;
        }
    }
    

    function drop(event) {
        event.preventDefault();
        
        let pieceId = event.dataTransfer.getData("pieceId");
        let piece = document.getElementById(pieceId);
    
        if (!piece) {
            console.error("FEJL: Brik ikke fundet!");
            return;
        }
    
        let targetSquare = event.target;
    
        // Sørg for at vi dropper på et felt, IKKE en brik
        if (targetSquare.classList.contains("piece")) {
            targetSquare = targetSquare.parentElement; // Gå til feltet i stedet
        }
    
        if (!targetSquare.classList.contains("square")) {
            console.warn("Ugyldigt træk! Kan kun placere på et felt.");
            return;
        }
    
        // Find om der allerede er en brik i det felt, vi vil rykke til
        let existingPiece = targetSquare.querySelector(".piece");
    
        if (existingPiece) {
            // Hvis der er en brik, tjek om den tilhører modstanderen
            if (existingPiece.dataset.color === piece.dataset.color) {
                console.warn("Kan ikke tage din egen brik!");
                return;
            }
    
            // Fjern modstanderens brik (TAKNING)
            existingPiece.remove();
            console.log("Brik taget:", existingPiece.id);
        }
    
        // Opdater brikkens position (NY KORREKT PLACERING)
        piece.dataset.row = targetSquare.dataset.row;
        piece.dataset.col = targetSquare.dataset.col;
    
        // Flyt brikken til feltet
        targetSquare.appendChild(piece);
       
    }
    

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.classList.add("square", (row + col) % 2 === 0 ? "white" : "black");
            square.dataset.row = row;
            square.dataset.col = col;
    
            square.addEventListener("dragover", dragOver);
            square.addEventListener("drop", drop);
    
            chessboard.appendChild(square);
        }
    }

    let squares = document.querySelectorAll(".square");
    let pieceSetup = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    for (let i = 0; i < 8; i++) {
        squares[i].appendChild(createPiece("white", pieceSetup[i], 0, i));
        squares[i + 8].appendChild(createPiece("white", "pawn", 1, i));

        squares[i + 48].appendChild(createPiece("black", "pawn", 6, i));
        squares[i + 56].appendChild(createPiece("black", pieceSetup[i], 7, i));
    }
});



