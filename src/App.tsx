/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Sparkles, ChevronRight, ChevronLeft, Send, 
  Trash2, Landmark, HelpCircle, Check, AlertCircle, FilePlus2 
} from 'lucide-react';
import { PropertyOwnerData, INITIAL_FORM_DATA, SubmittedRegistration } from './types';
import FormTabs from './components/FormTabs';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import PropertyInfoForm from './components/PropertyInfoForm';
import FurnishingSpecsForm from './components/FurnishingSpecsForm';
import MaintenanceForm from './components/MaintenanceForm';
import FinancialForm from './components/FinancialForm';
import ConsentSignatureForm from './components/ConsentSignatureForm';
import AutomationDashboard from './components/AutomationDashboard';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Core Data
  const [formData, setFormData] = useState<PropertyOwnerData>(INITIAL_FORM_DATA);
  const [submissions, setSubmissions] = useState<SubmittedRegistration[]>([]);

  // Validation / Error Tracking per step
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 1. Initial Load: read draft & submitted records
  useEffect(() => {
    try {
      const persistedDraft = localStorage.getItem('owner_registration_draft');
      if (persistedDraft) {
        const parsed = JSON.parse(persistedDraft);
        // Ensure proper merging of default values
        setFormData(prev => ({ ...prev, ...parsed }));
        const date = new Date();
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        setLastSaved(formattedTime);
        triggerToast('Rascunho recuperado automaticamente do seu navegador!');
      }

      const persistedSubmissions = localStorage.getItem('owner_registrations_list');
      if (persistedSubmissions) {
        const parsedList = JSON.parse(persistedSubmissions);
        setSubmissions(parsedList);
        if (parsedList.length > 0) {
          // If registrations exist, default tab to dashboard for better flow visibility, or keep it optional
          setActiveTab('dashboard');
        }
      }
    } catch (e) {
      console.error('Failure reloading persisted data:', e);
    }
  }, []);

  // 2. Draft Auto-saver: triggers on data changes
  const updateFormData = (fields: Partial<PropertyOwnerData>) => {
    const updated = { ...formData, ...fields };
    setFormData(updated);

    // Save to localStorage
    try {
      localStorage.setItem('owner_registration_draft', JSON.stringify(updated));
      const date = new Date();
      const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      setLastSaved(formattedTime);
    } catch (e) {
      console.warn('Unable to write local draft:', e);
    }
  };

  const clearDraft = () => {
    if (confirm('Tem certeza de que deseja limpar todo o rascunho preenchido?')) {
      localStorage.removeItem('owner_registration_draft');
      setFormData(INITIAL_FORM_DATA);
      setLastSaved(null);
      setCurrentStep(1);
      setErrors({});
      triggerToast('Rascunho apagado com sucesso.');
    }
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
  };

  // Real-time validations of each section
  const getSectionValidationStatus = (): { [key: number]: boolean } => {
    const status: { [key: number]: boolean } = {};

    // Section 1: Dados Pessoais
    const s1EmailValid = formData.ownerEmail.includes('@') && formData.ownerEmail.length > 4;
    status[1] = !!(
      formData.ownerName.trim().length > 3 &&
      formData.ownerTaxId.trim().length >= 14 && // CPF has 14 chars with formatting
      s1EmailValid &&
      formData.ownerPhone.trim().length >= 13 && // (99) 9999-9999
      formData.ownerAddress.trim().length > 6 &&
      (formData.ownerIdCardFileName || formData.ownerIdCardFile)
    );

    // Section 2: Detalhes do Imóvel
    status[2] = !!(
      formData.propZip.trim().length >= 9 &&
      formData.propStreet.trim() &&
      formData.propNumber.trim() &&
      formData.propNeighborhood.trim() &&
      formData.propCityState.trim() &&
      formData.propType &&
      formData.propRooms &&
      formData.propSuites &&
      formData.propGarage &&
      formData.propSmartLock
    );

    // Section 3: Mobília e Eletros
    status[3] = !!(
      formData.furnishStatus &&
      formData.allowPets
    );

    // Section 4: Manutenção e Revisões
    status[4] = !!(
      formData.utilitiesStatus &&
      formData.chronicProblems.trim()
    );

    // Section 5: Dados Bancários
    status[5] = !!(
      formData.bankAccountHolderName.trim() &&
      formData.bankAccountHolderTaxId.trim().length >= 14 &&
      formData.bankName &&
      formData.bankAccountType &&
      formData.bankAgencyAndAccount.trim() &&
      formData.pixKey.trim()
    );

    // Section 6: Termos e Assinaturas
    status[6] = !!(
      formData.lgpdConsent &&
      formData.signatureChannel &&
      (formData.signatureDrawing || formData.signatureFileName || formData.signatureFile)
    );

    return status;
  };

  const pathValidation = getSectionValidationStatus();

  // Validate step fields strictly before moving forward
  const validateStep = (stepNumber: number): boolean => {
    const currentErrors: { [key: string]: string } = {};
    let isValid = true;

    if (stepNumber === 1) {
      if (!formData.ownerName.trim()) {
        currentErrors.ownerName = 'O nome completo do proprietário é obrigatório.';
        isValid = false;
      }
      if (!formData.ownerTaxId.trim()) {
        currentErrors.ownerTaxId = 'O CPF ou CNPJ é obrigatório para identificação.';
        isValid = false;
      }
      if (!formData.ownerEmail.trim() || !formData.ownerEmail.includes('@')) {
        currentErrors.ownerEmail = 'Por favor, informe um e-mail válido com @.';
        isValid = false;
      }
      if (!formData.ownerPhone.trim() || formData.ownerPhone.length < 10) {
        currentErrors.ownerPhone = 'Informe um telefone de contato com DDD válido.';
        isValid = false;
      }
      if (!formData.ownerAddress.trim()) {
        currentErrors.ownerAddress = 'O endereço residencial atual do proprietário é obrigatório.';
        isValid = false;
      }
      if (!formData.ownerIdCardFileName && !formData.ownerIdCardFile) {
        currentErrors.ownerIdCardFile = 'Por favor, anexe uma cópia/foto legível do seu RG ou CNH eletronicamente.';
        isValid = false;
      }
    }

    if (stepNumber === 2) {
      if (!formData.propZip.trim() || formData.propZip.length < 8) {
        currentErrors.propZip = 'Insira um CEP válido para pesquisa geográfica.';
        isValid = false;
      }
      if (!formData.propStreet.trim()) {
        currentErrors.propStreet = 'O logradouro é obrigatório. Insira ou clique em "Buscar" pelo CEP.';
        isValid = false;
      }
      if (!formData.propNumber.trim()) {
        currentErrors.propNumber = 'O número do imóvel é indispensável.';
        isValid = false;
      }
      if (!formData.propNeighborhood.trim()) {
        currentErrors.propNeighborhood = 'Insira o Bairro correto do imóvel.';
        isValid = false;
      }
      if (!formData.propCityState.trim()) {
        currentErrors.propCityState = 'Preencha com a Cidade e Estado corretos (Ex: São Paulo / SP).';
        isValid = false;
      }
      if (!formData.propType) {
        currentErrors.propType = 'Selecione a categoria de imóvel adequada.';
        isValid = false;
      }
      if (!formData.propRooms) {
        currentErrors.propRooms = 'Informe o número de quartos na acomodação.';
        isValid = false;
      }
      if (!formData.propSuites) {
        currentErrors.propSuites = 'Informe a quantidade de suítes.';
        isValid = false;
      }
      if (!formData.propGarage) {
        currentErrors.propGarage = 'Informe o número de vagas disponíveis de garagem.';
        isValid = false;
      }
      if (!formData.propSmartLock) {
        currentErrors.propSmartLock = 'Sinalize o tipo de fechadura do imóvel.';
        isValid = false;
      }
    }

    if (stepNumber === 3) {
      if (!formData.furnishStatus) {
        currentErrors.furnishStatus = 'Selecione uma das opções sobre o nível de mobília.';
        isValid = false;
      }
      if (!formData.allowPets) {
        currentErrors.allowPets = 'Sinalize se o imóvel autoriza a permanência de animais de estimação.';
        isValid = false;
      }
    }

    if (stepNumber === 4) {
      if (!formData.utilitiesStatus) {
        currentErrors.utilitiesStatus = 'Por segurança imobiliária, selecione o estado elétrico/hidráulico.';
        isValid = false;
      }
      if (!formData.chronicProblems.trim()) {
        currentErrors.chronicProblems = 'Caso não possua problemas, digite "Nada consta" ou clique no botão rápido.';
        isValid = false;
      }
    }

    if (stepNumber === 5) {
      if (!formData.bankAccountHolderName.trim()) {
        currentErrors.bankAccountHolderName = 'O nome do titular é obrigatório para repasse.';
        isValid = false;
      }
      if (!formData.bankAccountHolderTaxId.trim() || formData.bankAccountHolderTaxId.length < 11) {
        currentErrors.bankAccountHolderTaxId = 'Insira o CPF ou CNPJ do titular da conta.';
        isValid = false;
      }
      if (!formData.bankName) {
        currentErrors.bankName = 'Selecione o seu banco para evitar devoluções de TED/Pix.';
        isValid = false;
      }
      if (!formData.bankAccountType) {
        currentErrors.bankAccountType = 'Sinalize entre Corrente ou Poupança.';
        isValid = false;
      }
      if (!formData.bankAgencyAndAccount.trim()) {
        currentErrors.bankAgencyAndAccount = 'A agência e o número da conta com dígito verificador são obrigatórios.';
        isValid = false;
      }
      if (!formData.pixKey.trim()) {
        currentErrors.pixKey = 'Digite a sua chave Pix para repasses rápidos e flexíveis.';
        isValid = false;
      }
    }

    if (stepNumber === 6) {
      if (!formData.lgpdConsent) {
        currentErrors.lgpdConsent = 'É obrigatório aceitar o termo de consentimento LGPD para continuar.';
        isValid = false;
      }
      if (!formData.signatureChannel) {
        currentErrors.signatureChannel = 'Selecione o canal de preferência de envio do contrato.';
        isValid = false;
      }
      if (!formData.signatureDrawing && !formData.signatureFileName && !formData.signatureFile) {
        alert('Por favor, assine digitalmente desenhando na tela ou enviando a sua rubrica.');
        isValid = false;
      }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Step 6 completed: run submission!
        handleSubmitForm();
      }
    } else {
      triggerToast('Sinalizamos alguns campos obrigatórios que precisam ser preenchidos incorretamente.');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitForm = () => {
    // Collect and format submission
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    const newRegistration: SubmittedRegistration = {
      id: `REG-${Date.now()}`,
      timestamp: formattedDate,
      data: { ...formData },
      status: 'Pendente',
    };

    const updatedSubmissions = [newRegistration, ...submissions];
    setSubmissions(updatedSubmissions);
    
    // Save to localStorage
    localStorage.setItem('owner_registrations_list', JSON.stringify(updatedSubmissions));
    
    // Clear the active draft
    localStorage.removeItem('owner_registration_draft');
    setFormData(INITIAL_FORM_DATA);
    setLastSaved(null);
    setCurrentStep(1);
    setErrors({});

    // Switch view to dashboard
    setActiveTab('dashboard');
    triggerToast('Cadastro SUBMETIDO com sucesso! Automações operacionais ativadas.');
  };

  const handleRemoveSubmission = (id: string) => {
    if (confirm('Deseja realmente excluir este registro imobiliário do seu painel?')) {
      const filtered = submissions.filter(s => s.id !== id);
      setSubmissions(filtered);
      localStorage.setItem('owner_registrations_list', JSON.stringify(filtered));
      triggerToast('Registro imobiliário removido com sucesso.');
    }
  };

  const executeQuickDemoFill = () => {
    // Instantly fills the active form with clean test values for demonstrations
    updateFormData({
      ownerName: 'Wellington Rodovalho da Silva',
      ownerTaxId: '123.456.789-00',
      ownerEmail: 'Wellington.Rodovalho@gmail.com',
      ownerPhone: '(11) 98765-4321',
      ownerAddress: 'Avenida Brigadeiro Luís Antônio, 2300, Apto 91',
      ownerIdCardFileName: 'doc_identidade_wellington.pdf',
      propZip: '01415-000',
      propStreet: 'Alameda Lorena',
      propNumber: '1240',
      propComplement: 'Bloco A, Apto 54',
      propNeighborhood: 'Jardins',
      propCityState: 'São Paulo / SP',
      propType: 'Apartamento',
      propCondoName: 'Condomínio Edifício Florença',
      propRooms: '2',
      propSuites: '1',
      propGarage: '1',
      propSmartLock: 'Sim',
      furnishStatus: 'Totalmente Mobiliado',
      propAppliances: ['Geladeira', 'Fogão/Cooktop', 'Smart TV', 'Ar-condicionado'],
      allowPets: 'Sim',
      lastPainting: 'Há menos de 6 meses',
      utilitiesStatus: 'Revisadas e 100% funcionais',
      acMaintenance: 'Higienizados recentemente (menos de 6 meses)',
      chronicProblems: 'Nada consta',
      bankAccountHolderName: 'Wellington Rodovalho da Silva',
      bankAccountHolderTaxId: '123.456.789-00',
      bankName: 'Banco Nubank S.A.',
      bankAccountType: 'Conta Corrente',
      bankAgencyAndAccount: 'Agência 0001 / Conta 456987-2',
      pixKey: 'Wellington.Rodovalho@gmail.com',
      lgpdConsent: true,
      signatureChannel: 'E-mail',
      signaturePlatform: 'ZapSign',
    });
    triggerToast('Preenchimento automático inteligente executado para testes rápidos!');
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-850 text-white text-xs py-3 px-4 rounded-xl shadow-lg flex items-center gap-2 max-w-sm animate-bounce transition-all">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Main Bar / Brand Header */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-6 shrink-0 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h1 className="text-base font-extrabold tracking-tight text-slate-905">
              Portal de Cadastro do Proprietário
            </h1>
            <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full font-bold hidden sm:inline">
              V2.5
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Form vs Dashboard Tab toggler */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-205">
              <button
                onClick={() => {
                  setActiveTab('form');
                  setErrors({});
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Formulário Cadastro
              </button>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Fluxo Automação</span>
                {submissions.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {submissions.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Demo Fill button to help Wellington test easily */}
            {activeTab === 'form' && (
              <button
                onClick={executeQuickDemoFill}
                type="button"
                className="text-[10px] font-bold text-emerald-800 bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                title="Preencher com dados exemplo para Wellington"
              >
                <Sparkles className="w-3 h-3 text-emerald-700 animate-pulse" />
                <span>Simular Preenchimento</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {activeTab === 'form' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Horizontal Tabs at the top of the form */}
            <FormTabs
              currentStep={currentStep}
              setStep={(step) => {
                // Verify if we can skip directly
                if (step < currentStep || validateStep(currentStep)) {
                  setCurrentStep(step);
                  setErrors({});
                } else {
                  triggerToast('Preencha os campos obrigatórios da seção corrente primeiro.');
                }
              }}
              validationStatus={pathValidation}
              onClearDraft={clearDraft}
              lastSaved={lastSaved}
            />

            {/* Editable step panel and back/forward interactions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
                
                {/* Dynamically active form component depending on index */}
                {currentStep === 1 && (
                  <PersonalDetailsForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <PropertyInfoForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {currentStep === 3 && (
                  <FurnishingSpecsForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <MaintenanceForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {currentStep === 5 && (
                  <FinancialForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {currentStep === 6 && (
                  <ConsentSignatureForm
                    data={formData}
                    updateData={updateFormData}
                    errors={errors}
                  />
                )}

                {/* Back and Next navigation triggers */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
                  
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      currentStep === 1
                        ? 'opacity-30 border-slate-200 text-slate-405 pointer-events-none'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Seção Anterior</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (i < currentStep || validateStep(currentStep)) {
                            setCurrentStep(i);
                            setErrors({});
                          }
                        }}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                          i === currentStep
                            ? 'bg-emerald-950 scale-120'
                            : pathValidation[i]
                              ? 'bg-emerald-500'
                              : 'bg-slate-200 hover:bg-slate-350'
                        }`}
                        title={`Navegar para Seção ${i}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 py-2 px-5 bg-emerald-950 text-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-900 transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
                  >
                    <span>{currentStep === 6 ? 'Finalizar e Ativar Automação' : 'Avançar Seção'}</span>
                    {currentStep === 6 ? (
                      <Send className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Informative advice for help */}
              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Dúvidas no preenchimento? Fale com nosso suporte jurídico pelo telefone (11) 3244-3015.
                </span>
              </div>

            </div>

          </div>
        ) : (
          /* Automation outcome panel */
          <AutomationDashboard
            registrations={submissions}
            onAddNew={() => {
              setActiveTab('form');
              setCurrentStep(1);
            }}
            onRemove={handleRemoveSubmission}
            userEmail="Wellington.Rodovalho@gmail.com"
          />
        )}

      </main>

      {/* Humble aesthetic footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 shrink-0">
        <p className="font-semibold text-slate-500">Administradora Comercial & Convenções Digitais</p>
        <p className="mt-1">Padrão em conformidade com o Regulamento de Locações Prediais Urbano e regras do Comitê de Direito Digital.</p>
      </footer>

    </div>
  );
}
