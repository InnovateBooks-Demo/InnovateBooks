import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, FileText, Target, Users, Lock, Key, UserCheck, Settings, Zap } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const AuthorityPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const authorityMatrix = [
    {
      decision: 'Customer Credit Limit',
      levels: [
        { amount: 'Up to $25K', authority: 'Sales Manager' },
        { amount: '$25K - $100K', authority: 'Sales Director' },
        { amount: '$100K - $500K', authority: 'VP Sales + Finance' },
        { amount: '$500K+', authority: 'CFO' }
      ]
    },
    {
      decision: 'Discount Approval',
      levels: [
        { amount: '0-15%', authority: 'Sales Rep' },
        { amount: '15-25%', authority: 'Sales Manager' },
        { amount: '25-35%', authority: 'Sales Director' },
        { amount: '35-50%', authority: 'VP Sales' },
        { amount: '50%+', authority: 'CFO' }
      ]
    },
    {
      decision: 'Purchase Order',
      levels: [
        { amount: 'Up to $5K', authority: 'Manager' },
        { amount: '$5K - $25K', authority: 'Director' },
        { amount: '$25K - $100K', authority: 'VP' },
        { amount: '$100K+', authority: 'CFO' }
      ]
    },
    {
      decision: 'Contract Signature',
      levels: [
        { amount: 'Up to $100K', authority: 'Sales Director' },
        { amount: '$100K - $500K', authority: 'VP' },
        { amount: '$500K - $2M', authority: 'CEO' },
        { amount: '$2M+', authority: 'CEO + Board' }
      ]
    }
  ];

  const delegationRules = [
    {
      rule: 'Temporary Delegation',
      description: 'Authority can be delegated during absences',
      conditions: ['Written delegation document', 'Time-limited (max 30 days)', 'Cannot exceed delegator\'s authority', 'Audit trail maintained']
    },
    {
      rule: 'Escalation Path',
      description: 'When authority is unavailable',
      conditions: ['Next level up in hierarchy', 'Must be documented', 'Cannot skip levels without exception', 'Time-sensitive exception process']
    },
    {
      rule: 'Joint Authority',
      description: 'Some decisions require multiple approvers',
      conditions: ['High-risk decisions', 'Cross-functional impact', 'Separation of duties', 'Both must approve (not sequential)']
    },
    {
      rule: 'Board Reserved',
      description: 'Decisions requiring board approval',
      conditions: ['Major acquisitions', 'Significant contracts (>$5M)', 'Strategic partnerships', 'Material risk acceptance']
    }
  ];

  const realScenarios = [
    {
      title: 'The Unauthorized Contract',
      company: 'Technology Company',
      situation: 'Sales manager signed $3M multi-year contract. Authority level was $100K. Legal terms were non-standard.',
      problem: {
        contractValue: '$3M over 3 years',
        signatureAuthority: '$100K (manager level)',
        nonStandardTerms: 'Unlimited liability, no termination clause',
        discovery: 'During audit, 6 months post-signature'
      },
      consequences: [
        'Contract technically voidable (but damaging to renegotiate)',
        'Liability exposure discovered during incident',
        'Customer relationship damaged by renegotiation attempt',
        'Manager terminated'
      ],
      withSystem: {
        controls: [
          'System checks signature authority before contract generation',
          'Non-standard terms require legal approval',
          'Electronic signature with authority verification',
          'Real-time alert on authority exceedance'
        ],
        outcome: 'Contract would have routed to CEO. Legal would have caught non-standard terms. Proper review before signature.'
      }
    },
    {
      title: 'The Approval Bottleneck',
      company: 'Services Company',
      situation: 'All discounts >10% required VP approval. VP overwhelmed, deals stuck for days.',
      impact: {
        avgApprovalTime: '4.5 days for discount approval',
        dealsLost: '15% of deals lost to faster competitors',
        vpTime: '12 hours/week on discount approvals',
        salesFrustration: 'Top performers leaving'
      },
      solution: {
        changes: [
          'Tiered authority: Manager to 20%, Director to 30%',
          'Pre-approved discount bands by customer segment',
          'System auto-approval for deals within guidelines',
          'VP only for true exceptions'
        ],
        outcome: 'Approval time reduced to 4 hours. Deal velocity up 35%. VP freed for strategic work.'
      }
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
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Authority Module</h1>
            <p className="text-2xl text-slate-600">Delegation of Authority & Decision Rights</p>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-purple-900 mb-2">
            <strong>Purpose:</strong> Authority defines who can make what decisions. Clear delegation enables fast action while ensuring appropriate oversight.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Clear Decision Rights</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Controlled Delegation</span>
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
              { key: 'matrix', label: 'Authority Matrix', icon: Users },
              { key: 'delegation', label: 'Delegation Rules', icon: Key },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-purple-600 text-purple-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Authority Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Clear Authority
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Anyone signs anything</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Or nobody can decide (everything escalated)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Commitments exceed what was intended</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Audit failures and legal exposure</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Authority
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Clear decision rights at each level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Fast decisions within authority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Appropriate escalation for exceptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Complete audit trail of who approved what</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Authority = Trust + Accountability</h2>
              <p className="text-xl leading-relaxed">
                Delegating authority is an act of trust. With that trust comes accountability. Clear authority matrices make both explicit—empowering people to act while ensuring appropriate oversight.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-8">
            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Authority Matrix</h2>
              <p className="text-purple-800">Who can approve what decisions</p>
            </div>

            {authorityMatrix.map((decision, index) => (
              <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900">{decision.decision}</h3>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-3 font-bold text-slate-900">Amount/Level</th>
                        <th className="text-left p-3 font-bold text-slate-900">Authority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decision.levels.map((level, i) => (
                        <tr key={`item-${i}`} className="border-t border-slate-200">
                          <td className="p-3 font-semibold text-purple-600">{level.amount}</td>
                          <td className="p-3">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {level.authority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'delegation' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Delegation Rules</h2>
              <p className="text-purple-800">How authority can be transferred and managed</p>
            </div>

            {delegationRules.map((rule, index) => (
              <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{rule.rule}</h3>
                <p className="text-slate-700 mb-4">{rule.description}</p>
                <ul className="space-y-2">
                  {rule.conditions.map((c, i) => (
                    <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      {c}
                    </li>
                  ))}
                </ul>
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
                      <div className="space-y-2">
                        {Object.entries(scenario.problem).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  {scenario.consequences && (
                    <div className="bg-red-50 p-4 rounded-xl">
                      <h4 className="font-bold text-red-900 mb-2">Consequences:</h4>
                      <ul className="space-y-2">
                        {scenario.consequences.map((c, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Authority Controls</h3>
                      <ul className="space-y-2 mb-4">
                        {scenario.withSystem.controls.map((c, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {c}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-green-800">{scenario.withSystem.outcome}</p>
                    </div>
                  )}

                  {scenario.solution && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ Solution</h3>
                      <ul className="space-y-2 mb-4">
                        {scenario.solution.changes.map((c, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {c}
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold text-green-800">{scenario.solution.outcome}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Empower Your Teams</h2>
          <p className="text-xl mb-6 opacity-90">
            Clear authority enables fast decisions with appropriate oversight
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default AuthorityPage;
