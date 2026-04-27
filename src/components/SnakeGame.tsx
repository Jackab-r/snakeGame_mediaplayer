import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }
      
      if (e.key === ' ') {
        setIsPaused(p => !p);
        e.preventDefault();
        return;
      }

      if (isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      setDirection(directionRef.current);
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, score, onScoreChange, generateFood, isPaused]);

  // Handle touch controls for mobile
  const handleTouchControl = (dx: number, dy: number) => {
    if (gameOver || isPaused) return;
    const currentDir = directionRef.current;
    if (dx !== 0 && currentDir.x === 0) {
      directionRef.current = { x: dx, y: 0 };
    } else if (dy !== 0 && currentDir.y === 0) {
      directionRef.current = { x: 0, y: dy };
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center relative">
      <div className="w-full max-w-[600px] aspect-square bg-black border border-[#00f3ff]/40 shadow-[0_0_30px_rgba(0,243,255,0.1)] rounded-sm relative overflow-hidden flex items-center justify-center">
        {/* Game Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {gameOver ? (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-6 text-center backdrop-blur-sm">
            <h2 className="text-3xl font-black text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff] mb-4 uppercase tracking-tighter">System Failure</h2>
            <p className="text-xl mb-6 text-white font-mono">Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 border-2 border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff]/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all font-bold uppercase tracking-wider font-mono text-sm"
            >
              Reboot Sequence
            </button>
          </div>
        ) : isPaused ? (
           <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/50 backdrop-blur-sm">
             <div className="text-2xl font-black text-[#00f3ff] drop-shadow-[0_0_10px_#00f3ff] tracking-widest uppercase">Simulation Paused</div>
           </div>
        ) : null}

        <div className="absolute top-4 left-4 font-mono text-[10px] text-[#00f3ff] uppercase tracking-tighter z-10 opacity-70">
          Coord_X: {(snake[0]?.x * 10).toFixed(2)} // Coord_Y: {(snake[0]?.y * 10).toFixed(2)}
        </div>

        <div 
          className="grid w-full h-full p-2 relative z-10"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((segment, sIdx) => sIdx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div key={idx} className="w-full h-full flex items-center justify-center p-[1px]">
                {isHead || isBody || isFood ? (
                  <div 
                    className={`w-full h-full ${
                      isHead ? 'bg-[#39ff14] shadow-[0_0_10px_#39ff14] border-2 border-white z-10' : 
                      isBody ? 'bg-[#39ff14] shadow-[0_0_10px_#39ff14] opacity-80' : 
                      isFood ? 'bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] animate-pulse rounded-full z-10' : 
                      ''
                    }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-6 lg:hidden w-48 mx-auto relative z-10">
        <div />
        <button 
          onClick={() => handleTouchControl(0, -1)}
          className="w-12 h-12 bg-white/5 border border-white/20 text-[#00f3ff] rounded flex items-center justify-center hover:bg-white/10 active:border-[#00f3ff] mx-auto transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative bottom-[1px]"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <div />
        <button 
          onClick={() => handleTouchControl(-1, 0)}
          className="w-12 h-12 bg-white/5 border border-white/20 text-[#00f3ff] rounded flex items-center justify-center hover:bg-white/10 active:border-[#00f3ff] ml-auto transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative right-[1px]"><path d="m15 18-6-6 6-6"/></svg>
        </button>
         <button 
          onClick={() => {
            if (gameOver) resetGame();
            else setIsPaused(!isPaused);
          }}
          className="w-12 h-12 bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff] rounded flex items-center justify-center hover:bg-[#ff00ff]/20 active:border-[#ff00ff] mx-auto transition-colors"
        >
          <div className="text-[10px] font-bold font-mono text-center leading-none">{gameOver ? 'RST' : isPaused ? 'PLAY' : 'PAUS'}</div>
        </button>
        <button 
          onClick={() => handleTouchControl(1, 0)}
          className="w-12 h-12 bg-white/5 border border-white/20 text-[#00f3ff] rounded flex items-center justify-center hover:bg-white/10 active:border-[#00f3ff] mr-auto transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative left-[1px]"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div />
        <button 
          onClick={() => handleTouchControl(0, 1)}
          className="w-12 h-12 bg-white/5 border border-white/20 text-[#00f3ff] rounded flex items-center justify-center hover:bg-white/10 active:border-[#00f3ff] mx-auto transition-colors"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative top-[1px]"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div />
      </div>

      <div className="mt-4 text-white/40 text-[10px] hidden lg:block text-center font-mono uppercase tracking-widest max-w-[400px]">
        USE ARROW KEYS OR WASD TO NAVIGATE THE NEURAL GRID. DON'T HIT THE BARRIERS. SPACE TO PAUSE.
      </div>
    </div>
  );
}
