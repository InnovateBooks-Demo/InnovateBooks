import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Settings, BarChart3, Book, ArrowRight, CheckCircle, Lock, Activity } from 'lucide-react';
import IBCommerceHub from '../IBCommerceHub';

const GovernanceModule = () => {
  const components = [
    {name:'Policies',icon:FileText,path:'/solutions/commerce/governance/policies',desc:'Commercial Rules & Guardrails',features:['Discount caps','Credit rules','Procurement thresholds','Geographic restrictions','Compliance requirements']},
    {name:'Limits',icon:Settings,path:'/solutions/commerce/governance/limits',desc:'Numerical Caps & Boundaries',features:['Customer exposure limits','Department budgets','Vendor spend limits','Discount ceilings','Authority thresholds']},
    {name:'Authority',icon:Shield,path:'/solutions/commerce/governance/authority',desc:'Approval Rights & Delegation',features:['Role-based authority','Amount-based routing','Risk-based escalation','Geographic controls','Customer tier controls']},
    {name:'Risk Engine',icon:BarChart3,path:'/solutions/commerce/governance/risk',tag:'CENTRAL',desc:'Unified Risk Assessment',features:['Party risk scoring','Deal size evaluation','Geographic risk','Counterparty concentration','Payment history analysis']},
    {name:'Audit Trail',icon:Book,path:'/solutions/commerce/governance/audit',desc:'Immutable Compliance Record',features:['Complete decision history','Who approved what','Policy application tracking','Exception documentation','SOX/SOC2 compliance']}
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <div className="mb-12"><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center shadow-xl"><Shield className="h-10 w-10 text-white"/></div><div><h1 className="text-5xl font-bold text-slate-900">Governance Module</h1><p className="text-2xl text-slate-600">Commercial Constitution</p></div></div>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"><h2 className="text-2xl font-bold text-red-900 mb-2">Why Governance is Central</h2><p className="text-lg text-red-800">Without governance: <strong>Everyone approves everything. Nobody is accountable.</strong></p></div>
        </div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">The 5 Governance Components</h2>
          <div className="space-y-6">
            {components.map((comp,i)=>{
              const Icon=comp.icon;
              return <div key={i} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:border-red-500 hover:shadow-xl transition-all">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center"><Icon className="h-7 w-7 text-white"/></div>
                      <div><div className="flex items-center gap-2 mb-1"><h3 className="text-2xl font-bold text-slate-900">{comp.name}</h3>{comp.tag&&<span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">{comp.tag}</span>}</div><p className="text-slate-600 font-semibold">{comp.desc}</p></div>
                    </div>
                    <Link to={comp.path} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">Learn More<ArrowRight className="h-5 w-5"/></Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">{comp.features.map((f,j)=><div key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0"/><span>{f}</span></div>)}</div>
                </div>
              </div>
            })}
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Central Principle</h2>
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-3xl text-white">
            <p className="text-2xl leading-relaxed mb-6">Governance is <strong>NOT optional</strong> - it is the FOUNDATION that makes all other modules work.</p>
            <ul className="space-y-3 text-xl">
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Policies define what's allowed</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Limits prevent overexposure</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Authority ensures accountability</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Risk Engine flags danger</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Audit Trail proves compliance</span></li>
            </ul>
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Business Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[{metric:'100%',label:'Policy Compliance',icon:CheckCircle},{metric:'0',label:'Unauthorized Deals',icon:Lock},{metric:'Full',label:'Audit Trail',icon:Book},{metric:'80%',label:'Risk Reduction',icon:Shield}].map((stat,i)=>{
              const Icon=stat.icon;
              return <div key={i} className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-3xl text-white text-center"><Icon className="h-10 w-10 mx-auto mb-3"/><p className="text-4xl font-bold mb-2">{stat.metric}</p><p className="text-lg">{stat.label}</p></div>
            })}
          </div>
        </section>

        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Enforce Commercial Rules</h2>
          <p className="text-xl mb-6 opacity-90">100% compliance, zero unauthorized deals</p>
          <div className="flex justify-center gap-4">
            <Link to="/solutions/commerce/governance/policies" className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:shadow-xl transition-all">Explore Policies</Link>
            <Link to="/auth/signup" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default GovernanceModule;