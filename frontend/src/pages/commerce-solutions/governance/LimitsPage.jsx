import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, CheckCircle, AlertTriangle, Shield, Target, DollarSign, TrendingUp, Users, BarChart3, FileText, Lock } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const LimitsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const limitTypes = [
    {
      type: 'Credit Limits',
      description: 'Maximum exposure allowed per customer',
      examples: [
        { level: 'New Customer', limit: '$10,000 - $25,000', approval: 'Sales Manager' },
        { level: 'Established (<2 years)', limit: 'Up to $100,000', approval: 'Sales Director' },
        { level: 'Strategic (>2 years)', limit: 'Up to $500,000', approval: 'VP Sales + Finance' },
        { level: 'Enterprise', limit: '$500,000+', approval: 'CFO' }
      ],
      enforcement: 'System blocks deals that would exceed limit'
    },
    {
      type: 'Discount Limits',
      description: 'Maximum discount percentage by authority level',
      examples: [
        { level: 'Sales Rep', limit: '0-10%', approval: 'Self' },
        { level: 'Sales Manager', limit: '10-20%', approval: 'Self' },
        { level: 'Sales Director', limit: '20-30%', approval: 'Self' },
        { level: 'VP Sales', limit: '30-40%', approval: 'Self' },
        { level: 'CFO Required', limit: '40%+', approval: 'CFO' }
      ],
      enforcement: 'Quote requires approval from appropriate level'
    },
    {
      type: 'Spending Limits',
      description: 'Maximum purchase authority by role',
      examples: [
        { level: 'Individual Contributor', limit: '$500', approval: 'Self + Manager' },
        { level: 'Manager', limit: '$5,000', approval: 'Self' },
        { level: 'Director', limit: '$25,000', approval: 'Self' },
        { level: 'VP', limit: '$100,000', approval: 'Self' },
        { level: 'C-Level Required', limit: '$100,000+', approval: 'CFO/CEO' }
      ],
      enforcement: 'PO requires approval chain based on amount'
    },
    {
      type: 'Contract Value Limits',
      description: 'Maximum contract authority by signer',
      examples: [
        { level: 'Sales Manager', limit: '$50,000', approval: 'Self' },
        { level: 'Director', limit: '$250,000', approval: 'Self' },
        { level: 'VP', limit: '$1,000,000', approval: 'Self' },
        { level: 'CEO Required', limit: '$1,000,000+', approval: 'CEO + Board if >$5M' }
      ],
      enforcement: 'Contract routing based on total value'
    }
  ];

  const realScenarios = [
    {
      title: 'The $2M Exposure Problem',
      company: 'Wholesale Distributor',
      situation: 'No credit limits. Single customer accumulated $2.1M in outstanding invoices. Customer went bankrupt.',
      impact: {
        exposure: '$2.1M in receivables',
        recovered: '$180,000 (8.5%)',
        writeOff: '$1.92M',
        percentOfProfit: '45% of annual profit'
      },
      withLimits: {
        controls: [
          'Customer would have had $300K credit limit',
          'Deal blocked when limit reached',
          'Early warning at 80% of limit',
          'Escalation when limit increase requested'
        ],
        outcome: 'Maximum exposure would have been $300K. Loss reduced by $1.6M.'
      }
    },
    {
      title: 'The Discount Spiral',
      company: 'Software Company',
      situation: 'No discount limits. Reps gave whatever discount needed to close. Average discount crept from 15% to 45%.',
      progression: [
        { quarter: 'Q1', avgDiscount: '15%', margin: '55%' },
        { quarter: 'Q2', avgDiscount: '25%', margin: '45%' },
        { quarter: 'Q3', avgDiscount: '35%', margin: '35%' },
        { quarter: 'Q4', avgDiscount: '45%', margin: '25%' }
      ],
      impact: 'Revenue grew 20%, profit dropped 35%',
      withLimits: {
        controls: [
          'Max discount by deal size and customer type',
          'Visibility into historical discounts',
          'Approval required for above-standard discounts',
          'Commission adjusted for discount level'
        ],
        outcome: 'Discount controlled at 18%. Margin maintained at 52%.'
      }
    }
  ];

  const limitBestPractices = [
    {
      practice: 'Tiered Limits',
      description: 'Different limits for different segments',
      benefits: ['Right-sized for risk profile', 'Rewards good behavior', 'Efficient use of capital']
    },
    {
      practice: 'Dynamic Adjustments',
      description: 'Limits that change based on behavior',
      benefits: ['Auto-increase for good performers', 'Auto-decrease for risks', 'Real-time risk management']
    },
    {
      practice: 'Cumulative Tracking',
      description: 'Monitor aggregate exposure, not just individual',
      benefits: ['Sector concentration visibility', 'Geographic risk management', 'Portfolio-level control']
    },
    {
      practice: 'Exception Documentation',
      description: 'Clear process for exceeding limits',
      benefits: ['Audit trail', 'Learning from exceptions', 'Controlled flexibility']
    }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/governance" className="flex items-center gap-2 text-slate-600 hover:text-slate-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Governance Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl flex items-center justify-center shadow-xl">
            <Settings className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Limits Module</h1>
            <p className="text-2xl text-slate-600">Boundaries & Thresholds for Commercial Decisions</p>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-amber-900 mb-2">
            <strong>Purpose:</strong> Limits are the guardrails that prevent runaway risk. They define how much exposure is acceptable and when escalation is required.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Risk Containment</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Auto Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Dynamic Adjustment</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'types', label: 'Limit Types', icon: Settings },
              { key: 'practices', label: 'Best Practices', icon: Target },
              { key: 'scenarios', label: 'Real Scenarios', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-amber-600 text-amber-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Limits Matter</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Limits
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Unlimited customer exposure until disaster</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Discounts creep higher over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Anyone can spend any amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Contract commitments exceed authority</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Limits
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Customer exposure capped and monitored</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Discount levels enforced by role</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Spending authority matches responsibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Contract authority clear and enforced</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Limits Enable Speed</h2>
              <p className="text-xl leading-relaxed">
                Counter-intuitively, clear limits enable faster decisions. When everyone knows the boundaries, they can act confidently within them. Only exceptions need escalation.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-8">
            {limitTypes.map((type, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{type.type}</h3>
                  <p className="text-slate-700">{type.description}</p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-bold text-slate-900">Level</th>
                          <th className="text-left p-3 font-bold text-slate-900">Limit</th>
                          <th className="text-left p-3 font-bold text-slate-900">Approval</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.examples.map((ex, i) => (
                          <tr key={`item-${i}`} className="border-t border-slate-200">
                            <td className="p-3 text-slate-700">{ex.level}</td>
                            <td className="p-3 font-semibold text-amber-600">{ex.limit}</td>
                            <td className="p-3 text-slate-600">{ex.approval}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-amber-900 font-semibold">
                      <Lock className="h-5 w-5 inline mr-2" />
                      Enforcement: {type.enforcement}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'practices' && (
          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Limit Best Practices</h2>
              <p className="text-amber-800">Industry-proven approaches to setting and managing limits</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {limitBestPractices.map((practice, index) => (
                <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{practice.practice}</h3>
                  <p className="text-slate-700 mb-4">{practice.description}</p>
                  <ul className="space-y-2">
                    {practice.benefits.map((b, i) => (
                      <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {b}
                      </li>
                    ))}
                  </ul>
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
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.impact).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.progression && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Discount Progression</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {scenario.progression.map((p, i) => (
                          <div key={`item-${i}`} className="text-center bg-white p-3 rounded-lg">
                            <p className="font-bold text-slate-900">{p.quarter}</p>
                            <p className="text-red-600">{p.avgDiscount} discount</p>
                            <p className="text-slate-600">{p.margin} margin</p>
                          </div>
                        ))}
                      </div>
                      {scenario.impact && typeof scenario.impact === 'string' && (
                        <p className="mt-4 font-bold text-red-800">{scenario.impact}</p>
                      )}
                    </div>
                  )}

                  {scenario.withLimits && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Limits</h3>
                      <ul className="space-y-2 mb-4">
                        {scenario.withLimits.controls.map((c, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {c}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-green-800">{scenario.withLimits.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Set Your Boundaries</h2>
          <p className="text-xl mb-6 opacity-90">
            Clear limits protect your organization while enabling fast decisions
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-amber-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default LimitsPage;
