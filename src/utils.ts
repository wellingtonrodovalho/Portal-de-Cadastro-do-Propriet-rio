// Formatting and mask utilities for Portuguese input fields

export function maskCEP(value: string): string {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
}

export function maskCPF_CNPJ(value: string): string {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 11) {
    // CPF: 999.999.999-99
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ: 99.999.999/9999-99
    return clean
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
}

export function maskPhone(value: string): string {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 10) {
    // (99) 9999-9999
    return clean
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // (99) 99999-9999
    return clean
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Generate raw simulated PDF preview / Data extraction layout
export function generateMockPDF(data: any): string {
  // Returns a readable textual layout representing a generated PDF summary
  return `
========================================================================
             RELATÓRIO DE ONBOARDING - PROPRIETÁRIO PARCEIRO
========================================================================
ID Controle: PAR-2026-${Math.floor(1000 + Math.random() * 9000)}
Data/Hora Emissão: 21/05/2026 - 17:35 (UTC)
Status: CADASTRO CONCLUÍDO (Aguardando homologação operacional)

------------------------------------------------------------------------
SEÇÃO 1: DADOS PESSOAIS DO PROPRIETÁRIO
------------------------------------------------------------------------
Proprietário: ${data.ownerName || 'Não preenchido'}
CPF/CNPJ: ${data.ownerTaxId || 'Não preenchido'}
E-mail principal: ${data.ownerEmail || 'Não preenchido'}
Telefone/WhatsApp: ${data.ownerPhone || 'Não preenchido'}
Residência Atual: ${data.ownerAddress || 'Não preenchido'}
Comprovante Identidade: ${data.ownerIdCardFileName || 'Enviado eletronicamente'}

------------------------------------------------------------------------
SEÇÃO 2: INFORMAÇÕES DO IMÓVEL (LOCALIZAÇÃO E CARACTERÍSTICAS)
------------------------------------------------------------------------
Endereço do Imóvel:
   CEP: ${data.propZip || 'Não preenchido'}
   Rua: ${data.propStreet || 'Não preenchido'}, Nº ${data.propNumber || 'S/N'}
   Bairro: ${data.propNeighborhood || 'Não preenchido'}
   Cidade/Estado: ${data.propCityState || 'Não preenchido'}
   Complemento: ${data.propComplement || 'Não consta'}

Características:
   Tipo de Imóvel: ${data.propType || 'Não preenchido'}
   Condomínio/Edifício: ${data.propCondoName || 'Não aplicável'}
   Distribuição: ${data.propRooms} Quartos | ${data.propSuites} Suítes | ${data.propGarage} Garagem
   Fechadura Digital / Smart Lock: ${data.propSmartLock || 'Não especificado'}

------------------------------------------------------------------------
SEÇÃO 3: MOBÍLIA, ELETROS E COMODIDADES
------------------------------------------------------------------------
Status de Mobília: ${data.furnishStatus || 'Não especificado'}
Eletrodomésticos Inclusos: ${data.propAppliances?.join(', ') || 'Nenhum'}
Política Pet Friendly (Aceita Pets?): ${data.allowPets || 'Não especificado'}

------------------------------------------------------------------------
SEÇÃO 4: HISTÓRICO DE MANUTENÇÃO E ESTADO ATUAL
------------------------------------------------------------------------
Última Pintura Geral: ${data.lastPainting || 'Não especificado'}
Instalações Elétricas e Hidráulicas: ${data.utilitiesStatus || 'Não especificado'}
Limpeza do Ar Condicionado: ${data.acMaintenance || 'Não aplicável / Não especificado'}
Problemas Crônicos Relatados: ${data.chronicProblems || 'Nada consta'}
Documentos de Vistoria/Fotos: ${data.maintenanceDocsFiles?.length > 0 ? `${data.maintenanceDocsFiles.length} arquivos anexos` : 'Não enviados'}

------------------------------------------------------------------------
SEÇÃO 5: DADOS BANCÁRIOS PARA REPASSE FINANCEIRO
------------------------------------------------------------------------
Titular da Conta: ${data.bankAccountHolderName || 'Não informado'}
CPF/CNPJ do Titular: ${data.bankAccountHolderTaxId || 'Não informado'}
Banco: ${data.bankName || 'Não informado'}
Tipo de Conta: ${data.bankAccountType || 'Não informado'}
Agência/Conta: ${data.bankAgencyAndAccount || 'Não informado'}
Chave Pix cadastrada: ${data.pixKey || 'Não informada'}

------------------------------------------------------------------------
SEÇÃO 6: TERMOS DE CONSENTIMENTO E ASSINATURA DIGITAL
------------------------------------------------------------------------
Consentimento LGPD: [ACEITO] Autorização expressa concedida.
Canal Assinatura Eletrônica do Contrato: ${data.signatureChannel || 'E-mail'}
Plataforma de Preferência: ${data.signaturePlatform || 'Administradora'}
Tipo de Validação: ${data.signatureDrawing ? 'Assinatura biométrica desenhada em tela' : 'Assinatura digital via link de e-mail'}

------------------------------------------------------------------------
             NOTIFICAÇÃO OPERACIONAL E AUTOMAÇÃO
------------------------------------------------------------------------
[OK] Disparo automático de alerta Slack/Push para o time técnico.
[OK] Envio de e-mail de cortesia para Wellington.Rodovalho@gmail.com.
[OK] Integração API iniciada com a plataforma ${data.signaturePlatform || 'ZapSign'}.
========================================================================
`;
}
