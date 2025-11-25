import React from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  color: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, color }) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex items-end justify-center gap-1 h-12 w-full max-w-[200px]">
      {bars.map((i) => (
        <div
          key={i}
          className={`visualizer-bar w-1.5 rounded-t-sm ${isPlaying ? '' : 'opacity-20 !animation-none'}`}
          style={{
            backgroundColor: color,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            animationPlayState: isPlaying ? 'running' : 'paused',
            height: isPlaying ? '100%' : '10%'
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;