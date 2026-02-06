import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Target } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ItemsPage = () => {
  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <Link to="/solutions/commerce/catalog" className="flex items-center gap-2 text-purple-600 mb-4 font-semibold"><ArrowLeft className="h-5 w-5"/>Back to Catalog Module</Link>
        <div className="flex items-center gap-4 mb-8"><div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-xl"><Package className="h-10 w-10 text-white"/></div><div><h1 className="text-5xl font-bold text-slate-900">Items Module</h1><p className="text-2xl text-slate-600">Product & Service Definitions</p></div></div>
        
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 mb-12"><h2 className="text-2xl font-bold text-purple-900 mb-4">What is an Item?</h2><p className="text-lg text-purple-800 mb-4">An <strong>Item</strong> is anything tradable in your business: SaaS subscriptions, construction projects, hospital procedures, consulting engagements, manufactured goods, or professional services.</p><div className="bg-white p-6 rounded-xl"><h3 className="font-bold text-slate-900 mb-3">Key Principle:</h3><p className="text-slate-700">Items define <strong>WHAT can be sold</strong> and at <strong>WHAT SCOPE</strong>. This is the foundation upon which pricing and costing attach.</p></div></div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Core Item Features</h2><div className="grid md:grid-cols-2 gap-6">{[
          {title:'Item Registry',desc:'Centralized catalog of all tradable items',features:['Unique item IDs','Item names & descriptions','Category classification','Status (Active/Inactive/Deprecated)','Version control']},
          {title:'Scope Definition',desc:'Clear boundaries of what the item includes',features:['Deliverables specification','Inclusions/exclusions','Service level definitions','Duration/quantity specs','Acceptance criteria']},
          {title:'Category Management',desc:'Hierarchical organization of items',features:['Product families','Sub-categories','Custom taxonomies','Search & filter','Reporting by category']},
          {title:'Lifecycle Management',desc:'Track items through their lifetime',features:['Draft → Active → Deprecated flow','Sunset planning','Replacement item mapping','Historical tracking','Usage analytics']}
        ].map((f,i)=><div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-200"><h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3><p className="text-slate-700 mb-4">{f.desc}</p><ul className="space-y-2">{f.features.map((feat,j)=><li key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600"/><span>{feat}</span></li>)}</ul></div>)}</div></section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Real Example: Cloud Migration Project</h2><div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-3xl border-2 border-purple-200"><div className="space-y-4"><div><p className="text-sm font-semibold text-slate-500">Item Name:</p><p className="text-2xl font-bold text-slate-900">Enterprise Cloud Migration</p></div><div><p className="text-sm font-semibold text-slate-500">Item ID:</p><p className="font-mono text-slate-900">ITEM-CM-001</p></div><div><p className="text-sm font-semibold text-slate-500">Category:</p><p className="text-slate-900">Professional Services → Cloud Solutions → Migration</p></div><div><p className="text-sm font-semibold text-slate-500">Base Scope Includes:</p><ul className="list-disc list-inside space-y-1 text-slate-700"><li>Infrastructure assessment (up to 100 servers)</li><li>Migration strategy & planning</li><li>Data transfer & validation</li><li>6-month post-migration support</li></ul></div><div><p className="text-sm font-semibold text-slate-500">Pricing & Costing:</p><p className="text-slate-700">Once item is defined, <strong>pricing rules</strong> and <strong>cost estimates</strong> attach to this base definition.</p></div></div></div></section>

        <section className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 rounded-3xl text-white mb-16"><h2 className="text-3xl font-bold mb-4">Why Item Clarity Matters</h2><div className="grid md:grid-cols-2 gap-6 mt-6"><div><h3 className="font-bold text-xl mb-3">❌ Without Clear Items:</h3><ul className="space-y-2"><li>• Sales sells vague "consulting"</li><li>• Scope creep inevitable</li><li>• Pricing inconsistent</li><li>• Customer expectations misaligned</li><li>• Delivery confusion</li></ul></div><div><h3 className="font-bold text-xl mb-3">✅ With Defined Items:</h3><ul className="space-y-2"><li>• Sales quotes specific deliverables</li><li>• Scope boundaries clear</li><li>• Pricing consistent</li><li>• Expectations set correctly</li><li>• Delivery streamlined</li></ul></div></div></section>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 text-white text-center"><h2 className="text-3xl font-bold mb-4">Define What You Sell</h2><p className="text-xl mb-6">Clear items = clear pricing = clear delivery</p><Link to="/auth/signup" className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl transition-all">Start Free Trial</Link></div>
      </div>
    </IBCommerceHub>
  );
};

export default ItemsPage;