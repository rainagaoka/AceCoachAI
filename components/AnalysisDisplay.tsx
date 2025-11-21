import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/50';
    if (score >= 70) return 'text-lime-400 border-lime-500/50';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/50';
    return 'text-red-400 border-red-500/50';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Excelente': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'Bom': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'Atenção': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'Crítico': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Resumo do Treinador</h2>
            <p className="text-slate-300 leading-relaxed">{result.summary}</p>
          </div>
          <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(result.overallScore)} bg-slate-900`}>
             <div className="text-center">
                <span className={`text-4xl font-bold ${getScoreColor(result.overallScore).split(' ')[0]}`}>{result.overallScore}</span>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Score</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown Analysis */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            Análise Biomecânica
          </h3>
          <div className="space-y-4">
            {result.breakdown.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-200">{item.aspect}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Strengths & Weaknesses */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Pontos Fortes</h3>
              <ul className="space-y-2">
                {result.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {str}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Oportunidades de Melhoria</h3>
              <ul className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Drill Recommendation */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
             </div>
             <h3 className="text-lg font-bold text-white mb-2 relative z-10">Recomendação de Treino</h3>
             <p className="text-indigo-200 text-sm relative z-10 leading-relaxed">
               {result.drillRecommendation}
             </p>
          </div>
        </div>
      </div>

    </div>
  );
};