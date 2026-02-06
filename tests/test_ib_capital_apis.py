"""
IB Capital Module - Backend API Tests
Tests for: Ownership, Equity, Debt, Treasury, Returns, Governance modules
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestIBCapitalSeed:
    """Test seed data endpoint"""
    
    def test_seed_data(self):
        """Seed IB Capital data"""
        response = requests.post(f"{BASE_URL}/api/ib-capital/seed")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["summary"]["owners"] >= 1
        assert data["summary"]["instruments"] >= 1
        assert data["summary"]["funding_rounds"] >= 1
        assert data["summary"]["debts"] >= 1
        assert data["summary"]["treasury_accounts"] >= 1


class TestIBCapitalDashboard:
    """Test dashboard endpoint"""
    
    def test_get_dashboard(self):
        """Get IB Capital dashboard overview"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/dashboard")
        assert response.status_code == 200
        data = response.json()
        
        # Verify summary KPIs
        assert "summary" in data
        summary = data["summary"]
        assert "total_equity_value" in summary
        assert "total_debt_outstanding" in summary
        assert "total_cash_position" in summary
        assert "net_capital_position" in summary
        assert "total_shareholders" in summary
        assert "active_debt_instruments" in summary
        assert "pending_approvals" in summary
        
        # Verify other sections
        assert "ownership_distribution" in data
        assert "recent_rounds" in data
        assert "pending_approvals" in data
        assert "covenant_status" in data


class TestOwnershipModule:
    """Test Ownership module endpoints"""
    
    def test_get_owners(self):
        """Get all shareholders/owners"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/owners")
        assert response.status_code == 200
        data = response.json()
        assert "owners" in data
        assert "total" in data
        assert len(data["owners"]) >= 1
        
        # Verify owner structure
        owner = data["owners"][0]
        assert "owner_id" in owner
        assert "name" in owner
        assert "owner_type" in owner
        assert "status" in owner
    
    def test_get_owners_filter_by_status(self):
        """Get owners filtered by status"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/owners?status=active")
        assert response.status_code == 200
        data = response.json()
        for owner in data["owners"]:
            assert owner["status"] == "active"
    
    def test_get_owner_detail(self):
        """Get owner details with holdings"""
        # First get an owner
        owners_response = requests.get(f"{BASE_URL}/api/ib-capital/owners")
        owner_id = owners_response.json()["owners"][0]["owner_id"]
        
        response = requests.get(f"{BASE_URL}/api/ib-capital/owners/{owner_id}")
        assert response.status_code == 200
        data = response.json()
        assert "owner_id" in data
        assert "holdings" in data
        assert "total_shares" in data
        assert "ownership_percentage" in data
    
    def test_get_owner_not_found(self):
        """Get non-existent owner returns 404"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/owners/INVALID123")
        assert response.status_code == 404
    
    def test_create_owner(self):
        """Create a new shareholder"""
        payload = {
            "owner_type": "individual",
            "name": "TEST_New Investor",
            "country": "India",
            "tax_identifier": "TESTPAN123",
            "email": "test_investor@example.com"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/owners", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TEST_New Investor"
        assert data["owner_type"] == "individual"
        assert "owner_id" in data
    
    def test_get_cap_table(self):
        """Get full cap table with ownership breakdown"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/cap-table")
        assert response.status_code == 200
        data = response.json()
        assert "cap_table" in data
        assert "total_shares" in data
        assert "total_owners" in data
        assert "snapshot_date" in data
        
        # Verify cap table entry structure
        if len(data["cap_table"]) > 0:
            entry = data["cap_table"][0]
            assert "owner_id" in entry
            assert "owner_name" in entry
            assert "shares" in entry
            assert "ownership_percentage" in entry
    
    def test_get_instruments(self):
        """Get all equity instruments"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/instruments")
        assert response.status_code == 200
        data = response.json()
        assert "instruments" in data
        assert len(data["instruments"]) >= 1
        
        # Verify instrument structure
        instrument = data["instruments"][0]
        assert "instrument_id" in instrument
        assert "instrument_type" in instrument
        assert "class_name" in instrument
        assert "par_value" in instrument
    
    def test_get_ownership_lots(self):
        """Get ownership lots"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/ownership-lots")
        assert response.status_code == 200
        data = response.json()
        assert "lots" in data


class TestEquityModule:
    """Test Equity module endpoints"""
    
    def test_get_funding_rounds(self):
        """Get all funding rounds"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds")
        assert response.status_code == 200
        data = response.json()
        assert "rounds" in data
        assert "total" in data
        assert len(data["rounds"]) >= 1
        
        # Verify round structure
        round_data = data["rounds"][0]
        assert "round_id" in round_data
        assert "round_name" in round_data
        assert "pre_money_valuation" in round_data
        assert "target_amount" in round_data
        assert "raised_amount" in round_data
        assert "status" in round_data
    
    def test_get_funding_rounds_filter_by_status(self):
        """Get funding rounds filtered by status"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds?status=closed")
        assert response.status_code == 200
        data = response.json()
        for round_data in data["rounds"]:
            assert round_data["status"] == "closed"
    
    def test_get_funding_round_detail(self):
        """Get funding round details"""
        # First get a round
        rounds_response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds")
        round_id = rounds_response.json()["rounds"][0]["round_id"]
        
        response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds/{round_id}")
        assert response.status_code == 200
        data = response.json()
        assert "round_id" in data
        assert "equity_issues" in data
        assert "total_issued" in data
    
    def test_get_funding_round_not_found(self):
        """Get non-existent funding round returns 404"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds/INVALID123")
        assert response.status_code == 404
    
    def test_create_funding_round(self):
        """Create a new funding round"""
        # First get an instrument
        instruments_response = requests.get(f"{BASE_URL}/api/ib-capital/instruments")
        instrument_id = instruments_response.json()["instruments"][0]["instrument_id"]
        
        payload = {
            "round_name": "TEST_Series C",
            "instrument_id": instrument_id,
            "pre_money_valuation": 3000000000,
            "target_amount": 1000000000,
            "currency": "INR"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/funding-rounds", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["round_name"] == "TEST_Series C"
        assert data["status"] == "planned"
        assert "round_id" in data
    
    def test_get_equity_issues(self):
        """Get equity issues"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/equity-issues")
        assert response.status_code == 200
        data = response.json()
        assert "issues" in data
    
    def test_get_dilution_analysis(self):
        """Get dilution analysis for a round"""
        # First get a round
        rounds_response = requests.get(f"{BASE_URL}/api/ib-capital/funding-rounds")
        round_id = rounds_response.json()["rounds"][0]["round_id"]
        
        response = requests.get(f"{BASE_URL}/api/ib-capital/dilution-analysis/{round_id}")
        assert response.status_code == 200
        data = response.json()
        assert "round_id" in data
        assert "pre_round_shares" in data
        assert "new_shares_issued" in data
        assert "dilution_percentage" in data


class TestDebtModule:
    """Test Debt module endpoints"""
    
    def test_get_debts(self):
        """Get all debt instruments"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/debts")
        assert response.status_code == 200
        data = response.json()
        assert "debts" in data
        assert "total" in data
        assert len(data["debts"]) >= 1
        
        # Verify debt structure
        debt = data["debts"][0]
        assert "debt_id" in debt
        assert "lender_name" in debt
        assert "debt_type" in debt
        assert "principal_amount" in debt
        assert "outstanding_principal" in debt
        assert "interest_rate" in debt
        assert "status" in debt
    
    def test_get_debts_filter_by_status(self):
        """Get debts filtered by status"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/debts?status=active")
        assert response.status_code == 200
        data = response.json()
        for debt in data["debts"]:
            assert debt["status"] == "active"
    
    def test_get_debt_detail(self):
        """Get debt instrument details"""
        # First get a debt
        debts_response = requests.get(f"{BASE_URL}/api/ib-capital/debts")
        debt_id = debts_response.json()["debts"][0]["debt_id"]
        
        response = requests.get(f"{BASE_URL}/api/ib-capital/debts/{debt_id}")
        assert response.status_code == 200
        data = response.json()
        assert "debt_id" in data
        assert "repayment_schedule" in data
        assert "covenants" in data
    
    def test_get_debt_not_found(self):
        """Get non-existent debt returns 404"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/debts/INVALID123")
        assert response.status_code == 404
    
    def test_create_debt(self):
        """Create a new debt instrument"""
        payload = {
            "lender_id": "TEST_LENDER001",
            "lender_name": "TEST_Bank of India",
            "debt_type": "term_loan",
            "principal_amount": 100000000,
            "currency": "INR",
            "interest_rate": 10.5,
            "interest_type": "fixed",
            "start_date": "2025-01-01",
            "maturity_date": "2028-01-01"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/debts", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["lender_name"] == "TEST_Bank of India"
        assert data["status"] == "planned"
        assert "debt_id" in data
    
    def test_get_covenants(self):
        """Get all covenants"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/covenants")
        assert response.status_code == 200
        data = response.json()
        assert "covenants" in data


class TestTreasuryModule:
    """Test Treasury module endpoints"""
    
    def test_get_treasury_accounts(self):
        """Get all treasury accounts"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/accounts")
        assert response.status_code == 200
        data = response.json()
        assert "accounts" in data
        assert len(data["accounts"]) >= 1
        
        # Verify account structure
        account = data["accounts"][0]
        assert "account_id" in account
        assert "bank_name" in account
        assert "account_type" in account
        assert "balance" in account
        assert "status" in account
    
    def test_get_treasury_account_detail(self):
        """Get treasury account details"""
        # First get an account
        accounts_response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/accounts")
        account_id = accounts_response.json()["accounts"][0]["account_id"]
        
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/accounts/{account_id}")
        assert response.status_code == 200
        data = response.json()
        assert "account_id" in data
        assert "inflows" in data
        assert "outflows" in data
    
    def test_get_treasury_account_not_found(self):
        """Get non-existent account returns 404"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/accounts/INVALID123")
        assert response.status_code == 404
    
    def test_create_treasury_account(self):
        """Create a new treasury account"""
        payload = {
            "bank_name": "TEST_State Bank",
            "account_number": "TEST123456789",
            "account_type": "operating",
            "currency": "INR",
            "initial_balance": 5000000
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/treasury/accounts", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["bank_name"] == "TEST_State Bank"
        assert data["balance"] == 5000000
        assert "account_id" in data
    
    def test_get_cash_inflows(self):
        """Get all cash inflows"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/inflows")
        assert response.status_code == 200
        data = response.json()
        assert "inflows" in data
    
    def test_get_cash_outflows(self):
        """Get all cash outflows"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/outflows")
        assert response.status_code == 200
        data = response.json()
        assert "outflows" in data
    
    def test_get_liquidity_position(self):
        """Get current liquidity position"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/treasury/liquidity")
        assert response.status_code == 200
        data = response.json()
        assert "total_cash" in data
        assert "restricted_cash" in data
        assert "available_cash" in data
        assert "runway_months" in data


class TestReturnsModule:
    """Test Returns module endpoints"""
    
    def test_get_returns(self):
        """Get all return declarations"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/returns")
        assert response.status_code == 200
        data = response.json()
        assert "returns" in data
        
        # Verify return structure if data exists
        if len(data["returns"]) > 0:
            ret = data["returns"][0]
            assert "return_id" in ret
            assert "return_type" in ret
            assert "declared_amount" in ret
            assert "status" in ret
    
    def test_get_returns_filter_by_type(self):
        """Get returns filtered by type"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/returns?return_type=dividend")
        assert response.status_code == 200
        data = response.json()
        for ret in data["returns"]:
            assert ret["return_type"] == "dividend"
    
    def test_get_return_detail(self):
        """Get return declaration details"""
        # First get a return
        returns_response = requests.get(f"{BASE_URL}/api/ib-capital/returns")
        returns_data = returns_response.json()["returns"]
        if len(returns_data) > 0:
            return_id = returns_data[0]["return_id"]
            
            response = requests.get(f"{BASE_URL}/api/ib-capital/returns/{return_id}")
            assert response.status_code == 200
            data = response.json()
            assert "return_id" in data
            assert "entitlements" in data
    
    def test_create_return_declaration(self):
        """Create a new return declaration"""
        payload = {
            "return_type": "dividend",
            "source_id": "RND001",
            "declared_amount": 10000000,
            "currency": "INR",
            "record_date": "2025-03-01",
            "payment_date": "2025-03-15"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/returns", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["return_type"] == "dividend"
        assert data["status"] == "declared"
        assert "return_id" in data


class TestGovernanceModule:
    """Test Governance module endpoints"""
    
    def test_get_governance_rules(self):
        """Get all governance rules"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/governance/rules")
        assert response.status_code == 200
        data = response.json()
        assert "rules" in data
        
        # Verify rule structure if data exists
        if len(data["rules"]) > 0:
            rule = data["rules"][0]
            assert "rule_id" in rule
            assert "rule_name" in rule
            assert "rule_type" in rule
            assert "applies_to" in rule
            assert "is_active" in rule
    
    def test_get_governance_rules_filter(self):
        """Get governance rules filtered by applies_to"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/governance/rules?applies_to=equity")
        assert response.status_code == 200
        data = response.json()
        for rule in data["rules"]:
            assert rule["applies_to"] == "equity"
    
    def test_create_governance_rule(self):
        """Create a new governance rule"""
        payload = {
            "rule_name": "TEST_Large Transaction Approval",
            "rule_type": "approval",
            "applies_to": "treasury",
            "condition_expression": "amount > 10000000",
            "enforcement_action": "require_approval",
            "required_role": "CFO"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/governance/rules", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["rule_name"] == "TEST_Large Transaction Approval"
        assert data["is_active"] == True
        assert "rule_id" in data
    
    def test_get_approvals(self):
        """Get all approval requests"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/governance/approvals")
        assert response.status_code == 200
        data = response.json()
        assert "approvals" in data
        
        # Verify approval structure if data exists
        if len(data["approvals"]) > 0:
            approval = data["approvals"][0]
            assert "approval_id" in approval
            assert "action_type" in approval
            assert "description" in approval
            assert "decision" in approval
    
    def test_get_approvals_filter_by_decision(self):
        """Get approvals filtered by decision"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/governance/approvals?decision=pending")
        assert response.status_code == 200
        data = response.json()
        for approval in data["approvals"]:
            assert approval["decision"] == "pending"
    
    def test_create_approval(self):
        """Create an approval request"""
        payload = {
            "action_type": "equity_issue",
            "action_reference_id": "TEST_REF001",
            "requested_by": "CFO",
            "description": "TEST_Approval for new equity issue"
        }
        response = requests.post(f"{BASE_URL}/api/ib-capital/governance/approvals", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["action_type"] == "equity_issue"
        assert data["decision"] == "pending"
        assert "approval_id" in data
    
    def test_get_authority_matrix(self):
        """Get the capital authority matrix"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/governance/authority-matrix")
        assert response.status_code == 200
        data = response.json()
        assert "matrix" in data
        assert len(data["matrix"]) >= 1
        
        # Verify matrix entry structure
        entry = data["matrix"][0]
        assert "action" in entry
        assert "threshold" in entry
        assert "required_approval" in entry
        assert "level" in entry


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
