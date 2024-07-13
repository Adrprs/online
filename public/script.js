const socket = io();

const board = document.getElementById('game-board');
const boardSize = 8;
const pieces = [];

// Inicializa o tabuleiro e as peças
function initBoard() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if ((row + col) % 2 === 0) {
                cell.classList.add('white');
            } else {
                cell.classList.add('black');
                cell.dataset.id = `${row}-${col}`;
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red');
                    piece.dataset.id = `${row}-${col}-red`;
                    cell.appendChild(piece);
                    pieces.push(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black');
                    piece.dataset.id = `${row}-${col}-black`;
                    cell.appendChild(piece);
                    pieces.push(piece);
                }
            }
            board.appendChild(cell);
        }
    }
}

initBoard();

// Lógica básica de movimentação (adicionando eventos)
let selectedPiece = null;

board.addEventListener('click', (e) => {
    const target = e.target;

    if (selectedPiece) {
        // Movimentação
        if (target.classList.contains('cell') && target.childElementCount === 0) {
            target.appendChild(selectedPiece);

            // Envia o movimento para o servidor
            const move = {
                pieceId: selectedPiece.dataset.id,
                cellId: target.dataset.id
            };
            socket.emit('move', move);

            selectedPiece = null;
        }
    } else {
        // Seleção de peça
        if (target.classList.contains('piece')) {
            selectedPiece = target;
        }
    }
});

// Recebe movimento do outro jogador
socket.on('move', (move) => {
    const piece = document.querySelector(`[data-id='${move.pieceId}']`);
    const cell = document.querySelector(`[data-id='${move.cellId}']`);
    cell.appendChild(piece);
});
