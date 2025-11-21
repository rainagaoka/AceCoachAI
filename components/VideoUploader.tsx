import React, { useRef, useState } from 'react';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  isLoading: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelected, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file && file.type.startsWith('video/')) {
      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onVideoSelected(file);
    } else if (file) {
      alert("Por favor, selecione um arquivo de vídeo válido.");
    }
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearVideo = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {!previewUrl ? (
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
            dragActive 
              ? "border-emerald-400 bg-emerald-400/10 scale-[1.02]" 
              : "border-slate-700 bg-slate-900 hover:border-slate-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-col items-center pointer-events-none">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Envie seu Saque</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Arraste e solte seu vídeo aqui ou clique para selecionar. (Recomendado: Vídeos curtos, máx 20MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
          <video 
            src={previewUrl} 
            controls 
            className="w-full max-h-[500px] object-contain mx-auto"
          />
          {!isLoading && (
             <button
             onClick={clearVideo}
             className="absolute top-4 right-4 bg-slate-900/80 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
             title="Remover vídeo"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
           </button>
          )}
        </div>
      )}
    </div>
  );
};