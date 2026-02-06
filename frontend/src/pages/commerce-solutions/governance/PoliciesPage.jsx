import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Target, Book, Settings, Users, Lock, Zap, Scale } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const policyCategories = [
    {
      category: 'Pricing Policies',
      description: 'Rules governing how products and services are priced',
      policies: [
        { name: 'Discount Authority', rule: 'Define who can approve what level of discount', example: 'Manager: 15%, Director: 25%, VP: 35%, CFO: 50%+' },
        { name: 'Price Floor', rule: 'Minimum price to protect margins', example: 'No sale below cost + 15% minimum margin' },
        { name: 'Bundle Pricing', rule: 'Rules for combined product pricing', example: 'Bundle discount max 25% off sum of components' },
        { name: 'Promotional Limits', rule: 'Constraints on promotional pricing', example: 'Promos limited to 30 days, max 20% off' }
      ]
    },
    {
      category: 'Credit Policies',
      description: 'Rules for extending credit to customers',
      policies: [
        { name: 'Credit Limits', rule: 'Maximum exposure per customer', example: 'New customers: $25K, Established: up to 3x annual revenue' },
        { name: 'Payment Terms', rule: 'Standard and exception terms', example: 'Standard Net 30, Net 60 requires Director approval' },
        { name: 'Credit Review', rule: 'When to reassess credit', example: 'Annual review, immediate if payment delayed >15 days' },
        { name: 'Collection Escalation', rule: 'Steps for overdue accounts', example: 'Day 30: reminder, Day 45: call, Day 60: hold new orders' }
      ]
    },
    {
      category: 'Procurement Policies',
      description: 'Rules for purchasing goods and services',
      policies: [
        { name: 'Competitive Bidding', rule: 'When to get multiple quotes', example: 'Required for purchases >$25K, minimum 3 bids' },
        { name: 'Preferred Vendors', rule: 'Use of approved suppliers', example: 'Must use preferred vendors for categories with contracts' },
        { name: 'Budget Authorization', rule: 'Spending authority limits', example: 'Manager: $10K, Director: $50K, VP: $250K' },
        { name: 'Emergency Purchases', rule: 'Process for urgent needs', example: 'Can bypass bidding with VP approval + documentation' }
      ]
    },
    {
      category: 'Contract Policies',
      description: 'Rules for entering into agreements',
      policies: [
        { name: 'Signature Authority', rule: 'Who can sign contracts', example: 'VP for <$500K, CEO for >$500K or multi-year' },
        { name: 'Term Limits', rule: 'Maximum contract duration', example: 'Standard max 3 years, >3 years requires CFO approval' },
        { name: 'Liability Limits', rule: 'Risk caps in contracts', example: 'Max liability = 2x contract value, exceptions need legal' },
        { name: 'Non-Standard Terms', rule: 'Deviation from templates', example: 'Any deviation requires legal review and documentation' }
      ]
    }
  ];

  const realScenarios = [
    {
      title: 'The Policy Vacuum That Cost $3M',
      company: 'Services Company',
      situation: 'No formal discount policy. Sales reps negotiated whatever they could to close deals.',
      impact: {
        avgDiscount: '35% (industry standard: 15%)',
        marginErosion: '$3M annually on $20M revenue',
        inconsistency: 'Same customer got different prices from different reps'
      },
      withPolicies: {
        implemented: [
          'Tiered discount matrix by deal size and customer type',
          'Approval workflow for above-standard discounts',
          'Historical discount visibility to prevent cherry-picking',
          'Manager dashboard showing discount trends'
        ],
        outcome: 'Average discount reduced to 18%. $2.1M margin recovery in year one.'
      }
    },
    {
      title: 'The Rogue Procurement',
      company: 'Tech Startup (150 employees)',
      situation: 'No procurement policy. Anyone could buy anything. Credit card chaos.',
      discovery: {
        softwareSpend: '$450K across 87 different tools (many overlapping)',
        unauthorizedPurchases: '$125K in equipment without approval',
        expenseAbuse: '$35K in questionable travel and entertainment'
      },
      withPolicies: {
        implemented: [
          'Spending limits by role',
          'Required approvals for purchases >$500',
          'Preferred vendor program',
          'Monthly spend reporting to managers'
        ],
        outcome: 'Software consolidated to 25 tools. $280K annual savings. Zero unauthorized purchases.'
      }
    }
  ];

  const policyFramework = [
    { element: 'Scope', description: 'What does this policy cover?', example: 'All customer discounts on products and services' },
    { element: 'Authority', description: 'Who can make decisions under this policy?', example: 'Sales Manager, Director, VP, CFO based on discount level' },
    { element: 'Limits', description: 'What are the boundaries?', example: 'No discount >50%, no below-cost sales without CEO approval' },
    { element: 'Exceptions', description: 'How are exceptions handled?', example: 'Document justification, escalate to next level, record outcome' },
    { element: 'Enforcement', description: 'How is compliance ensured?', example: 'System blocks non-compliant quotes, alerts for attempted violations' },
    { element: 'Review', description: 'How often is policy updated?', example: 'Annual review, quarterly metrics review, immediate if market changes' }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/governance" className="flex items-center gap-2 text-slate-600 hover:text-slate-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Governance Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Policies Module</h1>
            <p className="text-2xl text-slate-600">Commercial Rules & Business Standards</p>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-slate-900 mb-2">
            <strong>Purpose:</strong> Policies are your commercial constitution. They define what's allowed, what's not, and how decisions are made.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Clear Guidelines</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Consistent Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Fast Decisions</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'categories', label: 'Policy Categories', icon: Book },
              { key: 'framework', label: 'Policy Framework', icon: Settings },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-slate-700 text-slate-700'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Policies Matter</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Clear Policies
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Everyone makes up their own rules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Inconsistent decisions frustrate customers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Margins erode through undisciplined discounting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Risk taken without proper authorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Audit failures and compliance issues</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Policies
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Clear guidelines for all commercial decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Consistent customer experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Margin protection through discount controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Appropriate risk-taking with oversight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Audit-ready documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Policies = Encoded Judgment</h2>
              <p className="text-xl leading-relaxed">
                Good policies encode your organization's best judgment about how to handle situations. They allow fast decisions at lower levels while ensuring appropriate oversight for exceptions.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            {policyCategories.map((cat, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{cat.category}</h3>
                  <p className="text-slate-700">{cat.description}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {cat.policies.map((policy, i) => (
                      <div key={`item-${i}`} className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900">{policy.name}</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{policy.rule}</p>
                        <p className="text-sm bg-white p-2 rounded-lg text-slate-700">
                          <span className="font-semibold">Example: </span>{policy.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'framework' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Policy Framework</h2>
              <p className="text-slate-700">Every policy should address these six elements</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {policyFramework.map((element, index) => (
                <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-700 text-white rounded-xl flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{element.element}</h3>
                  </div>
                  <p className="text-slate-700 mb-3">{element.description}</p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="text-sm font-semibold text-slate-600">Example: </span>
                    <span className="text-sm text-slate-700">{element.example}</span>
                  </div>
                </div>
              ))}
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

                  {scenario.impact && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Impact</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.impact).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.discovery && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Discovery</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.discovery).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.withPolicies && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Policies</h3>
                      <ul className="space-y-2 mb-4">
                        {scenario.withPolicies.implemented.map((p, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-green-800">{scenario.withPolicies.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Define Your Commercial Constitution</h2>
          <p className="text-xl mb-6 opacity-90">
            Clear policies enable fast decisions and protect your organization
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default PoliciesPage;
