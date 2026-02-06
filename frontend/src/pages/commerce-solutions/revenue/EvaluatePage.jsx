import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, AlertTriangle, Scale, FileText, Target, Award, Users, DollarSign, Clock, Shield, Zap, TrendingUp } from 'lucide-react';
import IBCommerceHub from '../../IBCommerceHub';

const EvaluatePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const evaluationDimensions = [
    {
      dimension: 'Commercial Viability',
      weight: '30%',
      questions: [
        'Does the customer have budget approved?',
        'Are payment terms acceptable?',
        'Is the pricing within our guidelines?',
        'What is the expected margin?'
      ],
      redFlags: ['No budget allocated', 'Demands Net 120 terms', 'Margin below 15%']
    },
    {
      dimension: 'Delivery Feasibility',
      weight: '25%',
      questions: [
        'Do we have resources to deliver?',
        'Is the timeline achievable?',
        'Do we have required expertise?',
        'Are there technical dependencies?'
      ],
      redFlags: ['No available resources', 'Impossible timeline', 'Requires skills we lack']
    },
    {
      dimension: 'Strategic Fit',
      weight: '20%',
      questions: [
        'Is this our target market?',
        'Does it align with product roadmap?',
        'Will it be referenceable?',
        'Does it strengthen market position?'
      ],
      redFlags: ['Outside core market', 'Conflicts with strategy', 'Competitor advantage']
    },
    {
      dimension: 'Risk Assessment',
      weight: '15%',
      questions: [
        'What is customer credit risk?',
        'Are there legal/compliance concerns?',
        'Is scope well-defined?',
        'What could go wrong?'
      ],
      redFlags: ['Poor credit history', 'Regulatory issues', 'Vague scope']
    },
    {
      dimension: 'Relationship Value',
      weight: '10%',
      questions: [
        'What is lifetime value potential?',
        'Will this lead to more deals?',
        'Is customer influential in market?',
        'Partnership potential?'
      ],
      redFlags: ['One-time transactional', 'Declining company', 'Difficult to work with']
    }
  ];

  const dealReviewChecklist = [
    { category: 'Customer', items: ['Credit check completed', 'Decision maker identified', 'Budget confirmed', 'Timeline validated'] },
    { category: 'Solution', items: ['Scope documented', 'Technical requirements clear', 'Assumptions stated', 'Dependencies identified'] },
    { category: 'Commercial', items: ['Pricing approved', 'Margin calculated', 'Payment terms acceptable', 'Contract terms reviewed'] },
    { category: 'Delivery', items: ['Resource plan created', 'Project timeline validated', 'Risk mitigation planned', 'Success criteria defined'] }
  ];

  const realScenarios = [
    {
      title: 'The $3M Deal That Should Have Been Walked Away From',
      company: 'IT Services Company',
      situation: 'Huge opportunity: $3M digital transformation with prestigious brand. Sales pushed hard to win.',
      evaluation: {
        commercial: 'Margin: 8% (way below 25% minimum)',
        delivery: 'Timeline: 6 months (realistic: 12 months)',
        fit: 'Perfect reference customer',
        risk: 'Scope vague, fixed price demanded'
      },
      whatHappened: {
        decision: 'CEO overrode evaluation, approved deal for "strategic value"',
        result: [
          'Project ran 18 months (3x timeline)',
          'Final margin: -15% (loss)',
          'Customer unhappy despite overdelivery',
          'Team burned out',
          'No reference obtained'
        ],
        lesson: 'Strategic value can\'t compensate for fundamentally bad deal economics'
      },
      withSystem: {
        process: 'System required formal evaluation sign-off',
        scoring: 'Deal scored 35/100 (threshold: 60)',
        blocks: ['Margin below minimum', 'Unrealistic timeline', 'Scope not finalized'],
        outcome: 'Would have required re-scoping before proceeding. Likely outcome: Better deal or walk away.'
      }
    },
    {
      title: 'The Hidden Gem Discovered Through Evaluation',
      company: 'SaaS Company',
      situation: 'Small deal ($50K) almost dismissed. Evaluation process revealed massive potential.',
      discovery: {
        initialAssessment: 'Small, non-strategic, low priority',
        evaluationFindings: [
          'Customer is #3 in fast-growing market',
          'Planning 10x growth in 2 years',
          'Current vendor relationship rocky',
          'Budget increases expected significantly'
        ],
        revisedAssessment: '$50K deal → $500K/year potential within 24 months'
      },
      outcome: {
        approach: 'Treated as strategic land deal',
        resources: 'Assigned senior team',
        result: 'Now $1.2M annual customer, provided 5 referrals'
      }
    }
  ];

  return (
    <IBCommerceHub>
      <div className="max-w-6xl">
        {/* Header */}
        <Link to="/solutions/commerce/revenue" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-semibold">
          <ArrowLeft className="h-5 w-5" /> Back to Revenue Module
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl flex items-center justify-center shadow-xl">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Evaluate Module</h1>
            <p className="text-2xl text-slate-600">Opportunity Assessment & Deal Scoring</p>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-12">
          <p className="text-lg text-amber-900 mb-2">
            <strong>Purpose:</strong> Not every deal is worth winning. Systematic evaluation ensures you pursue the right opportunities with the right approach.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Multi-Dimensional Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Risk Identification</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">Go/No-Go Decision Support</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'dimensions', label: 'Evaluation Dimensions', icon: BarChart3 },
              { key: 'checklist', label: 'Review Checklist', icon: CheckCircle },
              { key: 'scenarios', label: 'Real Scenarios', icon: Target }
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Evaluation Matters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Without Formal Evaluation
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Pursue any deal that "looks big"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Discover problems during delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Win unprofitable deals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Waste resources on unwinnable opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Miss high-potential "small" deals</span>
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
                      <span>Systematic multi-factor assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Risks identified before commitment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Margin requirements enforced</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Focus resources on winnable deals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Discover hidden gems through process</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">The Evaluation Principle</h2>
              <p className="text-xl leading-relaxed mb-6">
                Every deal must score above threshold before significant resources are committed. This isn't about killing deals—it's about improving deals or knowing when to walk away.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { score: '80+', label: 'Green Light', desc: 'Pursue aggressively' },
                  { score: '60-79', label: 'Yellow Light', desc: 'Proceed with conditions' },
                  { score: '40-59', label: 'Orange Light', desc: 'Needs improvement' },
                  { score: '<40', label: 'Red Light', desc: 'Do not pursue' }
                ].map((item, i) => (
                  <div key={`item-${i}`} className="bg-white/10 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold mb-1">{item.score}</div>
                    <div className="font-semibold">{item.label}</div>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Evaluation Workflow</h2>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Opportunity Identified', desc: 'Lead converted to opportunity, initial qualification done' },
                  { step: '2', title: 'Data Collection', desc: 'Gather customer info, requirements, timeline, budget' },
                  { step: '3', title: 'Dimension Scoring', desc: 'Score across 5 evaluation dimensions' },
                  { step: '4', title: 'Risk Assessment', desc: 'Identify and document potential risks' },
                  { step: '5', title: 'Review Meeting', desc: 'Cross-functional review of evaluation' },
                  { step: '6', title: 'Go/No-Go Decision', desc: 'Approve, improve requirements, or decline' }
                ].map((item, i) => (
                  <div key={`item-${i}`} className="flex items-start gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="space-y-6">
            {evaluationDimensions.map((dim, index) => (
              <div key={`item-${index}`} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-white p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">{dim.dimension}</h3>
                    <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold">{dim.weight} Weight</span>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Key Questions:</h4>
                    <ul className="space-y-2">
                      {dim.questions.map((q, i) => (
                        <li key={`item-${i}`} className="flex items-start gap-2 text-slate-700">
                          <span className="text-amber-600">?</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-3">Red Flags:</h4>
                    <ul className="space-y-2">
                      {dim.redFlags.map((flag, i) => (
                        <li key={`item-${i}`} className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-8">
            <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Deal Review Checklist</h2>
              <p className="text-amber-800">Complete all items before progressing to Commit stage</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {dealReviewChecklist.map((category, index) => (
                <div key={`item-${index}`} className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{category.category}</h3>
                  <ul className="space-y-3">
                    {category.items.map((item, i) => (
                      <li key={`item-${i}`} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 border-2 border-slate-300 rounded flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-transparent" />
                        </div>
                        <span className="text-slate-700">{item}</span>
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

                  {scenario.evaluation && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(scenario.evaluation).map(([key, value], i) => (
                        <div key={`item-${i}`} className="bg-amber-50 p-4 rounded-xl">
                          <span className="font-bold text-amber-900 capitalize">{key}: </span>
                          <span className="text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {scenario.whatHappened && (
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-900 mb-4">❌ What Happened</h3>
                      <p className="text-slate-700 mb-3">{scenario.whatHappened.decision}</p>
                      <ul className="space-y-2">
                        {scenario.whatHappened.result.map((r, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            {r}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 font-bold text-red-800">{scenario.whatHappened.lesson}</p>
                    </div>
                  )}

                  {scenario.discovery && (
                    <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                      <h3 className="text-xl font-bold text-amber-900 mb-4">Discovery Through Evaluation</h3>
                      <p className="text-slate-700 mb-3">Initial: {scenario.discovery.initialAssessment}</p>
                      <h4 className="font-bold text-amber-800 mb-2">Evaluation Revealed:</h4>
                      <ul className="space-y-2">
                        {scenario.discovery.evaluationFindings.map((f, i) => (
                          <li key={`item-${i}`} className="flex items-center gap-2 text-slate-700">
                            <Zap className="h-4 w-4 text-amber-600" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 font-bold text-amber-800">{scenario.discovery.revisedAssessment}</p>
                    </div>
                  )}

                  {scenario.withSystem && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ With Evaluation System</h3>
                      <p className="text-slate-700 mb-2">{scenario.withSystem.process}</p>
                      <p className="text-slate-700 mb-2">{scenario.withSystem.scoring}</p>
                      {scenario.withSystem.blocks && (
                        <ul className="space-y-2 mb-3">
                          {scenario.withSystem.blocks.map((b, i) => (
                            <li key={`item-${i}`} className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="font-bold text-green-800">{scenario.withSystem.outcome}</p>
                    </div>
                  )}

                  {scenario.outcome && (
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4">✅ Outcome</h3>
                      <div className="space-y-2">
                        {Object.entries(scenario.outcome).map(([key, value], i) => (
                          <p key={`item-${i}`} className="text-slate-700">
                            <span className="font-semibold capitalize">{key}: </span>{value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Win the Right Deals</h2>
          <p className="text-xl mb-6 opacity-90">
            Systematic evaluation improves win rates by 40% and deal profitability by 25%
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

export default EvaluatePage;
