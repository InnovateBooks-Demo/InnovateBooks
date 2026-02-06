"""
Test Suite for IB Commerce - Parties Module CRUD Operations
Tests Partners, Channels, and Profiles endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestAuth:
    """Authentication tests to get token for subsequent tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        print(f"Login response status: {response.status_code}")
        print(f"Login response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token") or data.get("token")
            assert token is not None, "No token in response"
            return token
        pytest.skip(f"Authentication failed: {response.status_code}")
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data or "token" in data, "No token in response"
        print(f"Login successful, token received")


class TestPartnersCRUD:
    """Partners CRUD endpoint tests"""
    
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
    
    def test_get_partners_list(self, auth_headers):
        """Test GET /api/commerce/parties/partners - List all partners"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners",
            headers=auth_headers
        )
        print(f"GET partners response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to get partners: {response.text}"
        data = response.json()
        assert data.get("success") == True, "Response success should be True"
        assert "partners" in data, "Response should contain partners array"
        assert "count" in data, "Response should contain count"
        print(f"Found {data['count']} partners")
    
    def test_get_partners_with_search(self, auth_headers):
        """Test GET /api/commerce/parties/partners with search parameter"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners?search=test",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Search failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Search returned {data['count']} partners")
    
    def test_get_partners_with_status_filter(self, auth_headers):
        """Test GET /api/commerce/parties/partners with status filter"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners?status=active",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Filter failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Active partners: {data['count']}")
    
    def test_create_partner(self, auth_headers):
        """Test POST /api/commerce/parties/partners - Create new partner"""
        partner_data = {
            "display_name": "TEST_Partner_Automation",
            "legal_name": "Test Partner Legal Name",
            "party_category": "partner",
            "country_of_registration": "India",
            "operating_countries": ["India", "USA"],
            "status": "active",
            "primary_role": "Reseller",
            "partner_type": "Reseller",
            "territory_coverage": ["North India"],
            "industry_focus": ["Technology"],
            "contacts": [
                {
                    "name": "Test Contact",
                    "email": "test@partner.com",
                    "phone": "+91-9876543210",
                    "is_primary": True,
                    "is_active": True,
                    "preferred_mode": "email"
                }
            ],
            "locations": [
                {
                    "address_type": "registered",
                    "address_line1": "123 Test Street",
                    "city": "Mumbai",
                    "state": "Maharashtra",
                    "country": "India",
                    "postal_code": "400001",
                    "is_active": True
                }
            ]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/parties/partners",
            headers=auth_headers,
            json=partner_data
        )
        print(f"Create partner response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to create partner: {response.text}"
        data = response.json()
        assert data.get("success") == True, "Create should return success=True"
        assert "partner" in data or "partner_id" in data.get("partner", {}), "Response should contain partner data"
        
        # Store partner_id for subsequent tests
        partner = data.get("partner", {})
        partner_id = partner.get("partner_id")
        print(f"Created partner with ID: {partner_id}")
        return partner_id
    
    def test_get_partner_detail(self, auth_headers):
        """Test GET /api/commerce/parties/partners/{partner_id} - Get partner detail"""
        # First create a partner
        partner_data = {
            "display_name": "TEST_Partner_Detail",
            "legal_name": "Test Partner Detail Legal",
            "party_category": "partner",
            "country_of_registration": "India",
            "status": "active",
            "primary_role": "Distributor",
            "partner_type": "Distributor",
            "contacts": [],
            "locations": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/partners",
            headers=auth_headers,
            json=partner_data
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        partner_id = create_response.json().get("partner", {}).get("partner_id")
        
        # Now get the detail
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners/{partner_id}",
            headers=auth_headers
        )
        print(f"Get partner detail response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to get partner detail: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "partner" in data
        assert data["partner"]["partner_id"] == partner_id
        assert data["partner"]["display_name"] == "TEST_Partner_Detail"
        print(f"Partner detail retrieved successfully: {data['partner']['display_name']}")
    
    def test_update_partner(self, auth_headers):
        """Test PUT /api/commerce/parties/partners/{partner_id} - Update partner"""
        # First create a partner
        partner_data = {
            "display_name": "TEST_Partner_Update",
            "legal_name": "Test Partner Update Legal",
            "party_category": "partner",
            "country_of_registration": "India",
            "status": "active",
            "primary_role": "Agent",
            "partner_type": "Agent",
            "contacts": [],
            "locations": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/partners",
            headers=auth_headers,
            json=partner_data
        )
        assert create_response.status_code == 200
        partner_id = create_response.json().get("partner", {}).get("partner_id")
        
        # Update the partner
        update_data = {
            "display_name": "TEST_Partner_Updated",
            "legal_name": "Test Partner Updated Legal",
            "party_category": "partner",
            "country_of_registration": "USA",
            "status": "on_hold",
            "primary_role": "Strategic",
            "partner_type": "Strategic",
            "contacts": [],
            "locations": []
        }
        
        response = requests.put(
            f"{BASE_URL}/api/commerce/parties/partners/{partner_id}",
            headers=auth_headers,
            json=update_data
        )
        print(f"Update partner response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to update partner: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify update by getting the partner
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners/{partner_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 200
        updated_partner = get_response.json().get("partner", {})
        assert updated_partner["display_name"] == "TEST_Partner_Updated"
        assert updated_partner["country_of_registration"] == "USA"
        print(f"Partner updated successfully")
    
    def test_delete_partner(self, auth_headers):
        """Test DELETE /api/commerce/parties/partners/{partner_id} - Delete partner"""
        # First create a partner
        partner_data = {
            "display_name": "TEST_Partner_Delete",
            "legal_name": "Test Partner Delete Legal",
            "party_category": "partner",
            "country_of_registration": "India",
            "status": "active",
            "primary_role": "Referral",
            "partner_type": "Referral",
            "contacts": [],
            "locations": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/partners",
            headers=auth_headers,
            json=partner_data
        )
        assert create_response.status_code == 200
        partner_id = create_response.json().get("partner", {}).get("partner_id")
        
        # Delete the partner
        response = requests.delete(
            f"{BASE_URL}/api/commerce/parties/partners/{partner_id}",
            headers=auth_headers
        )
        print(f"Delete partner response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to delete partner: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify deletion by trying to get the partner
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners/{partner_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 404, "Deleted partner should return 404"
        print(f"Partner deleted successfully")
    
    def test_get_nonexistent_partner(self, auth_headers):
        """Test GET /api/commerce/parties/partners/{partner_id} - Non-existent partner"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners/PART-NONEXISTENT",
            headers=auth_headers
        )
        assert response.status_code == 404, f"Should return 404 for non-existent partner"
        print("Non-existent partner correctly returns 404")


class TestChannelsCRUD:
    """Channels CRUD endpoint tests"""
    
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
    
    def test_get_channels_list(self, auth_headers):
        """Test GET /api/commerce/parties/channels - List all channels"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels",
            headers=auth_headers
        )
        print(f"GET channels response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to get channels: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "channels" in data
        assert "count" in data
        print(f"Found {data['count']} channels")
    
    def test_get_channels_with_filters(self, auth_headers):
        """Test GET /api/commerce/parties/channels with filters"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels?status=active&channel_type=Direct Sales",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Filter failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Filtered channels: {data['count']}")
    
    def test_create_channel(self, auth_headers):
        """Test POST /api/commerce/parties/channels - Create new channel"""
        channel_data = {
            "channel_name": "TEST_Channel_Automation",
            "channel_type": "Direct Sales",
            "channel_owner": "Sales Team",
            "geography": ["India", "USA"],
            "allowed_party_types": ["Customer", "Partner"],
            "allowed_profiles": ["Premium", "Standard"],
            "discount_rules": "Max 10% discount",
            "conflict_rules": "No overlap with existing channels",
            "status": "active",
            "description": "Test channel for automation"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/parties/channels",
            headers=auth_headers,
            json=channel_data
        )
        print(f"Create channel response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to create channel: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "channel" in data
        
        channel = data.get("channel", {})
        channel_id = channel.get("channel_id")
        print(f"Created channel with ID: {channel_id}")
        return channel_id
    
    def test_get_channel_detail(self, auth_headers):
        """Test GET /api/commerce/parties/channels/{channel_id} - Get channel detail"""
        # First create a channel
        channel_data = {
            "channel_name": "TEST_Channel_Detail",
            "channel_type": "Online",
            "status": "active",
            "geography": [],
            "allowed_party_types": [],
            "allowed_profiles": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/channels",
            headers=auth_headers,
            json=channel_data
        )
        assert create_response.status_code == 200
        channel_id = create_response.json().get("channel", {}).get("channel_id")
        
        # Get the detail
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels/{channel_id}",
            headers=auth_headers
        )
        print(f"Get channel detail response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to get channel detail: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "channel" in data
        assert data["channel"]["channel_id"] == channel_id
        assert data["channel"]["channel_name"] == "TEST_Channel_Detail"
        print(f"Channel detail retrieved successfully")
    
    def test_update_channel(self, auth_headers):
        """Test PUT /api/commerce/parties/channels/{channel_id} - Update channel"""
        # First create a channel
        channel_data = {
            "channel_name": "TEST_Channel_Update",
            "channel_type": "Retail",
            "status": "active",
            "geography": [],
            "allowed_party_types": [],
            "allowed_profiles": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/channels",
            headers=auth_headers,
            json=channel_data
        )
        assert create_response.status_code == 200
        channel_id = create_response.json().get("channel", {}).get("channel_id")
        
        # Update the channel
        update_data = {
            "channel_name": "TEST_Channel_Updated",
            "channel_type": "Marketplace",
            "status": "on_hold",
            "geography": ["Europe"],
            "allowed_party_types": ["Vendor"],
            "allowed_profiles": ["Enterprise"],
            "description": "Updated description"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/commerce/parties/channels/{channel_id}",
            headers=auth_headers,
            json=update_data
        )
        print(f"Update channel response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to update channel: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify update
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels/{channel_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 200
        updated_channel = get_response.json().get("channel", {})
        assert updated_channel["channel_name"] == "TEST_Channel_Updated"
        assert updated_channel["channel_type"] == "Marketplace"
        print(f"Channel updated successfully")
    
    def test_delete_channel(self, auth_headers):
        """Test DELETE /api/commerce/parties/channels/{channel_id} - Delete channel"""
        # First create a channel
        channel_data = {
            "channel_name": "TEST_Channel_Delete",
            "channel_type": "Agent",
            "status": "active",
            "geography": [],
            "allowed_party_types": [],
            "allowed_profiles": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/channels",
            headers=auth_headers,
            json=channel_data
        )
        assert create_response.status_code == 200
        channel_id = create_response.json().get("channel", {}).get("channel_id")
        
        # Delete the channel
        response = requests.delete(
            f"{BASE_URL}/api/commerce/parties/channels/{channel_id}",
            headers=auth_headers
        )
        print(f"Delete channel response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to delete channel: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify deletion
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels/{channel_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 404
        print(f"Channel deleted successfully")
    
    def test_get_nonexistent_channel(self, auth_headers):
        """Test GET /api/commerce/parties/channels/{channel_id} - Non-existent channel"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels/CHAN-NONEXISTENT",
            headers=auth_headers
        )
        assert response.status_code == 404
        print("Non-existent channel correctly returns 404")


class TestProfilesCRUD:
    """Profiles CRUD endpoint tests"""
    
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
    
    def test_get_profiles_list(self, auth_headers):
        """Test GET /api/commerce/parties/profiles - List all profiles"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles",
            headers=auth_headers
        )
        print(f"GET profiles response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to get profiles: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "profiles" in data
        assert "count" in data
        print(f"Found {data['count']} profiles")
    
    def test_get_profiles_with_filters(self, auth_headers):
        """Test GET /api/commerce/parties/profiles with filters"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles?status=active&profile_type=Customer",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Filter failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Filtered profiles: {data['count']}")
    
    def test_create_profile(self, auth_headers):
        """Test POST /api/commerce/parties/profiles - Create new profile"""
        profile_data = {
            "profile_name": "TEST_Profile_Automation",
            "profile_type": "Customer",
            "applicable_regions": ["India", "USA"],
            "applicable_industries": ["Technology", "Finance"],
            "pricing_basis": "Volume-based",
            "discount_ceiling": 15.0,
            "rate_cards": "Standard Rate Card",
            "sla_expectations": "24-hour response time",
            "delivery_assumptions": "5-7 business days",
            "master_agreement_id": "MA-001",
            "validity_period": "12 months",
            "renewal_expectation": "Auto-renewal",
            "approval_required_flag": True,
            "exception_handling_rules": "Manager approval required",
            "policy_references": ["POL-001", "POL-002"],
            "status": "active",
            "description": "Test profile for automation"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/commerce/parties/profiles",
            headers=auth_headers,
            json=profile_data
        )
        print(f"Create profile response: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Failed to create profile: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "profile" in data
        
        profile = data.get("profile", {})
        profile_id = profile.get("profile_id")
        print(f"Created profile with ID: {profile_id}")
        return profile_id
    
    def test_get_profile_detail(self, auth_headers):
        """Test GET /api/commerce/parties/profiles/{profile_id} - Get profile detail"""
        # First create a profile
        profile_data = {
            "profile_name": "TEST_Profile_Detail",
            "profile_type": "Vendor",
            "status": "active",
            "applicable_regions": [],
            "applicable_industries": [],
            "policy_references": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/profiles",
            headers=auth_headers,
            json=profile_data
        )
        assert create_response.status_code == 200
        profile_id = create_response.json().get("profile", {}).get("profile_id")
        
        # Get the detail
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles/{profile_id}",
            headers=auth_headers
        )
        print(f"Get profile detail response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to get profile detail: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "profile" in data
        assert data["profile"]["profile_id"] == profile_id
        assert data["profile"]["profile_name"] == "TEST_Profile_Detail"
        print(f"Profile detail retrieved successfully")
    
    def test_update_profile(self, auth_headers):
        """Test PUT /api/commerce/parties/profiles/{profile_id} - Update profile"""
        # First create a profile
        profile_data = {
            "profile_name": "TEST_Profile_Update",
            "profile_type": "Partner",
            "status": "active",
            "applicable_regions": [],
            "applicable_industries": [],
            "policy_references": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/profiles",
            headers=auth_headers,
            json=profile_data
        )
        assert create_response.status_code == 200
        profile_id = create_response.json().get("profile", {}).get("profile_id")
        
        # Update the profile
        update_data = {
            "profile_name": "TEST_Profile_Updated",
            "profile_type": "Enterprise",
            "status": "on_hold",
            "applicable_regions": ["Europe"],
            "applicable_industries": ["Healthcare"],
            "policy_references": ["POL-003"],
            "discount_ceiling": 20.0,
            "description": "Updated description"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/commerce/parties/profiles/{profile_id}",
            headers=auth_headers,
            json=update_data
        )
        print(f"Update profile response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to update profile: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify update
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles/{profile_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 200
        updated_profile = get_response.json().get("profile", {})
        assert updated_profile["profile_name"] == "TEST_Profile_Updated"
        assert updated_profile["profile_type"] == "Enterprise"
        print(f"Profile updated successfully")
    
    def test_delete_profile(self, auth_headers):
        """Test DELETE /api/commerce/parties/profiles/{profile_id} - Delete profile"""
        # First create a profile
        profile_data = {
            "profile_name": "TEST_Profile_Delete",
            "profile_type": "Standard",
            "status": "active",
            "applicable_regions": [],
            "applicable_industries": [],
            "policy_references": []
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/commerce/parties/profiles",
            headers=auth_headers,
            json=profile_data
        )
        assert create_response.status_code == 200
        profile_id = create_response.json().get("profile", {}).get("profile_id")
        
        # Delete the profile
        response = requests.delete(
            f"{BASE_URL}/api/commerce/parties/profiles/{profile_id}",
            headers=auth_headers
        )
        print(f"Delete profile response: {response.status_code}")
        
        assert response.status_code == 200, f"Failed to delete profile: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify deletion
        get_response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles/{profile_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 404
        print(f"Profile deleted successfully")
    
    def test_get_nonexistent_profile(self, auth_headers):
        """Test GET /api/commerce/parties/profiles/{profile_id} - Non-existent profile"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles/PROF-NONEXISTENT",
            headers=auth_headers
        )
        assert response.status_code == 404
        print("Non-existent profile correctly returns 404")


class TestCleanup:
    """Cleanup test data after tests"""
    
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
    
    def test_cleanup_test_partners(self, auth_headers):
        """Clean up TEST_ prefixed partners"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/partners?search=TEST_",
            headers=auth_headers
        )
        if response.status_code == 200:
            partners = response.json().get("partners", [])
            for partner in partners:
                if partner.get("display_name", "").startswith("TEST_"):
                    requests.delete(
                        f"{BASE_URL}/api/commerce/parties/partners/{partner['partner_id']}",
                        headers=auth_headers
                    )
                    print(f"Deleted test partner: {partner['partner_id']}")
    
    def test_cleanup_test_channels(self, auth_headers):
        """Clean up TEST_ prefixed channels"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/channels?search=TEST_",
            headers=auth_headers
        )
        if response.status_code == 200:
            channels = response.json().get("channels", [])
            for channel in channels:
                if channel.get("channel_name", "").startswith("TEST_"):
                    requests.delete(
                        f"{BASE_URL}/api/commerce/parties/channels/{channel['channel_id']}",
                        headers=auth_headers
                    )
                    print(f"Deleted test channel: {channel['channel_id']}")
    
    def test_cleanup_test_profiles(self, auth_headers):
        """Clean up TEST_ prefixed profiles"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties/profiles?search=TEST_",
            headers=auth_headers
        )
        if response.status_code == 200:
            profiles = response.json().get("profiles", [])
            for profile in profiles:
                if profile.get("profile_name", "").startswith("TEST_"):
                    requests.delete(
                        f"{BASE_URL}/api/commerce/parties/profiles/{profile['profile_id']}",
                        headers=auth_headers
                    )
                    print(f"Deleted test profile: {profile['profile_id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
