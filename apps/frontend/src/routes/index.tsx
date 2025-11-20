import { createFileRoute } from '@tanstack/react-router'

import {
  Activity,
  ArrowRight,
  Check,
  Code,
  Database,
  GitBranch,
  Layers,
  Lock,
  Menu,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      if (windowHeight === 0) return setProgress(0)
      const scroll = totalScroll / windowHeight
      setProgress(Number.isNaN(scroll) ? 0 : scroll)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

const useElementScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const start = rect.top - windowHeight
      const end = rect.bottom
      const total = end - start
      const current = -start
      if (total === 0) return setProgress(0)
      let p = current / total
      if (Number.isNaN(p) || !Number.isFinite(p)) p = 0
      p = Math.max(0, Math.min(1, p))
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref])
  return progress
}

const useInView = (options = { threshold: 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect() // Only trigger once
      }
    }, options)

    const currentRef = ref.current
    if (currentRef) observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
      observer.disconnect()
    }
  }, [options])

  return [ref, isInView] as const
}

const useScramble = (
  text: string,
  trigger: boolean = true,
  speed: number = 40,
) => {
  const [displayText, setDisplayText] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text)
      return
    }

    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((_letter, index) => {
            if (index < iteration) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(''),
      )

      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 3
    }, speed)

    return () => clearInterval(interval)
  }, [text, trigger, speed])

  return displayText
}

const ScrambleTitle = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => {
  const display = useScramble(text, true, 50)
  return <span className={className}>{display}</span>
}

const HoverScramble = ({
  text,
  href,
  className,
}: {
  text: string
  href: string
  className?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const display = useScramble(text, isHovered, 30)

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {display}
    </a>
  )
}

const RichCodeBlock = ({
  lines,
  delay = 0,
  className = '',
}: {
  lines: Array<ReactNode>
  delay?: number
  className?: string
}) => {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  useEffect(() => {
    if (!started) return
    if (visibleLines < lines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, 600) // Speed of typing new lines
      return () => clearTimeout(timeout)
    }
  }, [visibleLines, lines.length, started])

  return (
    <div
      ref={ref}
      className={`font-mono text-xs sm:text-sm leading-relaxed bg-[#0d0d0d] p-4 rounded-md border border-zinc-800 shadow-inner ${className}`}
    >
      {/* Window Controls */}
      <div className="flex gap-2 mb-3 opacity-50">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>

      {lines.map((line, i) => (
        <div
          key={i}
          className={`transition-opacity duration-300 min-h-[1.5em] ${i < visibleLines ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-zinc-700 mr-3 select-none">{i + 1}</span>
          {line}
        </div>
      ))}
      {visibleLines < lines.length && started && (
        <span className="animate-blink inline-block w-2 h-4 bg-lime-400 ml-1 align-middle"></span>
      )}
    </div>
  )
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: any) => {
  return (
    <button
      className={`relative group px-8 py-4 text-sm font-bold tracking-widest uppercase overflow-hidden border transition-all duration-300 ${
        variant === 'primary'
          ? 'bg-white text-black border-white hover:text-white'
          : 'bg-transparent text-white border-zinc-800 hover:border-white'
      } ${className}`}
      {...props}
    >
      <div
        className={`absolute inset-0 bg-black transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ${variant === 'primary' ? 'block' : 'hidden'}`}
      />
      <div
        className={`absolute inset-0 bg-zinc-900 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ${variant === 'outline' ? 'block' : 'hidden'}`}
      />

      <span className="relative z-10 flex items-center gap-2 mix-blend-difference">
        {children}
      </span>
    </button>
  )
}

/**
 * --------------------------------------------------------------------------
 * STYLES
 * --------------------------------------------------------------------------
 */
const GlobalStyles = () => (
  <style>{`
    :root {
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    }
    html { scroll-behavior: smooth; }
    body { background-color: #000; overflow-x: hidden; }
    
    .bg-noise {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: overlay;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }

    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .animate-blink { animation: blink 1s step-end infinite; }
    
    @keyframes float-up { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
    .animate-float { animation: float-up 3s ease-in-out infinite alternate; }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .scanline-overlay {
      background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.02) 51%, transparent 52%);
      background-size: 100% 4px;
      animation: scanline 10s linear infinite;
      pointer-events: none;
    }
  `}</style>
)

const Navbar = () => (
  <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-8 py-6 mix-blend-difference text-white bg-black/50 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-white" />
      <span className="font-bold tracking-tight text-lg">n7n</span>
    </div>
    <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest">
      <HoverScramble
        href="#"
        text="PRODUCT"
        className="hover:text-lime-400 transition-colors"
      />
      <HoverScramble
        href="#"
        text="SOLUTIONS"
        className="hover:text-lime-400 transition-colors"
      />
      <HoverScramble
        href="#"
        text="PRICING"
        className="hover:text-lime-400 transition-colors"
      />
    </div>
    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
      <Menu size={20} />
    </button>
  </nav>
)

const Hero = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const scrollY = useScrollProgress()

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 20
    const y = (clientY / window.innerHeight - 0.5) * 20
    setMouse({ x, y })
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* Dynamic Background Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white to-transparent" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />
        <div className="absolute bottom-1/3 left-0 right-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-zinc-800 rounded-full bg-zinc-900/50 backdrop-blur-xl">
          <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            <ScrambleTitle text="System Online v2.4" />
          </span>
        </div>

        <h1 className="text-[16vw] sm:text-[12vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-600 mb-8 select-none">
          <ScrambleTitle text="VISUAL" /> <br />
          <span className="text-zinc-500">
            <ScrambleTitle text="BACKEND" />
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-zinc-400 text-base sm:text-lg mb-12 px-4">
          The only workflow automation tool that compiles to raw Node.js.
          <span className="text-white block mt-2">
            Build visually. Deploy as code.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <Button variant="primary">Start Free Trial</Button>
          <Button variant="outline">Documentation</Button>
        </div>
      </div>

      <div
        className="mt-20 hidden md:block w-full max-w-6xl px-4 perspective-[2000px]"
        style={{
          transform: `translateY(-${scrollY * 100}px)`,
        }}
      >
        <div
          className="relative aspect-21/9 bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden transition-transform duration-100 ease-out group"
          style={{
            transform: `rotateX(${mouse.y * 0.5}deg) rotateY(${mouse.x * 0.5}deg)`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none z-20" />

          <div className="h-12  bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="pl-4 border-l border-zinc-800 flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Terminal size={12} />
                <span>workflow.main.json</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                Active
              </span>
            </div>
          </div>

          <div className="relative h-full bg-[#0a0a0a] p-4 sm:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[32px_32px] opacity-30" />

            <div
              className="absolute top-[30%] left-[20%] w-64 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-lg shadow-2xl animate-float z-10"
              style={{ animationDelay: '0s' }}
            >
              <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white rounded text-black">
                    <Zap size={12} />
                  </div>
                  <span className="text-xs font-bold text-white">Webhook</span>
                </div>
                <span className="text-[10px] text-zinc-500">POST</span>
              </div>
              <div className="p-3">
                <RichCodeBlock
                  className="border-0 bg-zinc-950/50 p-2!"
                  delay={200}
                  lines={[
                    <span>
                      <span className="text-purple-400">const</span> body =
                      req.body;
                    </span>,
                    <span>
                      <span className="text-blue-400">return</span> body;
                    </span>,
                  ]}
                />
              </div>
            </div>

            <div
              className="absolute top-[50%] left-[50%] -translate-x-1/2 w-72 bg-zinc-900/90 backdrop-blur border border-lime-900/50 rounded-lg shadow-[0_0_50px_rgba(132,204,22,0.1)] animate-float z-20"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="flex items-center justify-between p-3 border-b border-lime-900/30 bg-lime-900/10">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-lime-400 rounded text-black">
                    <Code size={12} />
                  </div>
                  <span className="text-xs font-bold text-lime-400">
                    Transform Logic
                  </span>
                </div>
                <span className="text-[10px] text-lime-400/50">JS</span>
              </div>
              <div className="p-3">
                <RichCodeBlock
                  className="border-0 bg-zinc-950/50 p-2!"
                  delay={1500}
                  lines={[
                    <span>
                      data.<span className="text-yellow-300">map</span>(i ={'>'}{' '}
                      i * 2);
                    </span>,
                    <span>
                      <span className="text-purple-400">if</span> (err){' '}
                      <span className="text-red-400">throw</span> err;
                    </span>,
                    <span>
                      <span className="text-blue-400">return</span>{' '}
                      {`{ success: true }`};
                    </span>,
                  ]}
                />
              </div>
            </div>

            <div
              className="absolute top-[30%] right-[20%] w-64 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-lg shadow-2xl animate-float z-10"
              style={{ animationDelay: '3s' }}
            >
              <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-zinc-800 border border-zinc-700 rounded text-white">
                    <Database size={12} />
                  </div>
                  <span className="text-xs font-bold text-white">Postgres</span>
                </div>
                <span className="text-[10px] text-zinc-500">INSERT</span>
              </div>
              <div className="p-3">
                <RichCodeBlock
                  className="border-0 bg-zinc-950/50 p-2!"
                  delay={3000}
                  lines={[
                    <span>
                      <span className="text-purple-400">await</span> db.users.
                      <span className="text-yellow-300">add</span>(
                    </span>,
                    <span>&nbsp;&nbsp;data.user_id</span>,
                    <span>);</span>,
                  ]}
                />
              </div>
            </div>

            {/* Connection SVG */}
            <svg className="absolute inset-0 pointer-events-none overflow-visible stroke-zinc-700">
              <path
                d="M 30% 35% C 40% 35%, 40% 55%, 50% 55%"
                fill="none"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="animate-[dash_20s_linear_infinite]"
              />
              <path
                d="M 50% 55% C 60% 55%, 60% 35%, 70% 35%"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

const TearingSection = () => {
  const ref = useRef<HTMLElement>(null)
  const progress = useElementScroll(ref)
  const split = progress * 200
  const opacity = Math.min(Math.max(progress * 2, 0), 1)

  return (
    <section ref={ref} className="relative h-[200vh] bg-zinc-950">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div
            className="text-center transition-opacity duration-500 px-4"
            style={{ opacity: Number.isNaN(opacity) ? 0 : opacity }}
          >
            <span className="text-lime-400 font-mono text-xs tracking-widest mb-4 block">
              UNDER THE HOOD
            </span>
            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8">
              RAW
              <br />
              NODE.JS
              <br />
              POWER
            </h2>

            {/* Typwriter Code Block */}
            <div className="mt-8 max-w-xl w-full mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <RichCodeBlock
                delay={200}
                className="text-sm md:text-base"
                lines={[
                  <span>
                    <span className="text-purple-400">import</span>{' '}
                    {`{ Workflow }`}{' '}
                    <span className="text-purple-400">from</span>{' '}
                    <span className="text-orange-300">'@n7n/core'</span>;
                  </span>,
                  <span>&nbsp;</span>,
                  <span>
                    <span className="text-blue-400">const</span> flow ={' '}
                    <span className="text-purple-400">new</span>{' '}
                    <span className="text-yellow-300">Workflow</span>();
                  </span>,
                  <span>
                    <span className="text-green-400">
                      // Define nodes programmatically
                    </span>
                  </span>,
                  <span>
                    flow.<span className="text-yellow-300">add</span>(
                    {`{ type: `}
                    <span className="text-orange-300">'webhook'</span>
                    {` }`});
                  </span>,
                  <span>
                    <span className="text-purple-400">await</span> flow.
                    <span className="text-yellow-300">execute</span>();
                  </span>,
                  <span>
                    console.<span className="text-yellow-300">log</span>(
                    <span className="text-green-400">'Done!'</span>);
                  </span>,
                ]}
              />
            </div>
          </div>
        </div>

        {/* Top Half */}
        <div
          className="relative z-10 w-full max-w-4xl h-[30vh] overflow-hidden border-t border-x border-zinc-800 bg-zinc-900 shadow-2xl"
          style={{ transform: `translateY(-${split}px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-full h-[60vh] relative top-0 flex items-center justify-center">
              <h3 className="text-6xl sm:text-9xl font-black text-zinc-800 tracking-tighter">
                VISUAL
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Half */}
        <div
          className="relative z-10 w-full max-w-4xl h-[30vh] overflow-hidden border-b border-x border-zinc-800 bg-zinc-900 shadow-2xl"
          style={{ transform: `translateY(${split}px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-full h-[60vh] relative -top-[30vh] flex items-center justify-center">
              <h3 className="text-6xl sm:text-9xl font-black text-zinc-800 tracking-tighter">
                VISUAL
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const HorizontalScrollSection = () => {
  const ref = useRef<HTMLElement>(null)
  const progress = useElementScroll(ref)
  const x = -progress * 100

  const cards = [
    {
      title: 'Webhook',
      icon: Zap,
      lines: [
        <span>
          <span className="text-purple-400">POST</span> /hooks/catch/123
        </span>,
        <span>Accept: application/json</span>,
      ],
    },
    {
      title: 'Filter',
      icon: Layers,
      lines: [
        <span>
          <span className="text-purple-400">if</span> (item.price {`>`} 100)
        </span>,
        <span>
          &nbsp;&nbsp;<span className="text-blue-400">return</span>{' '}
          <span className="text-orange-300">true</span>;
        </span>,
      ],
    },
    {
      title: 'Postgres',
      icon: Database,
      lines: [
        <span>
          <span className="text-purple-400">SELECT</span> *{' '}
          <span className="text-purple-400">FROM</span> users
        </span>,
        <span>
          <span className="text-purple-400">WHERE</span> active ={' '}
          <span className="text-orange-300">true</span>
        </span>,
      ],
    },
    {
      title: 'Code',
      icon: Code,
      lines: [
        <span>
          console.<span className="text-yellow-300">log</span>(
          <span className="text-green-400">'Processing...'</span>);
        </span>,
        <span>
          <span className="text-blue-400">const</span> tax = price * 0.2;
        </span>,
      ],
    },
    {
      title: 'Response',
      icon: ArrowRight,
      lines: [
        <span>
          <span className="text-blue-400">return</span> {`{`}
        </span>,
        <span>
          &nbsp;&nbsp;success: <span className="text-orange-300">true</span>
        </span>,
        <span>{`}`}</span>,
      ],
    },
  ]

  return (
    <section ref={ref} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-y border-zinc-900">
        <div className="absolute top-10 left-4 sm:left-10 z-20 px-4">
          <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            The Pipeline
          </h3>
          <p className="text-sm sm:text-base text-zinc-500">
            Drag. Connect. Deploy.
          </p>
        </div>

        <div
          className="flex gap-4 px-4 sm:px-20"
          style={{ transform: `translateX(${x}%)` }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="shrink-0 w-[80vw] md:w-[30vw] aspect-4/5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between hover:bg-zinc-900 transition-colors group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors rounded-lg">
                <card.icon size={24} />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  {card.title}
                </h4>
                <RichCodeBlock
                  delay={i * 500}
                  lines={card.lines}
                  className="bg-black border-zinc-900"
                />
              </div>

              <div className="w-full h-px bg-zinc-800 group-hover:bg-white transition-colors mt-auto" />
            </div>
          ))}

          <div className="shrink-0 w-[30vw] flex items-center justify-center">
            <h2 className="text-6xl font-bold text-zinc-800">DEPLOY</h2>
          </div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ title, subtitle, children, className = '' }: any) => (
  <div
    className={`group relative border border-zinc-800 bg-zinc-950 overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/20 transition-colors duration-500" />

    <div className="relative p-8 h-full flex flex-col">
      <div className="mb-auto relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm max-w-xs">{subtitle}</p>
      </div>
      <div className="mt-8 relative z-10 h-full">{children}</div>
    </div>
  </div>
)

const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-20 flex items-end justify-between">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            BATTERIES
            <br />
            INCLUDED
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 text-right hidden md:block">
            Everything you need to run
            <br />
            mission critical automations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr">
          {/* Card 1: Git Workflow */}
          <FeatureCard
            className="md:col-span-8 min-h-[400px]"
            title="Git-Native Workflow"
            subtitle="Commit your workflows to GitHub. Run CI/CD pipelines. Code reviews on logic changes."
          >
            <div className="w-full h-full bg-zinc-900 border border-zinc-800 rounded relative overflow-hidden group-hover:border-zinc-600 transition-colors">
              <div className="absolute top-0 left-0 w-full h-8 bg-zinc-800 flex items-center px-4 text-zinc-400 border-b border-zinc-700">
                <GitBranch size={14} className="mr-2" /> feature/payment-logic
              </div>
              <div className="p-4 mt-8">
                <RichCodeBlock
                  delay={500}
                  className="border-0 bg-transparent shadow-none"
                  lines={[
                    <span>
                      <span className="text-green-400">+</span> "type":
                      "n7n-workflow",
                    </span>,
                    <span>
                      <span className="text-green-400">+</span> "nodes": [
                    </span>,
                    <span>
                      &nbsp;&nbsp;<span className="text-green-400">+</span>{' '}
                      {`{ "id": "uuid-1", "type": "webhook" },`}
                    </span>,
                    <span>
                      &nbsp;&nbsp;<span className="text-green-400">+</span>{' '}
                      {`{ "id": "uuid-2", "type": "transform" }`}
                    </span>,
                    <span>
                      <span className="text-green-400">+</span> ]
                    </span>,
                  ]}
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded flex items-center gap-2">
                <Check size={14} /> Merged
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            className="md:col-span-4 min-h-[400px]"
            title="Rust Runtime"
            subtitle="Benchmarks show n7n is 10x faster than Python-based alternatives."
          >
            <div className="relative h-full flex items-end justify-center pb-10">
              <div className="w-16 h-48 bg-zinc-900 rounded-t-lg relative mx-2 group-hover:h-64 transition-all duration-500 border-t border-x border-zinc-800">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 rotate-90 whitespace-nowrap origin-center">
                  Python
                </div>
              </div>
              <div className="w-16 h-24 bg-white rounded-t-lg relative mx-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:h-32 transition-all duration-500 delay-100">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black rotate-90 whitespace-nowrap origin-center">
                  n7n (Rust)
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-zinc-800 px-2 py-1 rounded">
                  12ms
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 3: Live Debugger */}
          <FeatureCard
            className="md:col-span-5 min-h-[400px]"
            title="Live Execution Logs"
            subtitle="Watch your workflows execute step-by-step in real-time."
          >
            <div className="w-full h-full bg-black border border-zinc-800 rounded p-4 font-mono text-xs relative overflow-hidden">
              <div className="scanline-overlay absolute inset-0 z-20" />
              <RichCodeBlock
                delay={0}
                className="bg-transparent border-0 p-0 shadow-none"
                lines={[
                  <span className="text-green-400">
                    ➜ START EXECUTION 8f2a...
                  </span>,
                  <span className="text-zinc-500">
                    [10:42:01] Webhook received payload
                  </span>,
                  <span className="text-zinc-500">
                    [10:42:02] Transform node started
                  </span>,
                  <span className="text-blue-400">
                    [10:42:02] Processing 15 items...
                  </span>,
                  <span className="text-zinc-500">
                    [10:42:03] Postgres insert success
                  </span>,
                  <span className="text-green-400">
                    ➜ EXECUTION COMPLETE (124ms)
                  </span>,
                  <span className="animate-pulse">_</span>,
                ]}
              />
              <div className="absolute bottom-4 right-4">
                <Activity className="text-green-500 animate-pulse" size={20} />
              </div>
            </div>
          </FeatureCard>

          {/* Card 4: Security Vault */}
          <FeatureCard
            className="md:col-span-7 min-h-[400px]"
            title="Secret Vault"
            subtitle="Enterprise-grade encryption for your API keys and credentials."
          >
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-64 h-64 rounded-full border border-zinc-800 flex items-center justify-center relative group-hover:border-zinc-700 transition-colors">
                <div className="absolute inset-0 border border-dashed border-zinc-800 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="w-48 h-48 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all">
                  <Lock
                    size={48}
                    className="text-zinc-600 group-hover:text-white transition-colors duration-500"
                  />
                </div>
                {/* Orbiting Keys */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full text-[10px] text-zinc-500 flex items-center gap-2">
                  <ShieldCheck size={10} /> AES-256
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-zinc-950 pt-20 pb-8 border-t border-zinc-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to automate?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">Get Started</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end items-end">
            <span className="text-[20vw] sm:text-[15vw] font-bold text-zinc-900 leading-none select-none">
              n7n
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-zinc-600 pt-8 border-t border-zinc-900">
          <p>&copy; 2025 n7n Inc. Berlin / San Francisco</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <HoverScramble
              href="#"
              text="GITHUB"
              className="hover:text-white transition-colors"
            />
            <HoverScramble
              href="#"
              text="TWITTER"
              className="hover:text-white transition-colors"
            />
            <HoverScramble
              href="#"
              text="LEGAL"
              className="hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <GlobalStyles />
      <div className="bg-noise" />

      <Navbar />
      <Hero />
      <TearingSection />
      <HorizontalScrollSection />
      <FeaturesGrid />
      <Footer />
    </div>
  )
}
