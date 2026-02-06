"""
Test IB Capital Detail Pages - Treasury Account Detail, Approval Detail, Rule Detail
Tests the new detail pages and navigation for IB Capital module
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

class TestIBCapitalDetailPages:
    """Test IB Capital Detail Pages APIs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        token = login_response.json().get("access_token")
        self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    # ============== TREASURY ACCOUNT DETAIL TESTS ==============
    
    def test_get_treasury_accounts_list(self):
        """Test GET /api/ib-capital/treasury/accounts - List all treasury accounts"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/treasury/accounts")
        assert response.status_code == 200
        
        data = response.json()
        assert "accounts" in data
        assert len(data["accounts"]) > 0
        
        # Verify account structure
        account = data["accounts"][0]
        assert "account_id" in account
        assert "bank_name" in account
        assert "account_number" in account
        assert "account_type" in account
        assert "balance" in account
        assert "status" in account
    
    def test_get_treasury_account_detail(self):
        """Test GET /api/ib-capital/treasury/accounts/:account_id - Get account detail with inflows/outflows"""
        # First get list of accounts
        list_response = self.session.get(f"{BASE_URL}/api/ib-capital/treasury/accounts")
        accounts = list_response.json().get("accounts", [])
        assert len(accounts) > 0, "No treasury accounts found"
        
        account_id = accounts[0]["account_id"]
        
        # Get account detail
        response = self.session.get(f"{BASE_URL}/api/ib-capital/treasury/accounts/{account_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["account_id"] == account_id
        assert "bank_name" in data
        assert "account_number" in data
        assert "balance" in data
        assert "inflows" in data
        assert "outflows" in data
        
        # Verify inflows structure if present
        if len(data["inflows"]) > 0:
            inflow = data["inflows"][0]
            assert "inflow_id" in inflow
            assert "source_type" in inflow
            assert "amount" in inflow
            assert "description" in inflow
        
        # Verify outflows structure if present
        if len(data["outflows"]) > 0:
            outflow = data["outflows"][0]
            assert "outflow_id" in outflow
            assert "purpose_type" in outflow
            assert "amount" in outflow
            assert "status" in outflow
    
    def test_get_treasury_account_not_found(self):
        """Test GET /api/ib-capital/treasury/accounts/:account_id - Non-existent account"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/treasury/accounts/NONEXISTENT")
        assert response.status_code == 404
    
    # ============== GOVERNANCE APPROVAL DETAIL TESTS ==============
    
    def test_get_governance_approvals_list(self):
        """Test GET /api/ib-capital/governance/approvals - List all approvals"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/approvals")
        assert response.status_code == 200
        
        data = response.json()
        assert "approvals" in data
        
        if len(data["approvals"]) > 0:
            approval = data["approvals"][0]
            assert "approval_id" in approval
            assert "action_type" in approval
            assert "requested_by" in approval
            assert "description" in approval
            assert "decision" in approval
    
    def test_get_governance_approval_detail(self):
        """Test GET /api/ib-capital/governance/approvals/:approval_id - Get approval detail"""
        # First get list of approvals
        list_response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/approvals")
        approvals = list_response.json().get("approvals", [])
        
        if len(approvals) == 0:
            pytest.skip("No approvals found to test detail page")
        
        approval_id = approvals[0]["approval_id"]
        
        # Get approval detail
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/approvals/{approval_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["approval_id"] == approval_id
        assert "action_type" in data
        assert "requested_by" in data
        assert "description" in data
        assert "decision" in data
        assert "decided_by" in data
        assert "decision_date" in data
    
    def test_get_governance_approval_not_found(self):
        """Test GET /api/ib-capital/governance/approvals/:approval_id - Non-existent approval"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/approvals/NONEXISTENT")
        assert response.status_code == 404
    
    def test_approve_governance_approval(self):
        """Test POST /api/ib-capital/governance/approvals/:approval_id/decide - Approve"""
        # Create a test approval first
        create_response = self.session.post(f"{BASE_URL}/api/ib-capital/governance/approvals", json={
            "action_type": "test_action",
            "action_reference_id": "TEST_REF_001",
            "requested_by": "Test User",
            "description": "TEST_Approval for testing"
        })
        assert create_response.status_code == 200
        approval_id = create_response.json()["approval_id"]
        
        # Approve the request
        response = self.session.post(
            f"{BASE_URL}/api/ib-capital/governance/approvals/{approval_id}/decide?decision=approved&decided_by=Test Approver"
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["decision"] == "approved"
        assert data["decided_by"] == "Test Approver"
        assert data["decision_date"] is not None
    
    def test_reject_governance_approval(self):
        """Test POST /api/ib-capital/governance/approvals/:approval_id/decide - Reject"""
        # Create a test approval first
        create_response = self.session.post(f"{BASE_URL}/api/ib-capital/governance/approvals", json={
            "action_type": "test_action",
            "action_reference_id": "TEST_REF_002",
            "requested_by": "Test User",
            "description": "TEST_Approval for rejection testing"
        })
        assert create_response.status_code == 200
        approval_id = create_response.json()["approval_id"]
        
        # Reject the request
        response = self.session.post(
            f"{BASE_URL}/api/ib-capital/governance/approvals/{approval_id}/decide?decision=rejected&decided_by=Test Rejector"
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["decision"] == "rejected"
        assert data["decided_by"] == "Test Rejector"
    
    # ============== GOVERNANCE RULE DETAIL TESTS ==============
    
    def test_get_governance_rules_list(self):
        """Test GET /api/ib-capital/governance/rules - List all rules"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/rules")
        assert response.status_code == 200
        
        data = response.json()
        assert "rules" in data
        
        if len(data["rules"]) > 0:
            rule = data["rules"][0]
            assert "rule_id" in rule
            assert "rule_name" in rule
            assert "rule_type" in rule
            assert "applies_to" in rule
            assert "enforcement_action" in rule
            assert "is_active" in rule
    
    def test_get_governance_rule_detail_via_list(self):
        """Test getting rule detail by fetching from list (RuleDetail fetches from list)"""
        # The RuleDetail component fetches all rules and filters by rule_id
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/rules")
        assert response.status_code == 200
        
        data = response.json()
        rules = data.get("rules", [])
        
        if len(rules) == 0:
            pytest.skip("No rules found to test detail page")
        
        rule = rules[0]
        assert "rule_id" in rule
        assert "rule_name" in rule
        assert "rule_type" in rule
        assert "applies_to" in rule
        assert "condition_expression" in rule
        assert "enforcement_action" in rule
        assert "required_role" in rule
        assert "is_active" in rule
    
    def test_update_governance_rule(self):
        """Test PUT /api/ib-capital/governance/rules/:rule_id - Update rule"""
        # Create a test rule first
        create_response = self.session.post(f"{BASE_URL}/api/ib-capital/governance/rules", json={
            "rule_name": "TEST_Rule for Update",
            "rule_type": "approval",
            "applies_to": "equity",
            "condition_expression": "amount > 1000",
            "enforcement_action": "require_approval",
            "required_role": "admin"
        })
        assert create_response.status_code == 200
        rule_id = create_response.json()["rule_id"]
        
        # Update the rule
        response = self.session.put(f"{BASE_URL}/api/ib-capital/governance/rules/{rule_id}", json={
            "rule_name": "TEST_Rule Updated",
            "rule_type": "restriction",
            "applies_to": "debt",
            "condition_expression": "amount > 5000",
            "enforcement_action": "block",
            "required_role": "cfo"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["rule_name"] == "TEST_Rule Updated"
        assert data["rule_type"] == "restriction"
        assert data["applies_to"] == "debt"
    
    def test_deactivate_governance_rule(self):
        """Test DELETE /api/ib-capital/governance/rules/:rule_id - Deactivate rule"""
        # Create a test rule first
        create_response = self.session.post(f"{BASE_URL}/api/ib-capital/governance/rules", json={
            "rule_name": "TEST_Rule for Deactivation",
            "rule_type": "notification",
            "applies_to": "treasury",
            "condition_expression": "amount > 100",
            "enforcement_action": "notify",
            "required_role": "finance"
        })
        assert create_response.status_code == 200
        rule_id = create_response.json()["rule_id"]
        
        # Deactivate the rule
        response = self.session.delete(f"{BASE_URL}/api/ib-capital/governance/rules/{rule_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["is_active"] == False
    
    # ============== NAVIGATION TESTS ==============
    
    def test_ib_capital_dashboard(self):
        """Test GET /api/ib-capital/dashboard - Dashboard loads correctly"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/dashboard")
        assert response.status_code == 200
        
        data = response.json()
        # Dashboard returns summary data
        assert "summary" in data or "pending_approvals" in data
        assert "covenant_status" in data or "ownership_distribution" in data
    
    def test_treasury_liquidity(self):
        """Test GET /api/ib-capital/treasury/liquidity - Liquidity position"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/treasury/liquidity")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_cash" in data
        assert "available_cash" in data
        assert "restricted_cash" in data
        assert "runway_months" in data
    
    def test_governance_authority_matrix(self):
        """Test GET /api/ib-capital/governance/authority-matrix - Authority matrix"""
        response = self.session.get(f"{BASE_URL}/api/ib-capital/governance/authority-matrix")
        assert response.status_code == 200
        
        data = response.json()
        assert "matrix" in data
        assert len(data["matrix"]) > 0
        
        item = data["matrix"][0]
        assert "action" in item
        assert "threshold" in item
        assert "required_approval" in item
        assert "level" in item


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
