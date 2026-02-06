import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const PricingPage = () => {
  const discountScenario = {basePrice:'$100,000',maxDiscount:'15%',salesAttempts:'$80,000 (20% discount)',systemAction:'BLOCKED - Exceeds policy',required:'Director approval for exception'};
  
  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <Link to="/solutions/commerce/catalog" className="flex items-center gap-2 text-purple-600 mb-4 font-semibold"><ArrowLeft className="h-5 w-5"/>Back to Catalog Module</Link>
        <div className="flex items-center gap-4 mb-8"><div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl flex items-center justify-center shadow-xl"><DollarSign className="h-10 w-10 text-white"/></div><div><h1 className="text-5xl font-bold text-slate-900">Pricing Module</h1><p className="text-2xl text-slate-600">Price Control & Discount Management</p></div></div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 mb-12"><h2 className="text-2xl font-bold text-emerald-900 mb-4">Why Pricing Controls?</h2><p className="text-lg text-emerald-800">Without controls, sales gives excessive discounts to "win the deal". Result: margin erosion, unprofitable deals, inconsistent pricing strategy.</p></div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Pricing Management Features</h2><div className="grid md:grid-cols-2 gap-6">{[
          {title:'Base Price Management',desc:'Standard list prices for all items',features:['Item-level pricing','Currency support','Price history tracking','Effective date ranges','Bulk price updates']},
          {title:'Discount Limit Enforcement',desc:'Maximum discounts per item/segment',features:['Percentage caps','Absolute amount limits','Segment-specific rules','Product-specific rules','Auto-block at quote stage']},
          {title:'Region-Specific Pricing',desc:'Different prices by geography',features:['Country/region pricing','Currency localization','Market positioning','Competitive adjustments','Local tax considerations']},
          {title:'Volume-Based Tiers',desc:'Quantity discounts managed',features:['Tiered pricing schedules','Volume breakpoints','Enterprise pricing','Commitment-based discounts','Annual vs monthly pricing']}
        ].map((f,i)=><div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-200"><h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3><p className="text-slate-700 mb-4">{f.desc}</p><ul className="space-y-2">{f.features.map((feat,j)=><li key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600"/><span>{feat}</span></li>)}</ul></div>)}</div></section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Real Example: Discount Control in Action</h2><div className="bg-white rounded-3xl border-2 border-emerald-200 p-8"><div className="grid md:grid-cols-2 gap-8"><div><h3 className="font-bold text-slate-900 mb-4">Scenario:</h3><div className="space-y-3">{Object.entries(discountScenario).map(([k,v])=><div key={k} className="flex justify-between items-center text-sm"><span className="text-slate-600 capitalize font-semibold">{k.replace(/([A-Z])/g,' $1')}:</span><span className="text-slate-900 font-bold text-right">{v}</span></div>)}</div></div><div className="bg-red-50 p-6 rounded-xl border-2 border-red-200"><p className="font-bold text-red-900 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>What This Prevents:</p><ul className="space-y-2 text-sm text-slate-700"><li>• Unauthorized margin erosion</li><li>• Sales pressure overriding policy</li><li>• Inconsistent pricing to customers</li><li>• Race-to-bottom discounting</li><li>• Unprofitable deals</li></ul></div></div></div></section>

        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 rounded-3xl text-white mb-16"><h2 className="text-3xl font-bold mb-4">Dynamic Pricing (Research-Backed)</h2><p className="text-lg leading-relaxed mb-6">Based on 2024 B2B pricing research: Companies using AI-powered dynamic pricing see 5-15% sales uplift and 2-4% profitability gains. Key strategies:</p><div className="grid md:grid-cols-2 gap-6"><div><h3 className="font-bold mb-3">Value-Based Pricing</h3><p className="text-sm">Price tied to customer value delivered. Works best for differentiated products and high-value solutions.</p></div><div><h3 className="font-bold mb-3">Tiered Pricing</h3><p className="text-sm">Starter to Enterprise tiers. Encourages upsell and accommodates diverse customer segments.</p></div></div></section>

        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white text-center"><h2 className="text-3xl font-bold mb-4">Control Every Price</h2><p className="text-xl mb-6">Protect margins, enforce policy, win profitably</p><Link to="/auth/signup" className="inline-block px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:shadow-xl transition-all">Start Free Trial</Link></div>
      </div>
    </IBCommerceHub>
  );
};

export default PricingPage;