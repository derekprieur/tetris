const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const startButton = document.getElementById('start-btn')
const numBlocks = 200
const width = 10
const height = 20
const lPiece = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]
const zPiece = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width + 1, width, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width + 1, width, width * 2 + 1]
]
const tPiece = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]
const oPiece = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]
const iPiece = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
]
const pieces = [lPiece, zPiece, tPiece, oPiece, iPiece]
const colors = [
    "yellow",
    "green",
    "red",
    "purple",
    "blue"
]
let squares = []
let currentPosition = 4
let currentPiece = Math.floor(Math.random() * pieces.length)
let currentRotation = 0
let current = pieces[currentPiece][currentRotation]
let piecePlaced = false
let dropInterval
let nextRandomPiece = 0
let gamePaused = false
let score = 0

function createBoard() {
    for (let i = 0; i < numBlocks; i++) {
        const newBlock = document.createElement('div')
        newBlock.classList.add('block')
        newBlock.classList.add(`${i}`)
        grid.appendChild(newBlock)
        squares.push(newBlock)
    }

    for (let i = 0; i < 10; i++) {
        const takenBlock = document.createElement('div')
        takenBlock.classList.add('taken')
        grid.appendChild(takenBlock)
        squares.push(takenBlock)
    }

}

function startGame() {
    draw()
    displayMiniGridPiece()
    startButton.removeEventListener('click', startGame)
    startButton.addEventListener('click', pause)
}

function draw() {
    displayPiece()
    dropInterval = setInterval(dropPiece, 500)
}

function displayPiece() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add("piece")
        squares[currentPosition + index].classList.add(colors[currentPiece])

    })
}

function hidePiece() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("piece")
        squares[currentPosition + index].classList.remove(colors[currentPiece])
    })
}

function control(e) {
    if (e.keyCode === 37) {
        movePieceLeft()
    }
    if (e.keyCode === 38) {
        rotatePiece()
    }
    if (e.keyCode === 39) {
        movePieceRight()
    }
    if (e.keyCode === 40) {
        movePieceDown()
    }
}

function dropPiece() {
    freezePiece()
    if (!piecePlaced) {
        hidePiece()
        currentPosition += width
        displayPiece()
    } else {
        clearInterval(dropInterval)
        piecePlaced = false
    }

}

function freezePiece() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        piecePlaced = true
        currentPiece = nextRandomPiece
        nextRandomPiece = Math.floor(Math.random() * pieces.length)
        current = pieces[currentPiece][currentRotation]
        currentPosition = 4
        checkForCompletedRow()
        draw()
        displayMiniGridPiece()
        gameOver()
    }
}

function checkForCompletedRow() {
    for (let i = 0; i < numBlocks; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('piece')
                squares[index].classList.remove('blue')
                squares[index].classList.remove('yellow')
                squares[index].classList.remove('green')
                squares[index].classList.remove('purple')
                squares[index].classList.remove('red')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

function movePieceLeft() {
    const cannotMoveLeft = current.some(index => (currentPosition + index) % width === 0)

    if (!cannotMoveLeft) {
        hidePiece()
        currentPosition -= 1
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
    }

    displayPiece()

}

function movePieceRight() {
    const cannotMoveRight = current.some(index => (currentPosition + index + 1) % width === 0)

    if (!cannotMoveRight) {
        hidePiece()
        currentPosition += 1
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1
    }

    displayPiece()
}

function movePieceDown() {
    dropPiece()
}

function rotatePiece() {
    hidePiece()
    currentRotation != 3 ? currentRotation++ : currentRotation = 0
    current = pieces[currentPiece][currentRotation]
    displayPiece()
}

startButton.addEventListener('click', startGame)

createBoard()

document.addEventListener('keydown', control)

const displayNext = document.querySelectorAll('.mini-grid div')
const miniGridWidth = 4
let miniGridIndex = 0

const upNextPiece = [
    [1, miniGridWidth + 1, miniGridWidth * 2 + 1, 2],
    [0, miniGridWidth + 1, miniGridWidth, miniGridWidth * 2 + 1],
    [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2],
    [0, 1, miniGridWidth, miniGridWidth + 1],
    [1, miniGridWidth + 1, miniGridWidth * 2 + 1, miniGridWidth * 3 + 1]
]

function displayMiniGridPiece() {
    displayNext.forEach(square => {
        square.classList.remove('piece')
        square.classList.remove(colors[0])
        square.classList.remove(colors[1])
        square.classList.remove(colors[2])
        square.classList.remove(colors[3])
        square.classList.remove(colors[4])
    })
    upNextPiece[nextRandomPiece].forEach(index => {
        displayNext[index].classList.add('piece')
        displayNext[index].classList.add(colors[nextRandomPiece])
    })
}

function pause() {
    if (!gamePaused) {
        clearInterval(dropInterval)
        gamePaused = true

    }
    else {
        dropInterval = setInterval(dropPiece, 500)
        gamePaused = false
    }
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        clearInterval(dropInterval)
    }
}