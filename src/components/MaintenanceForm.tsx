import React, { useState } from 'react';
import { PenTool, CheckCircle, AlertTriangle, RefreshCw, Upload, FileText, Trash2, ShieldCheck } from 'lucide-react';
import { PropertyOwnerData } from '../types';
import { formatBytes } from '../utils';

interface MaintenanceFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function MaintenanceForm({ data, updateData, errors }: MaintenanceFormProps) {
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
    
    if (e.dataTransfer.files) {
      addUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addUploadedFiles(Array.from(e.target.files));
    }
  };

  const addUploadedFiles = (filesList: File[]) => {
    const currentFiles = [...(data.maintenanceDocsFiles || [])];
    
    filesList.forEach((file) => {
      // Avoid duplicate filenames
      if (!currentFiles.some(f => f.name === file.name)) {
        currentFiles.push({
          name: file.name,
          size: formatBytes(file.size),
        });
      }
    });

    updateData({ maintenanceDocsFiles: currentFiles });
  };

  const removeFile = (indexToRemove: number) => {
    const currentFiles = data.maintenanceDocsFiles.filter((_, idx) => idx !== indexToRemove);
    updateData({ maintenanceDocsFiles: currentFiles });
  };

  const quickSetNoProblems = () => {
    updateData({ chronicProblems: 'Nada consta' });
  };

  return (
    <div id="section-maintenance-history" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            4
          </span>
          Histórico de Manutenção e Estado Atual
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Garantir a integridade física estrutural do imóvel, registrando correções periódicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Última Pintura Geral */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Última Pintura Geral do Imóvel
          </label>
          <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            {['Há menos de 6 meses', 'Há menos de 1 ano', 'Há mais de 2 anos', 'Necessita de pintura'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updateData({ lastPainting: opt as any })}
                className={`py-2 px-3 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors ${
                  data.lastPainting === opt
                    ? 'bg-emerald-950 text-white shadow-sm'
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Histórico de Manutenção de Ar-condicionado */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Histórico dos Ares-Condicionados <span className="text-slate-400 font-normal">(se aplicável)</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            {[
              'Higienizados recentemente (menos de 6 meses)',
              'Próximo do prazo de manutenção',
              'Não possuem manutenção recente',
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updateData({ acMaintenance: opt as any })}
                className={`py-2 px-3 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors ${
                  data.acMaintenance === opt
                    ? 'bg-emerald-950 text-white shadow-sm'
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Estado das Instalações Elétricas e Hidráulicas */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Estado das Instalações Elétricas e Hidráulicas <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'Revisadas e 100% funcionais', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100' },
              { value: 'Apresenta pequenos detalhes/vazamentos', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50/50 border-amber-100' },
              { value: 'Necessita de revisão urgente', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50/50 border-rose-100' },
            ].map((opt) => {
              const matches = data.utilitiesStatus === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateData({ utilitiesStatus: opt.value as any })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    matches
                      ? `${opt.color} border-current scale-[1.02] shadow-sm font-semibold`
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span className="text-xs leading-tight">{opt.value}</span>
                </button>
              );
            })}
          </div>
          {errors.utilitiesStatus && <p className="text-[11px] text-rose-500">{errors.utilitiesStatus}</p>}
        </div>

        {/* Problemas crônicos */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex justify-between items-center">
            <label htmlFor="chronicProblems" className="block text-xs font-semibold text-slate-700 tracking-wide">
              Existe algum problema crônico conhecido? <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={quickSetNoProblems}
              className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
            >
              Marcar como "Nada consta"
            </button>
          </div>
          
          <textarea
            id="chronicProblems"
            rows={3}
            placeholder="Ex: Pequeno vazamento abaixo da pia ou histórico de mofo no teto da suíte. Se não houver, digite 'Nada consta'."
            value={data.chronicProblems}
            onChange={(e) => updateData({ chronicProblems: e.target.value })}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              errors.chronicProblems ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500'
            } outline-none text-sm transition-all focus:bg-white text-slate-800 resize-none`}
          />
          {errors.chronicProblems && <p className="text-[11px] text-rose-500">{errors.chronicProblems}</p>}
        </div>

        {/* Multi-Files Upload */}
        <div className="space-y-2.5 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Laudo de Vistoria Prévio ou Fotos de Manutenção <span className="text-slate-400 font-normal">(Opcional)</span>
          </label>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-5 text-center transition-all relative ${
              dragActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <div className="pointer-events-none">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">Arraste múltiplos arquivos ou clique para buscar</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Laudos anteriores, vistorias em PDF ou galeria de fotos.</p>
            </div>
          </div>

          {/* List of uploaded files */}
          {data.maintenanceDocsFiles && data.maintenanceDocsFiles.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Arquivos Anexados ({data.maintenanceDocsFiles.length})</p>
              
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {data.maintenanceDocsFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-150 shadow-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-[400px]">
                          {file.name}
                        </p>
                        <p className="text-[9px] text-slate-400">{file.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
