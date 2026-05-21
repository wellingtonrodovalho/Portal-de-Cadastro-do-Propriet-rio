import React, { useState } from 'react';
import { MapPin, Search, Home, HelpCircle, KeyRound, Building, Building2 } from 'lucide-react';
import { PropertyOwnerData } from '../types';
import { maskCEP } from '../utils';

interface PropertyInfoFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function PropertyInfoForm({ data, updateData, errors }: PropertyInfoFormProps) {
  const [loadingCep, setLoadingCep] = useState(false);

  // Simulated automatic address prefilling
  const handleCepSearch = () => {
    if (!data.propZip || data.propZip.replace(/\D/g, '').length < 8) {
      alert('Por favor, informe um CEP válido com 8 dígitos primeiro.');
      return;
    }

    setLoadingCep(true);

    // Simulate high speed network delay
    setTimeout(() => {
      setLoadingCep(false);
      updateData({
        propStreet: 'Alameda Lorena',
        propNeighborhood: 'Jardins',
        propCityState: 'São Paulo / SP',
      });
    }, 850);
  };

  const propertyTypes: { value: PropertyOwnerData['propType']; label: string; desc: string; icon: any }[] = [
    { value: 'Apartamento', label: 'Apartamento', desc: 'Prédios, coberturas', icon: Building2 },
    { value: 'Casa', label: 'Casa', desc: 'Imóvel individual', icon: Home },
    { value: 'Casa em Condomínio', label: 'Condomínio', desc: 'Residências fechadas', icon: Building },
    { value: 'Studio/Flat', label: 'Studio / Flat', desc: 'Layout compacto moderno', icon: KeyRound },
    { value: 'Outro', label: 'Outro', desc: 'Salas, galpões, especial', icon: HelpCircle },
  ];

  const selectionQuarters: PropertyOwnerData['propRooms'][] = ['1', '2', '3', '4+'];
  const selectionSuites: PropertyOwnerData['propSuites'][] = ['0', '1', '2', '3+'];
  const selectionGarages: PropertyOwnerData['propGarage'][] = ['0', '1', '2', '3+'];

  return (
    <div id="section-property-info" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            2
          </span>
          Informações do Imóvel (Localização e Características)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Identificar e caracterizar geograficamente o imóvel que será registrado para administração imobiliária.
        </p>
      </div>

      {/* Address Block */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100/80 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Endereço do Imóvel</h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* CEP with simulation lookup */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="propZip" className="block text-xs font-semibold text-slate-700 tracking-wide">
              CEP <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="propZip"
                type="text"
                placeholder="00000-000"
                value={data.propZip}
                onChange={(e) => updateData({ propZip: maskCEP(e.target.value) })}
                className={`flex-1 px-3 py-2 bg-white rounded-xl border ${
                  errors.propZip ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
                } outline-none text-sm transition-all text-slate-800`}
              />
              <button
                type="button"
                onClick={handleCepSearch}
                disabled={loadingCep}
                className="px-3.5 py-2 bg-emerald-950 text-emerald-300 rounded-xl hover:bg-emerald-900 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-60"
              >
                {loadingCep ? (
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Buscar</span>
              </button>
            </div>
            {errors.propZip ? (
              <p className="text-[11px] text-rose-500">{errors.propZip}</p>
            ) : (
              <p className="text-[10px] text-slate-400">Insira e clique em Buscar para preencher.</p>
            )}
          </div>

          {/* Logradouro */}
          <div className="space-y-1.5 md:col-span-4">
            <label htmlFor="propStreet" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Logradouro (Rua/Avenida) <span className="text-rose-500">*</span>
            </label>
            <input
              id="propStreet"
              type="text"
              placeholder="Ex: Avenida Paulista ou Alameda Lorena"
              value={data.propStreet}
              onChange={(e) => updateData({ propStreet: e.target.value })}
              className={`w-full px-3 py-2 bg-white rounded-xl border ${
                errors.propStreet ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all text-slate-800`}
            />
            {errors.propStreet && <p className="text-[11px] text-rose-500">{errors.propStreet}</p>}
          </div>

          {/* Número */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="propNumber" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Número <span className="text-rose-500">*</span>
            </label>
            <input
              id="propNumber"
              type="text"
              placeholder="Ex: 1450"
              value={data.propNumber}
              onChange={(e) => updateData({ propNumber: e.target.value })}
              className={`w-full px-3 py-2 bg-white rounded-xl border ${
                errors.propNumber ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all text-slate-800`}
            />
            {errors.propNumber && <p className="text-[11px] text-rose-500">{errors.propNumber}</p>}
          </div>

          {/* Complemento */}
          <div className="space-y-1.5 md:col-span-4">
            <label htmlFor="propComplement" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Complemento (Apto/Bloco/Torre)
            </label>
            <input
              id="propComplement"
              type="text"
              placeholder="Ex: Apto 142 Bloco B"
              value={data.propComplement}
              onChange={(e) => updateData({ propComplement: e.target.value })}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm transition-all text-slate-800"
            />
          </div>

          {/* Bairro */}
          <div className="space-y-1.5 md:col-span-3">
            <label htmlFor="propNeighborhood" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Bairro <span className="text-rose-500">*</span>
            </label>
            <input
              id="propNeighborhood"
              type="text"
              placeholder="Ex: Jardins ou Centro"
              value={data.propNeighborhood}
              onChange={(e) => updateData({ propNeighborhood: e.target.value })}
              className={`w-full px-3 py-2 bg-white rounded-xl border ${
                errors.propNeighborhood ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all text-slate-800`}
            />
            {errors.propNeighborhood && <p className="text-[11px] text-rose-500">{errors.propNeighborhood}</p>}
          </div>

          {/* Cidade/Estado */}
          <div className="space-y-1.5 md:col-span-3">
            <label htmlFor="propCityState" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Cidade / Estado <span className="text-rose-500">*</span>
            </label>
            <input
              id="propCityState"
              type="text"
              placeholder="Ex: São Paulo / SP"
              value={data.propCityState}
              onChange={(e) => updateData({ propCityState: e.target.value })}
              className={`w-full px-3 py-2 bg-white rounded-xl border ${
                errors.propCityState ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              } outline-none text-sm transition-all text-slate-800`}
            />
            {errors.propCityState && <p className="text-[11px] text-rose-500">{errors.propCityState}</p>}
          </div>
        </div>
      </div>

      {/* Characteristics Block */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Características do Imóvel</h3>

        {/* Tipo de Imóvel */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Tipo de Imóvel <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = data.propType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateData({ propType: type.value })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 scale-[1.02] shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50/80 text-slate-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight block">{type.label}</span>
                  <span className="text-[9px] text-slate-400 mt-1 block leading-tight hidden sm:block">
                    {type.desc}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.propType && <p className="text-[11px] text-rose-500">{errors.propType}</p>}
        </div>

        {/* Nome do Condomínio/Edifício */}
        <div className="space-y-1.5">
          <label htmlFor="propCondoName" className="block text-xs font-semibold text-slate-700 tracking-wide">
            Nome do Condomínio / Edifício <span className="text-slate-400 font-normal">(se aplicável)</span>
          </label>
          <input
            id="propCondoName"
            type="text"
            placeholder="Ex: Condomínio Edifício Mirante do Sol"
            value={data.propCondoName}
            onChange={(e) => updateData({ propCondoName: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50/50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm transition-all text-slate-800 focus:bg-white"
          />
        </div>

        {/* Room grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quantidade de Quartos */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Quantidade de Quartos <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-100">
              {selectionQuarters.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateData({ propRooms: val })}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    data.propRooms === val ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            {errors.propRooms && <p className="text-[11px] text-rose-500">{errors.propRooms}</p>}
          </div>

          {/* Quantidade de Suítes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Quantidade de Suítes <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-100">
              {selectionSuites.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateData({ propSuites: val })}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    data.propSuites === val ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            {errors.propSuites && <p className="text-[11px] text-rose-500">{errors.propSuites}</p>}
          </div>

          {/* Vagas de Garagem */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Vagas de Garagem <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-100">
              {selectionGarages.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateData({ propGarage: val })}
                  className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    data.propGarage === val ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            {errors.propGarage && <p className="text-[11px] text-rose-500">{errors.propGarage}</p>}
          </div>
        </div>

        {/* Fechadura inteligente */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            O imóvel possui fechadura eletrônica / smart lock? <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-3">
            {['Sim', 'Não'].map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => updateData({ propSmartLock: choice as any })}
                className={`py-2 px-6 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  data.propSmartLock === choice
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
          {errors.propSmartLock && <p className="text-[11px] text-rose-500">{errors.propSmartLock}</p>}
          <p className="text-[10px] text-slate-400 mt-1">
            Fechaduras inteligentes agilizam o chaveamento eletrônico e evitam o deslocamento do hóspede/inquilino.
          </p>
        </div>
      </div>
    </div>
  );
}
