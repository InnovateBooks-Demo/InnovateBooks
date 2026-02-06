import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, BarChart3, CheckSquare, FileText, ArrowRight, CheckCircle, DollarSign } from 'lucide-react';
import IBCommerceHub from '../IBCommerceHub';

const RevenueModule = () => {
  const stages = [
    {name:'Lead',icon:Target,stage:'1',path:'/solutions/commerce/revenue/lead',desc:'Commercial Intent Capture',what:'Capture opportunity details without commitment',features:['Opportunity tracking','Customer selection','Package/item selection','Initial deal value','No approval required']},
    {name:'Evaluate',icon:BarChart3,stage:'2',path:'/solutions/commerce/revenue/evaluate',desc:'Commercial Viability Assessment',what:'System validates eligibility',features:['Margin calculation','Cost analysis','Risk assessment','Policy compliance check','Pricing rule validation']},
    {name:'Commit',icon:CheckSquare,stage:'3',path:'/solutions/commerce/revenue/commit',desc:'Approval Matrix Execution',what:'Authority-based routing',features:['Automatic routing','Approval workflow','Exception handling','SLA tracking','Decision documentation']},
    {name:'Contract',icon:FileText,stage:'4',path:'/solutions/commerce/revenue/contract',desc:'Legal Commitment',what:'Final agreement execution',features:['Terms finalization','Digital signature','Immutable record','Task auto-assignment','Revenue recognition scheduled']}
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <div className="mb-12"><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl flex items-center justify-center shadow-xl"><TrendingUp className="h-10 w-10 text-white"/></div><div><h1 className="text-5xl font-bold text-slate-900">Revenue Module</h1><p className="text-2xl text-slate-600">What You Plan to Sell</p></div></div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6"><h2 className="text-2xl font-bold text-green-900 mb-2">Not Finance - Permission to Earn</h2><p className="text-lg text-green-800">No invoice. No cash. Only <strong>permission</strong> to earn revenue. Revenue module ends at signed contract.</p></div>
        </div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">The 4-Stage Revenue Journey</h2>
          <div className="space-y-6">
            {stages.map((stage,i)=>{
              const Icon=stage.icon;
              return <div key={i} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:border-green-500 hover:shadow-xl transition-all">
                <div className="bg-gradient-to-r from-green-50 to-white p-6 border-b-2 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">{stage.stage}</div>
                    <div className="flex items-center gap-3"><Icon className="h-8 w-8 text-green-600"/><div><h3 className="text-2xl font-bold text-slate-900">{stage.name}</h3><p className="text-slate-600 font-semibold">{stage.desc}</p></div></div>
                  </div>
                  <Link to={stage.path} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all">Learn More<ArrowRight className="h-5 w-5"/></Link>
                </div>
                <div className="p-6">
                  <p className="text-lg font-semibold text-slate-700 mb-4">{stage.what}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {stage.features.map((f,j)=><div key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0"/><span>{f}</span></div>)}
                  </div>
                </div>
              </div>
            })}
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Key Principle</h2>
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 rounded-3xl text-white">
            <p className="text-2xl leading-relaxed">Revenue module is about <strong>PERMISSION</strong>, not ACCOUNTING. It answers:</p>
            <ul className="mt-6 space-y-3 text-xl">
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Can we sell to this customer? (credit check)</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>At what price and margin? (catalog rules)</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Under whose authority? (approval matrix)</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>What are the terms? (contract finalization)</span></li>
            </ul>
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Business Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[{metric:'100%',label:'Deal Compliance',icon:CheckCircle},{metric:'60%',label:'Faster Approvals',icon:Target},{metric:'30%',label:'Better Margins',icon:DollarSign},{metric:'0',label:'Unauthorized Deals',icon:CheckSquare}].map((stat,i)=>{
              const Icon=stat.icon;
              return <div key={i} className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-3xl text-white text-center"><Icon className="h-10 w-10 mx-auto mb-3"/><p className="text-4xl font-bold mb-2">{stat.metric}</p><p className="text-lg">{stat.label}</p></div>
            })}
          </div>
        </section>

        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Control Your Revenue Pipeline</h2>
          <p className="text-xl mb-6 opacity-90">Every deal follows policy. No surprises.</p>
          <div className="flex justify-center gap-4">
            <Link to="/solutions/commerce/revenue/lead" className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:shadow-xl transition-all">Explore Lead Stage</Link>
            <Link to="/auth/signup" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default RevenueModule;