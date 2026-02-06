import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, CheckCircle, AlertTriangle, FileText, Target, Award, Users, DollarSign, Clock, Shield, BarChart3, Star, TrendingDown } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const ProcurementEvaluatePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const evaluationCriteria = [
    {
      category: 'Price & Cost',
      weight: '30%',
      criteria: [
        { name: 'Unit Price', description: 'Base pricing competitiveness' },
        { name: 'Total Cost of Ownership', description: 'Including implementation, training, maintenance' },
        { name: 'Payment Terms', description: 'Cash flow impact of payment schedule' },
        { name: 'Volume Discounts', description: 'Potential savings at scale' }
      ]
    },
    {
      category: 'Quality & Capability',
      weight: '25%',
      criteria: [
        { name: 'Product/Service Quality', description: 'Meets specifications and requirements' },
        { name: 'Technical Capability', description: 'Ability to deliver complex requirements' },
        { name: 'Innovation', description: 'Modern approaches, continuous improvement' },
        { name: 'Customization', description: 'Ability to adapt to specific needs' }
      ]
    },
    {
      category: 'Vendor Stability',
      weight: '20%',
      criteria: [
        { name: 'Financial Health', description: 'Vendor solvency and stability' },
        { name: 'Market Position', description: 'Industry standing and longevity' },
        { name: 'References', description: 'Track record with similar customers' },
        { name: 'Dependency Risk', description: 'Risk of vendor failure or acquisition' }
      ]
    },
    {
      category: 'Compliance & Risk',
      weight: '15%',
      criteria: [
        { name: 'Certifications', description: 'SOC2, ISO, industry-specific' },
        { name: 'Security Posture', description: 'Data protection and privacy' },
        { name: 'Contract Terms', description: 'Acceptable legal terms' },
        { name: 'Sustainability', description: 'ESG compliance if required' }
      ]
    },
    {
      category: 'Service & Support',
      weight: '10%',
      criteria: [
        { name: 'SLA Commitments', description: 'Response and resolution times' },
        { name: 'Support Availability', description: '24/7, business hours, coverage' },
        { name: 'Account Management', description: 'Dedicated support quality' },
        { name: 'Training & Documentation', description: 'Enablement resources' }
      ]
    }
  ];

  const rfpProcess = [
    { stage: 'Requirement Definition', actions: ['Define specifications', 'Set evaluation criteria', 'Determine timeline'], output: 'RFP Document' },
    { stage: 'Vendor Identification', actions: ['Research market', 'Check existing vendors', 'Get referrals'], output: 'Vendor Shortlist' },
    { stage: 'RFP Distribution', actions: ['Send to vendors', 'Answer questions', 'Manage clarifications'], output: 'Vendor Responses' },
    { stage: 'Initial Screening', actions: ['Check compliance', 'Verify capabilities', 'Filter unqualified'], output: 'Qualified Vendors' },
    { stage: 'Detailed Evaluation', actions: ['Score responses', 'Conduct demos', 'Check references'], output: 'Evaluation Matrix' },
    { stage: 'Negotiation', actions: ['Negotiate terms', 'Optimize pricing', 'Finalize scope'], output: 'Best & Final Offer' },
    { stage: 'Selection', actions: ['Present recommendation', 'Get approval', 'Document decision'], output: 'Selected Vendor' }
  ];

  const realScenarios = [
    {
      title: 'The Hidden Cost Surprise',
      company: 'Healthcare Organization',
      situation: 'Selected lowest-priced EHR vendor. Implementation revealed massive hidden costs.',
      evaluation: {
        vendorA: { price: '$500K', hidden: '$0', total: '$500K', selected: false },
        vendorB: { price: '$350K', hidden: '$400K', total: '$750K', selected: true }
      },
      hiddenCosts: [
        'Implementation services: $150K (quoted as "included", actually extra)',
        'Data migration: $100K (not mentioned in proposal)',
        'Training: $80K (assumed "intuitive" = no training needed)',
        'Interface development: $70K (APIs not standard)'
      ],
      withSystem: {
        approach: [
          'TCO evaluation mandatory, not just license cost',
          'Standardized RFP with specific cost breakouts',
          'Reference calls asking about actual vs. quoted costs',
          'Implementation cost validation with similar customers'
        ],
        outcome: 'Hidden costs would have been exposed. Vendor A would have won on actual TCO.'
      }
    },
    {
      title: 'The Reference Check That Saved $2M',
      company: 'Financial Services',
      situation: 'About to select vendor based on impressive demo. Reference check revealed pattern of problems.',
      discovery: {
        reference1: '"Great sales team, terrible implementation. 18 months late."',
        reference2: '"Product doesn\'t do half of what was promised."',
        reference3: '"Support tickets take weeks. We\'re looking to switch."',
        pattern: '3/3 references had significant issues'
      },
      action: {
        decision: 'Vendor disqualified despite being lowest price',
        alternative: 'Selected vendor B at 15% higher cost',
        outcome: 'Smooth implementation, full functionality, excellent support'
      },
      lesson: 'References are not formalities—they\'re critical evaluation data'
    },
    {
      title: 'The Compliance Blind Spot',
      company: 'Enterprise Software',
      situation: 'Selected cloud vendor without proper security evaluation. Failed audit 6 months later.',
      problem: {
        vendor: 'Selected based on features and price',
        evaluation: 'Security "assumed" based on vendor reputation',
        audit: 'Failed SOC2 audit—vendor had no certification',
        exposure: 'Customer data potentially at risk'
      },
      consequences: [
        'Emergency migration to new vendor',
        'Customer notification required',
        'Regulatory scrutiny',
        'Cost: $850K in migration + penalties'
      ],
      withSystem: {
        controls: [
          'Security evaluation mandatory for all vendors',
          'Certification verification before selection',
          'Security questionnaire in RFP',
          'InfoSec sign-off required'
        ],
        outcome: 'Vendor would have been disqualified at initial screening. Compliant vendor selected from start.'
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
          <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl flex items-center justify-center shadow-xl">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Evaluate Module</h1>
            <p className="text-2xl text-slate-600">Vendor Assessment & Selection</p>
          </div>
        </div>

        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-teal-900 mb-2">
            <strong>Purpose:</strong> Select the best vendor, not just the cheapest. Systematic evaluation prevents costly mistakes.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Multi-Criteria Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Risk Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">TCO Analysis</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'criteria', label: 'Evaluation Criteria', icon: BarChart3 },
              { key: 'process', label: 'RFP Process', icon: Scale },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-4 ${
                    activeTab === tab.key
                      ? 'border-teal-600 text-teal-600'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Vendor Evaluation Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Proper Evaluation
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Select based on best presentation, not best fit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Hidden costs discovered post-signature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Compliance issues emerge in production</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Vendor stability not verified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Reference checks skipped or superficial</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    With IB Commerce Evaluate
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Objective scoring across multiple criteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Total cost of ownership calculated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Compliance verified before selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Financial health assessed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Structured reference verification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">The Evaluation Principle</h2>
              <p className="text-xl leading-relaxed mb-6">
                The cheapest vendor is rarely the best value. A systematic evaluation process ensures you consider all factors—not just price—before committing your organization.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { stat: '67%', label: 'Of procurement failures from poor evaluation' },
                  { stat: '3-5x', label: 'Cost of switching vendors vs. selecting right one' },
                  { stat: '40%', label: 'Of projects fail due to vendor capability gaps' }
                ].map((item, i) => (
                  <div key={`item-${i}`} className="bg-white/10 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold mb-1">{item.stat}</div>
                    <p className="text-sm opacity-80">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div className="space-y-6">
            {evaluationCriteria.map((cat, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">{cat.category}</h3>
                    <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-bold">{cat.weight}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {cat.criteria.map((c, i) => (
                      <div key={`item-${i}`} className="bg-slate-50 p-4 rounded-xl">
                        <h4 className="font-bold text-slate-900 mb-1">{c.name}</h4>
                        <p className="text-sm text-slate-600">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-8">
            <div className="bg-teal-50 p-6 rounded-2xl border-2 border-teal-200">
              <h2 className="text-2xl font-bold text-teal-900 mb-2">RFP Process</h2>
              <p className="text-teal-800">Structured approach to vendor selection</p>
            </div>

            <div className="space-y-4">
              {rfpProcess.map((stage, index) => (
                <div key={`item-${index}`} className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{stage.stage}</h3>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                        Output: {stage.output}
                      </span>
                    </div>
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

                  {scenario.hiddenCosts && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ Hidden Costs Discovered</h3>
                      <ul className="space-y-2">
                        {scenario.hiddenCosts.map((cost, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            {cost}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scenario.discovery && (
                    <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200">
                      <h3 className="text-xl font-bold text-yellow-900 mb-4">Reference Check Results</h3>
                      <div className="space-y-3">
                        {Object.entries(scenario.discovery).map(([key, value], i) => (
                          key !== 'pattern' && (
                            <div key={`item-${i}`} className="bg-white p-3 rounded-lg">
                              <span className="font-semibold text-slate-700">{key}: </span>
                              <span className="italic text-slate-600">{value}</span>
                            </div>
                          )
                        ))}
                        <p className="font-bold text-yellow-800 mt-4">{scenario.discovery.pattern}</p>
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
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Proper Evaluation</h3>
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
                      <p className="font-bold text-green-800">{scenario.withSystem.outcome}</p>
                    </div>
                  )}

                  {scenario.lesson && (
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                      <p className="font-semibold text-teal-900">{scenario.lesson}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Select the Right Vendors</h2>
          <p className="text-xl mb-6 opacity-90">
            Objective evaluation, complete visibility, confident decisions
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:shadow-xl transition-all"
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

export default ProcurementEvaluatePage;
