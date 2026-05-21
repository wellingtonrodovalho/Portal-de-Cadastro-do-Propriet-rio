import React, { useRef, useEffect } from 'react';
import { 
  User, Home, Tv, Wrench, Landmark, FilePlus2, 
  CheckCircle2, AlertCircle, Trash2, Sparkles 
} from 'lucide-react';

interface FormTabsProps {
  currentStep: number;
  setStep: (step: number) => void;
  validationStatus: { [key: number]: boolean };
  lastSaved: string | null;
  onClearDraft: () => void;
}

export default function FormTabs({
  currentStep,
  setStep,
  validationStatus,
  lastSaved,
  onClearDraft,
}: FormTabsProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { number: 1, title: 'Dados Pessoais', short: 'Pessoal', icon: User, desc: 'Identificação' },
    { number: 2, title: 'Informações do Imóvel', short: 'Imóvel', icon: Home, desc: 'Localização' },
    { number: 3, title: 'Mobília & Eletros', short: 'Mobília', icon: Tv, desc: 'Itens inclusos' },
    { number: 4, title: 'Histórico & Estado', short: 'Manutenção', icon: Wrench, desc: 'Vistorias' },
    { number: 5, title: 'Dados Financeiros', short: 'Financeiro', icon: Landmark, desc: 'Repasse Pix' },
    { number: 6, title: 'Assinatura', short: 'Assinatura', icon: FilePlus2, desc: 'Finalização' },
  ];

  // Helper to count completed sections
  const completedCount = Object.values(validationStatus).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  // Auto-scroll the active tab into view on mobile
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeElement = tabsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentStep]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs p-5 mb-6">
      
      {/* Top Bar: Progress and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Progresso do Cadastro</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {completedCount} de 6 concluídas
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 w-64 xs:w-72 sm:w-80">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-black text-slate-700 font-mono">{progressPercent}%</span>
          </div>
        </div>

        {/* Saved status & Action */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:justify-end">
          {lastSaved && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Salvo às {lastSaved}</span>
            </div>
          )}
          
          <button
            onClick={onClearDraft}
            type="button"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 p-2 rounded-lg font-medium transition-all duration-200 cursor-pointer"
            title="Apagar todos os dados salvos"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Formulário</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs container (Horizontal scrollable on mobile, flex row on desktop) */}
      <div 
        ref={tabsContainerRef}
        className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 pt-0.5 -mx-2 px-2 scrollbar-none snap-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map((tab) => {
          const isCompleted = validationStatus[tab.number];
          const isActive = currentStep === tab.number;
          const Icon = tab.icon;

          return (
            <button
              key={tab.number}
              onClick={() => setStep(tab.number)}
              data-active={isActive ? "true" : "false"}
              className={`flex-1 shrink-0 min-w-[130px] md:min-w-0 sm:flex-1 snap-align-center text-left relative overflow-hidden rounded-xl border p-3 sm:p-3.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-900 shadow-md shadow-slate-900/10'
                  : isCompleted
                    ? 'bg-emerald-50/20 text-slate-700 hover:text-slate-900 border-emerald-100 hover:border-emerald-300'
                    : 'bg-slate-50/40 hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Highlight ribbon for completed style or active style */}
              <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                isActive 
                  ? 'bg-emerald-400' 
                  : isCompleted 
                    ? 'bg-emerald-600' 
                    : 'bg-transparent'
              }`} />

              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[10px] font-bold font-mono tracking-wider ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 font-semibold'
                }`}>
                  0{tab.number}
                </span>

                {/* Status indicator badge */}
                <div>
                  {isCompleted ? (
                    <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  ) : isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  ) : null}
                </div>
              </div>

              {/* Icon and label row */}
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isActive 
                    ? 'bg-slate-800/80 text-emerald-400' 
                    : isCompleted 
                      ? 'bg-emerald-100/40 text-emerald-700' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className={`text-xs font-bold leading-tight tracking-tight uppercase truncate ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}>
                    {tab.short}
                  </h3>
                  <p className={`text-[10px] leading-none mt-0.5 truncate hidden sm:block ${
                    isActive ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                    {tab.desc}
                  </p>
                </div>
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}
