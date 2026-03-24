import { useState, useRef, useEffect } from "react";

interface TerminalProps {
  onClose: () => void;
}

const Terminal = ({ onClose }: TerminalProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: React.ReactNode }[]>([
    {
      command: "",
      output: (
        <div className="text-gray-300">
          <p>Welcome to Rohit's Interactive CLI.</p>
          <p>Type <span className="text-green-400 font-bold">help</span> to see available commands.</p>
          <p className="text-xs text-gray-500 mt-2">v2.0.1 - simulated ubuntu environment</p>
        </div>
      ),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const args = input.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const arg = args.slice(1).join(" ");
    
    let output: React.ReactNode = "";
    
    const fileSystem = {
      "about.txt": "Rohit Vishwakarma - DevOps Engineer.\nPassionate about cloud architecture, automation, and scalable deployments. Experienced in AWS, Docker, Kubernetes, and CI/CD pipelines.",
      "skills.json": `{\n  "cloud": ["AWS", "GCP"],\n  "iac": ["Terraform", "CloudFormation"],\n  "containers": ["Docker", "Kubernetes", "ECS"],\n  "ci_cd": ["GitHub Actions", "Jenkins", "GitLab CI"],\n  "coding": ["Python", "Node.js", "Bash", "React"]\n}`,
      "resume.pdf": "[BINARY DATA - Downloading...]",
      "projects.md": "# Active Projects\n- Terraform EKS Cluster Generator\n- Multi-Region CloudFront CDN routing\n- Automated MongoDB Atlas backups",
      "contact.sh": `echo "Reach out at: rohit@example.com (replace with real email)\nOr connect on LinkedIn /portal"`,
    };

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1">
            <div className="text-gray-400 mb-2">Available commands:</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">whoami</span> - Display current user</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">pwd</span> - Print working directory</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">ls</span> - List directory contents</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">cat &lt;file&gt;</span> - Concatenate files and print</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">echo &lt;str&gt;</span> - Print text to terminal</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">date</span> - Print system date and time</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">skills</span> - Graphical skills view</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">clear</span> - Clear terminal output</div>
            <div><span className="text-blue-400 w-24 md:w-32 inline-block">exit</span> - Close terminal</div>
          </div>
        );
        break;
      case "pwd":
        output = "/home/rohit/portfolio";
        break;
      case "ls":
        output = (
          <div className="flex gap-4 text-blue-300">
            {Object.keys(fileSystem).map(f => (
              <span key={f}>{f}</span>
            ))}
          </div>
        );
        break;
      case "cat":
        if (!arg) {
          output = "cat: missing file operand\nTry 'ls' to see available files.";
        } else if (arg === "resume.pdf") {
          output = (
            <div>
              {fileSystem["resume.pdf"]}
              <a href="/resume.pdf" download id="resume-download-link" className="hidden">Download</a>
              <span className="hidden">{setTimeout(() => document.getElementById("resume-download-link")?.click(), 100)}</span>
            </div>
          );
        } else if (fileSystem[arg as keyof typeof fileSystem]) {
          output = <div className="whitespace-pre-wrap">{fileSystem[arg as keyof typeof fileSystem]}</div>;
        } else {
          output = `cat: ${arg}: No such file or directory`;
        }
        break;
      case "echo":
        output = arg;
        break;
      case "date":
        output = new Date().toString();
        break;
      case "whoami":
        output = "rohit";
        break;
      case "sudo":
        output = "rohit is not in the sudoers file. This incident will be reported.";
        break;
      case "cd":
        output = `cd: ${arg}: Permission denied`;
        break;
      case "skills":
        output = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 border border-white/10 p-3 rounded-lg bg-white/5">
            <span className="text-yellow-400">AWS</span>
            <span className="text-blue-400">Kubernetes</span>
            <span className="text-purple-400">Terraform</span>
            <span className="text-blue-500">Docker</span>
            <span className="text-green-500">CI/CD</span>
            <span className="text-blue-300">React</span>
            <span className="text-green-400">Node.js</span>
            <span className="text-green-600">MongoDB</span>
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      case "":
        output = "";
        break;
      default:
        output = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { command: input, output }]);
    setInput("");
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#1e1e1e] w-full max-w-3xl h-[60vh] rounded-xl shadow-2xl shadow-blue-500/10 border border-white/10 flex flex-col overflow-hidden font-mono text-sm md:text-base transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-white/5">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></button>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-400 text-xs tracking-wider">rohit@devops-portfolio:~</div>
          <div className="w-10"></div>
        </div>
        
        {/* Terminal Body */}
        <div 
          className="flex-1 p-4 md:p-6 overflow-y-auto text-gray-300 bg-[#1e1e1e] cursor-text" 
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.command && (
                <div className="flex gap-2 text-white/90">
                  <span className="text-green-400">rohit@devops-portfolio:~$</span>
                  <span>{entry.command}</span>
                </div>
              )}
              {entry.output && <div className="mt-1 whitespace-pre-wrap">{entry.output}</div>}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex gap-2 mt-2">
            <span className="text-green-400">rohit@devops-portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white caret-white"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
