"""
Test Suite for Revenue and Procurement 5-Stage Workflow APIs
Tests: Lead→Evaluate→Commit→Contract→Handoff for Revenue
       Procure→Evaluate→Commit→Contract→Handoff for Procurement
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

class TestRevenueWorkflowAPIs:
    """Revenue Workflow API Tests - 5 Stage Pipeline"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup for each test"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    # ===== STAGE 1: LEADS =====
    
    def test_get_revenue_leads_list(self):
        """Test GET /api/commerce/workflow/revenue/leads - List all leads"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "leads" in data
        assert "count" in data
        print(f"✓ Revenue leads list: {data['count']} leads found")
    
    def test_create_revenue_lead(self):
        """Test POST /api/commerce/workflow/revenue/leads - Create new lead"""
        lead_data = {
            "company_name": "TEST_TechStartup Inc",
            "website": "https://techstartup.com",
            "country": "India",
            "industry": "Technology",
            "contact_name": "Test Contact",
            "contact_email": "test@techstartup.com",
            "contact_phone": "+91-9876543210",
            "lead_source": "website",
            "estimated_deal_value": 1500000,
            "expected_timeline": "3-6 months",
            "problem_identified": True,
            "budget_mentioned": "yes",
            "authority_known": True,
            "need_timeline": True,
            "notes": "Test lead for workflow testing"
        }
        response = self.session.post(f"{BASE_URL}/api/commerce/workflow/revenue/leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "lead_id" in data
        print(f"✓ Created revenue lead: {data['lead_id']}")
        return data["lead_id"]
    
    def test_get_revenue_lead_detail(self):
        """Test GET /api/commerce/workflow/revenue/leads/{lead_id} - Get lead details"""
        # First get list to find a lead
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads")
        leads = list_response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available for testing")
        
        lead_id = leads[0]["lead_id"]
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads/{lead_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "lead" in data
        assert data["lead"]["lead_id"] == lead_id
        print(f"✓ Got lead detail: {lead_id}")
    
    def test_update_revenue_lead(self):
        """Test PUT /api/commerce/workflow/revenue/leads/{lead_id} - Update lead"""
        # Get a lead to update
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads")
        leads = list_response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available for testing")
        
        lead = leads[0]
        lead_id = lead["lead_id"]
        
        update_data = {
            "company_name": lead.get("company_name", "Updated Company"),
            "country": lead.get("country", "India"),
            "contact_name": lead.get("contact_name", "Updated Contact"),
            "contact_email": lead.get("contact_email", "updated@test.com"),
            "lead_source": "referral",
            "estimated_deal_value": 2000000,
            "expected_timeline": "0-3 months",
            "notes": "Updated via test"
        }
        
        response = self.session.put(f"{BASE_URL}/api/commerce/workflow/revenue/leads/{lead_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Updated lead: {lead_id}")
    
    def test_change_lead_stage(self):
        """Test PUT /api/commerce/workflow/revenue/leads/{lead_id}/stage - Change stage"""
        # Get a 'new' lead
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads?stage=new")
        leads = list_response.json().get("leads", [])
        if not leads:
            pytest.skip("No 'new' leads available for stage change test")
        
        lead_id = leads[0]["lead_id"]
        
        # Change from new -> contacted
        response = self.session.put(f"{BASE_URL}/api/commerce/workflow/revenue/leads/{lead_id}/stage?new_stage=contacted")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Changed lead stage to contacted: {lead_id}")
    
    def test_convert_qualified_lead_to_evaluation(self):
        """Test POST /api/commerce/workflow/revenue/leads/{lead_id}/convert-to-evaluate"""
        # Get a qualified lead that hasn't been converted
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/leads?stage=qualified")
        leads = list_response.json().get("leads", [])
        qualified_leads = [l for l in leads if not l.get("is_converted")]
        
        if not qualified_leads:
            pytest.skip("No unconverted qualified leads available")
        
        lead_id = qualified_leads[0]["lead_id"]
        response = self.session.post(f"{BASE_URL}/api/commerce/workflow/revenue/leads/{lead_id}/convert-to-evaluate")
        
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == True
            assert "evaluation_id" in data
            assert "party_id" in data
            print(f"✓ Converted lead to evaluation: {data['evaluation_id']}")
        elif response.status_code == 400:
            # Lead already converted or not qualified
            print(f"⚠ Lead conversion skipped: {response.json().get('detail')}")
        else:
            pytest.fail(f"Unexpected status code: {response.status_code}")
    
    # ===== STAGE 2: EVALUATIONS =====
    
    def test_get_revenue_evaluations_list(self):
        """Test GET /api/commerce/workflow/revenue/evaluations"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/evaluations")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "evaluations" in data
        print(f"✓ Revenue evaluations list: {data['count']} evaluations found")
    
    def test_get_revenue_evaluation_detail(self):
        """Test GET /api/commerce/workflow/revenue/evaluations/{evaluation_id}"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/evaluations")
        evaluations = list_response.json().get("evaluations", [])
        if not evaluations:
            pytest.skip("No evaluations available")
        
        eval_id = evaluations[0]["evaluation_id"]
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/evaluations/{eval_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "evaluation" in data
        assert "party_readiness" in data
        assert "risk_assessment" in data
        print(f"✓ Got evaluation detail with party readiness and risk: {eval_id}")
    
    # ===== STAGE 3: COMMITS =====
    
    def test_get_revenue_commits_list(self):
        """Test GET /api/commerce/workflow/revenue/commits"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/commits")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "commits" in data
        print(f"✓ Revenue commits list: {data['count']} commits found")
    
    def test_get_revenue_commit_detail(self):
        """Test GET /api/commerce/workflow/revenue/commits/{commit_id}"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/commits")
        commits = list_response.json().get("commits", [])
        if not commits:
            pytest.skip("No commits available")
        
        commit_id = commits[0]["commit_id"]
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/commits/{commit_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "commit" in data
        print(f"✓ Got commit detail: {commit_id}")
    
    # ===== STAGE 4: CONTRACTS =====
    
    def test_get_revenue_contracts_list(self):
        """Test GET /api/commerce/workflow/revenue/contracts"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/contracts")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "contracts" in data
        print(f"✓ Revenue contracts list: {data['count']} contracts found")
    
    # ===== STAGE 5: HANDOFFS =====
    
    def test_get_revenue_handoffs_list(self):
        """Test GET /api/commerce/workflow/revenue/handoffs"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/revenue/handoffs")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "handoffs" in data
        print(f"✓ Revenue handoffs list: {data['count']} handoffs found")


class TestProcurementWorkflowAPIs:
    """Procurement Workflow API Tests - 5 Stage Pipeline"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup for each test"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    # ===== STAGE 1: PROCURE REQUESTS =====
    
    def test_get_procure_requests_list(self):
        """Test GET /api/commerce/workflow/procure/requests"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/requests")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "requests" in data
        assert "count" in data
        print(f"✓ Procurement requests list: {data['count']} requests found")
    
    def test_create_procure_request(self):
        """Test POST /api/commerce/workflow/procure/requests"""
        request_data = {
            "title": "TEST_Office Equipment Purchase",
            "description": "Test procurement request for office equipment",
            "request_type": "goods",
            "priority": "medium",
            "needed_by_date": "2025-03-01",
            "requesting_department": "IT",
            "cost_center": "TECH",
            "project_code": "PRJ-TEST",
            "estimated_cost": 250000,
            "is_recurring": False,
            "notes": "Test request for workflow testing"
        }
        response = self.session.post(f"{BASE_URL}/api/commerce/workflow/procure/requests", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "request_id" in data
        print(f"✓ Created procurement request: {data['request_id']}")
        return data["request_id"]
    
    def test_get_procure_request_detail(self):
        """Test GET /api/commerce/workflow/procure/requests/{request_id}"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/requests")
        requests_list = list_response.json().get("requests", [])
        if not requests_list:
            pytest.skip("No procurement requests available")
        
        request_id = requests_list[0]["request_id"]
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/requests/{request_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "request" in data
        print(f"✓ Got procurement request detail: {request_id}")
    
    def test_update_procure_request(self):
        """Test PUT /api/commerce/workflow/procure/requests/{request_id}"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/requests")
        requests_list = list_response.json().get("requests", [])
        draft_requests = [r for r in requests_list if r.get("status") == "draft"]
        
        if not draft_requests:
            pytest.skip("No draft procurement requests available")
        
        req = draft_requests[0]
        request_id = req["request_id"]
        
        update_data = {
            "title": req.get("title", "Updated Title"),
            "description": req.get("description", "Updated description"),
            "request_type": req.get("request_type", "goods"),
            "priority": "high",
            "requesting_department": req.get("requesting_department", "IT"),
            "cost_center": req.get("cost_center", "TECH"),
            "estimated_cost": 300000,
            "is_recurring": False,
            "notes": "Updated via test"
        }
        
        response = self.session.put(f"{BASE_URL}/api/commerce/workflow/procure/requests/{request_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Updated procurement request: {request_id}")
    
    def test_submit_procure_request_for_evaluation(self):
        """Test POST /api/commerce/workflow/procure/requests/{request_id}/submit"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/requests?status=draft")
        requests_list = list_response.json().get("requests", [])
        
        if not requests_list:
            pytest.skip("No draft procurement requests available")
        
        request_id = requests_list[0]["request_id"]
        response = self.session.post(f"{BASE_URL}/api/commerce/workflow/procure/requests/{request_id}/submit")
        
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == True
            assert "evaluation_id" in data
            print(f"✓ Submitted request for evaluation: {data['evaluation_id']}")
        elif response.status_code == 400:
            print(f"⚠ Request submission skipped: {response.json().get('detail')}")
        else:
            pytest.fail(f"Unexpected status code: {response.status_code}")
    
    # ===== STAGE 2: EVALUATIONS =====
    
    def test_get_procure_evaluations_list(self):
        """Test GET /api/commerce/workflow/procure/evaluations"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/evaluations")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "evaluations" in data
        print(f"✓ Procurement evaluations list: {data['count']} evaluations found")
    
    def test_get_procure_evaluation_detail(self):
        """Test GET /api/commerce/workflow/procure/evaluations/{evaluation_id}"""
        list_response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/evaluations")
        evaluations = list_response.json().get("evaluations", [])
        if not evaluations:
            pytest.skip("No procurement evaluations available")
        
        eval_id = evaluations[0]["evaluation_id"]
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/evaluations/{eval_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "evaluation" in data
        assert "budget_validation" in data
        print(f"✓ Got procurement evaluation with budget validation: {eval_id}")
    
    # ===== STAGE 3: COMMITS =====
    
    def test_get_procure_commits_list(self):
        """Test GET /api/commerce/workflow/procure/commits"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/commits")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "commits" in data
        print(f"✓ Procurement commits list: {data['count']} commits found")
    
    # ===== STAGE 4: CONTRACTS =====
    
    def test_get_procure_contracts_list(self):
        """Test GET /api/commerce/workflow/procure/contracts"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/contracts")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "contracts" in data
        print(f"✓ Procurement contracts list: {data['count']} contracts found")
    
    # ===== STAGE 5: HANDOFFS =====
    
    def test_get_procure_handoffs_list(self):
        """Test GET /api/commerce/workflow/procure/handoffs"""
        response = self.session.get(f"{BASE_URL}/api/commerce/workflow/procure/handoffs")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "handoffs" in data
        print(f"✓ Procurement handoffs list: {data['count']} handoffs found")


class TestWorkflowSeedData:
    """Test seed data endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup for each test"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
    
    def test_seed_workflow_data(self):
        """Test POST /api/commerce/workflow/seed-workflow-data"""
        response = self.session.post(f"{BASE_URL}/api/commerce/workflow/seed-workflow-data")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "revenue_leads" in data
        assert "procure_requests" in data
        print(f"✓ Seeded workflow data: {data['revenue_leads']} revenue leads, {data['procure_requests']} procurement requests")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
