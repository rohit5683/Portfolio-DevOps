import { motion } from "framer-motion";
import { 
  Globe, 
  Server, 
  Database, 
  Cloud, 
  Cpu, 
  ArrowRight,
} from "lucide-react";

export default function ArchitectureDiagram() {
  const nodes = [
    { id: 1, label: "Public Interent", desc: "User Traffic", icon: Globe, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    { id: 2, label: "CloudFront", desc: "CDN Cache & TLS", icon: Cloud, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
    { id: 3, label: "ALB", desc: "Routing", icon: Server, color: "text-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/10" },
    { id: 4, label: "ECS Fargate", desc: "MERN Stack Containers", icon: Cpu, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
    { id: 5, label: "MongoDB Atlas", desc: "NoSQL Cluster", icon: Database, color: "text-green-500", border: "border-green-500/30", bg: "bg-green-600/10" },
  ];

  return (
    <div className="w-full py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-50 blur-3xl rounded-full"></div>
      
      <div className="text-center mb-10 relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Portfolio Architecture</h3>
        <p className="text-gray-400">Deployed automatically via GitHub Actions pipelines.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 lg:gap-6 relative z-10 max-w-6xl mx-auto px-4">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col md:flex-row items-center justify-center">
            {/* Node Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
              className={`w-40 md:w-32 lg:w-44 p-4 rounded-2xl border ${node.border} ${node.bg} backdrop-blur-md flex flex-col items-center gap-3 text-center shadow-lg hover:scale-105 transition-transform cursor-default group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className={`p-3 rounded-xl bg-black/40 ${node.color} shadow-inner`}>
                <node.icon className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm lg:text-base">{node.label}</h4>
                <p className="text-[10px] lg:text-xs text-gray-400 mt-0.5">{node.desc}</p>
              </div>
            </motion.div>

            {/* Connecting Arrow */}
            {index < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, duration: 0.3 }}
                className="my-3 md:my-0 md:mx-1 lg:mx-2 text-gray-600 animate-pulse"
              >
                <ArrowRight className="w-5 h-5 md:w-4 md:h-4 lg:w-6 lg:h-6 rotate-90 md:rotate-0" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Metrics Row */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 relative z-10"
      >
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
          <span className="text-gray-300 text-sm font-semibold">99.99% Uptime</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-blue-400 font-bold">{"<"} 40ms</span>
          <span className="text-gray-300 text-sm font-semibold">Global Latency</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-purple-400 font-bold">GitOps</span>
          <span className="text-gray-300 text-sm font-semibold">Automated CI/CD</span>
        </div>
      </motion.div>
    </div>
  );
}
