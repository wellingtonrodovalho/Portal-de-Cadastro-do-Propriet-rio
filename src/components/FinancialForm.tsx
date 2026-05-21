import React from 'react';
import { Landmark, CreditCard, User, HelpCircle, Key, Percent } from 'lucide-react';
import { PropertyOwnerData, LIST_OF_BANKS } from '../types';
import { maskCPF_CNPJ } from '../utils';

interface FinancialFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function FinancialForm({ data, updateData, errors }: FinancialFormProps) {
  const accountTypes: { value: PropertyOwnerData['bankAccountType']; label: string }[] = [
    { value: 'Conta Corrente', label: 'Conta Corrente (Recomendado)' },
    { value: 'Conta Poupança', label: 'Conta Poupança' },
  ];

  return (
    <div id="section-financial-details" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            5
          </span>
          Dados Bancários para Repasse Financeiro
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Coletar as coordenadas bancárias seguras para envio eletrônico dos aluguéis e taxas coletadas mensalmente.
        </p>
      </div>

      {/* Real-time Bank card preview */}
      <div className="bg-gradient-to-tr from-emerald-950 via-emerald-900 to-emerald-800 text-emerald-100 p-5 rounded-2xl shadow-md space-y-6 relative overflow-hidden">
        {/* Abstract background circles */}
        <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-emerald-800/20 translate-x-8 translate-y-8" />
        <div className="absolute right-12 top-4 w-12 h-12 rounded-full bg-emerald-700/10" />

        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">CARTÃO DE REPASSE</span>
            <h3 className="text-sm font-semibold mt-0.5">{data.bankName || 'Banco não selecionado'}</h3>
          </div>
          <Landmark className="w-6 h-6 text-emerald-300" />
        </div>

        <div>
          <span className="text-[10px] text-emerald-400 block uppercase tracking-wide">Agência / Conta Bancária</span>
          <p className="text-base font-mono font-medium tracking-wider">
            {data.bankAgencyAndAccount || 'Agência 0000 - Conta 00000-0'}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9px] text-emerald-400 block uppercase">Titular</span>
            <p className="text-xs font-semibold uppercase tracking-wide truncate max-w-[200px]">
              {data.bankAccountHolderName || 'TITULAR INDEFINIDO'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-emerald-400 block uppercase">Tipo de Conta</span>
            <p className="text-xs font-medium font-mono">{data.bankAccountType || 'Corrente'}</p>
          </div>
        </div>
      </div>

      {/* Main Bank fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nome do Titular */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="bankAccountHolderName" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Nome do Titular da Conta <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="bankAccountHolderName"
              type="text"
              placeholder="Ex: Wellington Rodovalho da Silva"
              value={data.bankAccountHolderName}
              onChange={(e) => updateData({ bankAccountHolderName: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.bankAccountHolderName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all focus:bg-white text-slate-800`}
            />
          </div>
          {errors.bankAccountHolderName ? (
            <p className="text-[11px] text-rose-500">{errors.bankAccountHolderName}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Deve ser igual ao cadastrado no banco recebedor.</p>
          )}
        </div>

        {/* CPF/CNPJ do Titular */}
        <div className="space-y-1.5">
          <label htmlFor="bankAccountHolderTaxId" className="block text-xs font-semibold text-slate-700 tracking-wide">
            CPF/CNPJ do Titular da Conta <span className="text-rose-500">*</span>
          </label>
          <input
            id="bankAccountHolderTaxId"
            type="text"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            value={data.bankAccountHolderTaxId}
            onChange={(e) => updateData({ bankAccountHolderTaxId: maskCPF_CNPJ(e.target.value) })}
            className={`w-full px-3 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.bankAccountHolderTaxId ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
            } outline-none text-sm transition-all focus:bg-white text-slate-800`}
          />
          {errors.bankAccountHolderTaxId && <p className="text-[11px] text-rose-500">{errors.bankAccountHolderTaxId}</p>}
        </div>

        {/* Chave Pix para repasse */}
        <div className="space-y-1.5">
          <label htmlFor="pixKey" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Chave Pix preferencial para repasse <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="pixKey"
              type="text"
              placeholder="E-mail, CPF, Telefone ou Chave Aleatória"
              value={data.pixKey}
              onChange={(e) => updateData({ pixKey: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.pixKey ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all focus:bg-white text-slate-800`}
            />
          </div>
          {errors.pixKey && <p className="text-[11px] text-rose-500">{errors.pixKey}</p>}
        </div>

        {/* Seleção do Banco */}
        <div className="space-y-1.5">
          <label htmlFor="bankName" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Banco <span className="text-rose-500">*</span>
          </label>
          <select
            id="bankName"
            value={data.bankName}
            onChange={(e) => updateData({ bankName: e.target.value })}
            className={`w-full px-3 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.bankName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
            } outline-none text-sm transition-all focus:bg-white text-slate-800`}
          >
            <option value="">Selecione a instituição financeira</option>
            {LIST_OF_BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && <p className="text-[11px] text-rose-500">{errors.bankName}</p>}
        </div>

        {/* Agência e Número */}
        <div className="space-y-1.5">
          <label htmlFor="bankAgencyAndAccount" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Agência e Número da Conta com DV <span className="text-rose-500">*</span>
          </label>
          <input
            id="bankAgencyAndAccount"
            type="text"
            placeholder="Ex: Ag. 1024 / Conta 45678-9"
            value={data.bankAgencyAndAccount}
            onChange={(e) => updateData({ bankAgencyAndAccount: e.target.value })}
            className={`w-full px-3 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.bankAgencyAndAccount ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
            } outline-none text-sm transition-all focus:bg-white text-slate-800`}
          />
          {errors.bankAgencyAndAccount ? (
            <p className="text-[11px] text-rose-500">{errors.bankAgencyAndAccount}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Escreva no formato padrão de seu banco.</p>
          )}
        </div>

        {/* Tipo de Conta */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Tipo de Conta <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accountTypes.map((type) => {
              const isSelected = data.bankAccountType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateData({ bankAccountType: type.value })}
                  className={`p-3 rounded-xl border text-left text-xs font-bold leading-tight cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
          {errors.bankAccountType && <p className="text-[11px] text-rose-500">{errors.bankAccountType}</p>}
        </div>
      </div>
    </div>
  );
}
