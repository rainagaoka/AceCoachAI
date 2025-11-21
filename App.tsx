import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeTennisVideo } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleVideoSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisState(AnalysisState.IDLE);
    setResult(null);
    setErrorMsg("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    // Check file size (approx 20MB limit for demo robustness)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("O arquivo é muito grande. Por favor, envie um vídeo com menos de 20MB.");
      return;
    }

    setAnalysisState(AnalysisState.ANALYZING);
    setErrorMsg("");

    try {
      const analysis = await analyzeTennisVideo(file);
      setResult(analysis);
      setAnalysisState(AnalysisState.COMPLETE);
    } catch (error) {
      console.error(error);
      setAnalysisState(AnalysisState.ERROR);
      setErrorMsg("Ocorreu um erro ao analisar o vídeo. Tente novamente ou use um vídeo diferente.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">AceCoach<span className="text-emerald-400">AI</span></span>
          </div>
          <div className="text-xs font-medium text-slate-500 px-3 py-1 border border-slate-800 rounded-full">
            Powered by Gemini 2.5
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Melhore seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Saque</span> com IA
          </h1>
          <p className="text-slate-400 text-lg">
            Envie um vídeo do seu movimento. Nossa IA analisa a biomecânica, identifica falhas e cria um plano de treino personalizado em segundos.
          </p>
        </div>

        {/* Uploader Section */}
        <VideoUploader 
          onVideoSelected={handleVideoSelect} 
          isLoading={analysisState === AnalysisState.ANALYZING} 
        />

        {/* Action Button & Loading State */}
        {file && analysisState !== AnalysisState.COMPLETE && (
          <div className="mb-12">
            {analysisState === AnalysisState.ANALYZING ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <p className="text-emerald-400 font-medium animate-pulse">Analisando biomecânica...</p>
               </div>
            ) : (
              <button
                onClick={handleAnalyze}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-emerald-600 rounded-full hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 focus:ring-offset-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                <span className="mr-2">Analisar Movimento</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </button>
            )}
            
            {errorMsg && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center max-w-md mx-auto text-sm">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {analysisState === AnalysisState.COMPLETE && result && (
          <AnalysisDisplay result={result} />
        )}

      </main>

      <footer className="border-t border-slate-900 mt-auto py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} AceCoach AI. Análise gerada por IA pode conter imprecisões.</p>
      </footer>
    </div>
  );
};

export default App;