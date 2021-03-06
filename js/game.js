const game = {
    name: 'Arkanoid Game',
    description: "Arkanoid game",
    version: '1.0.0',
    license: undefined,
    author: 'Gonzalo Arguelles Navarro y Carlos Martin-Salas Larena',

    // Canvas
    ctx: undefined,
    canvasTag: undefined,
    canvasSize: {
        w: undefined,
        h: undefined
    },

    // Background
    background: undefined,

    // Game
    fps: 60,
    frames: 0,

    // Score
    score: 0,
    pointsInGame: undefined,
    pointsWin: undefined,
    pointsGameOver: undefined,

    // Bar
    bar: undefined,
    barWidth: 200,
    keys: {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        space: undefined
    },

    // Bricks
    bricks: [],
    brickHeight: 40,
    brickWidth: 100,
    brickStatus: 1,
    brickIniPosX: 35,
    brickIniPosY: 60,
    brickRow: 5,
    brickCol: 13,

    // Balls
    balls: [],
    
    // Power-ups
    doubleSize: [],
    extraBalls: [],
    sliceSize: [],
    changeDir: [],
    shotBow: [],
    arrow: [],
    arrowStatus: 1,


    // GAME INITIALIZATION

    init(id) {
        this.canvasTag = document.getElementById(id)
        this.ctx = this.canvasTag.getContext('2d')
        this.setDimensions()
        this.start()
        this.drawBricks()
        this.drawBar()
        this.drawBall()
        this.drawBackground()
        this.setEventListeners()
    },

    setDimensions() {
        this.canvasSize.w = window.innerWidth
        this.canvasSize.h = window.innerHeight
        this.canvasTag.setAttribute('width', this.canvasSize.w)
        this.canvasTag.setAttribute('height', this.canvasSize.h)
    },

    start() {
        document.getElementById('backgroundSound').play()
        this.interval = setInterval(() => {
        this.clearScreen() 
        this.drawAll()    
        this.createDoubleSize()
        this.moveDoubleSize()
        this.createExtraBalls()
        this.moveExtraBalls()
        this.createSliceSize()
        this.moveSliceSize()
        this.createChangeDir()
        this.moveChangeDir()
        this.createShotBow()
        this.moveShotBow()   
        this.clearOutOfScreen()
        //end game
        this.balls.length == 0 ? this.gameOver() : null 
        this.bricks.length == 0 ? this.youWin() : null
        },(1000 / this.fps))
    },

    reset() {
        this.drawBackground()
        this.drawBar()
        this.score = 0
        this.keys.left = 'ArrowLeft'
        this.keys.right = 'ArrowRight'
        this.keys.space = undefined
        this.balls = []
        this.doubleSize = []
        this.sliceSize = []
        this.changeDir = []
        this.extraBalls = []
        this.shotBow = []
        this.arrow = [],
        this.bricks = []
        this.points()
        this.drawBricks()
        this.drawBall()
        this.bricksColision()
        this.arrowColision()
        this.start()
    },

    drawAll() {
        //framesreset
        this.frames > 2000 ? this.frames = 0 : this.frames++
        ////game elements 
        this.background.draw()
        this.bar.draw()
        this.bricks.forEach(elm=> elm.draw())
        this.balls.forEach(elm => elm.draw())
        //power-ups
        this.sliceSize.forEach(e => e.draw())
        this.doubleSize.forEach(e => e.draw())
        this.extraBalls.forEach(e => e.draw())
        this.changeDir.forEach(e => e.draw())
        this.shotBow.forEach(e => e.draw())
        this.arrow.forEach(e => e.draw())
        //colisions
        this.bricksColision()
        this.arrowColision()
        this.barColision()
        this.DSColision()
        this.EBColision()
        this.SSColision()
        this.CDColision()
        this.shotBowColision()
        this.moveArrow()
        
    },


    //BACKGROUND

    drawBackground(){
        this.background = new Background(this.ctx, this.canvasSize.w, this.canvasSize.h, 'images/background.png');
    },

    //Bar Elements

    drawBar() {
        this.bar = new PlayerBar(this.ctx, this.canvasSize.w/2 - 100, this.canvasSize.h - 50, this.barWidth, 25, '../images/player-bar.png') 
    },

    barColision() {
        this.balls.forEach(elm => {
            if (elm.ballPos.ballx >= this.bar.barPos.x &&
                elm.ballPos.ballx <= (this.bar.barPos.x + this.bar.barSize.w / 2) -1 &&
                elm.ballPos.bally + 10 >= this.bar.barPos.y)
            {
                if (elm.ballVel.x < 0) {
                    document.getElementById('barColisionSound').play()
                    elm.ballVel.y *= -1
                    elm.ballVel.x *= 1
                }
                else {
                    document.getElementById('barColisionSound').play()
                    elm.ballVel.y *= - 1
                    elm.ballVel.x *= - 1
                }
            }
            if (elm.ballPos.ballx >= this.bar.barPos.x + this.bar.barSize.w / 2 &&
                elm.ballPos.ballx <= this.bar.barPos.x + this.bar.barSize.w  &&
                elm.ballPos.bally + 10 >= this.bar.barPos.y)
            {

                if (elm.ballVel.x > 0) {
                    document.getElementById('barColisionSound').play()
                    elm.ballVel.y *= -1
                    elm.ballVel.x *= 1
                }
                else {
                    document.getElementById('barColisionSound').play()
                    elm.ballVel.y *= - 1
                    elm.ballVel.x *= - 1
                }
            }
        })
    },

    //Brick Elements

    drawBricks() {
         for (let i = 0; i < this.brickRow; i++){
            for (let j = 0; j < this.brickCol; j++){
                this.bricks.push(new Brick (this.ctx,this.brickIniPosX + this.brickWidth * j,this.brickIniPosY + this.brickHeight * i, this.brickHeight, this.brickWidth, this.brickStatus, this.canvasSize, '../images/brick.png'))
            }
        }
    },

    bricksColision() {
        this.balls.forEach(eachball => {
            this.bricks.forEach(eachBrick => {
                if (eachball.ballPos.ballx >= eachBrick.brickPos.brickx &&
                    eachball.ballPos.ballx <= eachBrick.brickPos.brickx + eachBrick.brickSize.brickW &&
                    eachball.ballPos.bally + 10 >= eachBrick.brickPos.bricky &&
                    eachball.ballPos.bally <= eachBrick.brickPos.bricky + eachBrick.brickSize.brickH + 10)
                {
                    document.getElementById('brickColisionSound').play()
                    eachball.ballVel.y *= -1
                    this.score += 100
                    this.points()
                    eachBrick.brickStatus = 0
                    this.bricks = this.bricks.filter (eachBrick => eachBrick.brickStatus !== 0)// no elimina nada
                }

                if (eachball.ballPos.bally >= eachBrick.brickPos.bricky &&
                    eachball.ballPos.bally <= eachBrick.brickPos.bricky + eachBrick.brickSize.brickH && 
                    eachball.ballPos.ballx + 10 >= eachBrick.brickPos.brickx &&
                    eachball.ballPos.ballx <= eachBrick.brickPos.brickx + eachBrick.brickSize.brickW + 10
                ) {
                    document.getElementById('brickColisionSound').play()
                    eachball.ballVel.x *= -1
                    this.score += 100
                    this.points()
                    eachBrick.brickStatus = 0
                    this.bricks = this.bricks.filter (eachBrick => eachBrick.brickStatus !== 0)
                }

            })
        })
    },

    //Ball Elements

    drawBall() {
        this.balls.push(new Ball (this.ctx, this.canvasSize.w/2, this.canvasSize.h - 60, 10, 20, 4, 4, this.canvasSize))
    },
    
    //EXTRA BALLS Power Up

    createExtraBalls() {
        if (this.frames % 600 === 0) {
          let y = 0
          let minGap = 0
          let maxGap = this.canvasSize.w - 30
          let Gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)
          this.extraBalls.push(new ExtraBalls (this.ctx, Gap, y, 45, 45, '../images/moreballs.png'))
        }
    },

    moveExtraBalls() {
        this.extraBalls.forEach(e => {
            e.EBPos.y += 4
        })
    },

    EBColision() {
        this.extraBalls.forEach(e => {
            if (e.EBPos.x < this.bar.barPos.x + this.bar.barSize.w &&
                e.EBPos.x + e.EBSize.w > this.bar.barPos.x &&
                e.EBPos.y < this.bar.barPos.y + this.bar.barSize.h &&
                e.EBSize.h + e.EBPos.y > this.bar.barPos.y)
            {
                document.getElementById('EBColisionSound').play()
                this.balls.push(new Ball (this.ctx, this.bar.barPos.x + this.bar.barSize.w / 2, this.canvasSize.h - 60, 10, 20, 4, 4, this.canvasSize))
                this.balls.push(new Ball (this.ctx, this.bar.barPos.x + this.bar.barSize.w / 2, this.canvasSize.h - 60, 10, 20, -4, 4, this.canvasSize))
                this.extraBalls = this.extraBalls.filter(e => e.EBPos.y >= this.bar.barPos.y)
            }
        })
    },
    
    //DOUBLE SIZE Power Up

    createDoubleSize() {
        if (this.frames % 1000 === 0) {
          let y = 0
          let minGap = 0
          let maxGap = this.canvasSize.w - 30
          let Gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)
          this.doubleSize.push(new DoubleSize (this.ctx, Gap, y, 45, 45, '../images/x2.png'))
        }
    },

    moveDoubleSize() {
        this.doubleSize.forEach(e => {
            e.DSPos.y += 4
        })
    },
    
    DSColision() {
        this.doubleSize.forEach(e => {
            if (e.DSPos.x < this.bar.barPos.x + this.bar.barSize.w &&
                e.DSPos.x + e.DSSize.w > this.bar.barPos.x &&
                e.DSPos.y < this.bar.barPos.y + this.bar.barSize.h &&
                e.DSSize.h + e.DSPos.y > this.bar.barPos.y)
            {
            this.growSize()
            this.doubleSize = this.doubleSize.filter(e => e.DSPos.y >= this.bar.barPos.y)
            }
        })
    },

    growSize() {
        document.getElementById('doublebarSound').play()
        this.bar.barSize.w = this.barWidth * 2
        setTimeout(() => {
            this.bar.barSize.w = this.barWidth
        }, 5000)
    },

    //SLICE SIZE Power Up

    createSliceSize() {
        if (this.frames % 420 === 0) {
          let Sy = 0
          let SminGap = 0
          let SmaxGap = this.canvasSize.w - 30
          let SGap = Math.floor(Math.random() * (SmaxGap - SminGap + 1) + SminGap)
          this.sliceSize.push(new Slicebar(this.ctx, SGap, Sy, 35, 94, '../images/sliceSize.png'))
        }
    },

    moveSliceSize() {
        this.sliceSize.forEach(e => {
            e.SSPos.y += 4
        })
    },

    SSColision() {
        this.sliceSize.forEach(e => {
            if (e.SSPos.x < this.bar.barPos.x + this.bar.barSize.w &&
                e.SSPos.x + e.SSSize.w > this.bar.barPos.x &&
                e.SSPos.y < this.bar.barPos.y + this.bar.barSize.h &&
                e.SSSize.h + e.SSPos.y > this.bar.barPos.y)
            {
            this.sliceSizeBar()
            this.sliceSize = this.sliceSize.filter(e => e.SSPos.y >= this.bar.barPos.y)
            }
        })
    },

    sliceSizeBar() {
        document.getElementById('sliceSound').play()
        this.bar.barSize.w = this.barWidth / 2
        setTimeout(() => {
            this.bar.barSize.w = this.barWidth
        }, 5000)
    },

    //CHANGE DIRECTION Power Up

    createChangeDir() {
        if (this.frames % 480 === 0) {
          let Sy = 0
          let SminGap = 0
          let SmaxGap = this.canvasSize.w - 30
          let SGap = Math.floor(Math.random() * (SmaxGap - SminGap + 1) + SminGap)
          this.changeDir.push(new Change(this.ctx, SGap, Sy, 45, 45, '../images/changeDir.png'))
        }
    },

    moveChangeDir() {
        this.changeDir.forEach(e => {
            e.CDPos.y += 4
        })
    },

    CDColision() {
        this.changeDir.forEach(e => {
            if (e.CDPos.x < this.bar.barPos.x + this.bar.barSize.w &&
                e.CDPos.x + e.CDSize.w > this.bar.barPos.x &&
                e.CDPos.y < this.bar.barPos.y + this.bar.barSize.h &&
                e.CDSize.h + e.CDPos.y > this.bar.barPos.y)
            {
            this.changeCommands()
            this.changeDir = this.changeDir.filter(e => e.CDPos.y >= this.bar.barPos.y)
            }
        })
    },

    changeCommands() {
        document.getElementById('CDColisionSound').play()
        this.keys.left = 'ArrowRight'
        this.keys.right = 'ArrowLeft'
        setTimeout(() => {
            this.keys.left = 'ArrowLeft'
            this.keys.right = 'ArrowRight'
        }, 5000)
    },

    //BOW Power Up

    createShotBow() { 
        if (this.frames % 1500 === 0) { 
          let Sy = 0
          let SminGap = 0
          let SmaxGap = this.canvasSize.w - 30
          let SGap = Math.floor(Math.random() * (SmaxGap - SminGap + 1) + SminGap)
          this.shotBow.push(new Shot (this.ctx, SGap, Sy, 70, 10, '../images/bow.png'))
        }
    },

    moveShotBow() {
        this.shotBow.forEach(e => {
            e.ShotPos.y += 4
        })
    },
    
    shotBowColision() {
        this.shotBow.forEach(e => {
            if (e.ShotPos.x < this.bar.barPos.x + this.bar.barSize.w &&
                e.ShotPos.x + e.ShotSize.w > this.bar.barPos.x &&
                e.ShotPos.y < this.bar.barPos.y + this.bar.barSize.h &&
                e.ShotSize.h + e.ShotPos.y > this.bar.barPos.y)
            {
            document.getElementById('bowColisionSound').play()
            this.createArrow()
            this.shotBow = this.shotBow.filter(e => e.ShotPos.y >= this.bar.barPos.y)
            }
        })
    },

    //PROYECTILES  
    
    createArrow() {
        this.keys.space = ' '
        document.getElementById('arrowSound').play()
        this.arrow.push(new Arrow(this.ctx, this.bar.barPos.x + this.bar.barSize.w / 2, this.canvasSize.h - 60, 8, 65, this.arrowStatus, '../images/arrow.png'))
        setTimeout(() => {
            this.keys.space = undefined
        }, 5000)
    },

    moveArrow() {
         this.arrow.forEach(e => {
            e.arrowPos.y -= 4
        })
    },

    arrowColision() {
        this.arrow.forEach(eachArrow => {
            this.bricks.forEach(eachBrick => { 
                if (eachArrow.arrowPos.x < eachBrick.brickPos.brickx + eachBrick.brickSize.brickW &&
                    eachArrow.arrowPos.x + 8 > eachBrick.brickPos.brickx &&
                    eachArrow.arrowPos.y < eachBrick.brickPos.bricky + eachBrick.brickSize.brickH &&
                    65 + eachArrow.arrowPos.y > eachBrick.brickPos.bricky)
                {
                    document.getElementById('brickColisionSound').play()
                    this.score += 100
                    this.points()
                    eachBrick.brickStatus = 0
                    eachArrow.arrowStatus = 0
                    this.bricks = this.bricks.filter(eachBrick => eachBrick.brickStatus !== 0)
                    this.arrow = this.arrow.filter (eachArrow => eachArrow.arrowStatus !== 0)
                }
            })
        })  
    },


    //KEYBOARD COMMANDS

    setEventListeners() {
        document.onkeyup = e => {
            e.key === this.keys.space ? this.createArrow() : null
        }
        document.onkeydown = e => {
            e.key === this.keys.left ? this.bar.move('left') : null
            e.key === this.keys.right ? this.bar.move('right') : null
        }
    },
    
    //SCORE

    points() {
        this.pointsInGame = document.querySelector('.totalScore')
        this.pointsInGame.innerHTML = this.score

        this.pointsGameOver = document.querySelector('.totalScoreGO')
        this.pointsGameOver.innerHTML = this.score

        this.pointsWin = document.querySelector('.totalScoreW')
        this.pointsWin.innerHTML = this.score
    },

    //Clear SCREEN and ARRAYS

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
    },

    clearOutOfScreen() {
        this.doubleSize = this.doubleSize.filter(e => e.DSPos.y <= this.canvasSize.h)
        this.sliceSize = this.sliceSize.filter(e => e.SSPos.y <= this.canvasSize.h)
        this.changeDir = this.changeDir.filter(e => e.CDPos.y <= this.canvasSize.h)
        this.extraBalls = this.extraBalls.filter(e => e.EBPos.y <= this.canvasSize.h)
        this.balls = this.balls.filter(e => e.ballPos.bally <= this.canvasSize.h)
        this.shotBow = this.shotBow.filter(e => e.ShotPos.y <= this.canvasSize.h)
        this.arrow = this.arrow.filter(e => e.arrowPos.y > 0) 
    },

    //GAME END

    youWin() {
        document.getElementById('backgroundSound').pause()
        document.getElementById('winSound').play()
        clearInterval(this.interval)
        const YWdivDisplay = document.querySelector('#windiv') 
        YWdivDisplay.style.display = 'block'
    },

    gameOver() {
        document.getElementById('backgroundSound').pause()
        document.getElementById('gameoverSound').play()
        clearInterval(this.interval)
        const GOdisplay = document.querySelector('#GOdiv')
        GOdisplay.style.display = 'block'
    }
}
