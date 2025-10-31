"use client";
import React, { useState, useEffect } from 'react';
import { Battery, Sun, Zap, Cloud, CloudRain } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Custom Hook to detect screen size (simulating media queries)
const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (to handle SSR in Next.js)
    if (typeof window === 'undefined') return;

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkScreenSize();

    // Set up event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup function
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export default function EnergyDashboard() {
  const isMobile = useIsMobile(768); // Mobile/Tablet breakpoint at 768px
  const isTablet = useIsMobile(1280); // Adjusting layout for large tablets/small desktops

  const [solarPower, setSolarPower] = useState(4.8);
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [panelTemp, setPanelTemp] = useState(42);
  const [efficiency, setEfficiency] = useState(94.3);
  
  const [historicalData, setHistoricalData] = useState([
    { time: '06:00', power: 1.2, efficiency: 78 },
    { time: '08:00', power: 2.8, efficiency: 85 },
    { time: '10:00', power: 4.2, efficiency: 92 },
    { time: '12:00', power: 5.8, efficiency: 96 },
    { time: '14:00', power: 5.4, efficiency: 95 },
    { time: '16:00', power: 4.1, efficiency: 91 },
    { time: '18:00', power: 2.3, efficiency: 82 },
    { time: '20:00', power: 0.5, efficiency: 65 },
  ]);

  const monthlyData = [
    { month: 'Jan', energy: 320 },
    { month: 'Feb', energy: 380 },
    { month: 'Mar', energy: 450 },
    { month: 'Apr', energy: 520 },
    { month: 'May', energy: 580 },
    { month: 'Jun', energy: 620 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSolarPower(prev => Math.max(0, Math.min(6, prev + (Math.random() - 0.5) * 0.3)));
      setBatteryLevel(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 1.5)));
      setPanelTemp(prev => Math.max(25, Math.min(55, prev + (Math.random() - 0.5) * 2)));
      setEfficiency(prev => Math.max(85, Math.min(98, prev + (Math.random() - 0.5) * 0.5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const weatherCondition = solarPower > 4.5 ? 'sunny' : solarPower > 2.5 ? 'partly-cloudy' : 'cloudy';

  // --- Style Helpers for Responsiveness ---
  const headerFontSize = isMobile ? '24px' : isTablet ? '32px' : '36px';
  const gridColumns = isMobile ? 'repeat(1, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(12, 1fr)';
  const mainGridGap = isMobile ? '12px' : '16px';

  // Determine column spans based on screen size
  const getColSpan = (desktopSpan) => isMobile ? 'span 1' : isTablet ? 'span 1' : `span ${desktopSpan}`;
  
  // Set the height of chart containers (important for non-fixed height in mobile stacking)
  const chartHeight = isMobile ? '300px' : isTablet ? '40vh' : 'auto'; 
  const batteryHeight = isMobile ? '160px' : '208px';

  // Base card style
  const cardStyle = {
    backgroundColor: 'rgba(0, 11, 60, 0.5)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: isMobile ? '16px' : '20px',
    border: '1px solid #1523DB',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    minHeight: isMobile ? 'auto' : '100%',
  };


  return (
    <div style={{ 
      minHeight: '100vh', // Use minHeight to allow content overflow
      background: 'linear-gradient(to bottom right, #000B3C, rgba(21, 35, 219, 0.2), #000B3C)',
      padding: isMobile ? '12px' : '24px', // Reduced mobile padding
      overflowX: 'hidden', // Prevent horizontal scroll
    }}>
      <div style={{ maxWidth: '1536px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '12px' : '0' }}>
          <div>
            <h1 style={{ 
              fontSize: headerFontSize, 
              fontWeight: 'bold', 
              background: 'linear-gradient(to right, #F8D200, #3C9AE9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              UmemeSense Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#8ACE47', 
                borderRadius: '50%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span style={{ color: '#8ACE47', fontSize: isMobile ? '12px' : '14px', fontWeight: '600' }}>System Online - Generating Power</span>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            backgroundColor: 'rgba(0, 11, 60, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: isMobile ? '6px 10px' : '8px 16px',
            border: '1px solid #1523DB'
          }}>
            {weatherCondition === 'sunny' && <Sun style={{ color: '#F8D200' }} size={isMobile ? 24 : 32} />}
            {weatherCondition === 'partly-cloudy' && <Cloud style={{ color: '#3C9AE9' }} size={isMobile ? 24 : 32} />}
            {weatherCondition === 'cloudy' && <CloudRain style={{ color: '#3C9AE9' }} size={isMobile ? 24 : 32} />}
            <div>
              <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#9ca3af' }}>Weather</p>
              <p style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize', fontSize: isMobile ? '14px' : 'inherit' }}>
                {weatherCondition.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: gridColumns, 
          gap: mainGridGap,
        }}>
          
          {/* Left Column - Key Metrics (Span 3 on desktop, full width on mobile) */}
          <div style={{ 
            gridColumn: getColSpan(3), 
            display: 'flex', 
            flexDirection: 'column', 
            gap: mainGridGap,
            // On tablet, display key metrics side-by-side in a sub-grid
            ...(isTablet && !isMobile && { gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid' })
          }}>
            
            {/* Current Power Generation */}
            <div style={{ 
              ...cardStyle, 
              background: 'linear-gradient(to bottom right, rgba(248, 210, 0, 0.2), rgba(60, 154, 233, 0.2))',
              border: '1px solid rgba(248, 210, 0, 0.3)',
              boxShadow: '0 20px 25px -5px rgba(248, 210, 0, 0.2)',
              ...(isTablet && !isMobile && { gridColumn: 'span 3' }) // Take full width of tablet subgrid
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Zap style={{ color: '#F8D200' }} size={24} />
                <p style={{ color: '#d1d5db', fontSize: isMobile ? '12px' : '14px' }}>Current Output</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: 'bold', color: 'white' }}>{solarPower.toFixed(1)}</span>
                <span style={{ fontSize: isMobile ? '18px' : '24px', color: '#d1d5db' }}>MW</span>
              </div>
              <p style={{ color: '#8ACE47', fontSize: isMobile ? '12px' : '14px', marginTop: '8px' }}>↑ Peak performance</p>
            </div>

            {/* Panel Temperature */}
            <div style={{ 
              ...cardStyle, 
              // On tablet, these two will be side-by-side
              ...(isTablet && !isMobile && { gridColumn: 'span 1' }) 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px' }}>Panel Temp</p>
                  <p style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 'bold', color: 'white' }}>{panelTemp.toFixed(0)}°C</p>
                </div>
                <div style={{ 
                  width: isMobile ? '48px' : '64px', 
                  height: isMobile ? '48px' : '64px', 
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #F8D200, #3C9AE9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🌡️</span>
                </div>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%',
                  background: 'linear-gradient(to right, #F8D200, #3C9AE9)',
                  width: `${(panelTemp / 55) * 100}%`,
                  transition: 'width 1s'
                }}></div>
              </div>
              <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#9ca3af', marginTop: '8px' }}>Optimal: 25-45°C</p>
            </div>

            {/* System Efficiency */}
            <div style={{ 
              ...cardStyle, 
              // On tablet, these two will be side-by-side
              ...(isTablet && !isMobile && { gridColumn: 'span 1' }) 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px' }}>Efficiency</p>
                  <p style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 'bold', color: 'white' }}>{efficiency.toFixed(1)}%</p>
                </div>
                <div style={{ 
                  width: isMobile ? '48px' : '64px', 
                  height: isMobile ? '48px' : '64px', 
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #8ACE47, #3C9AE9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px' }}>⚡</span>
                </div>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%',
                  background: 'linear-gradient(to right, #8ACE47, #3C9AE9)',
                  width: `${efficiency}%`,
                  transition: 'width 1s'
                }}></div>
              </div>
              <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#9ca3af', marginTop: '8px' }}>Industry avg: 85%</p>
            </div>
            
            {/* Solar Panels Info - Full width on tablet subgrid */}
            <div style={{ 
              ...cardStyle,
              flex: 1, 
              ...(isTablet && !isMobile && { gridColumn: 'span 1' }) // On tablet, place it next to efficiency/temp
            }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>Panel Array</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Total Panels</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>2,840</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Active Panels</span>
                  <span style={{ color: '#8ACE47', fontWeight: '600' }}>2,835</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Capacity</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>6.0 MW</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Array Size</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>3.2 hectares</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Charts (Span 6 on desktop, full width on mobile/tablet) */}
          <div style={{ 
            gridColumn: getColSpan(6), 
            display: 'flex', 
            flexDirection: 'column', 
            gap: mainGridGap 
          }}>
            {/* Power Generation Over Time */}
            <div style={{ 
              ...cardStyle, 
              flex: 1,
              height: chartHeight // Set fixed height on mobile/tablet for consistency
            }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>Today's Power Generation</h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={historicalData} margin={{ top: 10, right: isMobile ? 5 : 20, left: isMobile ? -20 : 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3C9AE9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1523DB" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1523DB" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={isMobile ? 10 : 12} />
                  <YAxis stroke="#9ca3af" fontSize={isMobile ? 10 : 12} 
                    label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: isMobile ? 10 : 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000B3C', border: '1px solid #1523DB', borderRadius: '8px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="power" stroke="#3C9AE9" strokeWidth={isMobile ? 2 : 3} fillOpacity={1} fill="url(#colorPower)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Energy Production */}
            <div style={{ 
              ...cardStyle, 
              flex: 1,
              height: chartHeight // Set fixed height on mobile/tablet for consistency
            }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>Monthly Energy Production (MWh)</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={monthlyData} margin={{ top: 10, right: isMobile ? 5 : 20, left: isMobile ? -20 : 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1523DB" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={isMobile ? 10 : 12} />
                  <YAxis stroke="#9ca3af" fontSize={isMobile ? 10 : 12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000B3C', border: '1px solid #1523DB', borderRadius: '8px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Bar dataKey="energy" fill="#3C9AE9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column - Battery & Stats (Span 3 on desktop, full width on mobile) */}
          <div style={{ 
            gridColumn: getColSpan(3), 
            display: 'flex', 
            flexDirection: 'column', 
            gap: mainGridGap 
          }}>
            {/* Battery Status */}
            <div style={{ 
              ...cardStyle,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: 'white' }}>Battery Storage</h3>
                <Battery style={{ color: '#8ACE47' }} size={24} />
              </div>
              <div style={{ 
                position: 'relative',
                height: batteryHeight, // Responsive height
                backgroundColor: 'rgba(21, 35, 219, 0.3)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #1523DB',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, #8ACE47, #3C9AE9, #3D56FF)',
                  height: `${batteryLevel}%`,
                  transition: 'height 1s'
                }}>
                  <div style={{ 
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                </div>
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ 
                    fontSize: isMobile ? '30px' : '36px', // Responsive font size
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
                  }}>
                    {batteryLevel.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Capacity</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>50 MWh</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '14px' }}>
                  <span style={{ color: '#9ca3af' }}>Stored</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>{(50 * batteryLevel / 100).toFixed(1)} MWh</span>
                </div>
              </div>
            </div>

            {/* Today's Impact */}
            <div style={{ 
              ...cardStyle,
              flex: 1,
            }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>Today's Impact</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)', gap: '8px' }}>
                
                {/* Energy Generated */}
                <div style={{ padding: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '12px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px' }}>Energy Generated</p>
                  <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: 'white' }}>87.4 MWh</p>
                </div>

                {/* Renewable Energy Credits Earned */}
                <div style={{ padding: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '12px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px' }}>RECs Earned</p>
                  <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: 'white' }}>34.4 RECs</p>
                </div>

                {/* CO₂ Avoided */}
                <div style={{ padding: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '12px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px' }}>CO₂ Avoided</p>
                  <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: 'white' }}>54.6 tons</p>
                </div>

                {/* Homes Powered */}
                <div style={{ padding: '8px', backgroundColor: 'rgba(21, 35, 219, 0.3)', borderRadius: '12px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px' }}>Homes Powered</p>
                  <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: 'white' }}>14,568</p>
                </div>

                {/* Cost Savings */}
                <div style={{ 
                    padding: '8px', 
                    backgroundColor: 'rgba(21, 35, 219, 0.3)', 
                    borderRadius: '12px',
                    gridColumn: isMobile ? 'span 2' : 'span 1' // Full width on mobile subgrid
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px' }}>Cost Savings</p>
                  <p style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: 'white' }}>$8,740</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}