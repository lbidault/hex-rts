export class GameLoop {
  private lastTime = 0;
  private isRunning = false;

  constructor(
    private tick: (deltaTime: number) => void,
    private render: () => void
  ) {}

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(time: number) {
    if (!this.isRunning) return;
    
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;
    
    this.tick(deltaTime);
    this.render();
    
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }
}