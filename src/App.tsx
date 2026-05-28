/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Sparkles, ChevronRight, ChevronLeft, Send, 
  Trash2, Landmark, HelpCircle, Check, AlertCircle, FilePlus2,
  Lock, Unlock, ShieldCheck, CheckCircle2, FileDown, RotateCcw
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
import { downloadRealPDF } from './utils';

export default function App() {
  // Authentication & Restricted access states
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [customPassword, setCustomPassword] = useState<string>('');
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  
  // Custom password registration inputs
  const [registerCreci, setRegisterCreci] = useState<string>('');
  const [registerNewPassword, setRegisterNewPassword] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');

  // Navigation states
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Core Data
  const [formData, setFormData] = useState<PropertyOwnerData>(INITIAL_FORM_DATA);
  const [submissions, setSubmissions] = useState<SubmittedRegistration[]>([]);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<PropertyOwnerData | null>(null);

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
      }

      // Check if logged in as administrator (Wellington Rodovalho Fonseca)
      const adminVerifiedValue = localStorage.getItem('owner_admin_verified') === 'true';
      setIsAdmin(adminVerifiedValue);

      // Fetch custom configured password
      const savedPass = localStorage.getItem('owner_admin_custom_password') || '';
      setCustomPassword(savedPass);
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
      formData.ownerRG.trim() &&
      formData.ownerRgIssuer.trim() &&
      formData.ownerBirthDate &&
      formData.ownerNationality.trim() &&
      formData.ownerMaritalStatus &&
      (!['Casado(a)', 'União Estável'].includes(formData.ownerMaritalStatus) || (formData.ownerMarriageRegime || '').trim()) &&
      formData.ownerProfession.trim() &&
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
      if (!formData.ownerRG.trim()) {
        currentErrors.ownerRG = 'O número do RG é obrigatório.';
        isValid = false;
      }
      if (!formData.ownerRgIssuer.trim()) {
        currentErrors.ownerRgIssuer = 'O Órgão Expedidor do RG é obrigatório.';
        isValid = false;
      }
      if (!formData.ownerBirthDate) {
        currentErrors.ownerBirthDate = 'A data de nascimento é obrigatória.';
        isValid = false;
      }
      if (!formData.ownerNationality.trim()) {
        currentErrors.ownerNationality = 'A nacionalidade é obrigatória.';
        isValid = false;
      }
      if (!formData.ownerMaritalStatus) {
        currentErrors.ownerMaritalStatus = 'O estado civil é obrigatório.';
        isValid = false;
      } else if ((formData.ownerMaritalStatus === 'Casado(a)' || formData.ownerMaritalStatus === 'União Estável') && !(formData.ownerMarriageRegime || '').trim()) {
        currentErrors.ownerMarriageRegime = 'O regime de bens é obrigatório para casados ou união estável.';
        isValid = false;
      }
      if (!formData.ownerProfession.trim()) {
        currentErrors.ownerProfession = 'A profissão é obrigatória.';
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
    
    // Capture data for success receipt page
    setSubmittedData({ ...formData });
    setIsSubmittedSuccess(true);

    // Clear the active draft
    localStorage.removeItem('owner_registration_draft');
    setFormData(INITIAL_FORM_DATA);
    setLastSaved(null);
    setCurrentStep(1);
    setErrors({});

    triggerToast('Cadastro submetido com sucesso! Seu laudo em PDF foi gerado.');
  };

  const handleAdminVerify = (password: string) => {
    const cleanPass = password.trim();
    const cleanPassLower = cleanPass.toLowerCase();
    
    // Retrieve custom stored password
    const storedCustomPass = localStorage.getItem('owner_admin_custom_password') || '';
    
    if (
      cleanPassLower === 'wellington2026' ||
      (storedCustomPass && cleanPass === storedCustomPass) ||
      (storedCustomPass && cleanPassLower === storedCustomPass.toLowerCase())
    ) {
      setIsAdmin(true);
      localStorage.setItem('owner_admin_verified', 'true');
      setActiveTab('dashboard');
      setShowAdminLoginModal(false);
      setAdminPasswordInput('');
      setLoginError('');
      triggerToast('Autenticação do Administrador com sucesso! Bem-vindo, Wellington Rodovalho Fonseca.');
    } else {
      setLoginError('Senha de Administrador incorreta ou inválida!');
    }
  };

  const handleRegisterPersonalPassword = (creciOrCpf: string, newPass: string) => {
    const cleanNumbers = creciOrCpf.replace(/\D/g, ''); // Extract numbers
    const inputCleaned = creciOrCpf.trim().toLowerCase();
    
    // Validate if matching Wellington's details from CRECI (42695) or CPF (269.462.701-34)
    const isValidCredential = 
      cleanNumbers.includes('42695') || 
      inputCleaned.includes('creci-go 42695') ||
      cleanNumbers.includes('26946270134') || 
      inputCleaned.includes('269.462.701-34') ||
      cleanNumbers.includes('269462701'); // CPF start seq
      
    if (!isValidCredential) {
      setRegisterError('Dados de validação profissional incorretos! Digite seu CRECI (CRECI-GO 42695) ou o seu CPF (269.462.701-34) para confirmar que é o Wellington.');
      return;
    }
    
    const trimmedPass = newPass.trim();
    if (trimmedPass.length < 4) {
      setRegisterError('Sua nova senha pessoal deve conter pelo menos 4 caracteres.');
      return;
    }
    
    // Persist custom password
    localStorage.setItem('owner_admin_custom_password', trimmedPass);
    setCustomPassword(trimmedPass);
    setRegisterError('');
    setRegisterCreci('');
    setRegisterNewPassword('');
    setModalTab('login');
    setAdminPasswordInput(trimmedPass); // Auto fill for the screen
    triggerToast('Sua nova senha pessoal foi cadastrada com sucesso! Clique em Confirmar para entrar.');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('owner_admin_verified');
    setActiveTab('form');
    setIsSubmittedSuccess(false);
    triggerToast('Sessão encerrada. Painel ocultado com sucesso.');
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
      ownerName: 'Wellington Rodovalho Fonseca',
      ownerTaxId: '123.456.789-00',
      ownerNationality: 'Brasileiro(a)',
      ownerMaritalStatus: 'Casado(a)',
      ownerMarriageRegime: 'Comunhão Parcial de Bens',
      ownerProfession: 'Corretor de Imóveis',
      ownerBirthDate: '1985-15-05',
      ownerRG: '5482613',
      ownerRgIssuer: 'SSP-GO',
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
      bankAccountHolderName: 'Wellington Rodovalho Fonseca',
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
              Cadastro do Proprietário e Imóveis
            </h1>
            <span className="text-[10px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full font-bold hidden sm:inline">
              V2.5
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Form vs Dashboard Tab toggler (Only visible to verified admin) */}
            {isAdmin && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-205 items-center">
                <button
                  onClick={() => {
                    setIsSubmittedSuccess(false);
                    setActiveTab('form');
                    setErrors({});
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'form' && !isSubmittedSuccess
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Formulário Cadastro
                </button>
                
                <button
                  onClick={() => {
                    setIsSubmittedSuccess(false);
                    setActiveTab('dashboard');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Unlock className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>Fluxo Automação</span>
                  {submissions.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {submissions.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Lock/Logout button when logged in as Admin */}
            {isAdmin && (
              <button
                onClick={handleAdminLogout}
                className="text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                title="Deslogar e bloquear painel administrativo"
              >
                <Lock className="w-3 h-3 text-rose-600 animate-pulse" />
                <span>Bloquear</span>
              </button>
            )}

            {/* Quick Demo Fill button to help Wellington test easily */}
            {activeTab === 'form' && !isSubmittedSuccess && (
              <button
                onClick={executeQuickDemoFill}
                type="button"
                className="text-[10px] font-bold text-emerald-800 bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                title="Preencher com dados exemplo para Wellington Rodovalho Fonseca"
              >
                <Sparkles className="w-3 h-3 text-emerald-700 animate-pulse" />
                <span>Simular Preenchimento</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 animate-fadeIn">
        
        {isSubmittedSuccess && submittedData ? (
          /* Beautiful digital receipt view for the owner who just completed the form */
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 text-center space-y-6 py-12 relative overflow-hidden">
            
            {/* Top design accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400" />

            {/* Success checkmark graphic with heartbeat halo */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
              <CheckCircle2 className="w-8 h-8 text-emerald-600 relative z-10 animate-scaleUp" />
            </div>

            {/* Title & Onboarding confirmation */}
            <div className="space-y-1.5">
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Cadastro Enviado com Sucesso
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight pt-1">
                Seu Imóvel está Pronto para Homologação!
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed max-w-lg mx-auto">
                Prezado(a) <span className="font-bold text-slate-800">{submittedData.ownerName}</span>, confirmamos o recebimento seguro de sua ficha cadastral. Os dados operacionais, de manutenção e de repasses financeiros foram arquivados para homologação da equipe técnica.
              </p>
            </div>

            {/* Summary details container */}
            <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl text-left text-xs space-y-2.5 max-w-md mx-auto shadow-inner">
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400 font-medium">Controle de Onboarding:</span>
                <span className="font-mono font-bold text-slate-800">REG-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <p><strong>Proprietário:</strong> <span className="text-slate-800">{submittedData.ownerName}</span></p>
                <p><strong>CPF/CNPJ:</strong> <span className="text-slate-800">{submittedData.ownerTaxId}</span></p>
                <p><strong>Imóvel:</strong> <span className="text-slate-805">{submittedData.propStreet}, No {submittedData.propNumber} - {submittedData.propNeighborhood}</span></p>
                <p><strong>Chave Pix:</strong> <span className="text-slate-800">{submittedData.pixKey} ({submittedData.bankName})</span></p>
              </div>

              <div className="border-t border-slate-200/50 pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => downloadRealPDF(submittedData)}
                  className="w-full text-xs font-bold text-white bg-emerald-950 hover:bg-emerald-900 py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/10 hover:scale-[1.01]"
                >
                  <FileDown className="w-4 h-4 text-emerald-300" />
                  <span>Baixar Minha Ficha Oficial em PDF</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  Laudo expedido eletronicamente em conformidade com o Artigo 7 da Lei Geral de Proteção de Dados (LGPD).
                </p>
              </div>
            </div>

            {/* Instruction timeline */}
            <div className="max-w-md mx-auto text-left border-l-2 border-emerald-500 pl-4 py-1.5 space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Próximos Passos Operacionais:</h4>
              <p className="leading-relaxed">
                <strong className="text-slate-800">1. Vistoria e Book Fotográfico:</strong> Faremos o agendamento da visita presencial de engenharia para capturar as mídias da acomodação.
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-800">2. Assinatura do Contrato:</strong> O envelope será enviado por <span className="font-bold text-slate-800">{submittedData.signatureChannel}</span> via <span className="font-bold text-emerald-800">{submittedData.signaturePlatform || 'plataforma homologada'}</span> para formalizar as responsabilidades comerciais jurídicas.
              </p>
            </div>

            {/* Screen triggers */}
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => {
                  setIsSubmittedSuccess(false);
                  setSubmittedData(null);
                  setCurrentStep(1);
                  setErrors({});
                }}
                className="text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 py-2.5 px-4 rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Cadastrar Outro Imóvel
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmittedSuccess(false);
                    setActiveTab('dashboard');
                  }}
                  className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-950 py-2.5 px-4 rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Painel de Automação
                </button>
              )}
            </div>

          </div>
        ) : activeTab === 'form' ? (
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
                    <span>{currentStep === 6 ? 'Finalizar e Enviar Ficha' : 'Avançar Seção'}</span>
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
                  Dúvidas no preenchimento? Fale comigo pelo telefone (62) 99151-4568.
                </span>
              </div>

            </div>

          </div>
        ) : (
          /* Automation outcome panel (ONLY visible for verified admin Wellington Rodovalho Fonseca) */
          isAdmin ? (
            <AutomationDashboard
              registrations={submissions}
              onAddNew={() => {
                setActiveTab('form');
                setCurrentStep(1);
              }}
              onRemove={handleRemoveSubmission}
              userEmail="Wellington.Rodovalho@gmail.com"
            />
          ) : (
            <div className="max-w-md mx-auto text-center py-16 space-y-4">
              <Lock className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500 font-semibold">Este painel operacional necessita de privilégios administrativos.</p>
              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="text-xs bg-slate-900 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Autenticar Administrador
              </button>
            </div>
          )
        )}

      </main>

      {/* Admin Verification Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 sm:p-8 space-y-5 relative animate-scaleUp">
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
                <Lock className="w-5 h-5 text-emerald-700 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-none">Acesso Restrito - Wellington Rodovalho Fonseca</h3>
              <p className="text-[11px] text-slate-400">
                Painel administrativo de controle de automação e repasses de convênio.
              </p>
            </div>

            {/* Premium Selector Tabs inside the modal */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-205 text-xs">
              <button
                type="button"
                onClick={() => {
                  setModalTab('login');
                  setLoginError('');
                  setRegisterError('');
                }}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                  modalTab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalTab('register');
                  setLoginError('');
                  setRegisterError('');
                }}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                  modalTab === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Cadastrar Senha
              </button>
            </div>

            {modalTab === 'login' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdminVerify(adminPasswordInput);
                }}
                className="space-y-4"
              >
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sua Senha</label>
                    <button
                      type="button"
                      onClick={() => setModalTab('register')}
                      className="text-[10px] font-bold text-emerald-700 hover:underline"
                    >
                      Criar Senha Pessoal?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-slate-50/50"
                    autoFocus
                  />
                  
                  {loginError && (
                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 pt-1 animate-bounce">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{loginError}</span>
                    </p>
                  )}

                  {customPassword && (
                    <p className="text-[9.5px] text-emerald-700 font-medium leading-normal pt-1.5 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/30">
                      🔒 Você já possui uma senha pessoal cadastrada de forma segura em seu navegador.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminPasswordInput('');
                      setLoginError('');
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-950 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterPersonalPassword(registerCreci, registerNewPassword);
                }}
                className="space-y-4 text-left"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1. Identificação de Wellington (CPF ou CRECI)</label>
                    <input
                      type="text"
                      placeholder="CRECI-GO 42695 ou CPF"
                      value={registerCreci}
                      onChange={(e) => {
                        setRegisterCreci(e.target.value);
                        setRegisterError('');
                      }}
                      className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-slate-50/50"
                      autoFocus
                    />
                    <p className="text-[9.5px] text-slate-400 leading-snug">
                      Informe seu CRECI (<strong className="text-slate-605">42695</strong>) ou CPF (<strong className="text-slate-605">269.462.701-34</strong>) para provar sua titularidade e liberar o cadastro.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">2. Defina sua Senha Pessoal</label>
                    <input
                      type="password"
                      placeholder="Mínimo 4 caracteres"
                      value={registerNewPassword}
                      onChange={(e) => {
                        setRegisterNewPassword(e.target.value);
                        setRegisterError('');
                      }}
                      className="w-full text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all bg-slate-50/50"
                    />
                  </div>

                  {registerError && (
                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 pt-0.5 leading-normal">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{registerError}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalTab('login');
                      setRegisterError('');
                    }}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-950 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                  >
                    Salvar Senha
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Humble aesthetic footer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-xs text-slate-500 shrink-0">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center border-b border-slate-100 pb-6">
            
            {/* Col 1: Broker Info */}
            <div className="space-y-1.5 flex flex-col items-center">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Corretor de Imóveis</h4>
              <p className="text-[11px] font-semibold text-slate-700">WELLINGTON RODOVALHO FONSECA</p>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <p><span className="font-medium text-slate-500">CRECI:</span> <strong className="text-slate-600">CRECI-GO 42695</strong></p>
                <p><span className="font-medium text-slate-500">CNAI:</span> <strong className="text-slate-600">54826</strong></p>
                <p><span className="font-medium text-slate-500">CNAE:</span> <strong className="text-slate-600">6821-8/02</strong> - Corretagem de Imóveis</p>
              </div>
            </div>

            {/* Col 2: Financial Key */}
            <div className="space-y-1.5 flex flex-col items-center">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Canal Oficial Financeiro</h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                Para repasses, reservas e depósitos de caução:
              </p>
              <div className="bg-emerald-50/50 border border-emerald-100 px-2.5 py-1.5 rounded-xl inline-block mt-1">
                <p className="text-[10px] font-bold text-emerald-950 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Chave Pix:</span> 
                  <strong className="font-mono select-all text-emerald-900">reservas@alugagoias.com.br</strong>
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-center text-[10px] text-slate-400">
            <p className="font-semibold text-slate-500 flex items-center justify-center gap-1.5">
              <span>Wellington Rodovalho Fonseca — Corretor de Imóveis</span>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="p-1 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Acesso Restrito"
                >
                  <Lock className="w-3 h-3" />
                </button>
              )}
            </p>
            <p className="max-w-2xl leading-normal">Em conformidade com a Lei do Inquilinato (Lei nº 8.245/91) e a Lei Geral de Proteção de Dados (LGPD).</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
