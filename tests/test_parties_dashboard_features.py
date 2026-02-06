"""
Test Suite for IB Commerce - Parties Dashboard and New Features
Tests Dashboard Stats, Bulk Operations, and Enhanced Vendors List
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestDashboardStats:
    """Dashboard statistics endpoint tests"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers for requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token") or data.get("token")
            return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        pytest.skip("Authentication failed")
    
    def test_get_dashboard_stats(self, auth_headers):
        """Test GET /api/commerce/parties/dashboard/stats - Get all party stats"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/dashboard/stats",
            headers=auth_headers
        )
        print(f"Dashboard stats response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to get dashboard stats: {response.text}"
        data = response.json()
        assert data.get("success") == True, "Response success should be True"
        assert "stats" in data, "Response should contain stats object"
        
        stats = data["stats"]
        # Verify all party types are present
        assert "customers" in stats, "Stats should contain customers"
        assert "vendors" in stats, "Stats should contain vendors"
        assert "partners" in stats, "Stats should contain partners"
        assert "channels" in stats, "Stats should contain channels"
        assert "profiles" in stats, "Stats should contain profiles"
        
        # Verify structure of each stat
        for party_type in ["customers", "vendors", "partners", "channels", "profiles"]:
            assert "total" in stats[party_type], f"{party_type} should have total count"
            assert "active" in stats[party_type], f"{party_type} should have active count"
        
        # Vendors should have critical count
        assert "critical" in stats["vendors"], "Vendors should have critical count"
        
        print(f"Dashboard stats verified successfully")
        print(f"Customers: {stats['customers']['total']} total, {stats['customers']['active']} active")
        print(f"Vendors: {stats['vendors']['total']} total, {stats['vendors']['active']} active, {stats['vendors']['critical']} critical")


class TestBulkOperations:
    """Bulk operations endpoint tests"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers for requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token") or data.get("token")
            return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        pytest.skip("Authentication failed")
    
    def test_bulk_create_customers(self, auth_headers):
        """Test POST /api/commerce/parties/bulk/customers - Bulk create customers"""
        customers_data = [
            {
                "display_name": "TEST_Bulk_Customer_A",
                "legal_name": "Test Bulk Customer A Ltd",
                "party_category": "customer",
                "country_of_registration": "India",
                "status": "active",
                "primary_role": "Buyer",
                "customer_type": "B2B",
                "contacts": [],
                "locations": []
            },
            {
                "display_name": "TEST_Bulk_Customer_B",
                "legal_name": "Test Bulk Customer B Ltd",
                "party_category": "customer",
                "country_of_registration": "USA",
                "status": "active",
                "primary_role": "Buyer",
                "customer_type": "B2C",
                "contacts": [],
                "locations": []
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/parties/bulk/customers",
            headers=auth_headers,
            json=customers_data
        )
        print(f"Bulk create customers response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to bulk create customers: {response.text}"
        data = response.json()
        assert data.get("success") == True, "Response success should be True"
        assert "created" in data, "Response should contain created list"
        assert len(data["created"]) == 2, "Should have created 2 customers"
        assert "errors" in data, "Response should contain errors list"
        assert len(data["errors"]) == 0, "Should have no errors"
        
        print(f"Bulk created customers: {data['created']}")
        
        # Store IDs for cleanup
        return data["created"]
    
    def test_bulk_create_vendors(self, auth_headers):
        """Test POST /api/commerce/parties/bulk/vendors - Bulk create vendors"""
        vendors_data = [
            {
                "display_name": "TEST_Bulk_Vendor_A",
                "legal_name": "Test Bulk Vendor A Ltd",
                "party_category": "vendor",
                "country_of_registration": "India",
                "status": "active",
                "primary_role": "Supplier",
                "vendor_type": "Material",
                "contacts": [],
                "locations": []
            },
            {
                "display_name": "TEST_Bulk_Vendor_B",
                "legal_name": "Test Bulk Vendor B Ltd",
                "party_category": "vendor",
                "country_of_registration": "USA",
                "status": "active",
                "primary_role": "Supplier",
                "vendor_type": "Service",
                "contacts": [],
                "locations": []
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/parties/bulk/vendors",
            headers=auth_headers,
            json=vendors_data
        )
        print(f"Bulk create vendors response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to bulk create vendors: {response.text}"
        data = response.json()
        assert data.get("success") == True, "Response success should be True"
        assert "created" in data, "Response should contain created list"
        assert len(data["created"]) == 2, "Should have created 2 vendors"
        
        print(f"Bulk created vendors: {data['created']}")


class TestVendorsListFeatures:
    """Vendors list enhanced features tests"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers for requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token") or data.get("token")
            return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        pytest.skip("Authentication failed")
    
    def test_vendors_list_with_search(self, auth_headers):
        """Test GET /api/commerce/parties/vendors with search"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors?search=Cloud",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Search failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Search 'Cloud' returned {data['count']} vendors")
    
    def test_vendors_list_with_type_filter(self, auth_headers):
        """Test GET /api/commerce/parties/vendors with vendor_type filter"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors?vendor_type=Service",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Filter failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Service vendors: {data['count']}")
    
    def test_vendors_list_with_status_filter(self, auth_headers):
        """Test GET /api/commerce/parties/vendors with status filter"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors?status=active",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Filter failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Active vendors: {data['count']}")
    
    def test_vendor_detail_and_update(self, auth_headers):
        """Test vendor detail retrieval and update"""
        # Get first vendor
        list_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors",
            headers=auth_headers
        )
        assert list_response.status_code == 200
        vendors = list_response.json().get("vendors", [])
        assert len(vendors) > 0, "Should have at least one vendor"
        
        vendor_id = vendors[0]["vendor_id"]
        
        # Get vendor detail
        detail_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors/{vendor_id}",
            headers=auth_headers
        )
        assert detail_response.status_code == 200, f"Failed to get vendor detail: {detail_response.text}"
        data = detail_response.json()
        assert data.get("success") == True
        assert "vendor" in data
        print(f"Vendor detail retrieved: {data['vendor']['display_name']}")


class TestCleanupBulkData:
    """Cleanup bulk test data"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers for requests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token") or data.get("token")
            return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        pytest.skip("Authentication failed")
    
    def test_cleanup_bulk_customers(self, auth_headers):
        """Clean up TEST_Bulk_ prefixed customers"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/customers?search=TEST_Bulk_",
            headers=auth_headers
        )
        if response.status_code == 200:
            customers = response.json().get("customers", [])
            for customer in customers:
                if customer.get("display_name", "").startswith("TEST_Bulk_"):
                    requests.delete(
                        f"{BASE_URL}/api/commerce/parties/customers/{customer['customer_id']}",
                        headers=auth_headers
                    )
                    print(f"Deleted test customer: {customer['customer_id']}")
    
    def test_cleanup_bulk_vendors(self, auth_headers):
        """Clean up TEST_Bulk_ prefixed vendors"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/vendors?search=TEST_Bulk_",
            headers=auth_headers
        )
        if response.status_code == 200:
            vendors = response.json().get("vendors", [])
            for vendor in vendors:
                if vendor.get("display_name", "").startswith("TEST_Bulk_"):
                    requests.delete(
                        f"{BASE_URL}/api/commerce/parties/vendors/{vendor['vendor_id']}",
                        headers=auth_headers
                    )
                    print(f"Deleted test vendor: {vendor['vendor_id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
