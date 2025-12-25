import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Position,
  BaseEdge,
  getBezierPath,
  getStraightPath,
  EdgeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Database, 
  Server, 
  Smartphone, 
  Activity, 
  Moon, 
  Sun,
  Play,
  Pause,
  Users,
  ArrowRight,
  PanelRight
} from 'lucide-react';

// --- Color Styles Mapping (for Tailwind JIT) ---
const colorStyles: Record<string, any> = {
  blue: {
    border: 'border-blue-500',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    ring: 'ring-blue-500/20',
    bgIcon: 'bg-blue-100 dark:bg-blue-900/50',
    textIcon: 'text-blue-600',
    packetBg: 'bg-blue-500',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-600',
    bgNode: 'bg-blue-100 dark:bg-blue-900/50',
    textNode: 'text-blue-600 dark:text-blue-400',
    pulse: 'bg-blue-400',
    textStats: 'text-blue-600 dark:text-blue-400'
  },
  amber: {
    border: 'border-amber-500',
    shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
    ring: 'ring-amber-500/20',
    bgIcon: 'bg-amber-100 dark:bg-amber-900/50',
    textIcon: 'text-amber-600',
    packetBg: 'bg-amber-500',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-amber-600',
    bgNode: 'bg-amber-100 dark:bg-amber-900/50',
    textNode: 'text-amber-600 dark:text-amber-400',
    pulse: 'bg-amber-400',
    textStats: 'text-amber-600 dark:text-amber-400'
  },
  purple: {
    border: 'border-purple-500',
    shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    ring: 'ring-purple-500/20',
    bgIcon: 'bg-purple-100 dark:bg-purple-900/50',
    textIcon: 'text-purple-600',
    packetBg: 'bg-purple-500',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-purple-600',
    bgNode: 'bg-purple-100 dark:bg-purple-900/50',
    textNode: 'text-purple-600 dark:text-purple-400',
    pulse: 'bg-purple-400',
    textStats: 'text-purple-600 dark:text-purple-400'
  },
  green: {
    border: 'border-green-500',
    shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]',
    ring: 'ring-green-500/20',
    bgIcon: 'bg-green-100 dark:bg-green-900/50',
    textIcon: 'text-green-600',
    packetBg: 'bg-green-500',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-green-600',
    bgNode: 'bg-green-100 dark:bg-green-900/50',
    textNode: 'text-green-600 dark:text-green-400',
    pulse: 'bg-green-400',
    textStats: 'text-green-600 dark:text-green-400'
  },
  indigo: {
    border: 'border-indigo-500',
    shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.4)]',
    ring: 'ring-indigo-500/20',
    bgIcon: 'bg-indigo-100 dark:bg-indigo-900/50',
    textIcon: 'text-indigo-600',
    packetBg: 'bg-indigo-500',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-indigo-600',
    bgNode: 'bg-indigo-100 dark:bg-indigo-900/50',
    textNode: 'text-indigo-600 dark:text-indigo-400',
    pulse: 'bg-indigo-400',
    textStats: 'text-indigo-600 dark:text-indigo-400'
  },
  cyan: {
    border: 'border-cyan-500',
    shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    ring: 'ring-cyan-500/20',
    bgIcon: 'bg-cyan-100 dark:bg-cyan-900/50',
    textIcon: 'text-cyan-600',
    packetBg: 'bg-cyan-500',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-cyan-600',
    bgNode: 'bg-cyan-100 dark:bg-cyan-900/50',
    textNode: 'text-cyan-600 dark:text-cyan-400',
    pulse: 'bg-cyan-400',
    textStats: 'text-cyan-600 dark:text-cyan-400'
  }
};

// --- Custom Edge Component (Animated Stream Flow) ---
// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd,
// }: EdgeProps) => {
//   const [edgePath] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   return (
//     <>
//       {/* Base Path (The "Pipe") */}
//       <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeWidth: 4, stroke: '#cbd5e1' }} />
      
//       {/* Animated Particles (The "Data") */}
//       <circle r="6" fill="#3b82f6" filter="url(#glow)">
//         <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
//       </circle>
//       <circle r="6" fill="#3b82f6" filter="url(#glow)">
//         <animateMotion dur="1.5s" begin="0.75s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
//       </circle>
      
//       {/* SVG Filter for Glow Effect */}
//       <defs>
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//           <feMerge>
//             <feMergeNode in="coloredBlur"/>
//             <feMergeNode in="SourceGraphic"/>
//           </feMerge>
//         </filter>
//       </defs>
//     </>
//   );
// };


// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd,
// }: EdgeProps) => {
//   const [edgePath] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   return (
//     <g>
//       {/* SVG Filter for Glow Effect */}
//       <defs>
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//           <feMerge>
//             <feMergeNode in="coloredBlur"/>
//             <feMergeNode in="SourceGraphic"/>
//           </feMerge>
//         </filter>
//         <marker
//           id={`arrow-${id}`}
//           markerWidth="12"
//           markerHeight="12"
//           refX="10"
//           refY="6"
//           orient="auto"
//           markerUnits="strokeWidth"
//         >
//           <path d="M0,0 L0,12 L9,6 z" fill="#94a3b8" />
//         </marker>
//       </defs>

//       {/* Base Path (The "Pipe") */}
//       <path
//         d={edgePath}
//         strokeWidth={4}
//         stroke="#cbd5e1"
//         fill="none"
//         markerEnd={`url(#arrow-${id})`}
//       />
      
//       {/* Animated Particles (The "Data") */}
//       <circle r="6" fill="#3b82f6" filter="url(#glow)">
//         <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#10b981" filter="url(#glow)">
//         <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#f59e0b" filter="url(#glow)">
//         <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#8b5cf6" filter="url(#glow)">
//         <animateMotion dur="2s" begin="1.5s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//     </g>
//   );
// };


// --- Custom Edge Component (Animated Stream Flow) ---
// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd,
// }: EdgeProps) => {
//   const [edgePath] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   return (
//     <g>
//       {/* SVG Filter for Glow Effect */}
//       <defs>
//         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
//           <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
//           <feMerge>
//             <feMergeNode in="coloredBlur"/>
//             <feMergeNode in="SourceGraphic"/>
//           </feMerge>
//         </filter>
//         <marker
//           id={`arrow-${id}`}
//           markerWidth="12"
//           markerHeight="12"
//           refX="10"
//           refY="6"
//           orient="auto"
//           markerUnits="strokeWidth"
//         >
//           <path d="M0,0 L0,12 L9,6 z" fill="#94a3b8" />
//         </marker>
//       </defs>

//       {/* Base Path (The "Pipe") */}
//       <path
//         d={edgePath}
//         strokeWidth={4}
//         stroke="#cbd5e1"
//         fill="none"
//         markerEnd={`url(#arrow-${id})`}
//       />
      
//       {/* Animated Particles (The "Data") */}
//       <circle r="6" fill="#3b82f6" filter="url(#glow)">
//         <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#10b981" filter="url(#glow)">
//         <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#f59e0b" filter="url(#glow)">
//         <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//       <circle r="6" fill="#8b5cf6" filter="url(#glow)">
//         <animateMotion dur="2s" begin="1.5s" repeatCount="indefinite" path={edgePath} />
//       </circle>
//     </g>
//   );
// };


// --- Custom Edge Component (Animated Stream Flow) ---
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  // Use getStraightPath as requested
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Unique ID for the filter to avoid conflicts
  const filterId = `glow-${id}`;

  return (
    <>
      {/* 1. Define the Glow Filter (Reused for particles) */}
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 2. THE FIX: Use BaseEdge for the "Pipe" */}
      <BaseEdge 
        id={id}
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          strokeWidth: 3, 
          stroke: '#94a3b8', // Explicit color (slate-400) for visibility
          ...style 
        }} 
      />
      
      {/* 3. Animated Particles (The "Data") */}
      <circle r="5" fill="#3b82f6" filter={`url(#${filterId})`}>
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="5" fill="#10b981" filter={`url(#${filterId})`}>
        <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="5" fill="#f59e0b" filter={`url(#${filterId})`}>
        <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="5" fill="#8b5cf6" filter={`url(#${filterId})`}>
        <animateMotion dur="2s" begin="1.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
};
const edgeTypes = {
  custom: CustomEdge,
};

// --- Custom Node Components ---

const NodeCard = ({ data, icon: Icon, colorClass, isPipe = false }: any) => {
  const styles = colorStyles[colorClass] || colorStyles.blue;

  return (
    <div className={`
      relative group transition-all duration-300
      ${isPipe 
        ? 'min-w-[350px] h-[120px] flex flex-col justify-center px-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900' 
        : 'min-w-[250px] p-5 bg-white dark:bg-gray-800'
      }
      rounded-2xl border-2
      ${data.active 
        ? `${styles.border} ${styles.shadow} scale-105 ring-4 ${styles.ring}` 
        : 'border-gray-200 dark:border-gray-700 shadow-xl'
      }
    `}>
      {/* Internal Packet Animation (Visualizing processing) */}
      {data.active && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${styles.packetBg} flex items-center justify-center text-white shadow-lg z-10`}
        >
          <Activity size={16} className="animate-spin" />
        </motion.div>
      )}

      {isPipe ? (
        // Pipe / Stream Visualization (Kafka Style)
        <div className="w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${styles.bgIcon} ${styles.textIcon}`}>
              <Icon size={24} />
            </div>
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-200">{data.label}</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{data.subLabel}</div>
            </div>
          </div>
          
          {/* The "Pipe" Visual */}
          <div className="relative h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-inner">
             {/* Grid lines to look like a pipe */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%)', backgroundSize: '20px 100%' }}></div>
             
             {/* Data Packets inside Pipe */}
             <AnimatePresence>
               {data.active && (
                 <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: '100%' }}
                   transition={{ duration: 1, ease: "linear" }}
                   className={`absolute top-1 bottom-1 w-1/3 rounded-full bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} opacity-80 shadow-md`}
                 />
               )}
             </AnimatePresence>
          </div>
          
          <div className="flex justify-between mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
            <span>IN: {data.stats?.queued || 0}</span>
            <span>OUT: {data.stats?.processed || 0}</span>
          </div>
        </div>
      ) : (
        // Standard Node Visualization
        <div className="flex flex-col items-center gap-4">
          <div className={`
            relative p-4 rounded-2xl 
            ${data.active ? `${styles.bgNode} ${styles.textNode}` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
            transition-colors duration-300
          `}>
            <Icon size={32} />
            {/* Pulse Effect */}
            {data.active && (
              <span className={`absolute inset-0 rounded-2xl ${styles.pulse} opacity-20 animate-ping`} />
            )}
          </div>
          
          <div className="text-center">
            <div className="font-bold text-lg text-gray-800 dark:text-gray-100">{data.label}</div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{data.subLabel}</div>
          </div>

          {/* Stats Grid */}
          <div className="w-full bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
            {data.stats && Object.entries(data.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-sm py-1 border-b border-gray-200 dark:border-gray-600 last:border-0">
                <span className="font-medium text-gray-500 dark:text-gray-400 capitalize">{key}</span>
                <span className={`font-mono font-bold ${styles.textStats}`}>
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProducerNode = ({ data }: any) => <NodeCard data={data} icon={Truck} colorClass="blue" />;
const StreamNode = ({ data }: any) => <NodeCard data={data} icon={Database} colorClass="amber" isPipe={true} />;
const WorkerNode = ({ data }: any) => <NodeCard data={data} icon={Server} colorClass="purple" />;
const UserNode = ({ data }: any) => <NodeCard data={data} icon={Smartphone} colorClass="green" />;
const FilterNode = ({ data }: any) => <NodeCard data={data} icon={Users} colorClass="indigo" />;
const DbNode = ({ data }: any) => <NodeCard data={data} icon={Database} colorClass="cyan" />;

const nodeTypes = {
  producer: ProducerNode,
  stream: StreamNode,
  worker: WorkerNode,
  user: UserNode,
  filter: FilterNode,
  db: DbNode,
};

// --- Initial Graph Setup ---

const initialNodes: Node[] = [
  { 
    id: 'producer', 
    type: 'producer', 
    position: { x: 0, y: 250 }, 
    data: { label: 'Rider App', subLabel: 'Producer', stats: { sent: 0 } } 
  },
  { 
    id: 'stream-loc', 
    type: 'stream', 
    position: { x: 300, y: 250 }, 
    data: { label: 'Location Stream', subLabel: 'Redis Stream', stats: { queued: 0, processed: 0 } } 
  },
  { 
    id: 'worker-loc', 
    type: 'worker', 
    position: { x: 700, y: 250 }, 
    data: { label: 'Location Worker', subLabel: 'Consumer', stats: { processed: 0 } } 
  },
  { 
    id: 'filter-users', 
    type: 'filter', 
    position: { x: 700, y: 550 }, 
    data: { label: 'User Selection', subLabel: 'Geofence Check', stats: { qualified: 0 } } 
  },
  { 
    id: 'db-users', 
    type: 'db', 
    position: { x: 400, y: 550 }, 
    data: { label: 'User DB', subLabel: 'PostgreSQL', stats: { queried: 0 } } 
  },
  { 
    id: 'stream-notif', 
    type: 'stream', 
    position: { x: 1000, y: 550 }, 
    data: { label: 'Notification Queue', subLabel: 'Redis Stream', stats: { queued: 0, processed: 0 } } 
  },
  { 
    id: 'worker-notif', 
    type: 'worker', 
    position: { x: 1400, y: 550 }, 
    data: { label: 'Notification Worker', subLabel: 'Consumer', stats: { processed: 0 } } 
  },
  { 
    id: 'user', 
    type: 'user', 
    position: { x: 1700, y: 550 }, 
    data: { label: 'Resident App', subLabel: 'Subscriber', stats: { received: 0 } } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'producer', target: 'stream-loc', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: 'stream-loc', target: 'worker-loc', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: 'worker-loc', target: 'filter-users', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-db', source: 'filter-users', target: 'db-users', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed }, animated: true },
  { id: 'e4-5', source: 'filter-users', target: 'stream-notif', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: 'stream-notif', target: 'worker-notif', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-7', source: 'worker-notif', target: 'user', type: 'custom', markerEnd: { type: MarkerType.ArrowClosed } },
];

export const SimulationDashboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [events, setEvents] = useState<any[]>([]);
  
  // Persistent Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.1x to 2x
  const [isLogOpen, setIsLogOpen] = useState(true);

  // Toggle Dark Mode & Persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Helper to update node stats & visual state
  const updateNodeStats = useCallback((nodeId: string, statKey: string, increment = 1) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const currentStats = node.data.stats || {};
          const currentVal = currentStats[statKey] || 0;
          return {
            ...node,
            data: {
              ...node.data,
              active: true,
              stats: { ...currentStats, [statKey]: currentVal + increment },
            },
          };
        }
        return node;
      })
    );
    
    // Reset active state
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, active: false } };
          }
          return node;
        })
      );
    }, 500 / speed);
  }, [setNodes, speed]);

  // Simulation Loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // 1. Rider sends location
      const eventId = Date.now().toString();
      
      updateNodeStats('producer', 'sent');
      updateNodeStats('stream-loc', 'queued');
      
      setEvents(prev => [{ 
        type: 'LOCATION_UPDATE', 
        payload: { RiderId: 'KA01AA1234', lat: 34.05, lng: -118.25 }, 
        timestamp: Date.now() 
      }, ...prev].slice(0, 30));

      // 2. Location Worker processes
      setTimeout(() => {
        updateNodeStats('stream-loc', 'processed'); // Update OUT stats
        updateNodeStats('worker-loc', 'processed');
        
        // 3. Check for proximity (30% chance)
        if (Math.random() > 0.7) {
          // 3a. User Selection / Geofence Check
          setTimeout(() => {
            updateNodeStats('db-users', 'queried'); // Query DB
            
            setTimeout(() => {
              updateNodeStats('filter-users', 'qualified');
              setEvents(prev => [{ 
                type: 'USER_QUALIFIED', 
                payload: { residentId: 'R-456', reason: 'Within 50m' }, 
                timestamp: Date.now() 
              }, ...prev].slice(0, 30));

              // 4. Queue Notification
              setTimeout(() => {
                updateNodeStats('stream-notif', 'queued');
                setEvents(prev => [{ 
                  type: 'NOTIFICATION_QUEUED', 
                  payload: { taskId: 'T-789', priority: 'high' }, 
                  timestamp: Date.now() 
                }, ...prev].slice(0, 30));

                // 5. Notification Worker processes
                setTimeout(() => {
                  updateNodeStats('stream-notif', 'processed'); // Update OUT stats
                  updateNodeStats('worker-notif', 'processed');
                  updateNodeStats('user', 'received');
                  setEvents(prev => [{ 
                    type: 'NOTIFICATION_SENT', 
                    payload: { status: 'delivered', device: 'iOS' }, 
                    timestamp: Date.now() 
                  }, ...prev].slice(0, 30));
                }, 800 / speed);
              }, 600 / speed);
            }, 400 / speed); // DB Query delay
          }, 600 / speed);
        }
      }, 600 / speed);

    }, 2000 / speed);

    return () => clearInterval(interval);
  }, [isPaused, speed, updateNodeStats]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Trash Buddy System</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time Event Stream Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-md transition-all ${isPaused ? 'bg-white dark:bg-gray-600 shadow text-red-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
            <button 
              onClick={() => setSpeed(0.1)}
              className={`px-2 py-1 text-xs font-bold rounded ${speed === 0.1 ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500'}`}
            >0.1x</button>
            <button 
              onClick={() => setSpeed(0.5)}
              className={`px-2 py-1 text-xs font-bold rounded ${speed === 0.5 ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500'}`}
            >0.5x</button>
            <button 
              onClick={() => setSpeed(1)}
              className={`px-2 py-1 text-xs font-bold rounded ${speed === 1 ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500'}`}
            >1x</button>
            <button 
              onClick={() => setSpeed(2)}
              className={`px-2 py-1 text-xs font-bold rounded ${speed === 2 ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500'}`}
            >2x</button>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Log Toggle */}
          <button 
            onClick={() => setIsLogOpen(!isLogOpen)}
            className={`p-2 rounded-md transition-all ${isLogOpen ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Toggle Event Log"
          >
            <PanelRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Main Graph Area */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-gray-50 dark:bg-gray-900"
          >
            <Background color={isDarkMode ? '#374151' : '#e5e7eb'} gap={20} />
            <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 fill-gray-600 dark:fill-gray-300" />
          </ReactFlow>
        </div>
        
        {/* Live Log Sidebar */}
        <AnimatePresence>
          {isLogOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-10 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-w-[320px]">
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  Live Event Log
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-w-[320px]">
                <AnimatePresence initial={false}>
                  {events.map((evt, i) => (
                    <motion.div
                      key={evt.timestamp + i}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative pl-4 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0"
                    >
                      <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                        evt.type === 'LOCATION_UPDATE' ? 'bg-blue-500' :
                        evt.type === 'PROXIMITY_ALERT' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`} />
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-bold ${
                            evt.type === 'LOCATION_UPDATE' ? 'text-blue-600 dark:text-blue-400' :
                            evt.type === 'PROXIMITY_ALERT' ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>{evt.type}</span>
                          <span className="text-gray-400 text-[10px]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <pre className="font-mono text-gray-600 dark:text-gray-300 overflow-x-auto">
                          {JSON.stringify(evt.payload, null, 2)}
                        </pre>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {events.length === 0 && (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
                    Waiting for events...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
