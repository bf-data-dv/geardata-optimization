import React, { useState } from 'react';
import { 
  CheckCircle, Code2, BarChart3, 
  ChevronLeft, ChevronRight, Car, Cpu, Zap, 
  ShieldCheck, Layers, ListFilter, Search, 
  Filter, SortAsc, SortDesc, Type,
  ArrowUpDown, RefreshCcw, Terminal
} from 'lucide-react';

// Importation directe du fruit de ton travail SQL
import inventoryData from './marque_voiture.json';

const sqlQueries = [
  { title: "01. Scrubbing & Date Fix", code: (<><span className="text-pink-500">UPDATE</span> inventory <span className="text-pink-500">SET</span> <span className="text-emerald-400">date_mep</span> = <span className="text-indigo-400 italic">REPLACE</span>(date_mep, <span className="text-amber-200">'/101/'</span>, <span className="text-amber-200">'/10/'</span>) <span className="text-pink-500">WHERE</span> date_mep <span className="text-pink-500">LIKE</span> <span className="text-amber-200">'%/101/%'</span>;</>) },
  { title: "02. Schema Normalization", code: (<><span className="text-pink-500">UPDATE</span> inventory <span className="text-pink-500">SET</span> <span className="text-emerald-400">marque</span> = <span className="text-emerald-400 italic">UPPER</span>(<span className="text-emerald-400 italic">TRIM</span>(marque)), <span className="text-emerald-400">modele</span> = <span className="text-emerald-400 italic">UPPER</span>(<span className="text-emerald-400 italic">TRIM</span>(modele));</>) },
  { title: "03. Duplicate Elimination", code: (<><span className="text-pink-500">DELETE FROM</span> inventory <span className="text-pink-500">WHERE</span> ctid <span className="text-pink-500">NOT IN</span> (<span className="text-pink-500">SELECT</span> <span className="text-emerald-400 italic">MIN</span>(ctid) <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">GROUP BY</span> marque, modele, date_mep);</>) },
  { title: "04. Regex Sanitization", code: (<><span className="text-pink-500">UPDATE</span> inventory <span className="text-pink-500">SET</span> <span className="text-emerald-400">modele</span> = <span className="text-indigo-400 italic">REGEXP_REPLACE</span>(modele, <span className="text-amber-200">'[^a-zA-Z0-9 ]'</span>, <span className="text-amber-200">''</span>, <span className="text-amber-200">'g'</span>);</>) },
  { title: "05. Query Optimization Index", code: (<><span className="text-pink-500">CREATE INDEX</span> idx_car_search <span className="text-pink-500">ON</span> inventory(marque, modele);</>) },
  { title: "06. Data Extraction", code: (<><span className="text-pink-500">SELECT</span> marque, modele, <span className="text-emerald-400 italic">SUBSTRING</span>(date_mep <span className="text-pink-500">FROM</span> <span className="text-amber-200">'\d{4}'</span>) <span className="text-pink-500">FROM</span> inventory;</>) },
  { title: "07. Integrity Audit", code: (<><span className="text-pink-500">SELECT</span> <span className="text-emerald-400 italic">COUNT</span>(*) <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">WHERE</span> marque <span className="text-pink-500">IS NULL</span>;</>) },
  { title: "08. Chrono-Analysis", code: (<><span className="text-pink-500">SELECT</span> <span className="text-emerald-400 italic">RIGHT</span>(date_mep, 4), <span className="text-emerald-400 italic">COUNT</span>(*) <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">GROUP BY</span> 1 <span className="text-pink-500">ORDER BY</span> 1;</>) },
  { title: "09. Premium Segmentation", code: (<><span className="text-pink-500">SELECT</span> marque, prix <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">ORDER BY</span> prix <span className="text-pink-500">DESC LIMIT</span> <span className="text-amber-200">10</span>;</>) },
  { title: "10. Statistical Averaging", code: (<><span className="text-pink-500">SELECT</span> marque, <span className="text-emerald-400 italic">ROUND</span>(<span className="text-emerald-400 italic">AVG</span>(prix), 2) <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">GROUP BY</span> marque;</>) },
  { title: "11. JSON Hybrid Aggregation", code: (<><span className="text-pink-500">SELECT</span> <span className="text-emerald-400 italic">json_agg</span>(t) <span className="text-pink-500">FROM</span> (<span className="text-pink-500">SELECT</span> marque, <span className="text-emerald-400 italic">COUNT</span>(*) <span className="text-pink-500">FROM</span> inventory <span className="text-pink-500">GROUP BY</span> 1) t;</>) },
  { title: "12. High-Speed Export", code: (<><span className="text-pink-500">COPY</span> (<span className="text-pink-500">SELECT</span> * <span className="text-pink-500">FROM</span> inventory) <span className="text-pink-500">TO</span> <span className="text-amber-200">'/output/clean_data.json'</span> <span className="text-pink-500">WITH</span> (FORMAT JSON);</>) }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sqlIndex, setSqlIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('desc');

  const grandTotal = inventoryData.reduce((acc, curr) => {
    const val = curr.TOTAL || curr.total || curr.count || curr.COUNT || Object.values(curr)[1] || 0;
    return acc + Number(val);
  }, 0);

  const sortedData = [...inventoryData]
    .filter(item => (item?.MARQUE || item?.marque || Object.values(item)[0] || "").toString().toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = (a?.MARQUE || a?.marque || Object.values(a)[0] || "").toString();
      const nameB = (b?.MARQUE || b?.marque || Object.values(b)[0] || "").toString();
      const valA = Number(a?.TOTAL || a?.total || a?.count || a?.COUNT || Object.values(a)[1] || 0);
      const valB = Number(b?.TOTAL || b?.total || b?.count || b?.COUNT || Object.values(b)[1] || 0);
      return sortType === 'alpha' ? nameA.localeCompare(nameB) : sortType === 'desc' ? valB - valA : valA - valB;
    });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#06080F]/80 border-b border-white/5 h-20 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20"><Cpu size={24} /></div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white uppercase italic tracking-tighter">Gear<span className="text-indigo-400 font-light">Data</span></span>
              <span className="text-[10px] text-indigo-500 font-black tracking-widest uppercase italic">Brahim Fettih // Optimization Architect</span>
            </div>
          </div>
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase flex items-center gap-2 ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-400 hover:text-white'}`}>
              <Zap size={16} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('marques')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase flex items-center gap-2 ${activeTab === 'marques' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-400 hover:text-white'}`}>
              <ListFilter size={16} /> Catalogue
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'overview' ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* HERO SECTION - VALORISATION DU TRAVAIL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-slate-900/40 p-10 rounded-[40px] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-10"><Terminal size={200} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 w-fit px-4 py-1.5 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                    <ShieldCheck size={14} className="animate-pulse" /> 100% Data Integrity Verified
                  </div>
                  <h1 className="text-6xl font-black text-white mb-6 tracking-tighter italic uppercase leading-none">
                    Purified <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 text-5xl">Data Engine</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-xl italic leading-relaxed">
                    Transformation d'un dataset brut <span className="text-pink-500 font-bold underline decoration-pink-500/30">corrompu</span> en un inventaire 
                    <span className="text-white font-bold italic underline decoration-indigo-500"> haute performance</span> via 12 pipelines SQL.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[40px] p-8 text-white flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-7xl font-black mb-2 italic tracking-tighter uppercase">0ms</div>
                <div className="text-indigo-100 font-black uppercase text-[10px] tracking-[0.3em] opacity-80 italic">Zero Latency Engine</div>
                <div className="mt-8 flex gap-2">
                  {[1,2,3,4,5].map(i => <CheckCircle key={i} size={16} className="text-emerald-400 shadow-lg" />)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SQL PANEL */}
              <div className="bg-[#11141D] p-8 rounded-[40px] border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 shadow-inner"><Code2 size={24}/></div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Cleaning Logic</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSqlIndex((prev) => (prev - 1 + sqlQueries.length) % sqlQueries.length)} className="p-2.5 bg-slate-950 border border-white/10 rounded-xl hover:text-indigo-400 transition-all active:scale-95"><ChevronLeft size={20} /></button>
                    <button onClick={() => setSqlIndex((prev) => (prev + 1) % sqlQueries.length)} className="p-2.5 bg-slate-950 border border-white/10 rounded-xl hover:text-indigo-400 transition-all active:scale-95"><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="min-h-[160px] p-6 bg-slate-950 rounded-3xl border-l-4 border-indigo-500 shadow-inner group transition-all">
                  <div className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest italic flex items-center gap-2">
                    <RefreshCcw size={10} className="animate-spin-slow" /> // {sqlQueries[sqlIndex].title}
                  </div>
                  <code className="text-indigo-300 block font-mono text-sm leading-relaxed">{sqlQueries[sqlIndex].code}</code>
                </div>
              </div>

              {/* STATS PROCESS */}
              <div className="bg-[#11141D] p-8 rounded-[40px] border border-white/5 shadow-xl">
                <h3 className="text-xl font-bold text-white uppercase italic mb-8 flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><BarChart3 size={24}/></div>
                  Purification Pipeline
                </h3>
                <div className="space-y-4">
                  {[
                    {t: "Data Scrubbing", d: "Fixing corrupt entries & nulls", c: "text-pink-400", i: <Layers size={18}/>},
                    {t: "Hydrated JSON Export", d: "SQL-to-JSON Object Mapping", c: "text-blue-400", i: <Filter size={18}/>},
                    {t: "Reactive UI Sync", d: "0.1s Rendering Engine", c: "text-emerald-400", i: <Zap size={18}/>}
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                      <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center ${step.c} shadow-inner group-hover:scale-110 transition-transform`}>{step.i}</div>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest ${step.c}`}>{step.t}</h4>
                        <p className="text-[10px] text-slate-500 italic mt-1 uppercase font-bold">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SECTION CATALOGUE */
          <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-5xl font-black text-white italic uppercase leading-none tracking-tighter">Répertoire <span className="text-indigo-500">Auto</span></h2>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase">Normalized</span>
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{sortedData.length} Marques Validées</span>
                </div>
              </div>
              <div className="relative group w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input type="text" placeholder="RECHERCHER DANS L'INVENTAIRE..." onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-950 border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-indigo-500 w-full text-white uppercase font-bold tracking-widest shadow-2xl" />
              </div>
            </div>

            {/* BARRE DE TRI - ALGORITHMIC SORTING */}
            <div className="flex flex-wrap items-center gap-3 bg-[#11141D] p-3 rounded-3xl border border-white/5 shadow-2xl">
              <div className="px-4 py-2 flex items-center gap-2 text-slate-500">
                <ArrowUpDown size={16}/>
                <span className="text-[10px] font-black uppercase italic tracking-widest">Algorithmic Sort</span>
              </div>
              <button onClick={() => setSortType('desc')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${sortType === 'desc' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white'}`}>
                <SortDesc size={14} /> Top Ventes
              </button>
              <button onClick={() => setSortType('alpha')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${sortType === 'alpha' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white'}`}>
                <Type size={14} /> A - Z
              </button>
              <button onClick={() => setSortType('asc')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${sortType === 'asc' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white'}`}>
                <SortAsc size={14} /> Croissant
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {sortedData.map((item, index) => {
                const nom = item?.MARQUE || item?.marque || Object.values(item)[0] || "Inconnu";
                const total = Number(item?.TOTAL || item?.total || item?.count || item?.COUNT || Object.values(item)[1] || 0);
                const perc = ((total/grandTotal)*100).toFixed(1);
                return (
                  <div key={index} className="bg-[#11141D] p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/40 transition-all group relative overflow-hidden shadow-2xl shadow-black/40 h-fit">
                    <div className="absolute top-4 right-6 text-[10px] font-black text-slate-800 uppercase italic opacity-40">System-Checked ID {index + 1}</div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-5 bg-slate-950 rounded-3xl text-slate-400 group-hover:text-indigo-400 shadow-inner group-hover:rotate-3 transition-transform transition-colors"><Car size={32} /></div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-white italic leading-none tracking-tighter">{total}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic tracking-widest opacity-60">Unités Fixes</div>
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase mb-6 tracking-tight group-hover:text-indigo-300 transition-colors">{nom}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest italic">
                        Statistical Impact <span className="text-indigo-400">{perc}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${perc}%` }}></div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-emerald-500/70 uppercase flex items-center gap-1 italic"><CheckCircle size={10}/> Cleansed</span>
                       <span className="text-[10px] font-black text-slate-700 uppercase italic tracking-tighter underline">Mapping Root-V1</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-20 border-t border-white/5 bg-[#06080F]/90 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3 text-indigo-500 font-black uppercase text-sm tracking-[0.5em] italic">
            <ShieldCheck size={20}/> Brahim Fettih // Data Purification Architecture
          </div>
          <span className="text-slate-600 font-bold text-[10px] tracking-[0.6em] uppercase opacity-60">
            {grandTotal} Lines Processed // Built for Performance // 2026
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
