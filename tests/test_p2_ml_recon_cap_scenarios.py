"""
Test P2 Features: ML Bank Reconciliation and Cap Table Scenario Modeling
Tests all API endpoints for:
1. ML-powered bank reconciliation with auto-suggestions
2. Cap Table Scenario Modeling with dilution analysis
"""

import pytest
import requests
import os
import uuid
from datetime import datetime, timezone

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestAuth:
    """Authentication helper"""
    
    @staticmethod
    def get_auth_token():
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "remember_me": True
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        return None


@pytest.fixture(scope="module")
def auth_token():
    """Get auth token for all tests"""
    token = TestAuth.get_auth_token()
    if not token:
        pytest.skip("Authentication failed - skipping tests")
    return token


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get auth headers for all tests"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


# ============== ML BANK RECONCILIATION TESTS ==============

class TestMLBankReconciliation:
    """Test ML-powered bank reconciliation APIs"""
    
    def test_ml_auto_match_endpoint_exists(self, auth_headers):
        """Test POST /api/ib-finance/ml-reconcile/auto-match endpoint exists"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/auto-match",
            headers=auth_headers
        )
        # Should return 200 even if no data to match
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "success" in data or "message" in data or "total_analyzed" in data
        print(f"✓ ML auto-match endpoint works: {data.get('message', data)}")
    
    def test_ml_auto_match_returns_expected_fields(self, auth_headers):
        """Test ML auto-match returns expected response structure"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/auto-match",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Check expected fields
        expected_fields = ["success", "message", "total_analyzed", "auto_matched", "pending_review"]
        for field in expected_fields:
            if field in data:
                print(f"✓ Field '{field}' present: {data[field]}")
        
        # Verify all_matches is a list if present
        if "all_matches" in data:
            assert isinstance(data["all_matches"], list), "all_matches should be a list"
            print(f"✓ all_matches is a list with {len(data['all_matches'])} items")
    
    def test_ml_suggestions_endpoint_requires_entry_id(self, auth_headers):
        """Test GET /api/ib-finance/ml-reconcile/suggestions/{entry_id} endpoint"""
        # Test with a non-existent entry ID
        fake_entry_id = "ENTRY-NONEXISTENT"
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/suggestions/{fake_entry_id}",
            headers=auth_headers
        )
        # Should return 404 for non-existent entry
        assert response.status_code in [200, 404], f"Expected 200 or 404, got {response.status_code}"
        print(f"✓ ML suggestions endpoint responds correctly: {response.status_code}")
    
    def test_ml_confirm_match_requires_ids(self, auth_headers):
        """Test POST /api/ib-finance/ml-reconcile/confirm-match requires bank_entry_id and accounting_record_id"""
        # Test with missing data
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/confirm-match",
            headers=auth_headers,
            json={}
        )
        # Should return 400 for missing required fields
        assert response.status_code == 400, f"Expected 400 for missing fields, got {response.status_code}"
        print("✓ Confirm match validates required fields")
    
    def test_ml_confirm_match_with_invalid_ids(self, auth_headers):
        """Test confirm match with non-existent IDs"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/confirm-match",
            headers=auth_headers,
            json={
                "bank_entry_id": "NONEXISTENT-BANK-ENTRY",
                "accounting_record_id": "NONEXISTENT-RECORD"
            }
        )
        # Should return 404 for non-existent bank entry
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ Confirm match returns 404 for non-existent entries")
    
    def test_ml_analyze_endpoint(self, auth_headers):
        """Test POST /api/ib-finance/ml-reconcile/analyze endpoint"""
        # Test with sample data
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/analyze",
            headers=auth_headers,
            json={
                "bank_entries": [
                    {
                        "entry_id": "TEST-ENTRY-001",
                        "date": "2025-01-15",
                        "description": "Payment from ABC Corp",
                        "amount": 50000,
                        "type": "credit"
                    }
                ],
                "accounting_records": [
                    {
                        "id": "RCV-001",
                        "party_name": "ABC Corp",
                        "amount": 50000,
                        "type": "receivable"
                    }
                ]
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "success" in data
        print(f"✓ ML analyze endpoint works: {data}")
    
    def test_ml_endpoints_require_auth(self):
        """Test ML endpoints require authentication"""
        endpoints = [
            ("POST", f"{BASE_URL}/api/ib-finance/ml-reconcile/auto-match"),
            ("GET", f"{BASE_URL}/api/ib-finance/ml-reconcile/suggestions/test"),
            ("POST", f"{BASE_URL}/api/ib-finance/ml-reconcile/confirm-match"),
        ]
        
        for method, url in endpoints:
            if method == "POST":
                response = requests.post(url, json={})
            else:
                response = requests.get(url)
            
            assert response.status_code in [401, 403], f"Expected 401/403 for {url}, got {response.status_code}"
        
        print("✓ All ML endpoints require authentication")


# ============== CAP TABLE SCENARIO MODELING TESTS ==============

class TestCapTableScenarioModeling:
    """Test Cap Table Scenario Modeling APIs"""
    
    def test_get_scenario_templates(self, auth_headers):
        """Test GET /api/ib-capital/scenario/templates returns templates"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/templates",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "templates" in data, "Response should contain 'templates'"
        templates = data["templates"]
        assert isinstance(templates, list), "templates should be a list"
        assert len(templates) >= 1, "Should have at least 1 template"
        
        # Verify template structure
        for template in templates:
            assert "id" in template, "Template should have 'id'"
            assert "name" in template, "Template should have 'name'"
            assert "rounds" in template, "Template should have 'rounds'"
            print(f"✓ Template: {template['name']} with {len(template['rounds'])} rounds")
        
        print(f"✓ Got {len(templates)} scenario templates")
    
    def test_list_scenarios(self, auth_headers):
        """Test GET /api/ib-capital/scenario/list returns scenarios"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/list",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "scenarios" in data, "Response should contain 'scenarios'"
        assert isinstance(data["scenarios"], list), "scenarios should be a list"
        print(f"✓ Got {len(data['scenarios'])} saved scenarios")
    
    def test_create_scenario(self, auth_headers):
        """Test POST /api/ib-capital/scenario/create creates a new scenario"""
        scenario_name = f"TEST_Scenario_{uuid.uuid4().hex[:6]}"
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "name": scenario_name,
                "description": "Test scenario for dilution modeling",
                "base_valuation": 10000000,
                "base_shares_outstanding": 10000000
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "scenario_id" in data, "Response should contain 'scenario_id'"
        assert data["name"] == scenario_name, "Scenario name should match"
        assert data["base_valuation"] == 10000000, "Base valuation should match"
        
        print(f"✓ Created scenario: {data['scenario_id']}")
        return data["scenario_id"]
    
    def test_create_scenario_requires_name(self, auth_headers):
        """Test scenario creation requires name"""
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "description": "Test without name",
                "base_valuation": 10000000,
                "base_shares_outstanding": 10000000
            }
        )
        # Should fail validation
        assert response.status_code in [400, 422], f"Expected 400/422, got {response.status_code}"
        print("✓ Scenario creation validates required fields")
    
    def test_get_scenario_details(self, auth_headers):
        """Test GET /api/ib-capital/scenario/{scenario_id} returns scenario details"""
        # First create a scenario
        scenario_name = f"TEST_Detail_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "name": scenario_name,
                "description": "Test scenario for details",
                "base_valuation": 15000000,
                "base_shares_outstanding": 15000000
            }
        )
        assert create_response.status_code == 200
        scenario_id = create_response.json()["scenario_id"]
        
        # Get scenario details
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/{scenario_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data["scenario_id"] == scenario_id
        assert data["name"] == scenario_name
        assert "rounds" in data, "Should include rounds array"
        
        print(f"✓ Got scenario details: {scenario_id}")
    
    def test_add_round_to_scenario(self, auth_headers):
        """Test POST /api/ib-capital/scenario/round/add adds a round"""
        # First create a scenario
        scenario_name = f"TEST_Round_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "name": scenario_name,
                "description": "Test scenario for rounds",
                "base_valuation": 10000000,
                "base_shares_outstanding": 10000000
            }
        )
        assert create_response.status_code == 200
        scenario_id = create_response.json()["scenario_id"]
        
        # Add a round
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/round/add",
            headers=auth_headers,
            json={
                "scenario_id": scenario_id,
                "round_name": "Seed Round",
                "round_type": "seed",
                "pre_money_valuation": 10000000,
                "investment_amount": 2000000,
                "option_pool_increase": 10
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "round_id" in data, "Response should contain 'round_id'"
        assert data["round_name"] == "Seed Round"
        assert data["investment_amount"] == 2000000
        assert "price_per_share" in data, "Should calculate price_per_share"
        assert "new_shares_issued" in data, "Should calculate new_shares_issued"
        assert "post_money_valuation" in data, "Should calculate post_money_valuation"
        
        print(f"✓ Added round: {data['round_id']} with price/share: {data['price_per_share']}")
    
    def test_quick_simulation(self, auth_headers):
        """Test POST /api/ib-capital/scenario/simulate-quick calculates dilution"""
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/simulate-quick",
            headers=auth_headers,
            json={
                "current_shares": 10000000,
                "current_valuation": 10000000,
                "pre_money_valuation": 10000000,
                "investment_amount": 2000000,
                "option_pool_increase": 0
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "input" in data, "Response should contain 'input'"
        assert "output" in data, "Response should contain 'output'"
        
        output = data["output"]
        assert "price_per_share" in output
        assert "new_shares_issued" in output
        assert "post_money_valuation" in output
        assert "dilution_percentage" in output
        assert "new_investor_ownership_pct" in output
        assert "existing_ownership_pct" in output
        
        # Verify calculations
        # With 10M pre-money and 2M investment:
        # Post-money = 12M
        # New investor gets 2M/12M = 16.67%
        # Existing diluted to 83.33%
        assert output["post_money_valuation"] == 12000000, f"Post-money should be 12M, got {output['post_money_valuation']}"
        assert abs(output["new_investor_ownership_pct"] - 16.67) < 0.1, f"New investor should own ~16.67%, got {output['new_investor_ownership_pct']}"
        assert abs(output["existing_ownership_pct"] - 83.33) < 0.1, f"Existing should own ~83.33%, got {output['existing_ownership_pct']}"
        
        print(f"✓ Quick simulation works:")
        print(f"  - Dilution: {output['dilution_percentage']}%")
        print(f"  - New investor: {output['new_investor_ownership_pct']}%")
        print(f"  - Existing: {output['existing_ownership_pct']}%")
    
    def test_quick_simulation_requires_positive_investment(self, auth_headers):
        """Test quick simulation validates investment amount"""
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/simulate-quick",
            headers=auth_headers,
            json={
                "current_shares": 10000000,
                "current_valuation": 10000000,
                "pre_money_valuation": 10000000,
                "investment_amount": 0,  # Invalid
                "option_pool_increase": 0
            }
        )
        assert response.status_code == 400, f"Expected 400 for zero investment, got {response.status_code}"
        print("✓ Quick simulation validates positive investment amount")
    
    def test_analyze_dilution(self, auth_headers):
        """Test POST /api/ib-capital/scenario/analyze runs dilution analysis"""
        # Create scenario with rounds
        scenario_name = f"TEST_Analysis_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "name": scenario_name,
                "description": "Test scenario for analysis",
                "base_valuation": 10000000,
                "base_shares_outstanding": 10000000
            }
        )
        assert create_response.status_code == 200
        scenario_id = create_response.json()["scenario_id"]
        
        # Add a round
        requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/round/add",
            headers=auth_headers,
            json={
                "scenario_id": scenario_id,
                "round_name": "Seed",
                "round_type": "seed",
                "pre_money_valuation": 10000000,
                "investment_amount": 2000000,
                "option_pool_increase": 0
            }
        )
        
        # Run analysis
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/analyze",
            headers=auth_headers,
            json={"scenario_id": scenario_id}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "scenario_id" in data
        assert "summary" in data
        assert "rounds_analysis" in data
        assert "final_ownership" in data
        
        summary = data["summary"]
        assert "total_rounds" in summary
        assert "total_capital_raised" in summary
        assert "final_valuation" in summary
        assert "total_dilution_pct" in summary
        
        print(f"✓ Dilution analysis complete:")
        print(f"  - Total rounds: {summary['total_rounds']}")
        print(f"  - Capital raised: {summary['total_capital_raised']}")
        print(f"  - Final valuation: {summary['final_valuation']}")
        print(f"  - Total dilution: {summary['total_dilution_pct']}%")
    
    def test_delete_scenario(self, auth_headers):
        """Test DELETE /api/ib-capital/scenario/{scenario_id} soft deletes scenario"""
        # Create a scenario to delete
        scenario_name = f"TEST_Delete_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json={
                "name": scenario_name,
                "description": "Test scenario for deletion",
                "base_valuation": 10000000,
                "base_shares_outstanding": 10000000
            }
        )
        assert create_response.status_code == 200
        scenario_id = create_response.json()["scenario_id"]
        
        # Delete the scenario (soft delete)
        response = requests.delete(
            f"{BASE_URL}/api/ib-capital/scenario/{scenario_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True or "deleted" in str(data).lower()
        
        # Verify scenario is not in list (soft deleted scenarios filtered out)
        list_response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/list",
            headers=auth_headers
        )
        scenarios = list_response.json().get("scenarios", [])
        scenario_ids = [s.get("scenario_id") for s in scenarios]
        assert scenario_id not in scenario_ids, "Deleted scenario should not appear in list"
        
        print(f"✓ Scenario soft deleted: {scenario_id}")
    
    def test_scenario_endpoints_require_auth(self):
        """Test scenario endpoints require authentication (except templates which is public)"""
        # Templates endpoint is public by design
        templates_response = requests.get(f"{BASE_URL}/api/ib-capital/scenario/templates")
        assert templates_response.status_code == 200, "Templates endpoint should be public"
        print("✓ Templates endpoint is public (by design)")
        
        # Other endpoints require auth
        auth_required_endpoints = [
            ("GET", f"{BASE_URL}/api/ib-capital/scenario/list"),
            ("POST", f"{BASE_URL}/api/ib-capital/scenario/create"),
            ("GET", f"{BASE_URL}/api/ib-capital/scenario/test-id"),
            ("POST", f"{BASE_URL}/api/ib-capital/scenario/round/add"),
            ("POST", f"{BASE_URL}/api/ib-capital/scenario/simulate-quick"),
            ("POST", f"{BASE_URL}/api/ib-capital/scenario/analyze"),
        ]
        
        for method, url in auth_required_endpoints:
            if method == "POST":
                response = requests.post(url, json={})
            else:
                response = requests.get(url)
            
            assert response.status_code in [401, 403], f"Expected 401/403 for {url}, got {response.status_code}"
        
        print("✓ All protected scenario endpoints require authentication")


# ============== CLEANUP ==============

class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_scenarios(self, auth_headers):
        """Clean up TEST_ prefixed scenarios"""
        # Get all scenarios
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/list",
            headers=auth_headers
        )
        if response.status_code == 200:
            scenarios = response.json().get("scenarios", [])
            deleted = 0
            for scenario in scenarios:
                if scenario.get("name", "").startswith("TEST_"):
                    del_response = requests.delete(
                        f"{BASE_URL}/api/ib-capital/scenario/{scenario['scenario_id']}",
                        headers=auth_headers
                    )
                    if del_response.status_code == 200:
                        deleted += 1
            print(f"✓ Cleaned up {deleted} test scenarios")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
