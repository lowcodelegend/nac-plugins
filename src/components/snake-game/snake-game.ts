import { type PluginContract } from '@nintex/form-plugin-contract'
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { config } from './snake-game.config';

interface SnakeCell {
    x: number;
    y: number;
}

export type EventData<T> = {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail?: T;
}

export const defaultEventArgs = <T>(args: T): EventData<T> => ({
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: args
})

@customElement('plugin-elementname')
export class PageHighlight extends LitElement {
    static getMetaConfig = (): Promise<PluginContract> | PluginContract => config;

    @property({ type: Number }) grid = 16;
    @property({ type: Object }) snake = {
        x: 160,
        y: 160,
        dx: this.grid,
        dy: 0,
        cells: [] as SnakeCell[],
        maxCells: 4
    };
    @property({ type: Object }) apple = { x: 320, y: 320 };
    @property({ type: Number }) count = 0;
    @property({ type: Object }) canvas?: HTMLCanvasElement;
    @property({ type: Object }) context?: CanvasRenderingContext2D | null;
    @property({ type: Number }) score = 0;
    @property({ type: Number }) lives = 3;
    @property({ type: Number }) bestScore = 0;
    @property({type: Boolean}) gameOver = false;

    static override get styles() {
        return css`
            :host {
                display: block;
            }
            canvas {
                border: 1px solid black;
                left: 50%
            }
        `;
    }

    override firstUpdated() {
        this.startGame();
    }

    startGame() {
        this.canvas = this.shadowRoot?.getElementById('game') as HTMLCanvasElement;
        if (this.canvas) {
            const scaleFactor = window.devicePixelRatio || 1;
            this.canvas.width = this.canvas.offsetWidth * scaleFactor;
            this.canvas.height = this.canvas.offsetHeight * scaleFactor;
            
            this.context = this.canvas.getContext('2d');
            this.canvas.getContext('2d')?.scale(scaleFactor, scaleFactor);
            if (this.context) {             
                window.requestAnimationFrame(() => this.gameLoop());
            }
        }
    }
    
    gameLoop() {

        if(this.gameOver){
            return;
        }

        if (++this.count < 4) {
            window.requestAnimationFrame(() => this.gameLoop());
            return;
        }
        this.count = 0;
    
        if (this.context && this.canvas) {
            // Clear the canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.font = '20px Arial';
            this.context.fillStyle = 'black';
            this.context.fillText(`Score: ${this.score}`, this.canvas.width - 125, 30);
            this.context.fillText(`Best: ${this.bestScore}`, this.canvas.width - 125, 60);
            this.context.fillText(`Lives: ${this.lives}`, this.canvas.width - 125, 90);
            // Move the snake
            this.snake.x += this.snake.dx;
            this.snake.y += this.snake.dy;
            
            // Wrap snake position horizontally on edge of screen
            if (this.snake.x < 0) {
                this.snake.x = this.canvas.width - this.grid;
            } else if (this.snake.x >= this.canvas.width) {
                this.snake.x = 0;
            }
    
            // Wrap snake position vertically on edge of screen
            if (this.snake.y < 0) {
                this.snake.y = this.canvas.height - this.grid;
            } else if (this.snake.y >= this.canvas.height) {
                this.snake.y = 0;
            }
    
            // Keep track of where snake has been
            this.snake.cells.unshift({x: this.snake.x, y: this.snake.y});
    
            // Remove cells as we move away from them
            if (this.snake.cells.length > this.snake.maxCells) {
                this.snake.cells.pop();
            }
    
            // Draw apple
            this.context.fillStyle = 'red';
            this.context.fillRect(this.apple.x, this.apple.y, this.grid - 1, this.grid - 1);
    
            // Draw snake
            this.context.fillStyle = 'green';
            this.snake.cells.forEach((cell, index) => {
            this.context?.fillRect(cell.x, cell.y, this.grid - 1, this.grid - 1);
    
            // Snake ate apple
            if (cell.x === this.apple.x && cell.y === this.apple.y) {
                this.score++;
                this.bestScore = Math.max(this.bestScore, this.score);
                this.snake.maxCells++;
                this.apple.x = this.getRandomInt(0, 25) * this.grid;
                this.apple.y = this.getRandomInt(0, 25) * this.grid;
                const event = new CustomEvent('ntx-value-change', defaultEventArgs(this.bestScore));
                this.canvas?.dispatchEvent(event);
                console.log("Event raised for score: " + this.bestScore);
            }

            // Wall collision logic
            if(this.canvas){
                if (this.snake.x < 0 || this.snake.x >= this.canvas.width || this.snake.y < 0 || this.snake.y >= this.canvas.height) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver = true; // Set the game over state to true
                        // Optionally, you can call a function to handle game over logic
                        this.handleGameOver();
                    } else {
                        this.resetSnake(); // Reset snake position but not the game
                    }
                }
            }

            // Check collision with all cells after this one (modified for TypeScript)
            for (let i = index + 1; i < this.snake.cells.length; i++) {
                if (cell.x === this.snake.cells[i].x && cell.y === this.snake.cells[i].y) {
                    this.lives--;
                    this.score = 0;
                    if (this.lives === 0) {
                        // Game Over Logic
                        //alert(`Game Over! Best Score: ${this.bestScore}`);
                        const event = new CustomEvent('ntx-value-change', defaultEventArgs(this.bestScore));
                        document.body.dispatchEvent(event);
                        this.gameOver = true;
                        this.handleGameOver();
                    } else {
                        this.resetSnake();
                    }
                }
            }
        });
    
            // Next frame
            window.requestAnimationFrame(() => this.gameLoop());
        }
    }

    handleGameOver() {
        // Disable the canvas drawing
        if (this.canvas && this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.font = '20px Arial';
            this.context.fillStyle = 'black';
            this.context.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
            this.canvas.style.opacity = '0.5'; // Fade the canvas to show it's disabled
            this.canvas.style.pointerEvents = 'none'; // Prevent further interaction
        }
    }
    
    resetGame() {
        // Reset score and lives along with the game
        this.score = 0;
        this.lives = 3;
        this.resetSnake();
    }

    resetSnake() {
        // Reset only the snake, not the score or lives
        this.snake.x = 160;
        this.snake.y = 160;
        this.snake.cells = [];
        this.snake.maxCells = 4;
        this.snake.dx = this.grid;
        this.snake.dy = 0;
        this.apple.x = this.getRandomInt(0, 25) * this.grid;
        this.apple.y = this.getRandomInt(0, 25) * this.grid;
    }
    

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    handleKeyDown(e: any) {
        // ... handle keyboard input here ...
        if (e.which === 37 && this.snake.dx === 0) {
            this.snake.dx = -this.grid;
            this.snake.dy = 0;
          }
          else if (e.which === 38 && this.snake.dy === 0) {
            this.snake.dy = -this.grid;
            this.snake.dx = 0;
          }
          else if (e.which === 39 && this.snake.dx === 0) {
            this.snake.dx = this.grid;
            this.snake.dy = 0;
          }
          else if (e.which === 40 && this.snake.dy === 0) {
            this.snake.dy = this.grid;
            this.snake.dx = 0;
          }
    }

    override connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    override render() {
        return html`
            <canvas id="game" width="500px" height="500px"></canvas>
        `;
    }
}