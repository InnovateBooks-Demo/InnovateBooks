"""
Test Suite for Parties Engine and Governance Engine APIs
Tests: Commercial Identity & Readiness Engine + Governance (Policies, Limits, Authority, Risk)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPartiesEngineAPIs:
    """Parties Engine - Commercial Identity & Readiness Tests"""
    
    def test_list_parties(self):
        """Test GET /api/commerce/parties-engine/parties - List all parties"""
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "parties" in data
        assert "total" in data
        assert "stats" in data
        print(f"✅ List parties: {data['total']} parties found")
        print(f"   Stats: {data['stats']}")
    
    def test_list_parties_with_filters(self):
        """Test GET /api/commerce/parties-engine/parties with filters"""
        # Test status filter
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties?status=verified")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Filter by status=verified: {len(data['parties'])} parties")
        
        # Test role filter
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties?role=customer")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Filter by role=customer: {len(data['parties'])} parties")
    
    def test_create_party(self):
        """Test POST /api/commerce/parties-engine/parties - Create new party"""
        payload = {
            "legal_name": "TEST_NewParty Corp",
            "country": "India",
            "party_roles": ["customer", "vendor"],
            "registration_number": "TEST-REG-001",
            "created_source": "manual"
        }
        response = requests.post(f"{BASE_URL}/api/commerce/parties-engine/parties", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "party_id" in data
        print(f"✅ Created party: {data['party_id']}")
        return data["party_id"]
    
    def test_get_party_detail(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id} - Get party details"""
        # First get list to find a party
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available for testing")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "party" in data
        assert "profiles" in data
        assert "readiness" in data
        
        # Verify profiles structure
        profiles = data["profiles"]
        assert "identity" in profiles
        assert "legal" in profiles
        assert "tax" in profiles
        assert "risk" in profiles
        assert "compliance" in profiles
        
        # Verify readiness structure
        readiness = data["readiness"]
        assert "readiness_status" in readiness
        assert "can_evaluate" in readiness
        assert "can_commit" in readiness
        assert "can_contract" in readiness
        
        print(f"✅ Get party detail: {party_id}")
        print(f"   Readiness: {readiness['readiness_status']}")
        print(f"   Can Evaluate: {readiness['can_evaluate']}, Can Commit: {readiness['can_commit']}, Can Contract: {readiness['can_contract']}")
    
    def test_get_party_identity_profile(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/identity"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/identity")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Get identity profile for {party_id}")
    
    def test_get_party_legal_profile(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/legal"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/legal")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Get legal profile for {party_id}")
    
    def test_get_party_tax_profile(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/tax"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/tax")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Get tax profile for {party_id}")
    
    def test_get_party_risk_profile(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/risk"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/risk")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Get risk profile for {party_id}")
    
    def test_get_party_compliance_profile(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/compliance"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/compliance")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Get compliance profile for {party_id}")
    
    def test_get_party_readiness(self):
        """Test GET /api/commerce/parties-engine/parties/{party_id}/readiness"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/readiness")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "readiness" in data
        
        readiness = data["readiness"]
        assert "readiness_status" in readiness
        assert readiness["readiness_status"] in ["not_ready", "minimum_ready", "fully_verified"]
        print(f"✅ Get readiness for {party_id}: {readiness['readiness_status']}")
    
    def test_update_party_status(self):
        """Test POST /api/commerce/parties-engine/parties/{party_id}/update-status"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/parties-engine/parties")
        parties = list_response.json().get("parties", [])
        
        if not parties:
            pytest.skip("No parties available")
        
        party_id = parties[0]["party_id"]
        response = requests.post(f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}/update-status")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "status" in data
        assert "readiness" in data
        print(f"✅ Update status for {party_id}: {data['status']}")


class TestGovernanceEngineAPIs:
    """Governance Engine - Policies, Limits, Authority, Risk Tests"""
    
    # ==================== POLICIES ====================
    def test_list_policies(self):
        """Test GET /api/commerce/governance-engine/policies"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/policies")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "policies" in data
        assert "stats" in data
        print(f"✅ List policies: {len(data['policies'])} policies")
        print(f"   Stats: {data['stats']}")
    
    def test_list_policies_with_scope_filter(self):
        """Test GET /api/commerce/governance-engine/policies with scope filter"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/policies?scope=revenue")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Filter policies by scope=revenue: {len(data['policies'])} policies")
    
    def test_create_policy(self):
        """Test POST /api/commerce/governance-engine/policies"""
        payload = {
            "policy_name": "TEST_Minimum Margin Policy",
            "policy_type": "margin",
            "scope": "revenue",
            "condition_expression": "margin >= 15",
            "enforcement_type": "SOFT",
            "violation_message": "Margin below 15% requires approval",
            "threshold_value": 15.0,
            "active": True
        }
        response = requests.post(f"{BASE_URL}/api/commerce/governance-engine/policies", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "policy_id" in data
        print(f"✅ Created policy: {data['policy_id']}")
        return data["policy_id"]
    
    def test_get_policy_detail(self):
        """Test GET /api/commerce/governance-engine/policies/{policy_id}"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/policies")
        policies = list_response.json().get("policies", [])
        
        if not policies:
            pytest.skip("No policies available")
        
        policy_id = policies[0]["policy_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/policies/{policy_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "policy" in data
        print(f"✅ Get policy detail: {policy_id}")
    
    # ==================== LIMITS ====================
    def test_list_limits(self):
        """Test GET /api/commerce/governance-engine/limits"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/limits")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "limits" in data
        
        # Check utilization calculation
        for limit in data["limits"]:
            assert "utilization_percent" in limit
        
        print(f"✅ List limits: {len(data['limits'])} limits")
    
    def test_create_limit(self):
        """Test POST /api/commerce/governance-engine/limits"""
        payload = {
            "limit_name": "TEST_Credit Limit",
            "limit_type": "credit",
            "scope": "party",
            "scope_id": "PTY-0001",
            "threshold_value": 1000000.0,
            "current_usage": 250000.0,
            "hard_or_soft": "soft",
            "currency": "INR",
            "active": True
        }
        response = requests.post(f"{BASE_URL}/api/commerce/governance-engine/limits", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "limit_id" in data
        print(f"✅ Created limit: {data['limit_id']}")
        return data["limit_id"]
    
    def test_get_limit_detail(self):
        """Test GET /api/commerce/governance-engine/limits/{limit_id}"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/limits")
        limits = list_response.json().get("limits", [])
        
        if not limits:
            pytest.skip("No limits available")
        
        limit_id = limits[0]["limit_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/limits/{limit_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "limit" in data
        print(f"✅ Get limit detail: {limit_id}")
    
    # ==================== AUTHORITY ====================
    def test_list_authority_rules(self):
        """Test GET /api/commerce/governance-engine/authority"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/authority")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "authority_rules" in data
        print(f"✅ List authority rules: {len(data['authority_rules'])} rules")
    
    def test_create_authority_rule(self):
        """Test POST /api/commerce/governance-engine/authority"""
        payload = {
            "authority_name": "TEST_High Value Approval",
            "scope": "revenue",
            "condition_expression": "deal_value > 1000000",
            "approver_role": "cfo",
            "approval_sequence": "single",
            "min_value": 1000000.0,
            "max_value": None,
            "active": True
        }
        response = requests.post(f"{BASE_URL}/api/commerce/governance-engine/authority", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "authority_id" in data
        print(f"✅ Created authority rule: {data['authority_id']}")
        return data["authority_id"]
    
    def test_get_authority_rule_detail(self):
        """Test GET /api/commerce/governance-engine/authority/{authority_id}"""
        list_response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/authority")
        rules = list_response.json().get("authority_rules", [])
        
        if not rules:
            pytest.skip("No authority rules available")
        
        authority_id = rules[0]["authority_id"]
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/authority/{authority_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "authority_rule" in data
        print(f"✅ Get authority rule detail: {authority_id}")
    
    # ==================== RISK RULES ====================
    def test_list_risk_rules(self):
        """Test GET /api/commerce/governance-engine/risk-rules"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/risk-rules")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "risk_rules" in data
        print(f"✅ List risk rules: {len(data['risk_rules'])} rules")
    
    def test_create_risk_rule(self):
        """Test POST /api/commerce/governance-engine/risk-rules"""
        payload = {
            "rule_name": "TEST_High Risk Block",
            "risk_type": "party",
            "threshold": 80,
            "enforcement_type": "HARD",
            "escalation_role": "cfo",
            "active": True
        }
        response = requests.post(f"{BASE_URL}/api/commerce/governance-engine/risk-rules", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "rule_id" in data
        print(f"✅ Created risk rule: {data['rule_id']}")
    
    # ==================== AUDIT LOGS ====================
    def test_list_audit_logs(self):
        """Test GET /api/commerce/governance-engine/audit-logs"""
        response = requests.get(f"{BASE_URL}/api/commerce/governance-engine/audit-logs")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "audit_logs" in data
        assert "total" in data
        print(f"✅ List audit logs: {data['total']} logs")
    
    # ==================== GOVERNANCE EVALUATION ====================
    def test_governance_evaluation(self):
        """Test POST /api/commerce/governance-engine/evaluate - Main governance engine"""
        payload = {
            "context_type": "revenue",
            "context_id": "DEAL-001",
            "deal_value": 500000.0,
            "margin_percent": 25.0,
            "discount_percent": 10.0,
            "party_id": "PTY-0001",
            "risk_score": 30,
            "department": "sales"
        }
        response = requests.post(f"{BASE_URL}/api/commerce/governance-engine/evaluate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Response structure has governance_decision wrapper
        decision = data.get("governance_decision", data)
        assert "allowed" in decision
        assert "hard_blocks" in decision
        assert "soft_blocks" in decision
        assert "approvals_required" in decision
        
        print(f"✅ Governance evaluation:")
        print(f"   Allowed: {decision['allowed']}")
        print(f"   Hard Blocks: {len(decision['hard_blocks'])}")
        print(f"   Soft Blocks: {len(decision['soft_blocks'])}")
        print(f"   Approvals Required: {len(decision['approvals_required'])}")


class TestNavigationEndpoints:
    """Test that navigation endpoints for Revenue and Procurement workflows are accessible"""
    
    def test_revenue_workflow_leads_endpoint(self):
        """Test Revenue workflow leads endpoint"""
        response = requests.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Revenue workflow leads accessible: {len(data.get('leads', []))} leads")
    
    def test_procurement_workflow_requests_endpoint(self):
        """Test Procurement workflow requests endpoint"""
        response = requests.get(f"{BASE_URL}/api/commerce/workflow/procure/requests")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✅ Procurement workflow requests accessible: {len(data.get('requests', []))} requests")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
