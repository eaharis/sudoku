// Valid completed Sudoku board
const completedBoard = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

// One empty cell per 3x3 grid (row, col pairs)
const emptyCells = [
    [0, 1],  // Top-left 3x3
    [0, 4],  // Top-middle 3x3
    [1, 8],  // Top-right 3x3
    [3, 1],  // Middle-left 3x3
    [4, 4],  // Center 3x3
    [4, 7],  // Middle-right 3x3
    [6, 1],  // Bottom-left 3x3
    [7, 3],  // Bottom-middle 3x3
    [8, 7]   // Bottom-right 3x3
];

let selectedCell = null;
let gameCompleted = false;

// Check if a cell should be empty
function isEmptyCell(row, col) {
    return emptyCells.some(([r, c]) => r === row && c === col);
}

// Initialize the board
function initBoard() {
    const board = document.getElementById('sudoku-board');
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (isEmptyCell(row, col)) {
                cell.textContent = '';
                cell.classList.add('editable');
                cell.dataset.answer = completedBoard[row][col];
            } else {
                cell.textContent = completedBoard[row][col];
            }
            
            // Add click event listener
            cell.addEventListener('click', () => handleCellClick(cell));
            
            board.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(cell) {
    // Don't allow selection if game is completed
    if (gameCompleted) {
        return;
    }
    
    // Only allow selection of editable cells
    if (!cell.classList.contains('editable')) {
        return;
    }
    
    // Remove previous selection
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    
    // Add selection to clicked cell
    cell.classList.add('selected');
    selectedCell = cell;
}

// Handle keyboard input
function handleKeyPress(event) {
    if (gameCompleted || !selectedCell || !selectedCell.classList.contains('editable')) {
        return;
    }
    
    const key = event.key;
    
    // Check if it's a number 1-9
    if (key >= '1' && key <= '9') {
        const userAnswer = parseInt(key);
        const correctAnswer = parseInt(selectedCell.dataset.answer);
        
        selectedCell.textContent = key;
        selectedCell.classList.remove('correct', 'incorrect');
        
        if (userAnswer === correctAnswer) {
            selectedCell.classList.add('correct');
            checkCompletion();
        } else {
            selectedCell.classList.add('incorrect');
        }
    } else if (key === 'Backspace' || key === 'Delete') {
        // Allow clearing the cell
        selectedCell.textContent = '';
        selectedCell.classList.remove('correct', 'incorrect');
    }
}

// Check if all cells are correctly filled
function checkCompletion() {
    const editableCells = document.querySelectorAll('.cell.editable');
    const allCorrect = Array.from(editableCells).every(cell => 
        cell.classList.contains('correct')
    );
    
    if (allCorrect) {
        gameCompleted = true;
        const successMessage = document.getElementById('success-message');
        successMessage.classList.remove('hidden');
        
        // Deselect current cell
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            selectedCell = null;
        }
    }
}

// Reset the game
function resetGame() {
    gameCompleted = false;
    selectedCell = null;
    
    // Hide success message
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('hidden');
    
    // Clear and reset all editable cells
    const editableCells = document.querySelectorAll('.cell.editable');
    editableCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('correct', 'incorrect', 'selected');
    });
}

// Initialize the board when page loads
document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    
    // Add reset button listener
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);
});

document.addEventListener('keydown', handleKeyPress);
