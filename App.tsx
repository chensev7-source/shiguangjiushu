
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserChoice, FeedbackData, AIAnalysisReport, PathType } from './types';
import { STORY_NODES } from './constants';
import { generateJourneyAnalysis } from './services/gemini';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Sub-components
const Header = () => (
  <header className="text-center mb-8 opacity-60 tracking-widest text-xs uppercase font-sans py-4">
    Interactive Narrative Lab
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'welcome' | 'story' | 'feedback' | 'report' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('story-node-1');
  const [journey, setJourney] = useState<UserChoice[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [report, setReport] = useState<AIAnalysisReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Login ---
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    setUser({ username, isGuest: false });
    setView('welcome');
  };

  const guestLogin = () => {
    setUser({ username: `旅客_${Math.floor(Math.random() * 1000)}`, isGuest: true });
    setView('welcome');
  };

  // --- Story Navigation ---
  const makeChoice = (nextId: string, path: PathType, text: string) => {
    setJourney(prev => [...prev, { nodeId: currentNodeId, path, choiceText: text, timestamp: Date.now() }]);
    if (nextId) {
      setCurrentNodeId(nextId);
    } else {
      setView('feedback');
    }
  };

  useEffect(() => {
    const node = STORY_NODES[currentNodeId];
    if (node && node.choices.length === 0 && view === 'story') {
      // Auto transition to feedback after some delay if it's an ending?
      // For now, let user click a button rendered in the Story component
    }
  }, [currentNodeId, view]);

  // --- Feedback & Report ---
  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const f: FeedbackData = {
      agency: Number(formData.get('agency')),
      emotion: Number(formData.get('emotion')),
      comment: formData.get('comment') as string
    };
    setFeedback(f);
    setIsGenerating(true);
    setView('report');

    try {
      const analysis = await generateJourneyAnalysis(user?.username || "Unknown", journey, f);
      setReport(analysis);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const restart = () => {
    setJourney([]);
    setCurrentNodeId('story-node-1');
    setView('story');
    setReport(null);
  };

  // --- Render Utils ---
  const renderCurrentView = () => {
    switch (view) {
      case 'login':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-fadeIn">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">旧书店的秘密</h1>
            <p className="text-slate-500 italic mb-10 font-serif">一段关于寻找、迷失与救赎的互动旅程</p>
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <input 
                name="username" 
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                placeholder="请输入你的署名" 
                required 
              />
              <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition shadow-lg">
                开启阅读旅程
              </button>
            </form>
            <div className="flex items-center my-6 w-full max-w-sm">
              <hr className="flex-grow border-slate-200" /><span className="px-3 text-slate-300">或</span><hr className="flex-grow border-slate-200" />
            </div>
            <button onClick={guestLogin} className="w-full max-w-sm bg-white border border-slate-300 text-slate-600 font-bold py-3 rounded-lg hover:bg-slate-50 transition">
              🍃 以游客身份漫游
            </button>
          </div>
        );

      case 'welcome':
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center border-b border-dashed pb-6 mb-8 font-serif">序章：关于选择</h2>
            <div className="space-y-6 text-lg text-slate-700 font-serif leading-relaxed text-justify">
              <p>你好，<span className="text-blue-500 font-bold border-b-2 border-blue-100">{user?.username}</span>。</p>
              <p>欢迎来到这家名为“拾光”的旧书店。在这里，你将不再是一个旁观者，而是故事的主角。</p>
              <p>你即将经历一个关于承诺、欲望、真相与温情的故事。请注意，你的每一次选择都不仅仅是点击一个按钮，它们是通往不同平行宇宙的钥匙。</p>
              <p className="text-right italic text-slate-400">— 一切，由你决定。</p>
            </div>
            <div className="mt-12 text-center">
              <button 
                onClick={() => setView('story')} 
                className="bg-slate-800 text-white font-bold px-10 py-4 rounded-lg hover:transform hover:-translate-y-1 transition shadow-xl"
              >
                推开书店的门
              </button>
            </div>
          </div>
        );

      case 'story':
        const node = STORY_NODES[currentNodeId];
        return (
          <div className="p-8 flex flex-col min-h-[500px] animate-fadeIn">
            <h2 className="text-2xl font-bold text-center border-b border-dashed pb-6 mb-8 font-serif">{node.title}</h2>
            <div className="flex-grow space-y-4 text-lg text-slate-700 font-serif leading-loose text-justify">
              {node.content.map((p, i) => <p key={i} className="indent-8">{p}</p>)}
            </div>
            <div className="mt-10 space-y-4">
              {node.choices.length > 0 ? (
                node.choices.map(choice => (
                  <button 
                    key={choice.id}
                    onClick={() => makeChoice(choice.nextId, choice.path, choice.text)}
                    className="w-full text-left p-5 border-l-4 border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-500 hover:translate-x-1 transition rounded-r-lg shadow-sm"
                  >
                    <div className="font-bold text-slate-800">{choice.text}</div>
                    <div className="text-sm text-slate-400 font-normal">{choice.subtext}</div>
                  </button>
                ))
              ) : (
                <div className="text-center">
                   <button 
                    onClick={() => setView('feedback')}
                    className="bg-slate-800 text-white font-bold px-10 py-4 rounded-lg hover:bg-slate-700 transition"
                  >
                    进入反馈页面
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center border-b border-dashed pb-6 mb-8 font-serif">阅读体验反馈</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block font-bold">1. 代理感：你认为自己的选择改变了结局吗？</label>
                <div className="flex bg-slate-50 p-2 rounded-lg border">
                  {[1, 2, 3, 4, 5].map(v => (
                    <label key={v} className="flex-1 text-center cursor-pointer group">
                      <input type="radio" name="agency" value={v} className="hidden peer" required />
                      <div className="p-3 rounded-md transition peer-checked:bg-blue-500 peer-checked:text-white group-hover:bg-slate-200">
                        <div className="text-xl font-bold">{v}</div>
                        <div className="text-[10px] text-slate-400 peer-checked:text-blue-100">{v === 1 ? '无影响' : v === 5 ? '完全主导' : ''}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block font-bold">2. 情感体验满意度：</label>
                <div className="flex bg-slate-50 p-2 rounded-lg border">
                  {[1, 2, 3, 4, 5].map(v => (
                    <label key={v} className="flex-1 text-center cursor-pointer group">
                      <input type="radio" name="emotion" value={v} className="hidden peer" required />
                      <div className="p-3 rounded-md transition peer-checked:bg-blue-500 peer-checked:text-white group-hover:bg-slate-200">
                        <div className="text-xl font-bold">{v}</div>
                        <div className="text-[10px] text-slate-400">{v === 1 ? '不满意' : v === 5 ? '非常满意' : ''}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block font-bold">3. 简短留言：</label>
                <textarea 
                  name="comment" 
                  className="w-full p-4 border rounded-lg min-h-[120px] outline-none focus:ring-2 focus:ring-blue-400" 
                  placeholder="你的感受..."
                ></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-slate-800 text-white font-bold px-12 py-4 rounded-lg hover:bg-slate-700 transition">
                  提交并生成 AI 报告
                </button>
              </div>
            </form>
          </div>
        );

      case 'report':
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center border-b border-dashed pb-6 mb-8 font-serif">专属情感报告</h2>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
                <p className="text-slate-500 font-serif">AI 正在深度分析你的灵魂路径...</p>
              </div>
            ) : report ? (
              <div id="report-card" className="bg-white border p-8 rounded-lg shadow-inner font-serif space-y-8 leading-relaxed">
                <div className="text-center border-b border-dashed pb-6">
                  <h3 className="text-xl font-bold mb-2">《拾光叙事·专属情感分析》</h3>
                  <p className="text-sm text-slate-400">体验者：{user?.username} | 日期：{new Date().toLocaleDateString()}</p>
                </div>
                <section>
                  <h4 className="font-bold border-l-4 border-slate-800 pl-3 mb-4">一、旅程概览</h4>
                  <p className="text-slate-700">{report.overview}</p>
                </section>
                <section className="bg-slate-50 p-6 rounded-lg border">
                  <h4 className="font-bold border-l-4 border-blue-500 pl-3 mb-4">二、情感画像定位</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold">{report.persona.tag}</span>
                    <span className="text-sm text-slate-500">匹配契合度：{report.persona.matchRate}%</span>
                  </div>
                  <p className="text-slate-700 italic text-sm">{report.persona.description}</p>
                </section>
                <section>
                  <h4 className="font-bold border-l-4 border-slate-800 pl-3 mb-4">三、阅读/生活推荐</h4>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center text-slate-700">
                        <span className="mr-2 text-blue-500">📖</span> {rec}
                      </li>
                    ))}
                  </ul>
                </section>
                <div className="text-center py-6 border-t border-dashed mt-10">
                  <p className="text-lg italic text-slate-800">"{report.message}"</p>
                </div>
                <div className="flex justify-center space-x-4 mt-8 no-print">
                  <button onClick={restart} className="bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-lg hover:bg-slate-200 transition">重新开始</button>
                  <button onClick={() => setView('dashboard')} className="bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-700 transition">查看大盘</button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-red-500">生成失败，请重试</div>
            )}
          </div>
        );

      case 'dashboard':
        const pathData = [
          { name: '救赎', value: 35, color: '#3498db' },
          { name: '沉沦', value: 15, color: '#2c3e50' },
          { name: '悬疑', value: 25, color: '#e67e22' },
          { name: '温情', value: 25, color: '#2ecc71' }
        ];
        const agencyData = [
          { name: '1', score: 5 },
          { name: '2', score: 12 },
          { name: '3', score: 38 },
          { name: '4', score: 25 },
          { name: '5', score: 20 },
        ];

        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center border-b border-dashed pb-6 mb-8 font-serif">实验数据大盘</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl border h-[350px]">
                <h3 className="text-center font-bold mb-4">情感路径全局分布</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={pathData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {pathData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-xl border h-[350px]">
                <h3 className="text-center font-bold mb-4">代理感评分趋势</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={agencyData}>
                    <XAxis dataKey="name" label={{ value: '评分', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#34495e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="text-center">
              <button onClick={() => setView('welcome')} className="bg-slate-800 text-white font-bold px-12 py-4 rounded-lg hover:bg-slate-700 transition">返回首页</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <Header />
      <main className="bg-white w-full max-w-4xl min-h-[650px] rounded-lg shadow-2xl border-l-[6px] border-slate-300 relative overflow-hidden transition-all duration-500">
        {renderCurrentView()}
      </main>
      <footer className="mt-8 text-slate-400 text-xs text-center font-serif">
        &copy; {new Date().getFullYear()} 拾光旧书店交互叙事实验室 | Powered by Gemini 3 Flash
      </footer>
    </div>
  );
};

export default App;
