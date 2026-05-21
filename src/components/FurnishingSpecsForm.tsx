import React, { useState } from 'react';
import { Sofa, CheckSquare, Square, Info, Plus, X } from 'lucide-react';
import { PropertyOwnerData } from '../types';

interface FurnishingSpecsFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function FurnishingSpecsForm({ data, updateData, errors }: FurnishingSpecsFormProps) {
  const [customItemText, setCustomItemText] = useState('');

  const furnitureStatuses: { value: PropertyOwnerData['furnishStatus']; label: string; desc: string }[] = [
    {
      value: 'Totalmente Mobiliado',
      label: 'Totalmente Mobiliado',
      desc: 'Sofá, camas, mesas, cadeiras e armários prontos para morar.',
    },
    {
      value: 'Semimobiliado (apenas armários fixos)',
      label: 'Semimobiliado (apenas armários fixos)',
      desc: 'Guarda-roupas, armários de cozinha embutidos e gabinetes de banheiro.',
    },
    {
      value: 'Sem mobília',
      label: 'Sem mobília',
      desc: 'Imóvel vazio, limpo e pronto para receber os móveis do inquilino.',
    },
  ];

  const defaultAppliances = [
    'Geladeira',
    'Fogão/Cooktop',
    'Micro-ondas',
    'Máquina de lavar',
    'Smart TV',
    'Ar-condicionado',
    'Secadora de roupas',
    'Lava-louças',
    'Forno Elétrico/Gás',
    'Filtro/Purificador de água',
    'Sofá',
    'Mesa com cadeiras',
    'Cama de Casal',
    'Cama de Solteiro',
    'Guarda-roupa',
    'Aspirador de Pó',
    'Roteador Wi-Fi',
    'Utensílios de Cozinha',
  ];

  const toggleAppliance = (appliance: string) => {
    let list = [...data.propAppliances];

    if (appliance === 'Nenhum') {
      // If none selected, clear all others and keep only "Nenhum"
      list = ['Nenhum'];
    } else {
      // Remove "Nenhum" if active
      list = list.filter((item) => item !== 'Nenhum');

      if (list.includes(appliance)) {
        list = list.filter((item) => item !== appliance);
      } else {
        list.push(appliance);
      }
    }

    updateData({ propAppliances: list });
  };

  const addCustomItem = () => {
    const text = customItemText.trim();
    if (!text) return;

    // Check if it already exists
    if (!data.propAppliances.includes(text)) {
      let list = [...data.propAppliances].filter((item) => item !== 'Nenhum');
      list.push(text);
      updateData({ propAppliances: list });
    }
    setCustomItemText('');
  };

  const customItems = data.propAppliances.filter(
    (item) => !defaultAppliances.includes(item) && item !== 'Nenhum'
  );

  const petFriendlyOptions: { value: PropertyOwnerData['allowPets']; label: string; bg: string }[] = [
    { value: 'Sim', label: 'Sim, totalmente Pet Friendly', bg: 'bg-emerald-50 text-emerald-950 border-emerald-200' },
    { value: 'Não', label: 'Não aceita Pets', bg: 'bg-rose-50 text-rose-950 border-rose-200' },
    { value: 'Apenas de pequeno porte', label: 'Apenas de pequeno porte', bg: 'bg-amber-50 text-amber-950 border-amber-200' },
  ];

  return (
    <div id="section-furnishing-specs" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            3
          </span>
          Mobília, Eletros e Comodidades
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Nível de preparação física do imóvel para as locações e recepção dos novos moradores.
        </p>
      </div>

      {/* Status de Mobília */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide">
          Status de Mobília <span className="text-rose-500">*</span>
        </label>
        <div className="space-y-2.5">
          {furnitureStatuses.map((item) => {
            const isSelected = data.furnishStatus === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateData({ furnishStatus: item.value })}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-400'}`}>
                  <Sofa className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{item.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.furnishStatus && <p className="text-[11px] text-rose-500">{errors.furnishStatus}</p>}
      </div>

      {/* Eletrodomésticos, Mobília e Comodidades */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Eletrodomésticos, Mobília e Comodidades inclusos atualmente no imóvel
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Marcados ficarão na vistoria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          {defaultAppliances.map((appliance) => {
            const isChecked = data.propAppliances.includes(appliance);
            return (
              <button
                key={appliance}
                type="button"
                onClick={() => toggleAppliance(appliance)}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isChecked ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-slate-900 border border-slate-200/50' : 'text-slate-600 hover:bg-slate-105 border border-transparent'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-700 fill-emerald-50 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="text-xs font-medium">{appliance}</span>
              </button>
            );
          })}

          {/* Option Nenhum */}
          <button
            type="button"
            onClick={() => toggleAppliance('Nenhum')}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-colors cursor-pointer col-span-1 sm:col-span-2 lg:col-span-3 ${
              data.propAppliances.includes('Nenhum') ? 'bg-rose-50 text-rose-900 border border-rose-200/50 font-semibold' : 'text-slate-600 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            {data.propAppliances.includes('Nenhum') ? (
              <CheckSquare className="w-4 h-4 text-rose-700 fill-rose-50 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 shrink-0" />
            )}
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700">Nenhum item em especial (Imóvel vazio)</span>
          </button>
        </div>

        {/* Custom Items Added dynamically with input */}
        {customItems.length > 0 && (
          <div className="space-y-2 pt-2">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outros itens personalizados adicionados:</h5>
            <div className="flex flex-wrap gap-2">
              {customItems.map((item) => (
                <div 
                  key={item}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 pl-3 pr-2 py-1 rounded-full text-xs font-bold text-emerald-800 animate-fadeIn"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => toggleAppliance(item)}
                    className="p-0.5 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add custom item form input */}
        <div className="pt-2">
          <div className="max-w-md flex gap-2 animate-fadeIn">
            <input
              type="text"
              placeholder="Adicionar outro item (Ex: Cafeteira, Adega, etc)"
              value={customItemText}
              onChange={(e) => setCustomItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomItem();
                }
              }}
              className="flex-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
            <button
              type="button"
              onClick={addCustomItem}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Acrescentar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Política Pet Friendly */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide">
          O imóvel aceita Pets? (Política Pet Friendly) <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {petFriendlyOptions.map((opt) => {
            const isSelected = data.allowPets === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateData({ allowPets: opt.value })}
                className={`p-3.5 rounded-xl border text-center font-bold tracking-tight text-xs cursor-pointer transition-all ${
                  isSelected
                    ? `${opt.bg} border-emerald-600 scale-[1.02] shadow-sm`
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.allowPets && <p className="text-[11px] text-rose-500">{errors.allowPets}</p>}

        {/* Info box about Pet Friendly listings */}
        <div className="p-3 bg-blue-50/50 border border-blue-100/30 rounded-lg flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-blue-605 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-800 leading-normal">
            <strong>Dica do Especialista UX:</strong> Imóveis marcados como <strong>Pet Friendly</strong> são alugados até 
            <strong> 35% mais rápido</strong> e recebem mais visitas no portal da administradora.
          </p>
        </div>
      </div>
    </div>
  );
}
