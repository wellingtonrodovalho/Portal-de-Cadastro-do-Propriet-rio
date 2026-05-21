import React, { useRef, useState, useEffect } from 'react';
import { PenTool, CheckSquare, Square, RefreshCcw, Mail, MessageSquare, ShieldCheck, Upload, Trash2, Check } from 'lucide-react';
import { PropertyOwnerData } from '../types';

interface ConsentSignatureFormProps {
  data: PropertyOwnerData;
  updateData: (fields: Partial<PropertyOwnerData>) => void;
  errors: { [key: string]: string };
}

export default function ConsentSignatureForm({ data, updateData, errors }: ConsentSignatureFormProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const isGovBr = data.signaturePlatform === 'Gov.br';
  const isAutentique = data.signaturePlatform === 'Autentique';
  const isOther = data.signaturePlatform !== '' && !isGovBr && !isAutentique;
  const [otherText, setOtherText] = useState(isOther && data.signaturePlatform !== 'Outra' ? data.signaturePlatform : '');

  useEffect(() => {
    if (data.signaturePlatform && data.signaturePlatform !== 'Gov.br' && data.signaturePlatform !== 'Autentique' && data.signaturePlatform !== 'Outra') {
      setOtherText(data.signaturePlatform);
    }
  }, [data.signaturePlatform]);

  // Initialize and scale signature canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f2c25'; // Deep emerald forest slate colour
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // If there's an existing signature stored, we could load it (but for this mockup we reset or keep)
        if (data.signatureDrawing) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = data.signatureDrawing;
          setHasDrawn(true);
        }
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const parentDataUrl = canvas.toDataURL();
      updateData({ signatureDrawing: parentDataUrl });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      updateData({ signatureDrawing: null });
    }
  };

  const handleSignatureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateData({
        signatureFile: file,
        signatureFileName: file.name,
      });
    }
  };

  const removeSignatureFile = () => {
    updateData({
      signatureFile: null,
      signatureFileName: '',
    });
  };

  return (
    <div id="section-consent-signature" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            6
          </span>
          Termos de Consentimento e Assinatura Digital
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Formalizar o envio das informações de acordo com as regras da LGPD e configurar os canais de formalização.
        </p>
      </div>

      {/* LGPD Text box & Box check */}
      <div className={`p-5 rounded-2xl border transition-all ${
        data.lgpdConsent ? 'bg-emerald-50/50 border-emerald-100/80' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateData({ lgpdConsent: !data.lgpdConsent })}
            className="mt-0.5 text-slate-700 cursor-pointer shrink-0"
          >
            {data.lgpdConsent ? (
              <CheckSquare className="w-5 h-5 text-emerald-700 fill-emerald-50" />
            ) : (
              <Square className={`w-5 h-5 ${errors.lgpdConsent ? 'text-rose-450 border border-rose-300' : 'text-slate-400'}`} />
            )}
          </button>
          
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Termo de Autorização e LGPD</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Declaro que sou o proprietário legal (ou procurador devidamente autorizado) do imóvel descrito e dou consentimento para que a administradora utilize estes dados para fins de análise cadastral, anúncio comercial e elaboração de contratos de locação e intermediação, em total conformidade com as diretivas da Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>
        {errors.lgpdConsent && <p className="text-[11px] text-rose-500 mt-2 ml-8">{errors.lgpdConsent}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canal Preferencial */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Canal Preferencial para Assinatura Eletrônica do Contrato <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { value: 'WhatsApp (via link seguro)', label: 'WhatsApp', desc: 'Receber link para assinar pelo celular.', icon: MessageSquare },
              { value: 'E-mail', label: 'E-mail principal', desc: 'Receber envelopes diretamente no seu e-mail.', icon: Mail },
            ].map((opt) => {
              const isSelected = data.signatureChannel === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateData({ signatureChannel: opt.value as any })}
                  className={`flex items-start text-left p-3 rounded-xl border gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 mt-0.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <div>
                    <h5 className="text-xs font-bold">{opt.label}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.signatureChannel && <p className="text-[11px] text-rose-500">{errors.signatureChannel}</p>}
        </div>

        {/* Plataforma de Preferência */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Plataforma de Preferência para Assinatura <span className="text-slate-400 font-normal">(ou sugerido)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                updateData({ signaturePlatform: 'Gov.br' });
              }}
              className={`p-3 rounded-xl border text-center text-xs font-bold font-mono transition-all leading-tight cursor-pointer ${
                isGovBr
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 scale-[1.02] shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              Gov.br
            </button>

            <button
              type="button"
              onClick={() => {
                updateData({ signaturePlatform: 'Autentique' });
              }}
              className={`p-3 rounded-xl border text-center text-xs font-bold font-mono transition-all leading-tight cursor-pointer ${
                isAutentique
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 scale-[1.02] shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              Autentique
            </button>

            <button
              type="button"
              onClick={() => {
                const val = otherText.trim() === 'Outra' ? '' : (otherText.trim() || 'Outra');
                updateData({ signaturePlatform: val || 'Outra' });
              }}
              className={`p-3 rounded-xl border text-center text-xs font-bold font-mono transition-all leading-tight cursor-pointer ${
                (isOther || data.signaturePlatform === 'Outra')
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 scale-[1.02] shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              Outra
            </button>
          </div>

          {/* Custom platform input field */}
          {(isOther || data.signaturePlatform === 'Outra') && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 mt-2 animate-fadeIn">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Por favor, indique a plataforma de sua preferência:
              </label>
              <input
                type="text"
                placeholder="Ex: DocuSign, d4sign, Clicksign, ZapSign..."
                value={otherText === 'Outra' ? '' : otherText}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setOtherText(newVal);
                  updateData({ signaturePlatform: newVal || 'Outra' });
                }}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <p className="text-[10px] text-slate-400">
            * Caso selecione "Outra", informe o nome para prepararmos o envio no fluxo correto.
          </p>
        </div>
      </div>

      {/* Assinatura Manual Canvas & File Upload */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assinatura Manual em Tela</h3>
          <p className="text-[10px] text-slate-400">Desenhe sua rubrica na área pontilhada abaixo ou mande imagem digitalizada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Interactive drawing canvas */}
          <div className="md:col-span-3 space-y-2">
            <div className="relative border border-dashed border-slate-350 bg-white rounded-xl overflow-hidden h-36">
              <canvas
                ref={canvasRef}
                width={380}
                height={144}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair touch-none"
              />
              
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 gap-1.5">
                  <PenTool className="w-4 h-4" />
                  <span className="text-[11px] font-medium tracking-wide">Assine com o mouse ou o dedo aqui</span>
                </div>
              )}

              {hasDrawn && (
                <div className="absolute top-2 right-2 flex gap-1.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md border border-slate-100">
                  <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.5 rounded-full font-bold uppercase tracking-wider">Assinado</span>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-650 transition-colors"
                    title="Limpar assinatura"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Desenho da assinatura em tela registrado com segurança.</p>
          </div>

          {/* Alternative File Upload for signature */}
          <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
            <div className="text-center p-3 bg-slate-50 border border-slate-200/50 rounded-xl relative flex flex-col items-center justify-center min-h-[144px]">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleSignatureFile}
                accept="image/*,.pdf"
              />
              
              {data.signatureFileName ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 truncate max-w-[140px]">{data.signatureFileName}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeSignatureFile();
                    }}
                    className="text-[9px] font-semibold text-rose-500 hover:underline"
                  >
                    Remover arquivo
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700 shrink-0">Upload de Assinatura</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Envie rubrica digitalizada.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
