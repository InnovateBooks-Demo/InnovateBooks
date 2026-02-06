import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, CheckCircle, AlertTriangle, FileText, Target, Shield, Users, DollarSign, Send, Handshake, BarChart3 } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ProcurementCommitPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const poComponents = [
    {
      component: 'Header Information',
      elements: ['PO Number', 'Date', 'Vendor details', 'Ship-to address', 'Bill-to address', 'Payment terms'],
      validation: 'Auto-populated from vendor master and request'
    },
    {
      component: 'Line Items',
      elements: ['Item description', 'Quantity', 'Unit price', 'Extended amount', 'Delivery date', 'Cost center'],
      validation: 'Linked to catalog items where applicable'
    },
    {
      component: 'Terms & Conditions',
      elements: ['Standard T&Cs', 'Warranty terms', 'Return policy', 'Acceptance criteria', 'Confidentiality'],
      validation: 'Legal-approved templates, deviation tracking'
    },
    {
      component: 'Approvals',
      elements: ['Budget holder', 'Finance (if required)', 'Legal (if required)', 'Executive (large POs)'],
      validation: 'Approval matrix enforcement'
    }
  ];

  const approvalMatrix = [
    { amount: '$0 - $5K', approvers: ['Manager'], leadTime: '1 day' },
    { amount: '$5K - $25K', approvers: ['Manager', 'Director'], leadTime: '2-3 days' },
    { amount: '$25K - $100K', approvers: ['Director', 'Finance'], leadTime: '3-5 days' },
    { amount: '$100K - $500K', approvers: ['VP', 'Finance', 'Legal'], leadTime: '5-7 days' },
    { amount: '$500K+', approvers: ['VP', 'CFO', 'Legal', 'CEO'], leadTime: '7-14 days' }
  ];

  const realScenarios = [
    {
      title: 'The Duplicate PO Disaster',
      company: 'Manufacturing Company',
      situation: 'Same purchase accidentally ordered twice through different requestors. Duplicate deliveries, double payment.',
      problem: {
        originalPO: '$125,000 for equipment',
        duplicatePO: '$125,000 same equipment',
        discovery: 'Found when duplicate shipment arrived',
        cost: 'Restocking fees, shipping, admin time: $18K'
      },
      withSystem: {
        controls: [
          'Duplicate detection (vendor + item + timeframe)',
          'Alert when similar PO exists',
          'Consolidation suggestions for same-vendor orders',
          'Single point of entry for large purchases'
        ],
        outcome: 'Duplicate would have been flagged at creation. Single PO processed.'
      }
    },
    {
      title: 'The Budget Blown PO',
      company: 'Professional Services',
      situation: 'Marketing team issued multiple POs throughout quarter. Each individually approved. Total exceeded budget by 40%.',
      problem: {
        budget: '$500,000 quarterly',
        actualPOs: '$700,000 total',
        discovery: 'End of quarter budget review',
        impact: 'Cash flow crisis, other projects delayed'
      },
      approvalIssue: 'Each PO under individual approval threshold, cumulative effect not visible',
      withSystem: {
        controls: [
          'Real-time budget consumption tracking',
          'Alert when budget reaches 80%',
          'Block POs when budget exhausted',
          'Cumulative spend visibility per approver'
        ],
        outcome: 'Budget alert at $400K would have triggered review. Prioritization earlier.'
      }
    },
    {
      title: 'The Contract Terms Mismatch',
      company: 'Tech Company',
      situation: 'PO issued with standard terms. Vendor MSA had conflicting terms. Legal battle over which terms apply.',
      conflict: {
        pOTerms: 'Net 30, our standard indemnification',
        vendorMSA: 'Net 15, limited indemnification',
        dispute: 'Which terms govern?',
        legalCost: '$45,000 to resolve'
      },
      withSystem: {
        process: [
          'PO generation checks for existing vendor contracts',
          'Terms alignment validation',
          'Conflict flagged for legal review',
          'Clear terms hierarchy documentation'
        ],
        outcome: 'Conflict identified before PO sent. Terms aligned. No dispute.'
      }
    }
  ];

  const poChecklist = [
    { category: 'Pre-PO', items: ['Budget available', 'Vendor approved', 'Evaluation completed', 'Terms agreed'] },
    { category: 'PO Creation', items: ['Correct vendor selected', 'Items/services accurate', 'Pricing verified', 'Delivery date realistic'] },
    { category: 'Approval', items: ['Correct approvers routed', 'Budget holder confirmed', 'Compliance checks passed', 'All approvals obtained'] },
    { category: 'Dispatch', items: ['PO sent to vendor', 'Acknowledgment received', 'Delivery tracking set up', 'Receipt process ready'] }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/procurement" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Procurement Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-3xl flex items-center justify-center shadow-xl">
            <CheckSquare className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Commit Module</h1>
            <p className="text-2xl text-slate-600">Purchase Orders & Buying Commitment</p>
          </div>
        </div>

        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-cyan-900 mb-2">
            <strong>Purpose:</strong> A PO is a legal commitment to buy. Ensure every purchase is authorized, budgeted, and properly documented.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Budget Control</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Approval Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Terms Protection</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'components', label: 'PO Components', icon: CheckSquare },
              { key: 'approvals', label: 'Approval Matrix', icon: Users },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-cyan-600 text-cyan-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The PO = Legal Commitment</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without PO Controls
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Anyone can commit company to purchases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Budget tracking reactive, not proactive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Duplicate orders go undetected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Terms and conditions inconsistent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Audit trail incomplete</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Commit
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Approval matrix enforced on all POs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Real-time budget consumption visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Duplicate detection and prevention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Standardized terms with deviation tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Complete audit trail for compliance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">The Commit Principle</h2>
              <p className="text-xl leading-relaxed mb-6">
                A Purchase Order is a promise to pay. It creates a legal obligation. Every PO should be intentional, authorized, and within budget—before it leaves your organization.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: DollarSign, label: 'Budget Check', desc: 'Funds available' },
                  { icon: Users, label: 'Approval', desc: 'Right authority' },
                  { icon: Shield, label: 'Terms', desc: 'Protected position' },
                  { icon: Send, label: 'Commit', desc: 'Send to vendor' }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={`item-${i}`} className="bg-white/10 p-4 rounded-xl text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <h4 className="font-bold">{item.label}</h4>
                      <p className="text-sm opacity-80">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">PO Checklist</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {poChecklist.map((category, index) => (
                  <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{category.category}</h3>
                    <ul className="space-y-3">
                      {category.items.map((item, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                          <CheckSquare className="h-5 w-5 text-cyan-600" />
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

        {activeTab === 'components' && (
          <div className="space-y-6">
            {poComponents.map((comp, index) => (
              <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{comp.component}</h3>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Elements:</h4>
                    <ul className="space-y-2">
                      {comp.elements.map((el, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle className="h-4 w-4 text-cyan-600" />
                          {el}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-xl">
                    <h4 className="font-bold text-cyan-900 mb-2">Validation:</h4>
                    <p className="text-cyan-800">{comp.validation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-8">
            <div className="bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-200">
              <h2 className="text-2xl font-bold text-cyan-900 mb-2">PO Approval Matrix</h2>
              <p className="text-cyan-800">Who approves based on PO value</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-slate-900">PO Amount</th>
                    <th className="text-left p-4 font-bold text-slate-900">Required Approvers</th>
                    <th className="text-left p-4 font-bold text-slate-900">Lead Time</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalMatrix.map((row, i) => (
                    <tr key={`item-${i}`} className="border-t border-slate-200">
                      <td className="p-4 font-semibold text-slate-900">{row.amount}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {row.approvers.map((approver, j) => (
                            <span key={j} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">{approver}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{row.leadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

                  {scenario.conflict && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Terms Conflict</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.conflict).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.approvalIssue && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <p className="text-yellow-800">{scenario.approvalIssue}</p>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With PO Controls</h3>
                      {scenario.withSystem.controls && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.controls.map((c, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withSystem.process && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.process.map((p, i) => (
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
        <div className="mt-16 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Control Your Commitments</h2>
          <p className="text-xl mb-6 opacity-90">
            Every PO authorized, budgeted, and properly documented
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default ProcurementCommitPage;
