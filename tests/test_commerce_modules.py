"""
Test Commerce Modules API Endpoints
Tests for Catalog Items, Governance Policies, and Dashboard Stats
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestCatalogItems:
    """Catalog Items endpoint tests"""
    
    def test_get_catalog_items_success(self):
        """Test GET /api/commerce/modules/catalog/items returns items"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "items" in data
        assert "count" in data
        assert isinstance(data["items"], list)
        assert data["count"] >= 0
    
    def test_catalog_items_have_required_fields(self):
        """Test catalog items have all required fields"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items")
        assert response.status_code == 200
        
        data = response.json()
        if data["count"] > 0:
            item = data["items"][0]
            # Check required fields exist
            assert "item_id" in item
            assert "item_code" in item
            assert "name" in item
            assert "status" in item
    
    def test_catalog_items_stats_calculation(self):
        """Test that items can be used to calculate stats"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items")
        assert response.status_code == 200
        
        data = response.json()
        items = data["items"]
        
        # Calculate stats
        total_items = len(items)
        active_items = len([i for i in items if i.get("status") == "active"])
        categories = set([i.get("category") for i in items if i.get("category")])
        total_value = sum([i.get("base_price", 0) for i in items])
        
        assert total_items == data["count"]
        assert active_items >= 0
        assert len(categories) >= 0
        assert total_value >= 0
    
    def test_catalog_items_search_filter(self):
        """Test search filter on catalog items"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items?search=Software")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
    
    def test_catalog_items_category_filter(self):
        """Test category filter on catalog items"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items?category=Services")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True


class TestGovernancePolicies:
    """Governance Policies endpoint tests"""
    
    def test_get_policies_success(self):
        """Test GET /api/commerce/modules/governance/policies returns policies"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "policies" in data
        assert "count" in data
        assert isinstance(data["policies"], list)
    
    def test_policies_have_required_fields(self):
        """Test policies have all required fields"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies")
        assert response.status_code == 200
        
        data = response.json()
        if data["count"] > 0:
            policy = data["policies"][0]
            # Check required fields exist
            assert "policy_id" in policy
            assert "policy_name" in policy
            assert "status" in policy
    
    def test_policies_stats_calculation(self):
        """Test that policies can be used to calculate stats"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies")
        assert response.status_code == 200
        
        data = response.json()
        policies = data["policies"]
        
        # Calculate stats
        total_policies = len(policies)
        active_policies = len([p for p in policies if p.get("status") == "active"])
        under_review = len([p for p in policies if p.get("status") == "under_review"])
        policy_types = set([p.get("policy_type") for p in policies if p.get("policy_type")])
        
        assert total_policies == data["count"]
        assert active_policies >= 0
        assert under_review >= 0
        assert len(policy_types) >= 0
    
    def test_policies_status_filter(self):
        """Test status filter on policies"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies?status=active")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True


class TestDashboardStats:
    """Dashboard Stats endpoint tests"""
    
    def test_get_dashboard_stats_success(self):
        """Test GET /api/commerce/modules/dashboard/stats returns stats"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "stats" in data
    
    def test_dashboard_stats_structure(self):
        """Test dashboard stats has correct structure"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        stats = data["stats"]
        
        # Check all module categories exist
        assert "catalog" in stats
        assert "revenue" in stats
        assert "procurement" in stats
        assert "governance" in stats
    
    def test_catalog_stats_fields(self):
        """Test catalog stats has all submodule counts"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        catalog = data["stats"]["catalog"]
        
        assert "items" in catalog
        assert "pricing" in catalog
        assert "costing" in catalog
        assert "rules" in catalog
        assert "packages" in catalog
        
        # All counts should be non-negative integers
        assert isinstance(catalog["items"], int) and catalog["items"] >= 0
        assert isinstance(catalog["pricing"], int) and catalog["pricing"] >= 0
    
    def test_governance_stats_fields(self):
        """Test governance stats has all submodule counts"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/dashboard/stats")
        assert response.status_code == 200
        
        data = response.json()
        governance = data["stats"]["governance"]
        
        assert "policies" in governance
        assert "limits" in governance
        assert "authority" in governance
        assert "risks" in governance
        assert "audits" in governance


class TestCatalogCRUD:
    """Test CRUD operations for Catalog Items"""
    
    def test_create_catalog_item(self):
        """Test POST /api/commerce/modules/catalog/items creates item"""
        payload = {
            "item_code": "TEST-SKU-001",
            "name": "TEST Item for Testing",
            "description": "Test item created by automated tests",
            "category": "Testing",
            "unit_of_measure": "Each",
            "base_price": 1000,
            "cost_price": 500,
            "status": "active"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/modules/catalog/items",
            json=payload
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "item_id" in data
        
        # Store item_id for cleanup
        self.__class__.created_item_id = data["item_id"]
    
    def test_get_created_item(self):
        """Test GET /api/commerce/modules/catalog/items/{item_id} returns created item"""
        if not hasattr(self.__class__, 'created_item_id'):
            pytest.skip("No item created to fetch")
        
        item_id = self.__class__.created_item_id
        response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items/{item_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["item"]["item_id"] == item_id
        assert data["item"]["name"] == "TEST Item for Testing"
    
    def test_delete_created_item(self):
        """Test DELETE /api/commerce/modules/catalog/items/{item_id} deletes item"""
        if not hasattr(self.__class__, 'created_item_id'):
            pytest.skip("No item created to delete")
        
        item_id = self.__class__.created_item_id
        response = requests.delete(f"{BASE_URL}/api/commerce/modules/catalog/items/{item_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/catalog/items/{item_id}")
        assert get_response.status_code == 404


class TestGovernanceCRUD:
    """Test CRUD operations for Governance Policies"""
    
    def test_create_policy(self):
        """Test POST /api/commerce/modules/governance/policies creates policy"""
        payload = {
            "policy_name": "TEST Policy for Testing",
            "policy_type": "testing",
            "description": "Test policy created by automated tests",
            "effective_date": "2025-01-01",
            "owner": "Test Owner",
            "status": "draft"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/modules/governance/policies",
            json=payload
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "policy_id" in data
        
        # Store policy_id for cleanup
        self.__class__.created_policy_id = data["policy_id"]
    
    def test_get_created_policy(self):
        """Test GET /api/commerce/modules/governance/policies/{policy_id} returns created policy"""
        if not hasattr(self.__class__, 'created_policy_id'):
            pytest.skip("No policy created to fetch")
        
        policy_id = self.__class__.created_policy_id
        response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies/{policy_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["policy"]["policy_id"] == policy_id
        assert data["policy"]["policy_name"] == "TEST Policy for Testing"
    
    def test_delete_created_policy(self):
        """Test DELETE /api/commerce/modules/governance/policies/{policy_id} deletes policy"""
        if not hasattr(self.__class__, 'created_policy_id'):
            pytest.skip("No policy created to delete")
        
        policy_id = self.__class__.created_policy_id
        response = requests.delete(f"{BASE_URL}/api/commerce/modules/governance/policies/{policy_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/governance/policies/{policy_id}")
        assert get_response.status_code == 404


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
