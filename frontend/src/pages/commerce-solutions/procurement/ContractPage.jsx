import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Target, Clock, DollarSign, RefreshCw, Scale, Calendar, Users, Bell, Building2 } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ProcurementContractPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const vendorContractTypes = [
    {
      type: 'Master Service Agreement (MSA)',
      description: 'Umbrella agreement governing overall relationship',
      elements: ['General terms', 'Liability', 'IP rights', 'Confidentiality', 'Dispute resolution'],
      duration: 'Multi-year, typically 3-5 years'
    },
    {
      type: 'Statement of Work (SOW)',
      description: 'Specific project or engagement details',
      elements: ['Scope', 'Deliverables', 'Timeline', 'Pricing', 'Acceptance criteria'],
      duration: 'Project-specific'
    },
    {
      type: 'Purchase Agreement',
      description: 'Terms for buying goods',
      elements: ['Product specs', 'Pricing', 'Delivery', 'Warranty', 'Returns'],
      duration: 'Per order or annual'
    },
    {
      type: 'SaaS/Subscription Agreement',
      description: 'Software or service subscription',
      elements: ['Service description', 'SLAs', 'Data handling', 'Pricing', 'Renewal terms'],
      duration: 'Annual or multi-year'
    }
  ];

  const keyTerms = [
    {
      term: 'Limitation of Liability',
      importance: 'Caps vendor financial exposure',
      ourPosition: 'Push for higher limits, reject unlimited liability on our side',
      watchFor: 'Mutual unlimited liability clauses'
    },
    {
      term: 'Indemnification',
      importance: 'Who covers legal costs and damages',
      ourPosition: 'Vendor indemnifies for IP infringement, their negligence',
      watchFor: 'Overly broad indemnification requirements on us'
    },
    {
      term: 'Data Protection',
      importance: 'How our data is handled',
      ourPosition: 'Data remains ours, deletion on termination, security requirements',
      watchFor: 'Vendor claims to aggregated/anonymized data'
    },
    {
      term: 'Termination Rights',
      importance: 'Ability to exit the relationship',
      ourPosition: 'Termination for convenience with reasonable notice',
      watchFor: 'Long lock-in periods, high termination penalties'
    },
    {
      term: 'Price Escalation',
      importance: 'Future cost predictability',
      ourPosition: 'Cap annual increases, require notice period',
      watchFor: 'Unlimited price increase rights'
    },
    {
      term: 'Auto-Renewal',
      importance: 'Contract continuation mechanics',
      ourPosition: 'Reasonable notice period (60-90 days), easy opt-out',
      watchFor: 'Short notice periods, automatic multi-year renewals'
    }
  ];

  const realScenarios = [
    {
      title: 'The Vendor Lock-In Trap',
      company: 'Enterprise Company',
      situation: 'Signed 5-year SaaS contract with early termination penalty of remaining contract value. After 2 years, better solution emerged.',
      problem: {
        contractRemaining: '3 years',
        annualCost: '$300,000',
        terminationPenalty: '$900,000 (100% of remaining)',
        betterAlternative: '$180,000/year with better features'
      },
      choice: 'Pay $900K penalty OR stay with inferior solution for 3 more years',
      decision: 'Stayed with inferior solution. Lost competitive advantage.',
      withSystem: {
        negotiation: [
          'Max 3-year initial term',
          'Termination penalty capped at 50% of remaining',
          'Early termination right after Year 2',
          'Price protection clauses'
        ],
        outcome: 'Could have switched with $150K penalty instead of $900K lock-in.'
      }
    },
    {
      title: 'The Data Hostage Situation',
      company: 'Financial Services',
      situation: 'Vendor contract didn\'t specify data export. When switching vendors, export fees quoted at $250K.',
      contractGap: {
        missing: 'Data export rights and format',
        vendorPosition: '"Data export is a professional service"',
        exportCost: '$250,000 for CSV exports',
        timeline: '6 months to extract all data'
      },
      withSystem: {
        requirements: [
          'Data export in standard formats at no cost',
          'API access for ongoing data extraction',
          'Complete data deletion post-termination',
          'Transition assistance period included'
        ],
        outcome: 'Data portability guaranteed in contract. Smooth transition at contract end.'
      }
    },
    {
      title: 'The Unlimited Liability Nightmare',
      company: 'Tech Startup',
      situation: 'Signed vendor contract with mutual unlimited liability. Vendor service outage caused customer data loss.',
      incident: {
        vendorOutage: '72 hours',
        dataLost: 'Customer records for 30-day period',
        customerClaims: '$2.1M in damages',
        vendorResponse: '"You indemnify us per contract"',
        outcome: 'Startup liable for full $2.1M, vendor covered nothing'
      },
      lesson: 'Unlimited liability sounds "fair" until you realize the asymmetry of risk',
      withSystem: {
        protections: [
          'Vendor liability minimum 2x annual contract value',
          'Carve-outs for data loss and security breaches',
          'Insurance requirements (minimum $5M E&O)',
          'Cyber insurance requirement for data handlers'
        ],
        outcome: 'Vendor insurance would have covered majority. Capped remaining exposure.'
      }
    }
  ];

  const contractChecklist = [
    { category: 'Legal Review', items: ['Limitation of liability acceptable', 'Indemnification balanced', 'IP rights clear', 'Dispute resolution appropriate'] },
    { category: 'Commercial Terms', items: ['Pricing clear and complete', 'Escalation capped', 'Payment terms acceptable', 'Renewal terms documented'] },
    { category: 'Data & Security', items: ['Data ownership confirmed', 'Security requirements met', 'Compliance certifications valid', 'Export rights documented'] },
    { category: 'Exit Strategy', items: ['Termination rights clear', 'Penalties acceptable', 'Transition assistance defined', 'Data return/deletion specified'] }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/procurement" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Procurement Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-800 rounded-3xl flex items-center justify-center shadow-xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Contract Module</h1>
            <p className="text-2xl text-slate-600">Vendor Agreements & Term Management</p>
          </div>
        </div>

        <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-violet-900 mb-2">
            <strong>Purpose:</strong> Vendor contracts define your obligations and protections. Manage them to avoid lock-in, control costs, and protect your data.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Term Standardization</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Renewal Management</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Risk Protection</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'types', label: 'Contract Types', icon: Building2 },
              { key: 'terms', label: 'Key Terms', icon: Scale },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-violet-600 text-violet-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Vendor Contract Management Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Contract Management
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Sign whatever vendor sends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Auto-renewals at unfavorable terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Data stuck with vendor on exit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Liability exposure unknown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Price increases uncapped</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Contracts
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Standardized terms with deviation tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Renewal alerts 90 days in advance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Data portability requirements enforced</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Liability caps documented and tracked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Price escalation controls negotiated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Vendor Contracts Are Not Neutral</h2>
              <p className="text-xl leading-relaxed">
                Every vendor contract is written by the vendor's lawyers to protect the vendor. Your job is to balance the terms—protecting your data, limiting your liability, and preserving your flexibility.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Contract Review Checklist</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contractChecklist.map((category, index) => (
                  <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{category.category}</h3>
                    <ul className="space-y-3">
                      {category.items.map((item, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-violet-600" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-6">
            {vendorContractTypes.map((type, index) => (
              <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{type.type}</h3>
                  <p className="text-slate-700">{type.description}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Key Elements:</h4>
                    <ul className="space-y-2">
                      {type.elements.map((el, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle className="h-4 w-4 text-violet-600" />
                          {el}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <h4 className="font-bold text-violet-900 mb-2">Typical Duration:</h4>
                    <p className="text-violet-800">{type.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="bg-violet-50 p-6 rounded-2xl border-2 border-violet-200">
              <h2 className="text-2xl font-bold text-violet-900 mb-2">Key Contract Terms</h2>
              <p className="text-violet-800">Terms that matter most in vendor contracts</p>
            </div>

            {keyTerms.map((term, index) => (
              <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{term.term}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-700 mb-2">Why Important:</h4>
                    <p className="text-slate-600 text-sm">{term.importance}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-bold text-green-700 mb-2">Our Position:</h4>
                    <p className="text-green-600 text-sm">{term.ourPosition}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <h4 className="font-bold text-red-700 mb-2">Watch For:</h4>
                    <p className="text-red-600 text-sm">{term.watchFor}</p>
                  </div>
                </div>
              </div>
            ))}
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
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Problem</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.problem).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.contractGap && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Contract Gap</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.contractGap).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.incident && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Incident</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.incident).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.choice && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <p className="font-semibold text-yellow-900">Choice: {scenario.choice}</p>
                      {scenario.decision && <p className="text-yellow-800 mt-2">Decision: {scenario.decision}</p>}
                    </div>
                  )}

                  {scenario.lesson && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <p className="font-semibold text-yellow-900">{scenario.lesson}</p>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Proper Contract Terms</h3>
                      {scenario.withSystem.negotiation && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.negotiation.map((n, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {n}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withSystem.requirements && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.requirements.map((r, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <Shield className="h-4 w-4 text-green-600" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withSystem.protections && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.protections.map((p, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <Shield className="h-4 w-4 text-green-600" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="font-bold text-green-800">{scenario.withSystem.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-violet-600 to-violet-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Protect Your Organization</h2>
          <p className="text-xl mb-6 opacity-90">
            Better contracts. Less risk. More flexibility.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-violet-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default ProcurementContractPage;
