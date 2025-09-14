import React from 'react';

const SolarPanel3D: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative w-64 h-64">
        {/* Sun */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-2 bg-yellow-300 rounded-full">
            <div className="absolute inset-2 bg-yellow-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Solar Panel Container */}
        <div className="solar-panel-container">
          <div className="solar-panel">
            {/* Panel Base */}
            <div className="panel-face panel-front">
              <div className="grid grid-cols-3 gap-1 p-2 h-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-blue-800 rounded border border-blue-900 solar-cell">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Panel Sides for 3D effect */}
            <div className="panel-face panel-top"></div>
            <div className="panel-face panel-right"></div>
          </div>
        </div>

        {/* Energy rays animation */}
        <div className="absolute top-8 right-8 w-8 h-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-yellow-300 energy-ray"
              style={{
                height: '20px',
                transform: `rotate(${i * 60}deg)`,
                transformOrigin: '50% 100%',
                animation: 'energyPulse 2s infinite',
                animationDelay: `${i * 0.3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .solar-panel-container {
          perspective: 1000px;
          transform-style: preserve-3d;
          animation: tiltToSun 6s infinite ease-in-out;
        }

        .solar-panel {
          position: relative;
          width: 120px;
          height: 80px;
          transform-style: preserve-3d;
          margin: 50px auto;
        }

        .panel-face {
          position: absolute;
          width: 120px;
          height: 80px;
        }

        .panel-front {
          background: linear-gradient(145deg, #1e3a8a, #1e40af);
          border: 2px solid #1e40af;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .panel-top {
          background: linear-gradient(90deg, #1e40af, #3b82f6);
          transform: rotateX(90deg) translateZ(40px);
          height: 10px;
          border-radius: 8px 8px 0 0;
        }

        .panel-right {
          background: linear-gradient(180deg, #1e40af, #1e3a8a);
          width: 10px;
          transform: rotateY(90deg) translateZ(110px);
          border-radius: 0 8px 8px 0;
        }

        .solar-cell {
          transition: all 0.3s ease;
        }

        .solar-cell:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        @keyframes tiltToSun {
          0%, 100% { 
            transform: rotateX(-10deg) rotateY(-5deg); 
          }
          50% { 
            transform: rotateX(-5deg) rotateY(5deg); 
          }
        }

        @keyframes energyPulse {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }

        .energy-ray {
          border-radius: 2px;
          box-shadow: 0 0 4px rgba(251, 191, 36, 0.8);
        }
      `}</style>
    </div>
  );
};

export default SolarPanel3D;