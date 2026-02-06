import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, AlertTriangle, FileText, Target, Award, Users, DollarSign, Clock, Shield, Search, TrendingDown, Package, Building2 } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ProcurePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const procurementTypes = [
    {
      type: 'Direct Procurement',
      description: 'Goods/services directly used in production or delivery',
      examples: ['Raw materials', 'Components', 'Subcontractor services', 'Project-specific tools'],
      characteristics: ['Tied to specific deals/projects', 'Cost directly attributed to revenue', 'Often time-sensitive'],
      controls: ['Budget allocation per deal', 'Cost tracking to margin', 'Delivery timeline alignment']
    },
    {
      type: 'Indirect Procurement',
      description: 'Operational expenses not tied to specific deals',
      examples: ['Office supplies', 'Software licenses', 'Travel', 'Marketing services'],
      characteristics: ['Overhead expense', 'Often recurring', 'Multiple stakeholders'],
      controls: ['Category budgets', 'Spend limits per person/department', 'Approval workflows']
    },
    {
      type: 'Capital Procurement',
      description: 'Long-term assets and major investments',
      examples: ['Equipment', 'Real estate', 'Major IT systems', 'Vehicles'],
      characteristics: ['High value', 'Long approval cycle', 'Depreciation implications'],
      controls: ['Capex budgets', 'ROI requirements', 'Multi-level approval']
    }
  ];

  const procurementWorkflow = [
    { stage: 'Need Identification', description: 'Requestor identifies need', actions: ['Submit request', 'Justify need', 'Estimate budget'], owner: 'Requestor' },
    { stage: 'Budget Check', description: 'Verify budget availability', actions: ['Check budget', 'Route for approval if needed', 'Reserve funds'], owner: 'System/Finance' },
    { stage: 'Sourcing', description: 'Find and evaluate vendors', actions: ['Identify vendors', 'Request quotes', 'Compare options'], owner: 'Procurement' },
    { stage: 'Selection', description: 'Choose vendor and negotiate', actions: ['Evaluate bids', 'Negotiate terms', 'Select vendor'], owner: 'Procurement + Stakeholders' },
    { stage: 'Purchase Order', description: 'Create formal PO', actions: ['Generate PO', 'Get approvals', 'Send to vendor'], owner: 'Procurement' },
    { stage: 'Receipt & Payment', description: 'Receive goods, process payment', actions: ['Confirm receipt', '3-way match', 'Process payment'], owner: 'Receiving/AP' }
  ];

  const realScenarios = [
    {
      title: 'The Shadow Procurement Problem',
      company: 'Mid-Market Tech Company',
      situation: '35 employees, each buying their own software subscriptions. No visibility into total spend.',
      discovery: {
        totalShadowSpend: '$285,000/year',
        duplicateLicenses: '23 different project management tools',
        unusedSubscriptions: '$45,000 in abandoned subscriptions',
        securityRisk: '12 tools with no security review'
      },
      withSystem: {
        controls: [
          'All software requests through procurement',
          'Existing license check before new purchase',
          'Security review for new vendors',
          'Centralized subscription management'
        ],
        outcomes: {
          consolidatedTools: '23 → 3 project management tools',
          savedSpend: '$185,000/year',
          securityImproved: '100% vendor security review',
          visibilityGained: 'Complete SaaS inventory'
        }
      }
    },
    {
      title: 'The Rogue Purchase Order',
      company: 'Manufacturing Company',
      situation: 'Plant manager issued $450K PO for new equipment without proper approval. CFO discovered during bank reconciliation.',
      problem: {
        poValue: '$450,000',
        approvalRequired: 'CFO + CEO for >$100K',
        actualApproval: 'None - manager had PO creation access',
        cashImpact: 'Unexpected $450K outflow, missed investment opportunity'
      },
      withSystem: {
        workflow: 'System enforces approval matrix',
        controls: [
          'PO creation requires prior approval for >$50K',
          'Multi-level approval based on amount',
          'Budget verification before PO creation',
          'Cannot circumvent with manual PO'
        ],
        outcome: 'Purchase would have been flagged. Proper review would have identified better timing and financing options.'
      }
    },
    {
      title: 'The Duplicate Vendor Problem',
      company: 'Services Firm',
      situation: 'Different departments procuring from same vendor using different names/entities. Missing volume discount opportunities.',
      discovery: {
        vendorVariations: '"Acme Inc", "Acme Corp", "ACME LLC", "Acme International"',
        totalSpend: '$1.2M across all variations',
        missingDiscount: 'Volume discount starts at $500K (30% off)',
        lostSavings: '$360,000/year'
      },
      withSystem: {
        approach: [
          'Vendor master with duplicate detection',
          'Automatic vendor consolidation suggestions',
          'Spend analytics across all purchases',
          'Volume discount tracking'
        ],
        outcome: 'Vendors consolidated. Volume discount negotiated. $360K annual savings captured.'
      }
    }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/procurement" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Procurement Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl flex items-center justify-center shadow-xl">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Procure Module</h1>
            <p className="text-2xl text-slate-600">Purchase Requests & Spend Control</p>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-orange-900 mb-2">
            <strong>Purpose:</strong> Control what gets bought, from whom, and at what price. Eliminate shadow spend and maverick purchasing.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Spend Visibility</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Policy Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Cost Reduction</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'types', label: 'Procurement Types', icon: Package },
              { key: 'workflow', label: 'Workflow', icon: ShoppingCart },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-orange-600 text-orange-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Procurement Control Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Procurement Control
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Employees buy whatever, from whoever</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>No visibility into total spend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Volume discounts missed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Vendor compliance unknown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Budget overruns discovered late</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Procure
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>All purchases through controlled channels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Complete spend visibility by category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Consolidated buying power</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Vendor compliance verified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Real-time budget tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">The Procurement Principle</h2>
              <p className="text-xl leading-relaxed mb-6">
                Every dollar spent should be visible, controlled, and optimized. Procurement isn't about slowing things down—it's about buying smarter.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { metric: '15-25%', label: 'Typical savings from procurement control' },
                  { metric: '40%', label: 'Of spend is often invisible (shadow)' },
                  { metric: '3x', label: 'ROI on procurement technology' },
                  { metric: '60%', label: 'Of maverick spend is preventable' }
                ].map((item, i) => (
                  <div key={`item-${i}`} className="bg-white/10 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold mb-1">{item.metric}</div>
                    <p className="text-sm opacity-80">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-8">
            {procurementTypes.map((type, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900">{type.type}</h3>
                  <p className="text-slate-700">{type.description}</p>
                </div>
                <div className="p-6 grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {type.examples.map((ex, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                          <Package className="h-4 w-4 text-orange-600" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Characteristics:</h4>
                    <ul className="space-y-2">
                      {type.characteristics.map((c, i) => (
                        <li key={`item-${i}`} className="text-slate-700 text-sm bg-slate-50 p-2 rounded-lg">{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 mb-3">Key Controls:</h4>
                    <ul className="space-y-2">
                      {type.controls.map((ctrl, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700 bg-orange-50 p-2 rounded-lg">
                          <Shield className="h-4 w-4 text-orange-600" />
                          {ctrl}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-8">
            <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">Procurement Workflow</h2>
              <p className="text-orange-800">From need to payment, every step controlled</p>
            </div>

            <div className="space-y-4">
              {procurementWorkflow.map((stage, index) => (
                <div key={`item-${index}`} className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{stage.stage}</h3>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        <Users className="h-4 w-4 inline mr-1" />
                        {stage.owner}
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

                  {scenario.discovery && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Discovery</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(scenario.discovery).map(([key, value], i) => (
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
                            <span className="font-bold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Procurement Control</h3>
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
                      {scenario.withSystem.outcomes && (
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          {Object.entries(scenario.withSystem.outcomes).map(([key, value], i) => (
                            <div key={`item-${i}`} className="bg-white p-3 rounded-lg">
                              <span className="text-slate-600 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}: </span>
                              <span className="font-bold text-green-700">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {scenario.withSystem.outcome && (
                        <p className="font-bold text-green-800 mt-4">{scenario.withSystem.outcome}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Take Control of Spending</h2>
          <p className="text-xl mb-6 opacity-90">
            Eliminate shadow spend, capture volume discounts, and enforce compliance
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default ProcurePage;
