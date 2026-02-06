import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, AlertTriangle, DollarSign, TrendingDown, Target, Shield, Calculator, Layers, Users, Clock, FileText, Star, Award } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const CostingPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const costComponents = [
    {
      name: 'Direct Labor',
      description: 'Employee time directly attributable to delivery',
      examples: ['Consultant hours', 'Developer time', 'Project manager allocation'],
      calculation: 'Hours × Loaded hourly rate (salary + benefits + overhead)',
      typicalRange: '30-60% of total cost'
    },
    {
      name: 'Materials & Licenses',
      description: 'Physical goods or software required for delivery',
      examples: ['Software licenses', 'Hardware', 'Raw materials', 'Third-party tools'],
      calculation: 'Direct cost + procurement overhead',
      typicalRange: '10-40% depending on industry'
    },
    {
      name: 'Subcontractor/Partner',
      description: 'External resources engaged for delivery',
      examples: ['Specialized consultants', 'Implementation partners', 'Freelancers'],
      calculation: 'Contract value + management overhead (typically 5-15%)',
      typicalRange: '0-50% for services companies'
    },
    {
      name: 'Infrastructure',
      description: 'Hosting, cloud, and operational infrastructure',
      examples: ['Cloud hosting', 'Data centers', 'Network costs', 'Storage'],
      calculation: 'Allocated based on usage or flat allocation',
      typicalRange: '5-20% for SaaS companies'
    },
    {
      name: 'Overhead Allocation',
      description: 'Indirect costs distributed across projects',
      examples: ['Office space', 'Management', 'Admin support', 'Training'],
      calculation: 'Total overhead ÷ Revenue or hours (allocation method)',
      typicalRange: '15-35% of direct costs'
    }
  ];

  const realScenarios = [
    {
      title: 'The $2M Project That Lost $500K',
      company: 'IT Services Company',
      situation: 'Won a large digital transformation project. Sales quoted $2M based on rough estimates. Actual costs devastated margins.',
      breakdown: {
        quoted: '$2,000,000',
        expectedMargin: '35% ($700K profit)',
        actualCosts: {
          labor: '$1,200,000 (estimated $900K)',
          subcontractors: '$450,000 (estimated $250K)',
          licenses: '$180,000 (forgot enterprise licensing)',
          infrastructure: '$120,000 (underestimated cloud costs)',
          overhead: '$250,000 (standard allocation)',
          total: '$2,200,000'
        },
        actualMargin: '-$200,000 (10% loss)',
        rootCause: 'No systematic costing model. Sales estimated from "gut feel".'
      },
      withSystem: {
        process: 'System required cost breakdown before quote approval',
        laborCalc: 'Resource plan × loaded rates = $1,180,000',
        subCalc: 'Partner quotes integrated = $420,000',
        licenseCalc: 'Auto-calculated based on user count = $175,000',
        infraCalc: 'Usage-based estimation = $115,000',
        overhead: 'Standard 18% allocation = $340,000',
        totalCost: '$2,230,000',
        minimumPrice: '$2,900,000 (30% min margin)',
        outcome: 'Quote corrected. Won at $2.8M. Delivered with 25% margin.'
      }
    },
    {
      title: 'Partner Cost Explosion',
      company: 'Consulting Firm',
      situation: 'Used partner for specialized work. Partner raised rates mid-project. No cost tracking meant surprise at billing.',
      breakdown: {
        originalPartnerQuote: '$150,000',
        actualPartnerBill: '$285,000',
        reason: 'Scope changes not tracked, rate card expired, overtime not controlled'
      },
      withSystem: {
        controls: [
          'Partner rate cards stored in system',
          'Automatic alerts when spend approaches estimate',
          'Change orders require cost recalculation',
          'Real-time cost tracking vs. estimate'
        ],
        outcome: 'Partner costs controlled. Variance caught at $165K. Change order raised for additional scope. Customer approved incremental cost.'
      }
    }
  ];

  const marginRules = [
    {
      segment: 'Product Sales',
      minMargin: '45%',
      targetMargin: '55%',
      rationale: 'Lower delivery risk, scalable'
    },
    {
      segment: 'Standard Services',
      minMargin: '30%',
      targetMargin: '40%',
      rationale: 'Well-defined scope, repeatable'
    },
    {
      segment: 'Custom Projects',
      minMargin: '25%',
      targetMargin: '35%',
      rationale: 'Higher risk, more variability'
    },
    {
      segment: 'Strategic Deals',
      minMargin: '15%',
      targetMargin: '25%',
      rationale: 'Land-and-expand, relationship building'
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
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Costing Module</h1>
            <p className="text-2xl text-slate-600">Margin Protection & Cost Intelligence</p>
          </div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-emerald-900 mb-2">
            <strong>Purpose:</strong> Know your costs BEFORE you quote. Protect margins through systematic cost estimation.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Prevent Margin Erosion</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Cost-Before-Quote Enforcement</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Real-Time Cost Tracking</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'components', label: 'Cost Components', icon: Layers },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target },
              { key: 'practices', label: 'Best Practices', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-emerald-600 text-emerald-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Costing Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Systematic Costing
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Quotes based on "gut feel" or historical guesses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Hidden costs discovered during delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Partner/subcontractor costs not tracked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Overhead allocation inconsistent or missing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>"Won" deals that actually lose money</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Costing
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Cost breakdown required before quote approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>All cost components captured systematically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Partner costs integrated and tracked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Overhead allocated consistently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Minimum margin enforced before deal proceeds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">The Cost-Before-Quote Principle</h2>
              <p className="text-xl leading-relaxed mb-6">
                No quote can be sent to a customer until the system has a complete cost estimate. This ensures every deal has a known margin before commitment.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: '1', label: 'Define Scope', desc: 'What are we delivering?' },
                  { step: '2', label: 'Estimate Costs', desc: 'What will it cost us?' },
                  { step: '3', label: 'Check Margin', desc: 'Is it profitable?' },
                  { step: '4', label: 'Approve Quote', desc: 'Send to customer' }
                ].map((item, i) => (
                  <div key={`item-${i}`} className="bg-white/10 p-4 rounded-xl text-center">
                    <div className="w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">
                      {item.step}
                    </div>
                    <h4 className="font-bold">{item.label}</h4>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Margin Protection Rules</h2>
              <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-bold text-slate-900">Segment</th>
                      <th className="text-left p-4 font-bold text-slate-900">Min Margin</th>
                      <th className="text-left p-4 font-bold text-slate-900">Target Margin</th>
                      <th className="text-left p-4 font-bold text-slate-900">Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marginRules.map((rule, i) => (
                      <tr key={`item-${i}`} className="border-t border-slate-200">
                        <td className="p-4 font-semibold text-slate-900">{rule.segment}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold">{rule.minMargin}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">{rule.targetMargin}</span>
                        </td>
                        <td className="p-4 text-slate-600">{rule.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">The 5 Cost Components</h2>
              <p className="text-emerald-800">Every deliverable has costs from these five buckets. Complete costing requires estimating each.</p>
            </div>

            {costComponents.map((component, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-white p-6 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{component.name}</h3>
                  <p className="text-slate-700">{component.description}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {component.examples.map((ex, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-2">Calculation:</h4>
                      <p className="text-slate-700 font-mono text-sm">{component.calculation}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl">
                      <h4 className="font-bold text-emerald-900 mb-2">Typical Range:</h4>
                      <p className="text-emerald-800 font-semibold">{component.typicalRange}</p>
                    </div>
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

                  {scenario.breakdown && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                        <h3 className="text-xl font-bold text-red-900 mb-4">❌ What Happened</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-700">Quoted Price:</span>
                            <span className="font-bold text-slate-900">{scenario.breakdown.quoted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-700">Expected Margin:</span>
                            <span className="font-bold text-slate-900">{scenario.breakdown.expectedMargin}</span>
                          </div>
                          <hr className="border-red-200" />
                          <h4 className="font-bold text-red-900">Actual Costs:</h4>
                          {Object.entries(scenario.breakdown.actualCosts).map(([key, value], i) => (
                            <div key={`item-${i}`} className="flex justify-between text-sm">
                              <span className="text-slate-600 capitalize">{key}:</span>
                              <span className="font-mono">{value}</span>
                            </div>
                          ))}
                          <hr className="border-red-200" />
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-red-900">Actual Margin:</span>
                            <span className="font-bold text-red-600">{scenario.breakdown.actualMargin}</span>
                          </div>
                          <p className="text-sm text-red-700 mt-2">{scenario.breakdown.rootCause}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                        <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Costing Module</h3>
                        <div className="space-y-3 text-sm">
                          <p className="text-slate-700">{scenario.withSystem.process}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Labor:</span>
                              <span className="font-mono">{scenario.withSystem.laborCalc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Subcontractors:</span>
                              <span className="font-mono">{scenario.withSystem.subCalc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Licenses:</span>
                              <span className="font-mono">{scenario.withSystem.licenseCalc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Infrastructure:</span>
                              <span className="font-mono">{scenario.withSystem.infraCalc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Overhead:</span>
                              <span className="font-mono">{scenario.withSystem.overhead}</span>
                            </div>
                          </div>
                          <hr className="border-green-200" />
                          <div className="flex justify-between font-bold">
                            <span>Total Cost:</span>
                            <span>{scenario.withSystem.totalCost}</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Minimum Price (30% margin):</span>
                            <span>{scenario.withSystem.minimumPrice}</span>
                          </div>
                          <p className="text-green-800 font-semibold mt-2">{scenario.withSystem.outcome}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'practices' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 rounded-3xl text-white">
              <h2 className="text-3xl font-bold mb-4">Costing Best Practices</h2>
              <p className="text-xl opacity-90">Industry-proven approaches to protect margins and estimate accurately</p>
            </div>

            {[
              {
                title: 'Bottom-Up Costing',
                description: 'Build costs from individual components, not top-down estimates',
                steps: [
                  'List all deliverables in the scope',
                  'For each deliverable, identify required resources',
                  'Multiply resources by loaded rates',
                  'Add materials, licenses, and third-party costs',
                  'Apply overhead allocation',
                  'Sum for total cost'
                ]
              },
              {
                title: 'Use Loaded Rates',
                description: 'Always use fully-loaded hourly rates that include all employee costs',
                components: [
                  'Base salary (converted to hourly)',
                  'Benefits (health, retirement, etc.)',
                  'Payroll taxes',
                  'Training and development',
                  'Equipment and tools',
                  'Facility allocation'
                ],
                example: '$100K salary → $65/hr base → $95/hr loaded (1.46x multiplier)'
              },
              {
                title: 'Contingency Planning',
                description: 'Build in appropriate contingency based on estimate confidence',
                levels: [
                  { confidence: 'High (detailed scope)', contingency: '5-10%' },
                  { confidence: 'Medium (clear requirements)', contingency: '10-20%' },
                  { confidence: 'Low (early stage)', contingency: '20-35%' }
                ]
              },
              {
                title: 'Track Actuals vs. Estimates',
                description: 'Continuous improvement through variance analysis',
                metrics: [
                  'Cost variance by project type',
                  'Labor estimate accuracy',
                  'Partner cost prediction',
                  'Overhead allocation effectiveness'
                ]
              }
            ].map((practice, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{practice.title}</h3>
                <p className="text-lg text-slate-700 mb-6">{practice.description}</p>
                
                {practice.steps && (
                  <div className="space-y-2">
                    {practice.steps.map((step, i) => (
                      <div key={`item-${i}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {practice.components && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Components:</h4>
                      <ul className="space-y-2">
                        {practice.components.map((comp, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl">
                      <h4 className="font-bold text-emerald-900 mb-2">Example:</h4>
                      <p className="font-mono text-emerald-800">{practice.example}</p>
                    </div>
                  </div>
                )}

                {practice.levels && (
                  <div className="space-y-3">
                    {practice.levels.map((level, i) => (
                      <div key={`item-${i}`} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                        <span className="font-semibold text-slate-900">{level.confidence}</span>
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold">{level.contingency}</span>
                      </div>
                    ))}
                  </div>
                )}

                {practice.metrics && (
                  <ul className="grid md:grid-cols-2 gap-3">
                    {practice.metrics.map((metric, i) => (
                      <li key={`item-${i}`} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl text-slate-700">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Protect Your Margins</h2>
          <p className="text-xl mb-6 opacity-90">
            Never lose money on a deal again. Know your costs before you commit.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default CostingPage;
