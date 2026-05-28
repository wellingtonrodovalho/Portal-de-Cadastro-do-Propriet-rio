export interface PropertyOwnerData {
  // SEÇÃO 1: Dados Pessoais do Proprietário
  ownerName: string;
  ownerTaxId: string; // CPF or CNPJ
  ownerNationality: string;
  ownerMaritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável' | '';
  ownerMarriageRegime?: string; // Regime de bens
  ownerProfession: string;
  ownerBirthDate: string; // YYYY-MM-DD
  ownerRG: string;
  ownerRgIssuer: string; // Órgão Expedidor
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  ownerIdCardFile: File | null;
  ownerIdCardFileName?: string;

  // SEÇÃO 2: Informações do Imóvel (Localização e Características)
  propZip: string;
  propStreet: string;
  propNumber: string;
  propComplement: string;
  propNeighborhood: string;
  propCityState: string;
  propType: 'Apartamento' | 'Casa' | 'Casa em Condomínio' | 'Studio/Flat' | 'Outro' | '';
  propCondoName: string;
  propRooms: '1' | '2' | '3' | '4+' | '';
  propSuites: '0' | '1' | '2' | '3+' | '';
  propGarage: '0' | '1' | '2' | '3+' | '';
  propSmartLock: 'Sim' | 'Não' | '';

  // SEÇÃO 3: Mobília, Eletros e Comodidades
  furnishStatus: 'Totalmente Mobiliado' | 'Semimobiliado (apenas armários fixos)' | 'Sem mobília' | '';
  propAppliances: string[]; // Geladeira, Fogão/Cooktop, Micro-ondas, Máquina de lavar, Smart TV, Ar-condicionado, Nenhum
  allowPets: 'Sim' | 'Não' | 'Apenas de pequeno porte' | '';

  // SEÇÃO 4: Histórico de Manutenção e Estado Atual
  lastPainting: 'Há menos de 6 meses' | 'Há menos de 1 ano' | 'Há mais de 2 anos' | 'Necessita de pintura' | '';
  utilitiesStatus: 'Revisadas e 100% funcionais' | 'Apresenta pequenos detalhes/vazamentos' | 'Necessita de revisão urgente' | '';
  acMaintenance: 'Higienizados recentemente (menos de 6 meses)' | 'Próximo do prazo de manutenção' | 'Não possuem manutenção recente' | '';
  chronicProblems: string;
  maintenanceDocsFiles: { name: string; size: string; content?: string }[]; // Mock-friendly uploads with metadata

  // SEÇÃO 5: Dados Bancários para Repasse Financeiro
  bankAccountHolderName: string;
  bankAccountHolderTaxId: string;
  bankName: string;
  bankAccountType: 'Conta Corrente' | 'Conta Poupança' | '';
  bankAgencyAndAccount: string;
  pixKey: string;

  // SEÇÃO 6: Termos de Consentimento e Assinatura Digital
  lgpdConsent: boolean;
  signatureChannel: 'WhatsApp (via link seguro)' | 'E-mail' | '';
  signaturePlatform: string;
  signatureDrawing: string | null; // Base64 encoding of signature if drawn on screen
  signatureFile: File | null;
  signatureFileName?: string;
}

export const INITIAL_FORM_DATA: PropertyOwnerData = {
  ownerName: '',
  ownerTaxId: '',
  ownerNationality: '',
  ownerMaritalStatus: '',
  ownerMarriageRegime: '',
  ownerProfession: '',
  ownerBirthDate: '',
  ownerRG: '',
  ownerRgIssuer: '',
  ownerEmail: '',
  ownerPhone: '',
  ownerAddress: '',
  ownerIdCardFile: null,
  ownerIdCardFileName: '',

  propZip: '',
  propStreet: '',
  propNumber: '',
  propComplement: '',
  propNeighborhood: '',
  propCityState: '',
  propType: '',
  propCondoName: '',
  propRooms: '',
  propSuites: '',
  propGarage: '',
  propSmartLock: '',

  furnishStatus: '',
  propAppliances: [],
  allowPets: '',

  lastPainting: '',
  utilitiesStatus: '',
  acMaintenance: '',
  chronicProblems: 'Nada consta',
  maintenanceDocsFiles: [],

  bankAccountHolderName: '',
  bankAccountHolderTaxId: '',
  bankName: '',
  bankAccountType: '',
  bankAgencyAndAccount: '',
  pixKey: '',

  lgpdConsent: false,
  signatureChannel: '',
  signaturePlatform: '',
  signatureDrawing: null,
  signatureFile: null,
  signatureFileName: '',
};

export interface SubmittedRegistration {
  id: string;
  timestamp: string;
  data: PropertyOwnerData;
  status: 'Pendente' | 'Validação Técnica' | 'Aprovado';
}

export const LIST_OF_BANKS = [
  'Banco do Brasil S.A.',
  'Banco Bradesco S.A.',
  'Itaú Unibanco S.A.',
  'Banco Santander (Brasil) S.A.',
  'Caixa Econômica Federal',
  'Banco Nubank S.A.',
  'Banco Inter S.A.',
  'C6 Bank',
  'Banco BTG Pactual S.A.',
  'Original S.A.',
  'Banco Safra S.A.',
  'Outro / Cooperativa',
];
