document.addEventListener("DOMContentLoaded", () => {
    class Validator {
        constructor() {
            this.turn = "white"; // White starts
            this.pieces = {
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
        }

        isValidMove(piece, fromRow, fromCol, toRow, toCol) {
            const type = piece.id.split("_")[1]; // Extract piece type

            let rowDiff = Math.abs(toRow - fromRow);
            let colDiff = Math.abs(toCol - fromCol);

            switch (type) {
                case "pawn":
                    return this.isValidPawnMove(piece, fromRow, fromCol, toRow, toCol);
                case "rook":
                    return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
                case "knight":
                    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
                case "bishop":
                    return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
                case "queen":
                    return this.isValidRookMove(fromRow, fromCol, toRow, toCol) ||
                           this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
                case "king":
                    return rowDiff <= 1 && colDiff <= 1;
                default:
                    return false;
            }
        }

        isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
            const direction = piece.dataset.color === "white" ? 1 : -1;
            const startingRow = piece.dataset.color === "white" ? 1 : 6;

            if (fromCol === toCol) { // Normal forward move
                if (toRow - fromRow === direction) return true;
                if (fromRow === startingRow && toRow - fromRow === 2 * direction) return true;
            }
            return false;
        }

        isValidRookMove(fromRow, fromCol, toRow, toCol) {
            return fromRow === toRow || fromCol === toCol;
        }

        isValidBishopMove(fromRow, fromCol, toRow, toCol) {
            return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
        }
    }

    const validator = new Validator();

    const chessboard = document.querySelector(".chessboard");
    if (!chessboard) {
        console.error("FEJL: .chessboard kunne ikke findes i DOM'en!");
        return;
    }

    function createPiece(color, type, row, col) {
        let piece = document.createElement("img");
        piece.src = validator.pieces[color + "_" + type];
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
        let piece = event.target;
        if (piece.dataset.color !== chessGame.turn) {
            console.warn("Ikke din tur!");
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData("pieceId", piece.id);
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
        if (targetSquare.classList.contains("piece")) {
            targetSquare = targetSquare.parentElement;
        }
    
        if (!targetSquare.classList.contains("square")) {
            console.warn("Ugyldigt træk! Kan kun placere på et felt.");
            return;
        }
    
        let fromRow = parseInt(piece.dataset.row);
        let fromCol = parseInt(piece.dataset.col);
        let toRow = parseInt(targetSquare.dataset.row);
        let toCol = parseInt(targetSquare.dataset.col);

        if (!validator.isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
            console.warn("Ugyldigt træk!");
            return;
        }

        let existingPiece = targetSquare.querySelector(".piece");
        if (existingPiece && existingPiece.dataset.color === piece.dataset.color) {
            console.warn("Kan ikke tage din egen brik!");
            return;
        }
        if (existingPiece) {
            existingPiece.remove();
            console.log("Brik taget:", existingPiece.id);
        }

        piece.dataset.row = toRow;
        piece.dataset.col = toCol;
        targetSquare.appendChild(piece);

        validator.turn = validator.turn === "white" ? "black" : "white";
        console.log("Det er nu " + validator.turn + "s tur!");
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



