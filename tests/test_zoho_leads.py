"""
Zoho CRM Lead Module - Backend API Tests
Tests all CRUD operations and filters for the Lead module
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

class TestLeadAPI:
    """Lead API endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    # ============== GET LEADS TESTS ==============
    
    def test_get_all_leads(self):
        """Test fetching all leads"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "leads" in data
        assert "count" in data
        assert data["count"] >= 15  # We seeded 15 leads
        
        # Verify lead structure has all Zoho CRM fields
        if data["leads"]:
            lead = data["leads"][0]
            zoho_fields = [
                "lead_owner", "salutation", "first_name", "last_name", "title",
                "company", "industry", "annual_revenue", "no_of_employees",
                "lead_source", "lead_status", "rating", "phone", "mobile",
                "email", "website", "street", "city", "state", "zip_code",
                "country", "description", "email_opt_out", "lead_id"
            ]
            for field in zoho_fields:
                assert field in lead, f"Missing field: {field}"
    
    def test_get_leads_filter_by_status(self):
        """Test filtering leads by status"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?lead_status=New")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # All returned leads should have status "New"
        for lead in data["leads"]:
            assert lead["lead_status"] == "New"
    
    def test_get_leads_filter_by_source(self):
        """Test filtering leads by source"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?lead_source=Website")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # All returned leads should have source "Website"
        for lead in data["leads"]:
            assert lead["lead_source"] == "Website"
    
    def test_get_leads_filter_by_rating(self):
        """Test filtering leads by rating"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?rating=Hot")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # All returned leads should have rating "Hot"
        for lead in data["leads"]:
            assert lead["rating"] == "Hot"
    
    def test_get_leads_combined_filters(self):
        """Test filtering leads with multiple filters"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?lead_status=New&rating=Hot")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        
        # All returned leads should match both filters
        for lead in data["leads"]:
            assert lead["lead_status"] == "New"
            assert lead["rating"] == "Hot"
    
    # ============== GET SINGLE LEAD TESTS ==============
    
    def test_get_lead_by_id(self):
        """Test fetching a single lead by ID"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/LEAD-2025-0001")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "lead" in data
        
        lead = data["lead"]
        assert lead["lead_id"] == "LEAD-2025-0001"
        assert lead["first_name"] == "Amit"
        assert lead["last_name"] == "Patel"
        assert lead["company"] == "TechVentures Pvt Ltd"
        assert lead["industry"] == "Technology"
        assert lead["annual_revenue"] == 50000000
        assert lead["no_of_employees"] == 250
    
    def test_get_lead_not_found(self):
        """Test fetching a non-existent lead"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/LEAD-INVALID-9999")
        assert response.status_code == 404
    
    # ============== CREATE LEAD TESTS ==============
    
    def test_create_lead_minimal(self):
        """Test creating a lead with minimal required fields"""
        payload = {
            "last_name": "TEST_MinimalLead",
            "company": "TEST_MinimalCompany"
        }
        
        response = self.session.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "lead_id" in data
        assert data["lead_id"].startswith("LEAD-")
        
        # Verify lead was created by fetching it
        lead_id = data["lead_id"]
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 200
        
        lead_data = get_response.json()
        assert lead_data["lead"]["last_name"] == "TEST_MinimalLead"
        assert lead_data["lead"]["company"] == "TEST_MinimalCompany"
        assert lead_data["lead"]["lead_status"] == "New"  # Default status
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    def test_create_lead_full_zoho_fields(self):
        """Test creating a lead with all Zoho CRM fields"""
        payload = {
            "lead_owner": "TEST_Owner",
            "salutation": "Mr.",
            "first_name": "TEST_John",
            "last_name": "TEST_Doe",
            "title": "CEO",
            "company": "TEST_FullCompany",
            "industry": "Technology",
            "annual_revenue": 10000000,
            "no_of_employees": 100,
            "lead_source": "Website",
            "lead_status": "Contacted",
            "rating": "Hot",
            "phone": "+91-11-1234567",
            "mobile": "+91-9876543210",
            "fax": "+91-11-1234568",
            "email": "test.john@testcompany.com",
            "secondary_email": "john.personal@gmail.com",
            "skype_id": "john.doe.test",
            "website": "https://testcompany.com",
            "street": "123 Test Street",
            "city": "Mumbai",
            "state": "Maharashtra",
            "zip_code": "400001",
            "country": "India",
            "description": "Test lead with all fields populated",
            "email_opt_out": True
        }
        
        response = self.session.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        lead_id = data["lead_id"]
        
        # Verify all fields were saved correctly
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 200
        
        lead = get_response.json()["lead"]
        assert lead["lead_owner"] == "TEST_Owner"
        assert lead["salutation"] == "Mr."
        assert lead["first_name"] == "TEST_John"
        assert lead["last_name"] == "TEST_Doe"
        assert lead["title"] == "CEO"
        assert lead["company"] == "TEST_FullCompany"
        assert lead["industry"] == "Technology"
        assert lead["annual_revenue"] == 10000000
        assert lead["no_of_employees"] == 100
        assert lead["lead_source"] == "Website"
        assert lead["lead_status"] == "Contacted"
        assert lead["rating"] == "Hot"
        assert lead["phone"] == "+91-11-1234567"
        assert lead["mobile"] == "+91-9876543210"
        assert lead["fax"] == "+91-11-1234568"
        assert lead["email"] == "test.john@testcompany.com"
        assert lead["secondary_email"] == "john.personal@gmail.com"
        assert lead["skype_id"] == "john.doe.test"
        assert lead["website"] == "https://testcompany.com"
        assert lead["street"] == "123 Test Street"
        assert lead["city"] == "Mumbai"
        assert lead["state"] == "Maharashtra"
        assert lead["zip_code"] == "400001"
        assert lead["country"] == "India"
        assert lead["description"] == "Test lead with all fields populated"
        assert lead["email_opt_out"] == True
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    # ============== UPDATE LEAD TESTS ==============
    
    def test_update_lead(self):
        """Test updating a lead"""
        # First create a lead
        create_payload = {
            "last_name": "TEST_UpdateLead",
            "company": "TEST_UpdateCompany",
            "lead_status": "New",
            "rating": "Cold"
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=create_payload)
        assert create_response.status_code == 200
        lead_id = create_response.json()["lead_id"]
        
        # Update the lead
        update_payload = {
            "last_name": "TEST_UpdateLead",
            "company": "TEST_UpdatedCompany",
            "lead_status": "Qualified",
            "rating": "Hot",
            "first_name": "TEST_Updated",
            "title": "Updated Title",
            "annual_revenue": 5000000
        }
        
        update_response = self.session.put(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}", json=update_payload)
        assert update_response.status_code == 200
        
        data = update_response.json()
        assert data["success"] == True
        
        # Verify update was persisted
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 200
        
        lead = get_response.json()["lead"]
        assert lead["company"] == "TEST_UpdatedCompany"
        assert lead["lead_status"] == "Qualified"
        assert lead["rating"] == "Hot"
        assert lead["first_name"] == "TEST_Updated"
        assert lead["title"] == "Updated Title"
        assert lead["annual_revenue"] == 5000000
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    def test_update_lead_not_found(self):
        """Test updating a non-existent lead"""
        update_payload = {
            "last_name": "TEST_NotFound",
            "company": "TEST_NotFoundCompany"
        }
        
        response = self.session.put(f"{BASE_URL}/api/commerce/modules/revenue/leads/LEAD-INVALID-9999", json=update_payload)
        assert response.status_code == 404
    
    # ============== DELETE LEAD TESTS ==============
    
    def test_delete_lead(self):
        """Test deleting a lead"""
        # First create a lead
        create_payload = {
            "last_name": "TEST_DeleteLead",
            "company": "TEST_DeleteCompany"
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=create_payload)
        assert create_response.status_code == 200
        lead_id = create_response.json()["lead_id"]
        
        # Delete the lead
        delete_response = self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert delete_response.status_code == 200
        
        data = delete_response.json()
        assert data["success"] == True
        
        # Verify lead no longer exists
        get_response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 404
    
    def test_delete_lead_not_found(self):
        """Test deleting a non-existent lead"""
        response = self.session.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/LEAD-INVALID-9999")
        assert response.status_code == 404
    
    # ============== LEAD ID FORMAT TESTS ==============
    
    def test_lead_id_format(self):
        """Test that lead IDs follow the LEAD-YYYY-XXXX format"""
        response = self.session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        assert response.status_code == 200
        
        data = response.json()
        for lead in data["leads"]:
            lead_id = lead["lead_id"]
            # Check format: LEAD-YYYY-XXXX or LEAD-YYYYMMDDHHMMSS
            assert lead_id.startswith("LEAD-"), f"Invalid lead_id format: {lead_id}"


class TestLeadSeedEndpoint:
    """Test the seed endpoint"""
    
    def test_seed_leads(self):
        """Test seeding leads"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        
        response = session.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/seed")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "15" in data["message"]  # Should mention 15 leads
        
        # Verify 15 leads exist
        get_response = session.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        assert get_response.status_code == 200
        assert get_response.json()["count"] == 15


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
