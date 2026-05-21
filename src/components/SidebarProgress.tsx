import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Sparkles, Check } from 'lucide-react';
import { PropertyOwnerData } from '../types';

interface SidebarProgressProps {
  currentStep: number;
  setStep: (step: number) => void;
  data: PropertyOwnerData;
  validationStatus: { [key: number]: boolean };
  onClearDraft: () => void;
  lastSaved: string | null;
}

export default function SidebarProgress({
  currentStep,
  setStep,
  data,
  validationStatus,
  onClearDraft,
  lastSaved,
}: SidebarProgressProps) {
  const steps = [
    { number: 1, title: 'Dados Pessoais', desc: 'Identificação e contatos' },
    { number: 2, title: 'Informações do Imóvel', desc: 'Localização & dimensões' },
    { number: 3, title: 'Mobília & Eletros', desc: 'Nível de preparação' },
    { number: 4, title: 'Histórico & Estado', desc: 'Manutenção e vistorias' },
    { number: 5, title: 'Dados Financeiros', desc: 'Repasse mensal seguro' },
    { number: 6, title: 'Assinatura', desc: 'LGPD e formalização' },
  ];

  // Helper to count completed sections
  const completedCount = Object.values(validationStatus).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  return (
    <div id="sidebar-progress-container" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-900/10">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Onboarding</h2>
            <p className="text-xs text-slate-400">Portal de Proprietários</p>
          </div>
        </div>

        {/* Circular progress overview */}
        <div className="mb-8 p-4 bg-slate-50/50 rounded-xl border border-slate-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-600">Progresso Geral</span>
            <span className="text-xs font-bold text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {completedCount} de 6 seções validadas com sucesso
          </p>
        </div>

        {/* Steps List */}
        <nav className="space-y-2">
          {steps.map((step) => {
            const isCompleted = validationStatus[step.number];
            const isActive = currentStep === step.number;

            return (
              <button
                key={step.number}
                onClick={() => setStep(step.number)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50/70 text-emerald-950 border border-emerald-100/30 font-medium'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isActive ? 'text-emerald-900' : 'text-slate-500'}`}>
                      Seção {step.number}
                    </span>
                    {isActive && (
                      <span className="inline-block px-1.5 py-0.5 text-[8px] bg-emerald-600 text-white font-semibold rounded-full uppercase tracking-wider">
                        Ativa
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm tracking-tight leading-tight mt-0.5 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Auto-save / Draft status & Actions */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
        {lastSaved && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-emerald-50/30 p-2 rounded-md border border-emerald-100/10">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rascunho auto-salvo às {lastSaved}</span>
          </div>
        )}
        
        <button
          onClick={onClearDraft}
          className="w-full text-center py-2 px-3 border border-slate-200 text-[11px] text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-700 font-medium transition-colors"
        >
          Limpar Rascunho
        </button>
      </div>
    </div>
  );
}
