import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, CheckCircle, AlertTriangle, Package, DollarSign, Layers, Settings, FileText, Target, Award, Zap } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const PackagesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const packageTypes = [
    {
      name: 'Product Bundles',
      description: 'Multiple products sold together at a combined price',
      example: {
        name: 'Starter Suite',
        components: ['CRM License', 'Support Package', 'Training Credits'],
        individualPrice: '$15,000',
        bundlePrice: '$12,000',
        savings: '20%'
      },
      benefits: ['Simplified purchasing', 'Predictable revenue', 'Increased deal size']
    },
    {
      name: 'Tiered Offerings',
      description: 'Good/Better/Best packaging for market segmentation',
      example: {
        tiers: [
          { name: 'Basic', price: '$99/mo', features: '5 users, Core features' },
          { name: 'Professional', price: '$299/mo', features: '25 users, Advanced features' },
          { name: 'Enterprise', price: '$999/mo', features: 'Unlimited, All features' }
        ]
      },
      benefits: ['Clear upgrade path', 'Market coverage', 'Value-based pricing']
    },
    {
      name: 'Solution Packages',
      description: 'Complete solutions combining products, services, and support',
      example: {
        name: 'Digital Transformation Package',
        components: ['Software Licenses', 'Implementation Services', 'Training', '12-month Support'],
        totalValue: '$500,000'
      },
      benefits: ['Outcome-focused', 'Higher deal value', 'Competitive differentiation']
    },
    {
      name: 'Add-On Packages',
      description: 'Optional enhancements to base offerings',
      example: {
        base: 'Platform License',
        addOns: ['Premium Support (+$2K/mo)', 'Advanced Analytics (+$1K/mo)', 'API Access (+$500/mo)']
      },
      benefits: ['Upsell opportunities', 'Customer choice', 'Revenue expansion']
    }
  ];

  const packageComponents = [
    {
      component: 'Items',
      role: 'What\'s included in the package',
      example: 'Software licenses, service hours, support tiers',
      linkage: 'Package → Items (many-to-many)'
    },
    {
      component: 'Pricing',
      role: 'How the package is priced',
      example: 'Bundle discount, tiered pricing, value-based',
      linkage: 'Package pricing can differ from sum of components'
    },
    {
      component: 'Costing',
      role: 'What it costs to deliver the package',
      example: 'Sum of component costs + integration overhead',
      linkage: 'Cost expansion: Package → Component costs → Total'
    },
    {
      component: 'Rules',
      role: 'What constraints apply to the package',
      example: 'Discount limits, approval requirements, eligibility',
      linkage: 'Rules can be inherited from components or package-specific'
    }
  ];

  const realScenarios = [
    {
      title: 'The Bundle That Broke Margins',
      company: 'Enterprise Software Company',
      situation: 'Sales created custom bundle for large customer, combining 5 products. Discounted 30% off total list price.',
      problem: {
        listPrice: '$500,000',
        discount: '30%',
        bundlePrice: '$350,000',
        actualCost: '$310,000',
        margin: '11% (target was 35%)'
      },
      rootCause: 'No visibility into component costs. Bundle pricing not connected to cost model.',
      withSystem: {
        process: 'System calculates total cost when bundle created',
        visibility: 'Shows margin at proposed price before quote sent',
        guidance: 'Minimum bundle price = $417K for 25% margin',
        outcome: 'Bundle priced at $425K (22% discount). 27% margin achieved.'
      }
    },
    {
      title: 'The Tier Confusion',
      company: 'SaaS Platform',
      situation: 'Sales team offering inconsistent discounts across tiers. Professional tier being sold cheaper than Basic in some deals.',
      problem: {
        basicPrice: '$99/mo, discounted to $79/mo (20% off)',
        proPrice: '$299/mo, discounted to $149/mo (50% off)',
        result: 'Customers gaming the system, revenue cannibalization'
      },
      withSystem: {
        rules: [
          'Basic tier: max 15% discount',
          'Professional tier: max 25% discount',
          'Enterprise tier: max 35% discount'
        ],
        constraint: 'Higher tiers must always be > lower tier final price',
        outcome: 'Pricing integrity restored, clear tier value maintained'
      }
    }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/catalog" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Catalog Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl flex items-center justify-center shadow-xl">
            <Database className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Packages Module</h1>
            <p className="text-2xl text-slate-600">Market-Facing Bundles & Solution Design</p>
          </div>
        </div>

        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-indigo-900 mb-2">
            <strong>Purpose:</strong> Create market-facing bundles that combine items, apply special pricing, and inherit appropriate rules. Packages are how customers see and buy your offerings.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Bundle Definition</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Package Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Cost Expansion</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'types', label: 'Package Types', icon: Package },
              { key: 'architecture', label: 'Architecture', icon: Settings },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Items vs. Packages</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Package className="h-6 w-6 text-slate-600" />
                    Items (Internal View)
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Individual products or services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Base pricing and costing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Building blocks for packages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>May not be sold standalone</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-indigo-600" />
                    Packages (Market View)
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>Combinations of items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>Package-level pricing (often discounted)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>What customers actually buy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>Market positioning and messaging</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Package = Items + Pricing + Rules</h2>
              <p className="text-xl leading-relaxed mb-6">
                A package brings together catalog components into a market-ready offering. The system automatically expands packages to their underlying items for costing, while presenting unified pricing to customers.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-4 rounded-xl text-center">
                  <Layers className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-bold">Composition</h4>
                  <p className="text-sm opacity-80">Which items are included?</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-bold">Pricing</h4>
                  <p className="text-sm opacity-80">How is it priced?</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-bold">Rules</h4>
                  <p className="text-sm opacity-80">What constraints apply?</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">How Packages Connect to Catalog</h2>
              <div className="space-y-4">
                {packageComponents.map((comp, i) => (
                  <div key={`item-${i}`} className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{comp.component}</h3>
                        <p className="text-slate-700 mb-2">{comp.role}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <span className="font-semibold text-slate-600">Example: </span>
                            <span className="text-slate-700">{comp.example}</span>
                          </div>
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <span className="font-semibold text-indigo-600">Linkage: </span>
                            <span className="text-indigo-800">{comp.linkage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-8">
            {packageTypes.map((type, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{type.name}</h3>
                  <p className="text-slate-700">{type.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-4">Example:</h4>
                      {type.example.name && (
                        <div className="space-y-3">
                          <p className="font-semibold text-indigo-600">{type.example.name}</p>
                          {type.example.components && (
                            <ul className="space-y-1">
                              {type.example.components.map((comp, i) => (
                                <li key={`item-${i}`} className="text-sm text-slate-700 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  {comp}
                                </li>
                              ))}
                            </ul>
                          )}
                          {type.example.individualPrice && (
                            <div className="pt-3 border-t border-slate-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Individual Price:</span>
                                <span className="line-through text-slate-400">{type.example.individualPrice}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Bundle Price:</span>
                                <span className="font-bold text-green-600">{type.example.bundlePrice}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Savings:</span>
                                <span className="font-bold text-indigo-600">{type.example.savings}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {type.example.tiers && (
                        <div className="space-y-3">
                          {type.example.tiers.map((tier, i) => (
                            <div key={`item-${i}`} className="bg-white p-3 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-900">{tier.name}</span>
                                <span className="font-bold text-indigo-600">{tier.price}</span>
                              </div>
                              <p className="text-xs text-slate-600">{tier.features}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {type.example.base && (
                        <div className="space-y-3">
                          <p className="font-semibold text-slate-900">Base: {type.example.base}</p>
                          <ul className="space-y-1">
                            {type.example.addOns.map((addOn, i) => (
                              <li key={`item-${i}`} className="text-sm text-slate-700 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                {addOn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4">Benefits:</h4>
                      <ul className="space-y-3">
                        {type.benefits.map((benefit, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-slate-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Package Architecture</h2>
              <p className="text-indigo-800">How packages connect to the rest of the catalog system</p>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Package Data Model</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-slate-900 text-green-400 p-6 rounded-xl overflow-x-auto">
                  <pre>{`Package {
  id: "PKG-001"
  name: "Enterprise Suite"
  description: "Complete enterprise solution"
  status: "Active"
  
  // Composition
  items: [
    { item_id: "ITEM-001", quantity: 1 },
    { item_id: "ITEM-002", quantity: 1 },
    { item_id: "SVC-001", quantity: 100 }  // 100 service hours
  ]
  
  // Pricing (package level, not sum of items)
  pricing: {
    list_price: 150000,
    pricing_model: "Fixed",
    bundle_discount: 0.20  // 20% off sum of items
  }
  
  // Rules (inherited + package-specific)
  rules: [
    { rule_id: "MIN_MARGIN_25" },
    { rule_id: "ENTERPRISE_APPROVAL" }
  ]
  
  // Metadata
  effective_date: "2024-01-01"
  end_date: null
  eligible_segments: ["Enterprise", "Mid-Market"]
}`}</pre>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Cost Expansion Flow</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Quote Created', desc: 'Sales selects "Enterprise Suite" package' },
                  { step: '2', title: 'System Expands Package', desc: 'Retrieves all component items and quantities' },
                  { step: '3', title: 'Cost Calculation', desc: 'Calculates cost for each component item' },
                  { step: '4', title: 'Total Cost Aggregation', desc: 'Sums component costs + any package overhead' },
                  { step: '5', title: 'Margin Check', desc: 'Compares package price to total cost' },
                  { step: '6', title: 'Rule Validation', desc: 'Checks margin rules, approval requirements' }
                ].map((step, i) => (
                  <div key={`item-${i}`} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-8">
            {realScenarios.map((scenario, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{scenario.title}</h2>
                  <p className="text-xl opacity-90">{scenario.company}</p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Situation:</h3>
                    <p className="text-lg text-slate-700">{scenario.situation}</p>
                  </div>

                  {scenario.problem && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ The Problem</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.problem).map(([key, value], i) => (
                          <div key={`item-${i}`} className="flex justify-between">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                      {scenario.rootCause && (
                        <p className="mt-4 text-red-700 font-semibold">{scenario.rootCause}</p>
                      )}
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Packages Module</h3>
                      <div className="space-y-3">
                        {scenario.withSystem.process && (
                          <p className="text-slate-700">{scenario.withSystem.process}</p>
                        )}
                        {scenario.withSystem.visibility && (
                          <p className="text-slate-700">{scenario.withSystem.visibility}</p>
                        )}
                        {scenario.withSystem.guidance && (
                          <p className="font-semibold text-green-700">{scenario.withSystem.guidance}</p>
                        )}
                        {scenario.withSystem.rules && (
                          <ul className="space-y-2">
                            {scenario.withSystem.rules.map((rule, i) => (
                              <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                {rule}
                              </li>
                            ))}
                          </ul>
                        )}
                        {scenario.withSystem.constraint && (
                          <p className="bg-green-100 p-3 rounded-lg text-green-800 font-semibold">{scenario.withSystem.constraint}</p>
                        )}
                        <p className="font-bold text-green-800">{scenario.withSystem.outcome}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Build Better Bundles</h2>
          <p className="text-xl mb-6 opacity-90">
            Create market-winning packages with built-in margin protection
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-xl transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </IBCommerceHub>
  );
};

export default PackagesPage;
