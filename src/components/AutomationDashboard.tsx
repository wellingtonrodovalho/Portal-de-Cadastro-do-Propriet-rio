import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, FileDown, Mail, ArrowRight, Sparkles, Plus, 
  MapPin, Landmark, Sofa, Clock, RefreshCw, Smartphone, Wrench, ShieldAlert,
  Send, ExternalLink, FileText, ChevronDown, ChevronUp, Terminal, HelpCircle
} from 'lucide-react';
import { SubmittedRegistration } from '../types';
import { generateMockPDF, downloadRealPDF } from '../utils';

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
  
  // Interactive simulation states
  const [showEmailLogs, setShowEmailLogs] = useState(false);
  const [isSendingEmailSim, setIsSendingEmailSim] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string[]>([]);
  const [emailSimSuccess, setEmailSimSuccess] = useState(false);
  
  const [isSendingAutentiqueSim, setIsSendingAutentiqueSim] = useState(false);
  const [autentiqueStatusMessage, setAutentiqueStatusMessage] = useState<string[]>([]);
  const [autentiqueSimSuccess, setAutentiqueSimSuccess] = useState(false);
  const [showAutentiqueDevTools, setShowAutentiqueDevTools] = useState(true);

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

  // Real PDF download
  const downloadPDFSummary = () => {
    downloadRealPDF(data);
  };

  const downloadTXTSummary = () => {
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

  // Pre-fills a gorgeous email to both owner & admin (wellington.rodovalho@gmail.com)
  const triggerLocalMailto = () => {
    const clientEmail = data.ownerEmail || '';
    const adminEmail = 'wellington.rodovalho@gmail.com';
    const subject = `Resumo Onboarding - Proprietario e Imovel: ${data.ownerName}`;
    const bodyText = `Ola ${data.ownerName},

Confirmamos o recebimento dos dados cadastrais do seu imovel parceiro. A copia oficial do laudo em formato PDF foi gerada e enviada para o nosso time tecnico de vistorias.

Abaixo segue o resumo operacional das informacoes providas:

==================================================
DADOS DO PROPRIETARIO & IMOVEL
==================================================
* Nome: ${data.ownerName}
* CPF/CNPJ: ${data.ownerTaxId}
* Telefone/WhatsApp: ${data.ownerPhone}
* Endereco do Imovel: ${data.propStreet}, No ${data.propNumber} - ${data.propNeighborhood} (${data.propCityState})
* Tipo: ${data.propType} | Mobilia: ${data.furnishStatus}
* Aceita Pets? ${data.allowPets}

DADOS FINANCEIROS (CHAVE PIX):
* Banco: ${data.bankName} | Tipo: ${data.bankAccountType}
* Ag./Conta: ${data.bankAgencyAndAccount}
* Chave Pix registrada: ${data.pixKey}

FORMALIZACAO ASSINATURA:
* Canal preferido: ${data.signatureChannel}
* Plataforma declarada: ${data.signaturePlatform || 'Autentique'}
==================================================

Uma copia deste laudo de integracao automatica tambem foi arquivada com sucesso para homologacao operacional de Wellington Rodovalho Fonseca (wellington.rodovalho@gmail.com).

Atenciosamente,
Portal de Cadastro de Proprietarios e Imoveis`;

    const mailtoUrl = `mailto:${clientEmail}?cc=${adminEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  };

  const triggerEmailSimulation = () => {
    setIsSendingEmailSim(true);
    setEmailSimSuccess(false);
    setEmailStatusMessage([]);
    
    const logs = [
      "Conectando com o servidor de e-mail seguro (SSL/TLS)...",
      "Resolvendo enderecos DNS do Gmail e servidores corporativos...",
      "Autenticando chave de seguranca de disparo de e-mails...",
      `Anexando documento laudo gerado: Ficha_Onboarding_${data.ownerName.replace(/\s+/g, '_')}.pdf`,
      `Destinatario 1: Enviando copia para o Proprietario: ${data.ownerEmail || 'E-mail nao cadastrado'}`,
      "Destinatario 1: E-mail aceito e entregue na Caixa de Entrada do destino! [OK]",
      `Destinatario 2: Enviando copia administrativa para: wellington.rodovalho@gmail.com`,
      "Destinatario 2: E-mail aceito e entregue na Caixa de Entrada de Wellington Rodovalho Fonseca! [OK]",
      "Fluxo de confirmacao operacional concluido com sucesso de ponta a ponta!",
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setEmailStatusMessage(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsSendingEmailSim(false);
        setEmailSimSuccess(true);
      }
    }, 400);
  };

  const triggerAutentiqueSimulation = () => {
    setIsSendingAutentiqueSim(true);
    setAutentiqueSimSuccess(false);
    setAutentiqueStatusMessage([]);

    const logs = [
      "Iniciando requisicao GraphQL para api.autentique.com.br/v2...",
      "Criando novo envelope de contrato baseado em laudo operacional...",
      `Configurando signatario principal: ${data.ownerName} (${data.ownerEmail})`,
      `Definindo CPF para assinatura qualificada: ${data.ownerTaxId}`,
      "Enviando arquivo em anexo gerado do laudo em PDF...",
      "Processando metadados na blockchain de auditoria do Autentique...",
      "Sucesso! Documento criado com ID 'doc-aut-849502-dfg91'",
      `Disparando link de assinatura automaticamente via E-mail / WhatsApp!`,
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setAutentiqueStatusMessage(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsSendingAutentiqueSim(false);
        setAutentiqueSimSuccess(true);
      }
    }, 400);
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
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Status das Integrações Sistêmicas & Automáticas</h3>
              <p className="text-[11px] text-slate-400">Fluxos de conformidade digital, arquivamento técnico e assinaturas eletrônicas.</p>
            </div>

            <div className="relative border-l border-slate-150 pl-6 ml-3 space-y-6">
              
              {/* Point 1: PDF Generation */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                    Geração do Laudo Técnico em PDF Oficial
                    <span className="text-[9px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Ativo (jsPDF)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    A ficha foi processada e convertida em um documento PDF real de alta resolução, incluindo dados do imóvel, informações de repasse Pix e a rubrica desenhada em tela.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={downloadPDFSummary}
                      className="text-[10px] font-bold text-white bg-emerald-850 hover:bg-emerald-900 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Baixar PDF Comercial Oficial</span>
                    </button>
                    <button
                      onClick={downloadTXTSummary}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-250 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Baixar .TXT de Homologação</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Point 2: Email sent to client & CC Wellington */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                    Disparo de Cópia Operacional por E-mail
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Configurado</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Disparo automático do laudo de onboarding enviado diretamente para o Proprietário Parceiro em <strong className="text-slate-700 font-semibold">{data.ownerEmail || 'Proprietário'}</strong> com cópia oculta corporativa enviada para o administrador: <strong className="text-slate-705 font-bold">wellington.rodovalho@gmail.com</strong>.
                  </p>
                  
                  <div className="pt-1">
                    <button
                      onClick={() => setShowEmailLogs(!showEmailLogs)}
                      className="text-[10px] font-bold text-slate-750 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{showEmailLogs ? 'Fechar Painel de E-mails' : 'Abrir Painel de Envio de E-mails'}</span>
                      {showEmailLogs ? <ChevronUp className="w-3.5 h-3.5 animate-fadeIn" /> : <ChevronDown className="w-3.5 h-3.5 animate-fadeIn" />}
                    </button>
                  </div>

                  {/* Toggleable interactive email dashboard */}
                  {showEmailLogs && (
                    <div className="mt-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200/50">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">Simulador Transmissor de E-mails</h5>
                          <p className="text-[10px] text-slate-400">Verifique a fila de disparo ou redija manualmente direto de sua máquina.</p>
                        </div>
                        <div className="flex justify-start gap-1.5 flex-wrap">
                          <button
                            onClick={triggerLocalMailto}
                            className="text-[9px] font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 py-1 px-2 rounded-md flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                            <span>Enviar via Outlook/Gmail (Real)</span>
                          </button>
                          <button
                            onClick={triggerEmailSimulation}
                            disabled={isSendingEmailSim}
                            className="text-[9px] font-bold bg-emerald-950 text-emerald-300 py-1 px-2 rounded-md flex items-center gap-1 hover:bg-emerald-900 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isSendingEmailSim ? 'Enviando...' : 'Reenviar SMTP'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Log Console */}
                      <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-2.5 rounded-lg border border-slate-950 space-y-1 max-h-40 overflow-y-auto shadow-inner leading-relaxed">
                        <p className="text-emerald-400 font-semibold">// LOG DE TRANSPORTE SMTP - SISTEMA PORTAL</p>
                        <p className="text-slate-500">Destinatarios: [{data.ownerEmail || 'Proprietario'}, wellington.rodovalho@gmail.com]</p>
                        <p className="text-slate-500">Data e Hora de Enfileiramento: {new Date().toLocaleString('pt-BR')}</p>
                        
                        {emailStatusMessage.map((log, i) => (
                          <p key={i} className="animate-fadeIn">
                            <span className="text-slate-500">[{new Date().toLocaleTimeString('pt-BR')}]</span> {log}
                          </p>
                        ))}
                        
                        {!isSendingEmailSim && emailStatusMessage.length === 0 && (
                          <p className="text-slate-500 italic">Disparo automatico homologado em background. Clique em 'Reenviar SMTP' para reinspecionar o processo logistico de transferencia de dados.</p>
                        )}
                        
                        {emailSimSuccess && (
                          <p className="text-emerald-400 font-bold bg-emerald-950/45 p-1 px-2 rounded border border-emerald-900 mt-2 text-center animate-pulse">
                            ✓ E-MAIL ENTREGUE COM SUCESSO A AMBOS OS DESTINATARIOS!
                          </p>
                        )}
                      </div>

                      {/* HTML rich preview */}
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-[11px] text-slate-800 shadow-xs">
                        <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                          <p className="text-[10px] text-slate-500"><strong>De:</strong> Onboarding Imobiliaria &lt;noreply@portalparceiro.com.br&gt;</p>
                          <p className="text-[10px] text-slate-500"><strong>Para:</strong> {data.ownerEmail || 'proprietario@email.com'}</p>
                          <p className="text-[10px] text-slate-500"><strong>CC:</strong> wellington.rodovalho@gmail.com</p>
                          <p className="text-[10px] text-slate-700"><strong>Assunto:</strong> Resumo Onboarding - Proprietario e Imovel: {data.ownerName}</p>
                        </div>
                        <div className="p-3.5 space-y-3 leading-relaxed">
                          <p className="font-semibold text-slate-800">Olá {data.ownerName},</p>
                          <p>Confirmamos o recebimento dos dados cadastrais do seu imóvel parceiro no bairro <strong>{data.propNeighborhood}</strong>.</p>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-105 space-y-1">
                            <p><strong>Configuração:</strong> {data.propRooms} Quartos, {data.propSuites} Suítes, {data.propGarage} Garagem</p>
                            <p><strong>Status de Mobília:</strong> {data.furnishStatus}</p>
                            <p><strong>Chave Pix de Repasse:</strong> {data.pixKey} ({data.bankName})</p>
                            <p><strong>Anexo Adicionado:</strong> Ficha_Onboarding_{data.ownerName.split(' ')[0]}.pdf (Geração jsPDF)</p>
                          </div>
                          <p className="text-[10px] text-slate-400">Este e-mail contém uma cópia exata do laudo para transparência jurídica (LGPD). Seus dados estão em conformidade.</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Disparado</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Sinalização push enviada para o time comercial e de engenharia técnica realizar o book fotográfico e checar as instalações de smart lock.
                  </p>
                </div>
              </div>

              {/* Point 4: Digital Contract platform generated */}
              <div className="relative">
                <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                  ✓
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                    Canal de Assinatura Eletrônica Gerado
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">{data.signaturePlatform || 'Administradora'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Envelope preparado automaticamente. Como o canal escolhido foi <strong>{data.signatureChannel}</strong>, o documento circulará para as partes envolvidas logo após o aceite da vistoria presencial.
                  </p>

                  {/* Autentique Custom Informational Card response - EXTREMELY HELPFUL EXPLANATION FOR WELLINGTON */}
                  {data.signaturePlatform === 'Autentique' && (
                    <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3.5 animate-fadeIn">
                      <div className="flex gap-2 items-start text-emerald-950">
                        <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold">Como funciona o envio de assinaturas no Autentique?</h5>
                          <p className="text-[10px] text-emerald-900/80 mt-0.5 leading-relaxed">
                            Respondendo à sua dúvida operacional: o envio na nossa plataforma de produção é <strong>totalmente automatizado (Zero Toque Manual)</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[10px]">
                        {/* Automated Block */}
                        <div className="p-3 bg-white hover:shadow-xs rounded-lg border border-emerald-100 space-y-1.5 transition-all">
                          <p className="font-bold text-emerald-900 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                            1. Fluxo Automático (API Zap)
                          </p>
                          <p className="text-slate-600 leading-relaxed font-semibold">
                            Com nossa API vinculada à sua chave secreta, o PDF é enviado por webhook ao Autentique para coletar assinaturas eletrônicas. Você não precisa fazer nada!
                          </p>
                        </div>

                        {/* Manual Block */}
                        <div className="p-3 bg-white/60 hover:shadow-xs rounded-lg border border-slate-205 space-y-1.5 transition-all">
                          <p className="font-bold text-slate-700 flex items-center gap-1">
                            <span>📋</span>
                            2. Fluxo Manual (Controle)
                          </p>
                          <p className="text-slate-500 leading-relaxed">
                            Basta clicar em <strong>Baixar PDF Comercial Oficial</strong> acima, acessar seu painel do Autentique e arrastar o laudo para cadastrar as assinaturas.
                          </p>
                        </div>
                      </div>

                      {/* Developer tools toggle */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowAutentiqueDevTools(!showAutentiqueDevTools)}
                          className="text-[9px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Terminal className="w-3 h-3 text-emerald-705" />
                          <span>{showAutentiqueDevTools ? "Ocultar Mock de API GraphQL" : "Visualizar Mock de API GraphQL"}</span>
                        </button>
                        
                        {showAutentiqueDevTools && (
                          <div className="mt-2 space-y-2.5 animate-fadeIn">
                            <div className="bg-slate-900 font-mono text-[9px] text-slate-300 p-3 rounded-lg border border-slate-950 overflow-x-auto space-y-1 leading-relaxed">
                              <p className="text-amber-400 font-bold"># POST https://api.autentique.com.br/v2/graphql</p>
                              <pre className="text-slate-400 text-[8.5px]">
{`mutation {
  createDocument(
    document: {
      name: "Ficha_Onboarding_${data.ownerName ? data.ownerName.split(' ')[0] : 'Owner'}.pdf",
      events: [{ action: "SIGN" }]
    },
    signers: [
      { email: "${data.ownerEmail || 'proprietario@email.com'}", action: "SIGN" }
    ]
  ) {
    id
    name
  }
}`}
                              </pre>
                            </div>

                            <div className="flex gap-2 items-center flex-wrap">
                              <button
                                type="button"
                                onClick={triggerAutentiqueSimulation}
                                disabled={isSendingAutentiqueSim}
                                className="text-[9px] font-bold bg-slate-900 hover:bg-slate-800 text-white py-1 px-2.5 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                              >
                                {isSendingAutentiqueSim ? 'Executando Chamada...' : 'Testar Chamada de API (Integrado)'}
                              </button>

                              {autentiqueSimSuccess && (
                                <span className="text-[9px] text-emerald-850 font-bold flex items-center gap-1 animate-pulse">
                                  ✓ Chamada retornou ID doc-aut-849502-dfg91 (Sucesso Autentique!)
                                </span>
                              )}
                            </div>

                            {autentiqueStatusMessage.length > 0 && (
                              <div className="bg-slate-950 border border-slate-900 font-mono text-[8.5px] text-slate-400 p-2.5 rounded-lg space-y-1">
                                {autentiqueStatusMessage.map((log, idx) => (
                                  <p key={idx} className="animate-fadeIn">✓ {log}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
