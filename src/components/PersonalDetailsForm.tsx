import React, { useState } from 'react';
import { User, FileText, Phone, Mail, MapPin, Upload, X, Check } from 'lucide-react';
import { PropertyOwnerData } from '../types';
import { maskCPF_CNPJ, maskPhone } from '../utils';

interface PersonalDetailsFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function PersonalDetailsForm({ data, updateData, errors }: PersonalDetailsFormProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      updateData({
        ownerIdCardFile: file,
        ownerIdCardFileName: file.name,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateData({
        ownerIdCardFile: file,
        ownerIdCardFileName: file.name,
      });
    }
  };

  const removeFile = () => {
    updateData({
      ownerIdCardFile: null,
      ownerIdCardFileName: '',
    });
  };

  return (
    <div id="section-personal-details" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            1
          </span>
          Dados Pessoais do Proprietário
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Coletar as informações de contato e identificação jurídica do proprietário legal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nome Completo */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="ownerName" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Nome Completo <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerName"
              type="text"
              placeholder="Digite seu nome completo igual ao RG/CNH"
              value={data.ownerName}
              onChange={(e) => updateData({ ownerName: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerName ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerName ? (
            <p className="text-[11px] text-rose-500">{errors.ownerName}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Insira seu prenome e sobrenome completos.</p>
          )}
        </div>

        {/* CPF ou CNPJ */}
        <div className="space-y-1.5">
          <label htmlFor="ownerTaxId" className="block text-xs font-semibold text-slate-700 tracking-wide">
            CPF ou CNPJ <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerTaxId"
              type="text"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={data.ownerTaxId}
              onChange={(e) => updateData({ ownerTaxId: maskCPF_CNPJ(e.target.value) })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerTaxId ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerTaxId ? (
            <p className="text-[11px] text-rose-500">{errors.ownerTaxId}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Válido tanto para pessoa física ou jurídica.</p>
          )}
        </div>

        {/* RG do Proprietário */}
        <div className="space-y-1.5">
          <label htmlFor="ownerRG" className="block text-xs font-semibold text-slate-700 tracking-wide">
            RG do Proprietário <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerRG"
              type="text"
              placeholder="Ex: 0000000-0"
              value={data.ownerRG}
              onChange={(e) => updateData({ ownerRG: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerRG ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerRG ? (
            <p className="text-[11px] text-rose-500">{errors.ownerRG}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Número do documento de identidade.</p>
          )}
        </div>

        {/* Órgão Expedidor */}
        <div className="space-y-1.5">
          <label htmlFor="ownerRgIssuer" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Órgão Expedidor do RG <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerRgIssuer"
              type="text"
              placeholder="Ex: SSP-GO"
              value={data.ownerRgIssuer}
              onChange={(e) => updateData({ ownerRgIssuer: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerRgIssuer ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerRgIssuer ? (
            <p className="text-[11px] text-rose-500">{errors.ownerRgIssuer}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Ex: SSP-GO, SSP-SP, Detran-RJ etc.</p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-1.5">
          <label htmlFor="ownerBirthDate" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Data de Nascimento <span className="text-rose-500">*</span>
          </label>
          <input
            id="ownerBirthDate"
            type="date"
            value={data.ownerBirthDate}
            onChange={(e) => updateData({ ownerBirthDate: e.target.value })}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.ownerBirthDate ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
            } outline-none text-sm transition-all text-slate-800 cursor-pointer`}
          />
          {errors.ownerBirthDate && (
            <p className="text-[11px] text-rose-500">{errors.ownerBirthDate}</p>
          )}
        </div>

        {/* Nacionalidade */}
        <div className="space-y-1.5">
          <label htmlFor="ownerNationality" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Nacionalidade <span className="text-rose-500">*</span>
          </label>
          <input
            id="ownerNationality"
            type="text"
            placeholder="Ex: Brasileiro(a)"
            value={data.ownerNationality}
            onChange={(e) => updateData({ ownerNationality: e.target.value })}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.ownerNationality ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
            } outline-none text-sm transition-all text-slate-800`}
          />
          {errors.ownerNationality && (
            <p className="text-[11px] text-rose-500">{errors.ownerNationality}</p>
          )}
        </div>

        {/* Estado Civil */}
        <div className="space-y-1.5">
          <label htmlFor="ownerMaritalStatus" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Estado Civil <span className="text-rose-500">*</span>
          </label>
          <select
            id="ownerMaritalStatus"
            value={data.ownerMaritalStatus}
            onChange={(e) => {
              const val = e.target.value as any;
              updateData({
                ownerMaritalStatus: val,
                ownerMarriageRegime: (val === 'Casado(a)' || val === 'União Estável') ? data.ownerMarriageRegime : ''
              });
            }}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.ownerMaritalStatus ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
            } outline-none text-sm transition-all text-slate-800 cursor-pointer`}
          >
            <option value="">Selecione...</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
            <option value="União Estável">União Estável</option>
          </select>
          {errors.ownerMaritalStatus && (
            <p className="text-[11px] text-rose-500">{errors.ownerMaritalStatus}</p>
          )}
        </div>

        {/* Regime de Bens (Casado ou União Estável) */}
        {(data.ownerMaritalStatus === 'Casado(a)' || data.ownerMaritalStatus === 'União Estável') && (
          <div className="space-y-1.5">
            <label htmlFor="ownerMarriageRegime" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Regime de Bens <span className="text-rose-500">*</span>
            </label>
            <input
              id="ownerMarriageRegime"
              type="text"
              placeholder="Ex: Comunhão Parcial"
              value={data.ownerMarriageRegime || ''}
              onChange={(e) => updateData({ ownerMarriageRegime: e.target.value })}
              className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerMarriageRegime ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
            {errors.ownerMarriageRegime && (
              <p className="text-[11px] text-rose-500">{errors.ownerMarriageRegime}</p>
            )}
          </div>
        )}

        {/* Profissão */}
        <div className="space-y-1.5">
          <label htmlFor="ownerProfession" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Profissão <span className="text-rose-500">*</span>
          </label>
          <input
            id="ownerProfession"
            type="text"
            placeholder="Ex: Engenheiro(a), Autônomo(a)"
            value={data.ownerProfession}
            onChange={(e) => updateData({ ownerProfession: e.target.value })}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.ownerProfession ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
            } outline-none text-sm transition-all text-slate-800`}
          />
          {errors.ownerProfession && (
            <p className="text-[11px] text-rose-500">{errors.ownerProfession}</p>
          )}
        </div>

        {/* Telefone/WhatsApp */}
        <div className="space-y-1.5">
          <label htmlFor="ownerPhone" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Telefone / WhatsApp <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerPhone"
              type="text"
              placeholder="(11) 99999-9999"
              value={data.ownerPhone}
              onChange={(e) => updateData({ ownerPhone: maskPhone(e.target.value) })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerPhone ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerPhone ? (
            <p className="text-[11px] text-rose-500">{errors.ownerPhone}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Com DDD. Números apenas.</p>
          )}
        </div>

        {/* E-mail principal */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="ownerEmail" className="block text-xs font-semibold text-slate-700 tracking-wide">
            E-mail principal para contato <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="ownerEmail"
              type="email"
              placeholder="exemplo@email.com"
              value={data.ownerEmail}
              onChange={(e) => updateData({ ownerEmail: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerEmail ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800`}
            />
          </div>
          {errors.ownerEmail ? (
            <p className="text-[11px] text-rose-500">{errors.ownerEmail}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Canal usado para prestação de contas, repasses e avisos legais.</p>
          )}
        </div>

        {/* Endereço de Residência Atual */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="ownerAddress" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Endereço de Residência Atual <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <textarea
              id="ownerAddress"
              rows={3}
              placeholder="Digite seu endereço residencial atual completo (Rua, Número, Apto, Bairro, Cidade, Estado, CEP)"
              value={data.ownerAddress}
              onChange={(e) => updateData({ ownerAddress: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border ${
                errors.ownerAddress ? 'border-rose-400 focus:border-rose-500 bg-rose-50/10' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
              } outline-none text-sm transition-all text-slate-800 resize-none`}
            />
          </div>
          {errors.ownerAddress ? (
            <p className="text-[11px] text-rose-500">{errors.ownerAddress}</p>
          ) : (
            <p className="text-[10px] text-slate-400">Conforme comprovante de endereço residencial.</p>
          )}
        </div>

        {/* Documento de Identidade RG ou CNH (Upload) */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Documento de Identidade (RG/CNH) <span className="text-rose-500">*</span>
          </label>

          <div
            id="dropzone-id-card"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all relative flex flex-col items-center justify-center ${
              dragActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
            } ${errors.ownerIdCardFile ? 'border-rose-300 bg-rose-50/10' : ''}`}
          >
            <input
              type="file"
              id="id-card-element"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />

            {data.ownerIdCardFileName ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm z-10">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-700 truncate max-w-[220px]">
                    {data.ownerIdCardFileName}
                  </p>
                  <p className="text-[10px] text-slate-400">PDF ou imagem carregada com sucesso</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-4"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-xs font-medium text-slate-700">
                  Clique para anexar ou arraste o arquivo aqui
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Formatos aceitos: PDF, JPEG, PNG até 10MB.
                </p>
              </div>
            )}
          </div>
          {errors.ownerIdCardFile && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.ownerIdCardFile}</p>
          )}
        </div>
      </div>
    </div>
  );
}
