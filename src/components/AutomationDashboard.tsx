import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, FileDown, Mail, ArrowRight, Sparkles, Plus, 
  MapPin, Landmark, Sofa, Clock, RefreshCw, Smartphone, Wrench, ShieldAlert 
} from 'lucide-react';
import { SubmittedRegistration } from '../types';
import { generateMockPDF } from '../utils';

interface AutomationDashboardProps {
  registrations: SubmittedRegistration[];
  onAddNew: () => void;
  onRemove: (id: string) => void;
  userEmail: string;
}

export default function AutomationDashboard({ 
  registrations, 
  onAddNew, 
  onRemove,
  userEmail 
}: AutomationDashboardProps) {
  const [selectedId, setSelectedId] = useState<string>(registrations[0]?.id || '');

  const activeReg = registrations.find(r => r.id === selectedId) || registrations[0];

  if (!activeReg) {
    return (
      <div id="dashboard-empty-state" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-800">Nenhum Imóvel Cadastrado</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inicie preenchendo as 6 seções do formulário para registrar o seu primeiro imóvel e conferir o fluxo de automação completo para o proprietário.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-950 text-emerald-300 font-semibold text-xs rounded-xl hover:bg-emerald-900 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Proprietário & Imóvel</span>
        </button>
      </div>
    );
  }

  const { data } = activeReg;

  // Generate technical validation warning checklist depending on data answers
  const getTechnicalActionPlan = () => {
    const plans: { title: string; priority: 'Alta' | 'Normal' | 'Baixa'; desc: string }[] = [];

    if (data.utilitiesStatus === 'Necessita de revisão urgente') {
      plans.push({
        title: 'Vistoria Elétrica/Hidráulica Célere',
        priority: 'Alta',
        desc: 'Necessário enviar eletricista antes de any listagem comercial.',
      });
    } else if (data.utilitiesStatus === 'Apresenta pequenos detalhes/vazamentos') {
      plans.push({
        title: 'Reparo Hidráulico Preventivo',
        priority: 'Normal',
        desc: 'Instalação possui pequenos vazamentos registados. Reparar antes do check-in.',
      });
    }

    if (data.lastPainting === 'Necessita de pintura') {
      plans.push({
        title: 'Equipes de Revitalização Visual',
        priority: 'Normal',
        desc: 'Sinalizado com necessidade de pintura antes de receber novos inquilinos.',
      });
    }

    if (data.acMaintenance === 'Não possuem manutenção recente') {
      plans.push({
        title: 'Higienização de Ar Condicionado',
        priority: 'Alta',
        desc: 'Agendar higienização e troca de filtros de ar preventiva.',
      });
    }

    if (data.chronicProblems && data.chronicProblems !== 'Nada consta') {
      plans.push({
        title: 'Avaliação da Patologia Crônica',
        priority: 'Alta',
        desc: `Verificar sinistro relatado: "${data.chronicProblems}"`,
      });
    }

    if (plans.length === 0) {
      plans.push({
        title: 'Pronto para Publicação Comercial',
        priority: 'Baixa',
        desc: 'Imóvel em perfeitas condições de manutenção. Emitir book fotográfico logo após vistoria protocolar.',
      });
    }

    return plans;
  };

  // Simulation of PDF download
  const downloadPDFSummary = () => {
    const textContent = generateMockPDF(data);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ficha_Onboarding_${data.ownerName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionPlans = getTechnicalActionPlan();

  return (
    <div id="dashboard-container" className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Fluxo de Automação Ativado
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            Painel Geral de Automação
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sua ficha foi validada de acordo com as diretrizes da LGPD de direito digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950 text-emerald-300 rounded-xl hover:bg-emerald-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Outro Imóvel</span>
          </button>
        </div>
      </div>

      {/* Grid selector of registered records if multiple */}
      {registrations.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Selecione o registro:</span>
          {registrations.map(reg => (
            <button
              key={reg.id}
              onClick={() => setSelectedId(reg.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border shrink-0 transition-colors cursor-pointer ${
                selectedId === reg.id
                  ? 'bg-slate-900 border-slate-900 text-white font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {reg.data.ownerName.split(' ')[0]} - {reg.data.propStreet}, {reg.data.propNumber}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Hand: Key Information Card & Quick summaries */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulation status checklist block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Status das Integrações Sistêmicas</h3>
              <p className="text-[11px] text-slate-400">Automóvel de processos e conformidade garantidos.</p>
            </div>

            <div className="relative border-l border-slate-150 pl-6 ml-3 space-y-5">
              {/* Point 1: PDF Generation */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Doutrinas de Direito Digital - Ficha em PDF Consolidada
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-normal">Auto-gerado</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Coleta assinada pela chave Pix e biometria na tela salva com conformidade em rascunho codificado.
                  </p>
                  <button
                    onClick={downloadPDFSummary}
                    className="mt-2 text-[10px] font-bold text-slate-800 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Baixar Cópia da Ficha (.txt formatado)</span>
                  </button>
                </div>
              </div>

              {/* Point 2: Email sent to client */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Disparo de Cópia Operacional por E-mail
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded font-normal">Concluído</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cópia do laudo de integração enviado eletronicamente para o endereço do proprietário parceiro: <strong className="text-slate-700">{data.ownerEmail || userEmail}</strong>.
                  </p>
                </div>
              </div>

              {/* Point 3: operational alert */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Alerta Enviado para Validação Técnica
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded font-normal font-semibold">Preparado</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Disparado alerta Push e Webhook de vistoria para a equipe de Engenharia Técnica da administradora.
                  </p>
                </div>
              </div>

              {/* Point 4: Digital Contract platform generated */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Canal de Assinatura Eletrônica Gerado
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-800 px-1 py-0.2 rounded font-normal font-semibold">{data.signatureChannel}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Envelope pronto na plataforma de preferência: <strong>{data.signaturePlatform || 'Usar a da administradora'}</strong>. 
                    Será disparado de acordo com a vistoria técnica presencial.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick specs visual review card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ficha Técnica do Imóvel Cadastrado</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Location */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold uppercase">Local</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">{data.propNeighborhood}</p>
                <p className="text-[9px] text-slate-400 truncate">{data.propCityState}</p>
              </div>

              {/* Type */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <Sofa className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold uppercase">Estilo</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">{data.propType}</p>
                <p className="text-[9px] text-slate-400 truncate">{data.furnishStatus}</p>
              </div>

              {/* Account summary */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <Landmark className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold uppercase">Repasse Pix</span>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">{data.pixKey}</p>
                <p className="text-[9px] text-slate-400 truncate">{data.bankName}</p>
              </div>
            </div>

            {/* Address full line breakdown */}
            <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl flex items-start gap-2 border border-slate-100/50">
              <Clock className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Endereço de Gestão Comercial:</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {data.propStreet}, {data.propNumber} {data.propComplement ? ` - ${data.propComplement}` : ''} - Bairro: {data.propNeighborhood}, CEP: {data.propZip} - {data.propCityState}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Action Plans & Warnings logs */}
        <div className="space-y-6">
          {/* Action plan generated depending on maintenance answers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-800 animate-pulse" />
                Roteiro de Validação Técnica
              </h3>
              <p className="text-[10px] text-slate-400">Gerado dinamicamente para o time presencial imobiliário.</p>
            </div>

            <div className="space-y-3">
              {actionPlans.map((plan, idx) => {
                const isUrgent = plan.priority === 'Alta';
                const isNormal = plan.priority === 'Normal';
                
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border text-left space-y-1 ${
                      isUrgent 
                        ? 'border-rose-100 bg-rose-50/30' 
                        : isNormal 
                          ? 'border-amber-100 bg-amber-50/20' 
                          : 'border-emerald-100 bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-bold text-slate-800">{plan.title}</h4>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                        isUrgent 
                          ? 'bg-rose-150 text-rose-800' 
                          : isNormal 
                            ? 'bg-amber-150 text-amber-800' 
                            : 'bg-emerald-150 text-emerald-800'
                      }`}>
                        Prioridade {plan.priority}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{plan.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal / Protection indicators */}
          <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl space-y-3 shadow-inner relative overflow-hidden">
            <ShieldAlert className="w-12 h-12 text-emerald-800/40 absolute -right-3 -bottom-3" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segurança jurídica (LGPD)</h4>
            <p className="text-[10px] text-emerald-300 leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (Nº 13.709), as coordenadas fornecidas foram encriptadas eletronicamente na plataforma de destino e os anexos de vistoria carregados ficarão guardados com acesso sob confidencialidade de chaves.
            </p>
            <div className="text-[10px] bg-emerald-900 border border-emerald-800 p-2 rounded-lg text-emerald-400 font-mono">
              IP Registro: 198.15.22.45<br/>
              Consentimento: {data.lgpdConsent ? 'SIM (TERMO ACEITO)' : 'NÃO'}<br/>
              Chave Hash: SHA-256 (Proprietário)
            </div>
          </div>

          {/* Delete property option */}
          <button
            onClick={() => onRemove(activeReg.id)}
            className="w-full text-center py-2 px-3 border border-rose-100 text-[11px] text-rose-600 rounded-lg hover:bg-rose-50/50 transition-colors font-medium cursor-pointer"
          >
            Excluir Registro Imobiliário
          </button>
        </div>
      </div>
    </div>
  );
}
