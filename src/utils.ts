// Formatting and mask utilities for Portuguese input fields
import { jsPDF } from 'jspdf';

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

export function downloadRealPDF(data: any) {
  const doc = new jsPDF();
  
  // PDF Top Header Accent
  doc.setFillColor(15, 44, 37); // Deep Emerald Forest
  doc.rect(0, 0, 210, 35, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.text("CADASTRO DO PROPRIETARIO E IMOVEIS", 14, 15);
  
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(167, 243, 208); // Accent light emerald green
  doc.text("Relatorio de Onboarding & Ficha Cadastral do Imovel", 14, 21);
  doc.text(`ID Controle: REG-2026-${data.ownerTaxId ? data.ownerTaxId.replace(/\D/g, '').slice(-4) : '2957'} | Status: CONCLUIDO`, 14, 27);

  let y = 48;
  const checkPageBreak = (needed: number) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 44, 37);
    doc.text(title, 14, y);
    y += 4;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.4);
    doc.line(14, y, 196, y);
    y += 8;
  };

  const addField = (label: string, value: string) => {
    checkPageBreak(8);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(label + ":", 14, y);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42); // slate-900
    
    const valText = String(value || 'Nao informado');
    const lines = doc.splitTextToSize(valText, 125);
    doc.text(lines, 65, y);
    y += Math.max(lines.length * 5, 6);
  };

  // Section 1
  addSectionTitle("1. DADOS PESSOAIS DO PROPRIETARIO");
  addField("Nome Completo", data.ownerName);
  addField("CPF/CNPJ", data.ownerTaxId);
  addField("E-mail principal", data.ownerEmail);
  addField("Telefone/WhatsApp", data.ownerPhone);
  addField("Endereco Atual", data.ownerAddress);
  
  // Section 2
  addSectionTitle("2. INFORMACOES DO IMOVEL");
  addField("CEP", data.propZip);
  addField("Endereco do Imovel", `${data.propStreet || ''}, No ${data.propNumber || 'S/N'}`);
  addField("Bairro", data.propNeighborhood);
  addField("Cidade/Estado", data.propCityState);
  addField("Complemento", data.propComplement || 'Nenhum');
  addField("Tipo de Imovel", data.propType);
  addField("Condominio/Edificio", data.propCondoName || 'Nao aplicavel');
  addField("Configuracao", `${data.propRooms || 0} Quartos | ${data.propSuites || 0} Suites | ${data.propGarage || 0} Garagem`);
  addField("Possui Smart Lock", data.propSmartLock ? "Sim" : "Nao");

  // Section 3
  addSectionTitle("3. MOBILIA, ELETROS & COMODIDADES");
  addField("Status de Mobilia", data.furnishStatus);
  addField("Itens Incluidos", data.propAppliances?.join(', '));
  addField("Aceita Pets?", data.allowPets);

  // Section 4
  addSectionTitle("4. HISTORICO DE MANUTENCAO");
  addField("Ultima Pintura", data.lastPainting);
  addField("Instalacoes", data.utilitiesStatus);
  addField("Ar-Condicionado", data.acMaintenance);
  addField("Problemas Cronicos", data.chronicProblems || 'Nada consta');

  // Section 5
  addSectionTitle("5. DADOS FINANCEIROS (PIX)");
  addField("Titular da Conta", data.bankAccountHolderName);
  addField("CPF/CNPJ do Titular", data.bankAccountHolderTaxId);
  addField("Banco", data.bankName);
  addField("Tipo de Conta", data.bankAccountType);
  addField("Agencia / Conta", data.bankAgencyAndAccount);
  addField("Chave Pix cadastrada", data.pixKey);

  // Section 6
  addSectionTitle("6. SEGURANCA E FORMALIZACAO COLETADA");
  addField("Consentimento LGPD", data.lgpdConsent ? "AUTORIZADO (Termo aceito)" : "Pendente");
  addField("Canal de Assinatura", data.signatureChannel);
  addField("Plataforma Preferida", data.signaturePlatform || 'Usar a da administradora');

  if (data.signatureDrawing) {
    checkPageBreak(35);
    y += 2;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Assinatura Registrada:", 14, y);
    try {
      doc.addImage(data.signatureDrawing, 'PNG', 65, y - 5, 50, 16);
      y += 15;
    } catch (e) {
      y += 6;
    }
  }

  // Footer stamp box
  checkPageBreak(25);
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 16, 'FD');
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("CERTIFICACAO DE SEGURANCA LEGAL (LGPD)", 18, y + 5);
  doc.setFont("Helvetica", "normal");
  doc.text(`Laudo gerado via Portal de Cadastro em conformidade com o Artigo 7 da Lei No 13.709.`, 18, y + 10);

  // Trigger Save
  doc.save(`Ficha_Onboarding_${String(data.ownerName || 'Proprietario').replace(/\s+/g, '_')}.pdf`);
}

