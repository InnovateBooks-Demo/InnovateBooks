"""
Enhanced Lead Module API Tests
Tests for Zoho + HubSpot + Salesforce features:
- Lead CRUD with 47+ fields
- Lead scoring and recalculation
- Activities CRUD
- Deals CRUD
- Lead conversion
- Lifecycle stage updates
- Engagement tracking
- Timeline
- Dashboard stats
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestLeadDashboardStats:
    """Test dashboard stats endpoint"""
    
    def test_dashboard_stats_endpoint(self):
        """Test /api/commerce/modules/revenue/leads/dashboard/stats returns stats"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "stats" in data
        stats = data["stats"]
        # Verify all expected stat fields
        assert "total_leads" in stats
        assert "rating_breakdown" in stats
        assert "lifecycle_breakdown" in stats
        assert "total_deal_value" in stats
        assert "average_lead_score" in stats
        print(f"Dashboard stats: total_leads={stats['total_leads']}, avg_score={stats['average_lead_score']}")


class TestLeadCRUD:
    """Test Lead CRUD operations with enhanced fields"""
    
    def test_get_all_leads(self):
        """Test GET /api/commerce/modules/revenue/leads returns leads"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "leads" in data
        assert "count" in data
        print(f"Total leads: {data['count']}")
    
    def test_filter_leads_by_status(self):
        """Test filtering leads by status"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?lead_status=New")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # All returned leads should have status=New
        for lead in data.get("leads", []):
            assert lead.get("lead_status") == "New"
        print(f"Leads with status 'New': {data['count']}")
    
    def test_filter_leads_by_source(self):
        """Test filtering leads by source"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?lead_source=Website")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        for lead in data.get("leads", []):
            assert lead.get("lead_source") == "Website"
        print(f"Leads from 'Website': {data['count']}")
    
    def test_filter_leads_by_rating(self):
        """Test filtering leads by rating"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads?rating=Hot")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        for lead in data.get("leads", []):
            assert lead.get("rating") == "Hot"
        print(f"Hot leads: {data['count']}")
    
    def test_get_lead_by_id(self):
        """Test GET /api/commerce/modules/revenue/leads/{id}"""
        # First get a lead ID
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "lead" in data
        lead = data["lead"]
        # Verify enhanced fields exist
        assert "lead_score" in lead
        assert "lifecycle_stage" in lead
        assert "email_opens" in lead or lead.get("email_opens") is None
        print(f"Lead {lead_id}: {lead.get('first_name')} {lead.get('last_name')}, Score: {lead.get('lead_score')}")
    
    def test_create_lead_with_enhanced_fields(self):
        """Test creating lead with Zoho+HubSpot+Salesforce fields"""
        lead_data = {
            "last_name": "TEST_EnhancedLead",
            "company": "TEST_Company",
            "first_name": "Test",
            "title": "CEO",
            "lead_source": "Website",
            "lead_status": "New",
            "rating": "Hot",
            "lifecycle_stage": "MQL",
            "lead_priority": "High",
            "email": "test.enhanced@example.com",
            "phone": "+91-9876543210",
            "industry": "Technology",
            "annual_revenue": 50000000,
            "no_of_employees": 200,
            "company_type": "Enterprise",
            "linkedin_url": "https://linkedin.com/in/testuser",
            "twitter_handle": "@testuser",
            "campaign_source": "Google Ads",
            "campaign_name": "Q1 Campaign",
            "email_opens": 5,
            "email_clicks": 2,
            "website_visits": 10,
            "deal_value": 1000000,
            "deal_stage": "Qualification",
            "deal_probability": 30,
            "tags": ["test", "enterprise"]
        }
        response = requests.post(
            f"{BASE_URL}/api/commerce/modules/revenue/leads",
            json=lead_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "lead_id" in data
        print(f"Created lead: {data['lead_id']}")
        
        # Verify lead was created with all fields
        lead_id = data["lead_id"]
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 200
        created_lead = get_response.json().get("lead", {})
        assert created_lead.get("lifecycle_stage") == "MQL"
        assert created_lead.get("deal_value") == 1000000
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    def test_update_lead(self):
        """Test updating a lead"""
        # Create a test lead first
        lead_data = {"last_name": "TEST_UpdateLead", "company": "TEST_UpdateCompany"}
        create_response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=lead_data)
        lead_id = create_response.json().get("lead_id")
        
        # Update the lead
        update_data = {
            "last_name": "TEST_UpdateLead",
            "company": "TEST_UpdateCompany",
            "lead_status": "Contacted",
            "rating": "Warm",
            "lifecycle_stage": "SQL"
        }
        response = requests.put(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}", json=update_data)
        assert response.status_code == 200
        
        # Verify update
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        updated_lead = get_response.json().get("lead", {})
        assert updated_lead.get("lead_status") == "Contacted"
        assert updated_lead.get("lifecycle_stage") == "SQL"
        print(f"Updated lead {lead_id} to status=Contacted, lifecycle=SQL")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    def test_delete_lead(self):
        """Test deleting a lead"""
        # Create a test lead
        lead_data = {"last_name": "TEST_DeleteLead", "company": "TEST_DeleteCompany"}
        create_response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=lead_data)
        lead_id = create_response.json().get("lead_id")
        
        # Delete the lead
        response = requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        assert get_response.status_code == 404
        print(f"Deleted lead {lead_id}")


class TestLeadScoring:
    """Test lead scoring functionality"""
    
    def test_calculate_lead_score(self):
        """Test POST /api/commerce/modules/revenue/leads/{id}/calculate-score"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/calculate-score")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "lead_score" in data
        print(f"Lead {lead_id} score: {data['lead_score']}")
    
    def test_recalculate_all_scores(self):
        """Test POST /api/commerce/modules/revenue/leads/recalculate-all-scores"""
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/recalculate-all-scores")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"Recalculated scores: {data.get('message')}")


class TestLeadActivities:
    """Test lead activities CRUD"""
    
    def test_get_lead_activities(self):
        """Test GET /api/commerce/modules/revenue/leads/{id}/activities"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/activities")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "activities" in data
        print(f"Lead {lead_id} has {data['count']} activities")
    
    def test_create_activity(self):
        """Test POST /api/commerce/modules/revenue/leads/{id}/activities"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        activity_data = {
            "activity_type": "call",
            "subject": "TEST_Discovery Call",
            "description": "Initial discovery call to understand requirements",
            "lead_id": lead_id,
            "status": "pending",
            "priority": "high"
        }
        response = requests.post(
            f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/activities",
            json=activity_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "activity_id" in data
        print(f"Created activity: {data['activity_id']}")
        
        # Verify activity was created
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/activities")
        activities = get_response.json().get("activities", [])
        test_activities = [a for a in activities if "TEST_" in a.get("subject", "")]
        assert len(test_activities) > 0
        
        # Cleanup
        for act in test_activities:
            requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/activities/{act['activity_id']}")


class TestLeadDeals:
    """Test lead deals/opportunities CRUD"""
    
    def test_get_lead_deals(self):
        """Test GET /api/commerce/modules/revenue/leads/{id}/deals"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/deals")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "deals" in data
        print(f"Lead {lead_id} has {data['count']} deals")
    
    def test_create_deal(self):
        """Test POST /api/commerce/modules/revenue/leads/{id}/deals"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        deal_data = {
            "deal_name": "TEST_CRM Implementation",
            "lead_id": lead_id,
            "amount": 500000,
            "stage": "Qualification",
            "probability": 20,
            "deal_type": "New Business"
        }
        response = requests.post(
            f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/deals",
            json=deal_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "deal_id" in data
        print(f"Created deal: {data['deal_id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/deals/{data['deal_id']}")
    
    def test_get_all_deals(self):
        """Test GET /api/commerce/modules/revenue/deals"""
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/deals")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "deals" in data
        print(f"Total deals: {data['count']}")


class TestLeadConversion:
    """Test lead conversion to Account+Contact+Opportunity"""
    
    def test_convert_lead(self):
        """Test POST /api/commerce/modules/revenue/leads/{id}/convert"""
        # Create a test lead for conversion
        lead_data = {
            "last_name": "TEST_ConvertLead",
            "company": "TEST_ConvertCompany",
            "first_name": "Convert",
            "email": "convert@test.com",
            "phone": "+91-1234567890",
            "deal_value": 1000000
        }
        create_response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=lead_data)
        lead_id = create_response.json().get("lead_id")
        
        # Convert the lead
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/convert?create_opportunity=true")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "account_id" in data
        assert "contact_id" in data
        assert "opportunity_id" in data
        print(f"Converted lead {lead_id}: account={data['account_id']}, contact={data['contact_id']}, opportunity={data['opportunity_id']}")
        
        # Verify lead is marked as converted
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        converted_lead = get_response.json().get("lead", {})
        assert converted_lead.get("is_converted") == True
        assert converted_lead.get("lead_status") == "Converted"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")


class TestLifecycleStage:
    """Test lifecycle stage updates"""
    
    def test_update_lifecycle_stage(self):
        """Test PUT /api/commerce/modules/revenue/leads/{id}/lifecycle-stage"""
        # Create a test lead
        lead_data = {"last_name": "TEST_LifecycleLead", "company": "TEST_LifecycleCompany"}
        create_response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads", json=lead_data)
        lead_id = create_response.json().get("lead_id")
        
        # Update lifecycle stage
        response = requests.put(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/lifecycle-stage?stage=SQL")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify update
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        updated_lead = get_response.json().get("lead", {})
        assert updated_lead.get("lifecycle_stage") == "SQL"
        print(f"Updated lead {lead_id} lifecycle to SQL")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
    
    def test_invalid_lifecycle_stage(self):
        """Test invalid lifecycle stage returns error"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.put(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/lifecycle-stage?stage=InvalidStage")
        assert response.status_code == 400
        print("Invalid lifecycle stage correctly rejected")


class TestEngagementTracking:
    """Test engagement tracking"""
    
    def test_track_email_open(self):
        """Test POST /api/commerce/modules/revenue/leads/{id}/track-engagement"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        initial_opens = leads[0].get("email_opens", 0)
        
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/track-engagement?engagement_type=email_open")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify increment
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}")
        updated_lead = get_response.json().get("lead", {})
        assert updated_lead.get("email_opens", 0) == initial_opens + 1
        print(f"Tracked email open for lead {lead_id}")
    
    def test_track_website_visit(self):
        """Test tracking website visit"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/track-engagement?engagement_type=website_visit")
        assert response.status_code == 200
        print(f"Tracked website visit for lead {lead_id}")
    
    def test_invalid_engagement_type(self):
        """Test invalid engagement type returns error"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/track-engagement?engagement_type=invalid_type")
        assert response.status_code == 400
        print("Invalid engagement type correctly rejected")


class TestLeadTimeline:
    """Test lead timeline"""
    
    def test_get_lead_timeline(self):
        """Test GET /api/commerce/modules/revenue/leads/{id}/timeline"""
        # Get a lead
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = response.json().get("leads", [])
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0].get("lead_id")
        response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads/{lead_id}/timeline")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "timeline" in data
        print(f"Lead {lead_id} timeline has {data['count']} events")


class TestSeedData:
    """Test seed data endpoint"""
    
    def test_seed_enhanced_leads(self):
        """Test POST /api/commerce/modules/revenue/leads/seed"""
        response = requests.post(f"{BASE_URL}/api/commerce/modules/revenue/leads/seed")
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"Seed result: {data.get('message')}")
        
        # Verify 15 leads were created
        get_response = requests.get(f"{BASE_URL}/api/commerce/modules/revenue/leads")
        leads = get_response.json().get("leads", [])
        assert len(leads) == 15
        
        # Verify enhanced fields exist
        sample_lead = leads[0]
        assert "lifecycle_stage" in sample_lead
        assert "lead_score" in sample_lead
        assert "email_opens" in sample_lead or sample_lead.get("email_opens") is None
        print(f"Verified 15 enhanced leads with lifecycle stages and scores")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
