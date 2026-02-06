import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Target, Award, Clock, DollarSign, RefreshCw, Scale, Calendar, Users, Bell } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ContractPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const contractElements = [
    {
      element: 'Terms & Conditions',
      description: 'Legal terms governing the relationship',
      components: ['Payment terms', 'Liability clauses', 'Indemnification', 'Termination rights', 'IP ownership'],
      risks: ['Non-standard terms without legal review', 'Missing key protections', 'Conflicting terms']
    },
    {
      element: 'Scope of Work (SOW)',
      description: 'Detailed description of deliverables',
      components: ['Deliverable definitions', 'Acceptance criteria', 'Milestones', 'Exclusions', 'Change process'],
      risks: ['Vague scope', 'Missing exclusions', 'Undefined acceptance criteria']
    },
    {
      element: 'Service Level Agreement (SLA)',
      description: 'Performance guarantees and remedies',
      components: ['Uptime commitments', 'Response times', 'Resolution times', 'Credits/penalties', 'Measurement methods'],
      risks: ['Unachievable SLAs', 'Undefined measurement', 'Unlimited penalties']
    },
    {
      element: 'Commercial Terms',
      description: 'Pricing and payment structure',
      components: ['Pricing structure', 'Payment schedule', 'Price escalation', 'Billing terms', 'Currency'],
      risks: ['Ambiguous pricing', 'Unfavorable escalation', 'Currency risk']
    }
  ];

  const contractLifecycle = [
    { stage: 'Draft', description: 'Initial contract creation', actions: ['Use approved templates', 'Populate deal terms', 'Flag deviations'], duration: '1-2 days' },
    { stage: 'Review', description: 'Internal review process', actions: ['Legal review', 'Finance review', 'Delivery review'], duration: '3-5 days' },
    { stage: 'Negotiation', description: 'Customer discussion', actions: ['Track redlines', 'Manage versions', 'Escalate issues'], duration: '1-4 weeks' },
    { stage: 'Execution', description: 'Final signature', actions: ['Verify terms', 'Obtain signatures', 'Store securely'], duration: '1-3 days' },
    { stage: 'Active', description: 'Contract in force', actions: ['Monitor obligations', 'Track renewals', 'Manage amendments'], duration: 'Contract term' },
    { stage: 'Renewal', description: 'Term end approaching', actions: ['Review performance', 'Prepare renewal', 'Negotiate terms'], duration: '60-90 days before expiry' }
  ];

  const realScenarios = [
    {
      title: 'The Auto-Renewal Disaster',
      company: 'Services Company',
      situation: 'Unfavorable vendor contract auto-renewed for 3 years. Nobody tracked the renewal date.',
      impact: {
        contractValue: '$450,000/year',
        autoRenewal: '3 years',
        totalCommitment: '$1.35M locked in',
        marketRate: '$280,000/year (38% less)',
        wastedSpend: '$510,000 over 3 years'
      },
      withSystem: {
        features: [
          '90-day renewal alerts',
          '60-day negotiation reminders',
          '30-day escalation to leadership',
          'Auto-renewal flag in contract record'
        ],
        outcome: 'Alert would have triggered market review. Renegotiation or switch would have saved $510K.'
      }
    },
    {
      title: 'The Missing Limitation of Liability',
      company: 'Software Company',
      situation: 'Sales modified contract template to close deal. Removed limitation of liability clause.',
      problem: {
        modification: 'Removed LoL clause to satisfy customer',
        approval: 'None - sales had edit access to templates',
        exposure: 'Unlimited liability for software defects'
      },
      incident: {
        event: 'Software bug caused customer data issue',
        claim: '$5M in damages',
        normalExposure: 'Would have been capped at contract value ($200K)',
        actualExposure: 'Unlimited - settled for $2.1M'
      },
      withSystem: {
        controls: [
          'Template modifications require legal approval',
          'Key clauses flagged as non-removable',
          'Deviation tracking and approval workflow',
          'Audit trail of all changes'
        ],
        outcome: 'LoL removal would have required legal sign-off. Legal would have refused or obtained appropriate coverage.'
      }
    },
    {
      title: 'The Orphaned Contract',
      company: 'Enterprise Software',
      situation: '150 active contracts, 3-person legal team. Obligations not tracked. Multiple SLA breaches discovered.',
      problems: [
        'SLA commitments not communicated to ops',
        'Reporting obligations missed',
        'Price increase windows missed',
        'Compliance certifications lapsed'
      ],
      consequences: {
        slaPenalties: '$125,000',
        missedIncreases: '$340,000 (could have raised prices)',
        complianceFines: '$75,000',
        total: '$540,000 in losses'
      },
      withSystem: {
        approach: [
          'Obligation extraction into task system',
          'SLA commitments synced to operations',
          'Automated compliance tracking',
          'Price increase calendar alerts'
        ],
        outcome: 'All obligations visible and tracked. Proactive management instead of reactive fire-fighting.'
      }
    }
  ];

  const keyMetrics = [
    { metric: 'Avg. Negotiation Cycle', benchmark: '< 15 days', risk: '> 30 days' },
    { metric: 'Contract Deviation Rate', benchmark: '< 10%', risk: '> 25%' },
    { metric: 'Renewal Visibility', benchmark: '> 90 days', risk: '< 30 days' },
    { metric: 'Obligation Compliance', benchmark: '> 98%', risk: '< 90%' }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/revenue" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Revenue Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Contract Module</h1>
            <p className="text-2xl text-slate-600">Agreement Lifecycle & Obligation Management</p>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-slate-900 mb-2">
            <strong>Purpose:</strong> Contracts are the legal embodiment of your commercial commitments. Manage them throughout their lifecycle to maximize value and minimize risk.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Template Control</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Renewal Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Obligation Alerts</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'elements', label: 'Contract Elements', icon: Scale },
              { key: 'lifecycle', label: 'Lifecycle', icon: RefreshCw },
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Contract Management Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Contract Management
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Contracts stored in random folders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Renewal dates missed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Obligations forgotten</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Unauthorized modifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>No visibility into exposure</span>
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
                      <span>Central repository with search</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Automated renewal alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Obligation tracking & reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Template and deviation control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Complete exposure visibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Key Metrics</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {keyMetrics.map((m, i) => (
                  <div key={`item-${i}`} className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3">{m.metric}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">{m.benchmark}</span>
                        <p className="text-xs text-slate-500 mt-1">Target</p>
                      </div>
                      <div className="text-center">
                        <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold">{m.risk}</span>
                        <p className="text-xs text-slate-500 mt-1">Risk Zone</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Contracts = Legal Revenue</h2>
              <p className="text-xl leading-relaxed">
                Every contract represents committed revenue and committed obligations. Managing them well means capturing all value and avoiding all risk. The contract is where commercial becomes legal.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-6">
            {contractElements.map((element, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{element.element}</h3>
                  <p className="text-slate-700">{element.description}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Components:</h4>
                    <ul className="space-y-2">
                      {element.components.map((c, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle className="h-4 w-4 text-slate-600" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-3">Risks to Watch:</h4>
                    <ul className="space-y-2">
                      {element.risks.map((r, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg">
                          <AlertTriangle className="h-4 w-4" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lifecycle' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Contract Lifecycle</h2>
              <p className="text-slate-700">From creation to renewal, every stage matters</p>
            </div>

            <div className="space-y-4">
              {contractLifecycle.map((stage, index) => (
                <div key={`item-${index}`} className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200">
                  <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{stage.stage}</h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {stage.duration}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">{stage.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.actions.map((action, i) => (
                        <span key={`item-${i}`} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                          {action}
                        </span>
                      ))}
                    </div>
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
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.impact).map(([key, value], i) => (
                          <div key={`item-${i}`} className="flex justify-between">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.problem && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Problem</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.problem).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.incident && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">Incident</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.incident).map(([key, value], i) => (
                          <div key={`item-${i}`}>
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="text-slate-900 font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.problems && (
                    <div className="bg-red-50 p-4 rounded-xl">
                      <h4 className="font-bold text-red-900 mb-2">Problems:</h4>
                      <ul className="space-y-2">
                        {scenario.problems.map((p, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scenario.consequences && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">Consequences</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.consequences).map(([key, value], i) => (
                          <div key={`item-${i}`} className="flex justify-between">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-bold text-red-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Contract Management</h3>
                      {scenario.withSystem.features && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.features.map((f, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withSystem.controls && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.controls.map((c, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <Shield className="h-4 w-4 text-green-600" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      )}
                      {scenario.withSystem.approach && (
                        <ul className="space-y-2 mb-4">
                          {scenario.withSystem.approach.map((a, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {a}
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
        <div className="mt-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Master Your Contracts</h2>
          <p className="text-xl mb-6 opacity-90">
            Never miss a renewal. Never forget an obligation. Never lose visibility.
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

export default ContractPage;
