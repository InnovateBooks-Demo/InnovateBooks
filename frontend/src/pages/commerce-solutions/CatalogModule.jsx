import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, BarChart3, Shield, Database, ArrowRight, CheckCircle } from 'lucide-react';
import IBCommerceHub from '../IBCommerceHub';

const CatalogModule = () => {
  const subModules = [
    {name:'Items',icon:Package,path:'/solutions/commerce/catalog/items',tagline:'Product & Service Definitions',features:['Tradable item registry','Scope & specifications','Category management','Status lifecycle','Version control']},
    {name:'Pricing',icon:DollarSign,path:'/solutions/commerce/catalog/pricing',tagline:'Price Control & Discount Management',features:['Base price management','Discount limit enforcement','Region-specific pricing','Volume-based tiers','Promotional pricing']},
    {name:'Costing',icon:BarChart3,path:'/solutions/commerce/catalog/costing',tagline:'Margin Protection',features:['Expected cost estimation','Labor & material costs','Partner/subcontractor costs','Overhead allocation','Margin analysis']},
    {name:'Rules',icon:Shield,path:'/solutions/commerce/catalog/rules',tagline:'Commercial Guardrails',features:['Minimum margin enforcement','Geographic restrictions','Compliance checks','Approval requirements','Policy automation']},
    {name:'Packages',icon:Database,path:'/solutions/commerce/catalog/packages',tagline:'Market-Facing Bundles',features:['Bundle definitions','Component mapping','Package pricing','Cost expansion','Rule inheritance']}
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-xl"><Package className="h-10 w-10 text-white"/></div>
            <div><h1 className="text-5xl font-bold text-slate-900">Catalog Module</h1><p className="text-2xl text-slate-600">What You Are Allowed to Trade</p></div>
          </div>
        </div>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">Why Catalog Controls Matter</h2>
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 rounded-3xl text-white mb-8">
            <p className="text-xl leading-relaxed mb-4">Deals fail because:</p>
            <ul className="space-y-2 text-lg">
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Sales sells the <strong>wrong thing</strong></span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Pricing is <strong>uncontrolled</strong> (excessive discounts)</span></li>
              <li className="flex items-center gap-3"><CheckCircle className="h-6 w-6"/><span>Costs are <strong>underestimated</strong> (margin erosion)</span></li>
            </ul>
            <p className="text-xl mt-4">Catalog defines <strong>commercial truth</strong>, not inventory.</p>
          </div>
        </section>

        <section className="mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-6">The 5 Catalog Components</h2>
          <div className="space-y-6">
            {subModules.map((sub,i)=>{
              const Icon=sub.icon;
              return <div key={i} className="bg-white rounded-3xl border-2 border-slate-200 p-8 hover:border-purple-500 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center"><Icon className="h-7 w-7 text-white"/></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">{sub.name}</h3><p className="text-slate-600 font-semibold">{sub.tagline}</p></div>
                  </div>
                  <Link to={sub.path} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">Learn More<ArrowRight className="h-5 w-5"/></Link>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {sub.features.map((f,j)=><div key={j} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0"/><span>{f}</span></div>)}
                </div>
              </div>
            })}
          </div>
        </section>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Control What You Sell</h2>
          <p className="text-xl mb-6 opacity-90">Prevent margin erosion and pricing chaos</p>
          <div className="flex justify-center gap-4">
            <Link to="/solutions/commerce/catalog/items" className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl transition-all">Explore Items Module</Link>
            <Link to="/auth/signup" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default CatalogModule;