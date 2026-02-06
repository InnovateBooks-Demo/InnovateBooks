"""
Commerce Modules API Tests - Catalog, Revenue, Procurement, Governance
Tests all 12 list endpoints for live data functionality
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')

class TestCommerceModulesAPI:
    """Test all commerce module list endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session with authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        
        if login_response.status_code == 200:
            data = login_response.json()
            token = data.get("access_token")
            if token:
                self.session.headers.update({"Authorization": f"Bearer {token}"})
                self.token = token
            else:
                pytest.skip("No access token in login response")
        else:
            pytest.skip(f"Login failed with status {login_response.status_code}")
    
    # ============== CATALOG MODULE TESTS ==============
    
    def test_catalog_items_list(self):
        """Test GET /api/commerce/modules/catalog/items - Catalog Items list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/items")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True, "Response should have success=True"
        assert "items" in data, "Response should contain 'items' key"
        assert "count" in data, "Response should contain 'count' key"
        assert isinstance(data["items"], list), "Items should be a list"
        print(f"✅ Catalog Items: {data['count']} items returned")
    
    def test_catalog_items_search(self):
        """Test catalog items search functionality"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/items?search=test")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✅ Catalog Items Search: {data['count']} items found")
    
    def test_catalog_pricing_list(self):
        """Test GET /api/commerce/modules/catalog/pricing - Pricing list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/pricing")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "pricing" in data, "Response should contain 'pricing' key"
        assert "count" in data
        print(f"✅ Catalog Pricing: {data['count']} pricing rules returned")
    
    def test_catalog_costing_list(self):
        """Test GET /api/commerce/modules/catalog/costing - Costing list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/costing")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "costing" in data, "Response should contain 'costing' key"
        assert "count" in data
        print(f"✅ Catalog Costing: {data['count']} costing records returned")
    
    def test_catalog_rules_list(self):
        """Test GET /api/commerce/modules/catalog/rules - Rules list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/rules")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "rules" in data, "Response should contain 'rules' key"
        assert "count" in data
        print(f"✅ Catalog Rules: {data['count']} rules returned")
    
    def test_catalog_packages_list(self):
        """Test GET /api/commerce/modules/catalog/packages - Packages list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/packages")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "packages" in data, "Response should contain 'packages' key"
        assert "count" in data
        print(f"✅ Catalog Packages: {data['count']} packages returned")
    
    # ============== GOVERNANCE MODULE TESTS ==============
    
    def test_governance_policies_list(self):
        """Test GET /api/commerce/modules/governance/policies - Policies list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/governance/policies")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "policies" in data, "Response should contain 'policies' key"
        assert "count" in data
        print(f"✅ Governance Policies: {data['count']} policies returned")
    
    def test_governance_limits_list(self):
        """Test GET /api/commerce/modules/governance/limits - Limits list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/governance/limits")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "limits" in data, "Response should contain 'limits' key"
        assert "count" in data
        print(f"✅ Governance Limits: {data['count']} limits returned")
    
    def test_governance_authority_list(self):
        """Test GET /api/commerce/modules/governance/authority - Authority list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/governance/authority")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "authorities" in data, "Response should contain 'authorities' key"
        assert "count" in data
        print(f"✅ Governance Authority: {data['count']} authorities returned")
    
    def test_governance_risks_list(self):
        """Test GET /api/commerce/modules/governance/risks - Risks list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/governance/risks")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "risks" in data, "Response should contain 'risks' key"
        assert "count" in data
        print(f"✅ Governance Risks: {data['count']} risks returned")
    
    def test_governance_audits_list(self):
        """Test GET /api/commerce/modules/governance/audits - Audits list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/governance/audits")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "audits" in data, "Response should contain 'audits' key"
        assert "count" in data
        print(f"✅ Governance Audits: {data['count']} audits returned")
    
    # ============== REVENUE MODULE TESTS ==============
    
    def test_revenue_leads_list(self):
        """Test GET /api/commerce/modules/revenue/leads - Leads list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "leads" in data, "Response should contain 'leads' key"
        assert "count" in data
        print(f"✅ Revenue Leads: {data['count']} leads returned")
    
    def test_revenue_leads_filter_by_status(self):
        """Test leads filtering by status"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?status=new")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✅ Revenue Leads (status=new): {data['count']} leads found")
    
    # ============== PROCUREMENT MODULE TESTS ==============
    
    def test_procurement_requests_list(self):
        """Test GET /api/commerce/modules/procurement/requests - Procurement Requests list"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/procurement/requests")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "requests" in data, "Response should contain 'requests' key"
        assert "count" in data
        print(f"✅ Procurement Requests: {data['count']} requests returned")
    
    def test_procurement_requests_filter_by_status(self):
        """Test procurement requests filtering by status"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/procurement/requests?status=pending")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✅ Procurement Requests (status=pending): {data['count']} requests found")
    
    # ============== DASHBOARD STATS TEST ==============
    
    def test_dashboard_stats(self):
        """Test GET /api/commerce/modules/dashboard/stats - Module stats"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/dashboard/stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("success") == True
        assert "stats" in data, "Response should contain 'stats' key"
        
        stats = data["stats"]
        assert "catalog" in stats, "Stats should contain 'catalog'"
        assert "revenue" in stats, "Stats should contain 'revenue'"
        assert "procurement" in stats, "Stats should contain 'procurement'"
        assert "governance" in stats, "Stats should contain 'governance'"
        print(f"✅ Dashboard Stats: All module stats returned")


class TestCRUDOperations:
    """Test CRUD operations for commerce modules"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session with authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        
        if login_response.status_code == 200:
            data = login_response.json()
            token = data.get("access_token")
            if token:
                self.session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            pytest.skip("Login failed")
    
    def test_create_and_get_catalog_item(self):
        """Test creating and retrieving a catalog item"""
        # Create item
        create_payload = {
            "item_code": "TEST-ITEM-001",
            "name": "TEST_Automated Test Item",
            "description": "Created by automated test",
            "category": "Test Category",
            "unit_of_measure": "Each",
            "base_price": 1000,
            "cost_price": 500,
            "status": "active"
        }
        
        create_response = self.session.post(
            f"{BASE_URL}/api/commerce/modules/catalog/items",
            json=create_payload
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        
        create_data = create_response.json()
        assert create_data.get("success") == True
        assert "item_id" in create_data
        
        item_id = create_data["item_id"]
        print(f"✅ Created catalog item: {item_id}")
        
        # Get item to verify persistence
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/catalog/items/{item_id}")
        assert get_response.status_code == 200
        
        get_data = get_response.json()
        assert get_data.get("success") == True
        assert get_data["item"]["name"] == create_payload["name"]
        print(f"✅ Verified catalog item persistence: {item_id}")
        
        # Cleanup - delete the test item
        delete_response = self.session.delete(f"{BASE_URL}/api/commerce/modules/catalog/items/{item_id}")
        assert delete_response.status_code == 200
        print(f"✅ Cleaned up test item: {item_id}")
    
    def test_create_and_get_lead(self):
        """Test creating and retrieving a lead"""
        create_payload = {
            "lead_name": "TEST_Automated Test Lead",
            "company_name": "Test Company",
            "contact_person": "Test Contact",
            "email": "test@testcompany.com",
            "phone": "9876543210",
            "source": "website",
            "status": "new",
            "value": 50000,
            "probability": 30
        }
        
        create_response = self.session.post(
            f"{BASE_URL}/api/commerce/modules/revenue/leads",
            json=create_payload
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        
        create_data = create_response.json()
        assert create_data.get("success") == True
        assert "lead_id" in create_data
        
        lead_id = create_data["lead_id"]
        print(f"✅ Created lead: {lead_id}")
        
        # Get lead to verify persistence
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 200
        
        get_data = get_response.json()
        assert get_data.get("success") == True
        assert get_data["lead"]["lead_name"] == create_payload["lead_name"]
        print(f"✅ Verified lead persistence: {lead_id}")
        
        # Cleanup
        delete_response = self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert delete_response.status_code == 200
        print(f"✅ Cleaned up test lead: {lead_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
