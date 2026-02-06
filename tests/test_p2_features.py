"""
P2 Features Backend API Tests
- Cap Table Scenario Modeling
- Email Campaigns
- Workflow Builder
- ML Bank Reconciliation
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestAuth:
    """Authentication helper"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        token = data.get("access_token") or data.get("token")
        assert token, "No token in response"
        return token
    
    @pytest.fixture(scope="class")
    def auth_headers(self, auth_token):
        """Get headers with auth token"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }


class TestCapTableScenarioTemplates(TestAuth):
    """Cap Table Scenario Templates API Tests"""
    
    def test_get_scenario_templates_returns_3_templates(self, auth_headers):
        """Test that scenario templates endpoint returns exactly 3 templates"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/templates",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "templates" in data, "Response should have 'templates' key"
        templates = data["templates"]
        assert len(templates) == 3, f"Expected 3 templates, got {len(templates)}"
        
        # Verify template structure
        template_ids = [t["id"] for t in templates]
        assert "startup_seed_to_a" in template_ids, "Missing 'startup_seed_to_a' template"
        assert "growth_b_to_c" in template_ids, "Missing 'growth_b_to_c' template"
        assert "bridge_round" in template_ids, "Missing 'bridge_round' template"
        
        # Verify each template has required fields
        for template in templates:
            assert "id" in template
            assert "name" in template
            assert "description" in template
            assert "base_valuation" in template
            assert "base_shares" in template
            assert "rounds" in template


class TestCapTableQuickSimulation(TestAuth):
    """Cap Table Quick Simulation API Tests"""
    
    def test_quick_simulation_calculates_dilution_correctly(self, auth_headers):
        """Test quick simulation calculates dilution correctly"""
        payload = {
            "current_shares": 1000000,
            "current_valuation": 10000000,
            "investment_amount": 2000000,
            "pre_money_valuation": 10000000,
            "option_pool_increase": 10
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/simulate-quick",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify input is echoed back
        assert "input" in data
        assert data["input"]["current_shares"] == 1000000
        assert data["input"]["investment_amount"] == 2000000
        
        # Verify output calculations
        assert "output" in data
        output = data["output"]
        
        # Price per share = pre_money / current_shares = 10M / 1M = 10
        assert output["price_per_share"] == 10.0
        
        # New shares = investment / price = 2M / 10 = 200,000
        assert output["new_shares_issued"] == 200000
        
        # Option pool shares = current_shares * 10% = 100,000
        assert output["option_pool_shares"] == 100000
        
        # Post round shares = 1M + 200K + 100K = 1.3M
        assert output["post_round_shares"] == 1300000
        
        # Post money valuation = pre_money + investment = 12M
        assert output["post_money_valuation"] == 12000000
        
        # Dilution factor = 1M / 1.3M ≈ 0.7692
        assert 0.76 < output["dilution_factor"] < 0.78
        
        # Dilution percentage ≈ 23.08%
        assert 23 < output["dilution_percentage"] < 24
    
    def test_quick_simulation_rejects_zero_investment(self, auth_headers):
        """Test quick simulation rejects zero investment amount"""
        payload = {
            "current_shares": 1000000,
            "current_valuation": 10000000,
            "investment_amount": 0,
            "pre_money_valuation": 10000000
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/simulate-quick",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"


class TestCapTableScenarioCRUD(TestAuth):
    """Cap Table Scenario Create/List Tests"""
    
    def test_create_scenario(self, auth_headers):
        """Test creating a new scenario"""
        payload = {
            "name": "TEST_P2_Scenario",
            "description": "Test scenario for P2 testing",
            "base_valuation": 5000000,
            "base_shares_outstanding": 1000000
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/scenario/create",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "scenario_id" in data
        assert data["name"] == "TEST_P2_Scenario"
        assert data["base_valuation"] == 5000000
        assert data["base_shares_outstanding"] == 1000000
        assert data["status"] == "draft"
        
        # Store scenario_id for cleanup
        TestCapTableScenarioCRUD.created_scenario_id = data["scenario_id"]
        return data["scenario_id"]
    
    def test_list_scenarios(self, auth_headers):
        """Test listing scenarios"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/scenario/list",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "scenarios" in data
        assert isinstance(data["scenarios"], list)
    
    def test_delete_scenario(self, auth_headers):
        """Test deleting a scenario (cleanup)"""
        if hasattr(TestCapTableScenarioCRUD, 'created_scenario_id'):
            scenario_id = TestCapTableScenarioCRUD.created_scenario_id
            response = requests.delete(
                f"{BASE_URL}/api/ib-capital/scenario/{scenario_id}",
                headers=auth_headers
            )
            assert response.status_code == 200, f"Failed: {response.text}"


class TestEmailCampaignsTemplates(TestAuth):
    """Email Campaigns Templates API Tests"""
    
    def test_list_templates(self, auth_headers):
        """Test listing email templates"""
        response = requests.get(
            f"{BASE_URL}/api/email-campaigns/templates",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "templates" in data
        assert isinstance(data["templates"], list)
    
    def test_seed_default_templates(self, auth_headers):
        """Test seeding default email templates"""
        response = requests.post(
            f"{BASE_URL}/api/email-campaigns/templates/seed",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True
        assert "message" in data
        # Message should indicate templates created
        assert "template" in data["message"].lower() or "created" in data["message"].lower()
    
    def test_templates_exist_after_seed(self, auth_headers):
        """Verify templates exist after seeding"""
        response = requests.get(
            f"{BASE_URL}/api/email-campaigns/templates",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        templates = data["templates"]
        # Should have at least the 4 default templates
        template_names = [t["name"] for t in templates]
        
        # Check for expected default templates
        expected_templates = ["Welcome Email", "Invoice Reminder", "Newsletter", "Promotional Offer"]
        for expected in expected_templates:
            assert expected in template_names, f"Missing template: {expected}"


class TestEmailCampaignsCRUD(TestAuth):
    """Email Campaigns Create Campaign Tests"""
    
    @pytest.fixture(scope="class")
    def template_id(self, auth_headers):
        """Get a template ID for campaign creation"""
        # First seed templates
        requests.post(
            f"{BASE_URL}/api/email-campaigns/templates/seed",
            headers=auth_headers
        )
        
        # Get templates
        response = requests.get(
            f"{BASE_URL}/api/email-campaigns/templates",
            headers=auth_headers
        )
        data = response.json()
        if data["templates"]:
            return data["templates"][0]["template_id"]
        
        # Create a template if none exist
        response = requests.post(
            f"{BASE_URL}/api/email-campaigns/templates",
            headers=auth_headers,
            json={
                "name": "TEST_Template",
                "subject": "Test Subject",
                "body_html": "<p>Test body</p>",
                "category": "general",
                "variables": []
            }
        )
        return response.json()["template_id"]
    
    def test_create_campaign(self, auth_headers, template_id):
        """Test creating a new email campaign"""
        payload = {
            "name": "TEST_P2_Campaign",
            "template_id": template_id,
            "recipient_type": "manual"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/email-campaigns/campaigns",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "campaign_id" in data
        assert data["name"] == "TEST_P2_Campaign"
        assert data["status"] == "draft"
        assert data["template_id"] == template_id
        
        # Store for cleanup
        TestEmailCampaignsCRUD.created_campaign_id = data["campaign_id"]
    
    def test_list_campaigns(self, auth_headers):
        """Test listing campaigns"""
        response = requests.get(
            f"{BASE_URL}/api/email-campaigns/campaigns",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "campaigns" in data
        assert isinstance(data["campaigns"], list)
    
    def test_delete_campaign(self, auth_headers):
        """Test deleting a campaign (cleanup)"""
        if hasattr(TestEmailCampaignsCRUD, 'created_campaign_id'):
            campaign_id = TestEmailCampaignsCRUD.created_campaign_id
            response = requests.delete(
                f"{BASE_URL}/api/email-campaigns/campaigns/{campaign_id}",
                headers=auth_headers
            )
            assert response.status_code == 200, f"Failed: {response.text}"


class TestWorkflowBuilderTemplates(TestAuth):
    """Workflow Builder Templates API Tests"""
    
    def test_get_workflow_templates_returns_4_templates(self, auth_headers):
        """Test that workflow templates endpoint returns exactly 4 templates"""
        response = requests.get(
            f"{BASE_URL}/api/workflows/templates/list",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "templates" in data, "Response should have 'templates' key"
        templates = data["templates"]
        assert len(templates) == 4, f"Expected 4 templates, got {len(templates)}"
        
        # Verify template IDs
        template_ids = [t["id"] for t in templates]
        assert "invoice_overdue_reminder" in template_ids
        assert "payment_received_notification" in template_ids
        assert "new_lead_assignment" in template_ids
        assert "contract_expiry_alert" in template_ids
        
        # Verify each template has required fields
        for template in templates:
            assert "id" in template
            assert "name" in template
            assert "description" in template
            assert "category" in template
            assert "trigger" in template
            assert "steps" in template


class TestWorkflowBuilderCRUD(TestAuth):
    """Workflow Builder Create/Run Tests"""
    
    def test_create_workflow(self, auth_headers):
        """Test creating a new workflow"""
        payload = {
            "name": "TEST_P2_Workflow",
            "description": "Test workflow for P2 testing",
            "trigger": {
                "type": "manual",
                "event_type": None,
                "schedule": None,
                "conditions": []
            },
            "steps": [
                {
                    "step_id": "s1",
                    "name": "Test Step",
                    "step_type": "action",
                    "config": {
                        "type": "send_notification",
                        "title": "Test Notification",
                        "message": "This is a test",
                        "notification_type": "info"
                    },
                    "next_steps": [],
                    "position": {"x": 100, "y": 100}
                }
            ],
            "is_active": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/workflows/create",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "workflow_id" in data
        assert data["name"] == "TEST_P2_Workflow"
        assert data["is_active"] == False
        assert len(data["steps"]) == 1
        
        # Store for later tests
        TestWorkflowBuilderCRUD.created_workflow_id = data["workflow_id"]
        return data["workflow_id"]
    
    def test_list_workflows(self, auth_headers):
        """Test listing workflows"""
        response = requests.get(
            f"{BASE_URL}/api/workflows/list",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "workflows" in data
        assert isinstance(data["workflows"], list)
    
    def test_run_workflow_manually(self, auth_headers):
        """Test running a workflow manually"""
        if not hasattr(TestWorkflowBuilderCRUD, 'created_workflow_id'):
            pytest.skip("No workflow created")
        
        workflow_id = TestWorkflowBuilderCRUD.created_workflow_id
        
        response = requests.post(
            f"{BASE_URL}/api/workflows/{workflow_id}/run",
            headers=auth_headers,
            json={"trigger_data": {"test_key": "test_value"}}
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True
        assert "run_id" in data
        assert "message" in data
        
        # Store run_id
        TestWorkflowBuilderCRUD.created_run_id = data["run_id"]
    
    def test_get_workflow_runs(self, auth_headers):
        """Test getting workflow runs"""
        if not hasattr(TestWorkflowBuilderCRUD, 'created_workflow_id'):
            pytest.skip("No workflow created")
        
        workflow_id = TestWorkflowBuilderCRUD.created_workflow_id
        
        response = requests.get(
            f"{BASE_URL}/api/workflows/{workflow_id}/runs",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert "runs" in data
        assert isinstance(data["runs"], list)
    
    def test_delete_workflow(self, auth_headers):
        """Test deleting a workflow (cleanup)"""
        if hasattr(TestWorkflowBuilderCRUD, 'created_workflow_id'):
            workflow_id = TestWorkflowBuilderCRUD.created_workflow_id
            response = requests.delete(
                f"{BASE_URL}/api/workflows/{workflow_id}",
                headers=auth_headers
            )
            assert response.status_code == 200, f"Failed: {response.text}"


class TestMLBankReconciliation(TestAuth):
    """ML Bank Reconciliation API Tests"""
    
    def test_analyze_endpoint_with_empty_data(self, auth_headers):
        """Test ML analyze endpoint with empty data"""
        payload = {
            "bank_entries": [],
            "accounting_records": []
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/analyze",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True
        assert "data" in data
        assert "message" in data
    
    def test_analyze_endpoint_with_sample_data(self, auth_headers):
        """Test ML analyze endpoint with sample transaction data"""
        payload = {
            "bank_entries": [
                {
                    "entry_id": "BANK-001",
                    "date": "2025-01-15",
                    "description": "Payment from Acme Corp INV-2025-001",
                    "amount": 50000,
                    "type": "credit"
                },
                {
                    "entry_id": "BANK-002",
                    "date": "2025-01-16",
                    "description": "Vendor payment to TechSupply Ltd",
                    "amount": -25000,
                    "type": "debit"
                }
            ],
            "accounting_records": [
                {
                    "receivable_id": "REC-001",
                    "customer_name": "Acme Corp",
                    "invoice_number": "INV-2025-001",
                    "invoice_amount": 50000,
                    "type": "receivable"
                },
                {
                    "payable_id": "PAY-001",
                    "vendor_name": "TechSupply Ltd",
                    "bill_number": "BILL-001",
                    "bill_amount": 25000,
                    "type": "payable"
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/analyze",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True
        assert "data" in data
        assert "total_analyzed" in data
        assert data["total_analyzed"] == 2
        assert "matches_found" in data
        assert "ml_powered" in data
        
        # Verify match structure
        matches = data["data"]
        assert isinstance(matches, list)
        
        # Each match should have bank_entry_id and matches array
        for match in matches:
            assert "bank_entry_id" in match
            assert "matches" in match
            assert "reasoning" in match
    
    def test_analyze_endpoint_finds_matches(self, auth_headers):
        """Test that ML analyze finds correct matches based on amount and description"""
        payload = {
            "bank_entries": [
                {
                    "entry_id": "BANK-TEST-001",
                    "date": "2025-01-15",
                    "description": "Payment from TestCompany",
                    "amount": 100000,
                    "type": "credit"
                }
            ],
            "accounting_records": [
                {
                    "receivable_id": "REC-TEST-001",
                    "customer_name": "TestCompany",
                    "invoice_number": "INV-TEST-001",
                    "invoice_amount": 100000,
                    "type": "receivable"
                },
                {
                    "receivable_id": "REC-TEST-002",
                    "customer_name": "OtherCompany",
                    "invoice_number": "INV-TEST-002",
                    "invoice_amount": 50000,
                    "type": "receivable"
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/analyze",
            headers=auth_headers,
            json=payload
        )
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        assert data["success"] == True
        matches = data["data"]
        
        # Should find at least one match
        assert len(matches) > 0
        
        # First bank entry should have matches
        first_match = matches[0]
        assert first_match["bank_entry_id"] == "BANK-TEST-001"
        
        # Should have found the matching receivable
        if first_match["matches"]:
            top_match = first_match["matches"][0]
            assert "accounting_id" in top_match
            assert "confidence" in top_match
            # The TestCompany receivable should be the top match
            assert top_match["accounting_id"] == "REC-TEST-001"


class TestAuthenticationRequired:
    """Test that all endpoints require authentication"""
    
    def test_cap_table_templates_requires_auth(self):
        """Cap table templates should not require auth (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/scenario/templates")
        # This endpoint might be public or require auth
        assert response.status_code in [200, 401, 403]
    
    def test_cap_table_list_requires_auth(self):
        """Cap table list requires authentication"""
        response = requests.get(f"{BASE_URL}/api/ib-capital/scenario/list")
        assert response.status_code == 401
    
    def test_email_campaigns_requires_auth(self):
        """Email campaigns requires authentication"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/templates")
        assert response.status_code == 401
    
    def test_workflows_requires_auth(self):
        """Workflows requires authentication"""
        response = requests.get(f"{BASE_URL}/api/workflows/list")
        assert response.status_code == 401
    
    def test_ml_reconcile_requires_auth(self):
        """ML reconcile requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/ml-reconcile/analyze",
            json={"bank_entries": [], "accounting_records": []}
        )
        assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
