import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, BarChart3, CheckSquare, FileText, ArrowRight, CheckCircle, Shield, TrendingDown } from 'lucide-react';
import IBCommerceHub from '../IBCommerceHub';

const ProcurementModule = () => {
  const stages = [
    {name:'Procure',icon:ShoppingCart,stage:'1',path:'/solutions/commerce/procurement/procure',desc:'Purchase Intent',features:['Vendor selection','Service/material specification','Cost estimation','Delivery requirements','Budget check']},
    {name:'Evaluate',icon:BarChart3,stage:'2',path:'/solutions/commerce/procurement/evaluate',desc:'Commercial Validation',features:['Vendor risk assessment','Budget availability','Cost justification','Alternative analysis','Compliance verification']},
    {name:'Commit',icon:CheckSquare,stage:'3',path:'/solutions/commerce/procurement/commit',desc:'Spend Authority Enforcement',features:['Approval routing','Authority limits','Exception handling','Policy compliance','CFO escalation']},
    {name:'Contract',icon:FileText,stage:'4',path:'/solutions/commerce/procurement/contract',desc:'Vendor Agreement',features:['Terms finalization','Vendor signature','PO generation','Payment terms','Task assignment']}
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <div className="mb-12"><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl flex items-center justify-center shadow-xl"><ShoppingCart className="h-10 w-10 text-white"/></div><div><h1 className="text-5xl font-bold text-slate-900">Procurement Module</h1><p className="text-2xl text-slate-600">What You Plan to Buy</p></div></div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6"><h2 className="text-2xl font-bold text-orange-900 mb-2">Mirror of Revenue for Purchases</h2><p className="text-lg text-orange-800">Same rigor as Revenue, but for <strong>outbound money</strong> instead of inbound</p></div>
        </div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">The 4-Stage Procurement Journey</h2>
          <div className="space-y-6">
            {stages.map((stage,i)=>{
              const Icon=stage.icon;
              return <div key={i} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:border-orange-500 hover:shadow-xl transition-all">
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b-2 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">{stage.stage}</div>
                    <div className="flex items-center gap-3"><Icon className="h-8 w-8 text-orange-600"/><div><h3 className="text-2xl font-bold text-slate-900">{stage.name}</h3><p className="text-slate-600 font-semibold">{stage.desc}</p></div></div>
                  </div>
                  <Link to={stage.path} className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all">Learn More<ArrowRight className="h-5 w-5"/></Link>
                </div>
                <div className="p-6"><div className="grid md:grid-cols-2 gap-3">{stage.features.map((f,j)=><div key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0"/><span>{f}</span></div>)}</div></div>
              </div>
            })}
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Why Procurement Controls?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200"><h3 className="text-xl font-bold text-red-900 mb-4">Without Controls</h3><ul className="space-y-3 text-slate-700">
              <li>❌ Shadow procurement bypasses budget</li><li>❌ Risky vendors engaged without vetting</li><li>❌ No spend visibility</li><li>❌ Maverick spend uncontrolled</li><li>❌ Compliance violations</li></ul></div>
            <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200"><h3 className="text-xl font-bold text-green-900 mb-4">With IB Commerce</h3><ul className="space-y-3 text-slate-700">
              <li>✓ All spend approved through workflow</li><li>✓ Vendors verified for compliance</li><li>✓ Complete spend visibility</li><li>✓ Zero maverick spend</li><li>✓ 100% audit ready</li></ul></div>
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Business Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[{metric:'100%',label:'Spend Visibility',icon:CheckCircle},{metric:'40%',label:'Cost Reduction',icon:TrendingDown},{metric:'0',label:'Maverick Spend',icon:Shield},{metric:'75%',label:'Vendor Compliance',icon:CheckSquare}].map((stat,i)=>{
              const Icon=stat.icon;
              return <div key={i} className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-3xl text-white text-center"><Icon className="h-10 w-10 mx-auto mb-3"/><p className="text-4xl font-bold mb-2">{stat.metric}</p><p className="text-lg">{stat.label}</p></div>
            })}
          </div>
        </section>

        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Control Every Dollar Spent</h2>
          <p className="text-xl mb-6 opacity-90">Reduce costs by 40% through intelligent procurement</p>
          <div className="flex justify-center gap-4">
            <Link to="/solutions/commerce/procurement/procure" className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:shadow-xl transition-all">Explore Procurement</Link>
            <Link to="/auth/signup" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default ProcurementModule;