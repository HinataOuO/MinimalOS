import { useState, useEffect } from "react";
import {
  Wifi, Bluetooth, Volume2, Plane, Moon, Sun, Battery,
  Calendar, Music, Phone, Settings, Search, ChevronRight,
  Play, Pause, SkipBack, SkipForward, Heart,
  PhoneCall, MessageSquare, Plus, X, ArrowLeft, Signal,
  Sunrise, MapPin, Users, Sparkles, ExternalLink, MessageCircle,
  Clock, Folder
} from "lucide-react";

export default function MinimalOS() {
  const [screen, setScreen] = useState("home");
  const [time, setTime] = useState(new Date());
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [volume, setVolume] = useState(60);
  const [brightness, setBrightness] = useState(75);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const dateStr = time.toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long"
  });

  // Simula apertura app Claude esterna (deep link)
  const launchClaude = (action) => {
    setLaunching(action || "open");
    setTimeout(() => setLaunching(false), 1400);
  };

  // ─── Common UI ──────────────────────────────────────
  const StatusBar = () => (
    <div className="flex justify-between items-center px-5 pt-3 pb-2 text-[10px] font-mono text-zinc-400 tracking-wider">
      <span>{hh}:{mm}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <Battery className="w-3.5 h-3.5" />
        <span>87%</span>
      </div>
    </div>
  );

  const NavBar = () => (
    <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="flex justify-around items-center py-3">
        {[
          { id: "home", icon: <div className="w-3 h-3 rounded-full border border-current" /> },
          { id: "calendar", icon: <Calendar className="w-4 h-4" /> },
          { id: "music", icon: <Music className="w-4 h-4" /> },
          { id: "phone", icon: <Phone className="w-4 h-4" /> },
          { id: "controls", icon: <Settings className="w-4 h-4" /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`p-2 transition-colors ${
              screen === item.id ? "text-zinc-100" : "text-zinc-600"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );

  const Header = ({ title }) => (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-900">
      <button onClick={() => setScreen("home")} className="text-zinc-500">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <h2 className="text-sm font-medium tracking-wide text-zinc-200">{title}</h2>
    </div>
  );

  // ─── Overlay di lancio app esterna ───────────────────
  const LaunchOverlay = () => {
    if (!launching) return null;
    const labels = {
      open: "Apertura Claude…",
      new: "Nuova chat…",
      recent: "Chat recenti…",
      projects: "Projects…"
    };
    return (
      <div className="absolute inset-0 z-30 bg-zinc-950/95 backdrop-blur flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl border border-zinc-700 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-zinc-100" strokeWidth={1.5} />
        </div>
        <div className="text-sm text-zinc-200 mb-1">Claude</div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 flex items-center gap-2">
          <ExternalLink className="w-3 h-3" />
          {labels[launching] || labels.open}
        </div>
      </div>
    );
  };

  // ─── Home ────────────────────────────────────────────
  const Home = () => (
    <div className="px-5 pt-12 pb-24 h-full flex flex-col">
      <div className="mb-12">
        <div className="text-7xl font-light tracking-tighter text-zinc-100 tabular-nums">
          {hh}<span className="text-zinc-700">:</span>{mm}
        </div>
        <div className="text-xs text-zinc-500 mt-2 capitalize tracking-wide">{dateStr}</div>
      </div>

      <div className="border border-zinc-800 rounded-md p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Sunrise className="w-3.5 h-3.5" />
            <span>Milano</span>
          </div>
          <span className="text-xs text-zinc-600">14°</span>
        </div>
        <div className="text-xs text-zinc-500">Sereno · vento 8 km/h</div>
      </div>

      <div className="border border-zinc-800 rounded-md p-4 mb-6">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Prossimo evento</div>
        <div className="text-sm text-zinc-200 mb-1">Standup team</div>
        <div className="text-xs text-zinc-500">10:00 — 10:30</div>
      </div>

      {/* Card Claude — app integrata, lancia l'app esterna */}
      <button
        onClick={() => launchClaude("open")}
        className="border border-zinc-700 rounded-md p-4 mb-2 text-left hover:bg-zinc-900/70 transition-colors group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-zinc-200" />
            <span className="text-xs font-medium text-zinc-100">Claude</span>
          </div>
          <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div
            onClick={(e) => { e.stopPropagation(); launchClaude("new"); }}
            className="border border-zinc-800 rounded px-2 py-2 hover:bg-zinc-900 flex flex-col items-center gap-1"
          >
            <Plus className="w-3 h-3 text-zinc-400" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Nuova</span>
          </div>
          <div
            onClick={(e) => { e.stopPropagation(); launchClaude("recent"); }}
            className="border border-zinc-800 rounded px-2 py-2 hover:bg-zinc-900 flex flex-col items-center gap-1"
          >
            <Clock className="w-3 h-3 text-zinc-400" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Recenti</span>
          </div>
          <div
            onClick={(e) => { e.stopPropagation(); launchClaude("projects"); }}
            className="border border-zinc-800 rounded px-2 py-2 hover:bg-zinc-900 flex flex-col items-center gap-1"
          >
            <Folder className="w-3 h-3 text-zinc-400" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Projects</span>
          </div>
        </div>
      </button>

      <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3 mt-4">Apps</div>
      <div className="space-y-1">
        {["Messages", "Browser", "Notes", "Camera", "Files"].map(app => (
          <button
            key={app}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-900 rounded-md transition-colors"
          >
            <span className="text-sm text-zinc-300 font-light">{app}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Calendar ────────────────────────────────────────
  const CalendarView = () => {
    const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const today = time.getDay() === 0 ? 6 : time.getDay() - 1;
    const events = [
      { time: "10:00", title: "Standup team", duration: "30 min", day: 0 },
      { time: "14:30", title: "Review design", duration: "1h", day: 0 },
      { time: "09:00", title: "Dentista", duration: "45 min", day: 1 },
      { time: "18:00", title: "Palestra", duration: "1h", day: 2 },
    ];

    return (
      <div className="h-full flex flex-col pb-20">
        <Header title="Calendario" />
        <div className="px-5 py-4 border-b border-zinc-900">
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => (
              <div key={d} className="text-center">
                <div className="text-[10px] text-zinc-600 mb-2">{d}</div>
                <div className={`text-sm py-2 rounded ${
                  i === today
                    ? "bg-zinc-100 text-zinc-950 font-medium"
                    : "text-zinc-400"
                }`}>
                  {10 + i}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Oggi</div>
          {events.filter(e => e.day === 0).map((e, i) => (
            <div key={i} className="border border-zinc-800 rounded-md p-3 mb-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-zinc-200">{e.title}</span>
                <span className="text-xs text-zinc-500 font-mono">{e.time}</span>
              </div>
              <span className="text-[10px] text-zinc-600">{e.duration}</span>
            </div>
          ))}
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3 mt-6">Domani</div>
          {events.filter(e => e.day === 1).map((e, i) => (
            <div key={i} className="border border-zinc-800 rounded-md p-3 mb-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-zinc-200">{e.title}</span>
                <span className="text-xs text-zinc-500 font-mono">{e.time}</span>
              </div>
              <span className="text-[10px] text-zinc-600">{e.duration}</span>
            </div>
          ))}
        </div>
        <button className="mx-5 mb-4 border border-zinc-800 rounded-md py-2.5 text-xs text-zinc-400 hover:bg-zinc-900 flex items-center justify-center gap-2">
          <Plus className="w-3.5 h-3.5" /> Nuovo evento
        </button>
      </div>
    );
  };

  // ─── Music ───────────────────────────────────────────
  const MusicView = () => (
    <div className="h-full flex flex-col pb-20">
      <Header title="Spotify" />
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="aspect-square w-40 mx-auto mb-8 border border-zinc-800 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <Music className="w-10 h-10 text-zinc-700" strokeWidth={1} />
        </div>

        <div className="text-center mb-8">
          <div className="text-base text-zinc-100 mb-1">Weightless</div>
          <div className="text-xs text-zinc-500">Marconi Union</div>
        </div>

        <div className="mb-6">
          <div className="h-px bg-zinc-800 relative mb-2">
            <div className="absolute h-px bg-zinc-300" style={{ width: "34%" }} />
            <div className="absolute w-1.5 h-1.5 bg-zinc-100 rounded-full -top-[2px]" style={{ left: "34%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
            <span>2:48</span>
            <span>8:10</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-8 mb-8">
          <button className="text-zinc-500 hover:text-zinc-200">
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center hover:border-zinc-500"
          >
            {playing
              ? <Pause className="w-4 h-4 text-zinc-100" fill="currentColor" />
              : <Play className="w-4 h-4 text-zinc-100 ml-0.5" fill="currentColor" />}
          </button>
          <button className="text-zinc-500 hover:text-zinc-200">
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>
        </div>

        <div className="flex justify-between items-center px-2">
          <button onClick={() => setLiked(!liked)} className="text-zinc-500">
            <Heart className={`w-4 h-4 ${liked ? "fill-zinc-100 text-zinc-100" : ""}`} />
          </button>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600">In coda · 12</div>
        </div>
      </div>
    </div>
  );

  // ─── Phone ───────────────────────────────────────────
  const PhoneView = () => {
    const contacts = [
      { name: "Marco Bianchi", last: "Oggi · 14:23" },
      { name: "Giulia Rossi", last: "Ieri" },
      { name: "Andrea Verdi", last: "2 giorni fa" },
      { name: "Sara Conti", last: "5 giorni fa" },
      { name: "Luca Ferrari", last: "1 sett fa" },
    ];
    return (
      <div className="h-full flex flex-col pb-20">
        <Header title="Telefono" />
        <div className="px-5 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-2 px-3 py-2 border border-zinc-800 rounded-md">
            <Search className="w-3.5 h-3.5 text-zinc-600" />
            <input
              placeholder="Cerca contatto"
              className="bg-transparent text-xs text-zinc-300 outline-none flex-1 placeholder:text-zinc-600"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="px-5 py-3 text-[10px] uppercase tracking-widest text-zinc-600">Recenti</div>
          {contacts.map((c, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-900 border-b border-zinc-900/50"
            >
              <div className="text-left">
                <div className="text-sm text-zinc-200">{c.name}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{c.last}</div>
              </div>
              <PhoneCall className="w-3.5 h-3.5 text-zinc-600" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 px-5 py-3">
          <button className="border border-zinc-800 rounded-md py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center justify-center gap-2">
            <Users className="w-3.5 h-3.5" /> Rubrica
          </button>
          <button className="border border-zinc-800 rounded-md py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center justify-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" /> Messaggi
          </button>
        </div>
      </div>
    );
  };

  // ─── Quick Controls ──────────────────────────────────
  const Controls = () => {
    const Toggle = ({ icon, label, state, setState, sub }) => (
      <button
        onClick={() => setState(!state)}
        className={`border rounded-md p-3 text-left transition-colors ${
          state
            ? "border-zinc-300 bg-zinc-100 text-zinc-950"
            : "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          {icon}
          <div className={`w-1.5 h-1.5 rounded-full ${state ? "bg-zinc-950" : "bg-zinc-700"}`} />
        </div>
        <div className="text-xs font-medium">{label}</div>
        {sub && <div className={`text-[10px] mt-0.5 ${state ? "text-zinc-600" : "text-zinc-600"}`}>{sub}</div>}
      </button>
    );

    return (
      <div className="h-full flex flex-col pb-20">
        <Header title="Controlli" />
        <div className="flex-1 overflow-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Toggle icon={<Wifi className="w-4 h-4" />} label="Wi-Fi" sub={wifi ? "Casa_5G" : "Off"} state={wifi} setState={setWifi} />
            <Toggle icon={<Bluetooth className="w-4 h-4" />} label="Bluetooth" sub={bt ? "AirPods Pro" : "Off"} state={bt} setState={setBt} />
            <Toggle icon={<Plane className="w-4 h-4" />} label="Aereo" state={airplane} setState={setAirplane} />
            <Toggle icon={<Moon className="w-4 h-4" />} label="Non disturbare" state={dnd} setState={setDnd} />
          </div>

          {bt && (
            <div className="border border-zinc-800 rounded-md p-3 mb-4">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">Dispositivi</div>
              {[
                { name: "AirPods Pro", connected: true, battery: "82%" },
                { name: "WH-1000XM5", connected: false, battery: "—" },
                { name: "Tastiera Logi", connected: false, battery: "—" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-t border-zinc-900 first:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${d.connected ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    <span className="text-xs text-zinc-300">{d.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">{d.battery}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border border-zinc-800 rounded-md p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs text-zinc-300">Volume</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{volume}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={e => setVolume(+e.target.value)}
              className="w-full accent-zinc-100 h-px"
            />
          </div>

          <div className="border border-zinc-800 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs text-zinc-300">Luminosità</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{brightness}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={brightness}
              onChange={e => setBrightness(+e.target.value)}
              className="w-full accent-zinc-100 h-px"
            />
          </div>
        </div>
      </div>
    );
  };

  // ─── Frame ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-6 font-sans">
      <div className="flex flex-col items-center">
        <div className="text-xs text-zinc-500 mb-4 font-mono tracking-widest">MINIMALOS · v0.1</div>
        <div
          className="relative bg-zinc-950 rounded-[2.5rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden"
          style={{ width: 360, height: 740 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-950 rounded-b-2xl z-20" />
          <div className="h-full text-zinc-100 overflow-hidden relative">
            <StatusBar />
            <div className="h-[calc(100%-32px)] overflow-auto">
              {screen === "home" && <Home />}
              {screen === "calendar" && <CalendarView />}
              {screen === "music" && <MusicView />}
              {screen === "phone" && <PhoneView />}
              {screen === "controls" && <Controls />}
            </div>
            <NavBar />
            <LaunchOverlay />
          </div>
        </div>
        <div className="text-[10px] text-zinc-500 mt-4 font-mono tracking-wider">
          tap ⎯ icone in basso per navigare
        </div>
      </div>
    </div>
  );
}
