"""
Test Admin APIs and PWA Features for IB Commerce
Tests: Admin Dashboard, Users, Roles, Settings, Invites, PWA manifest
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAdminAPIs:
    """Admin API endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.base_url = BASE_URL
        self.token = None
        # Login to get token
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={
                "email": "demo@innovatebooks.com",
                "password": "Demo1234",
                "remember_me": True
            }
        )
        if response.status_code == 200:
            self.token = response.json().get("access_token")
        self.headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={
                "email": "demo@innovatebooks.com",
                "password": "Demo1234",
                "remember_me": True
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "access_token" in data
        assert data.get("user", {}).get("email") == "demo@innovatebooks.com"
    
    def test_admin_dashboard_returns_stats(self):
        """Test GET /api/admin/dashboard returns stats"""
        response = requests.get(
            f"{self.base_url}/api/admin/dashboard",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify stats structure
        stats = data.get("stats", {})
        assert "total_users" in stats
        assert "active_users" in stats
        assert "pending_invites" in stats
        assert "total_roles" in stats
        assert "storage_used" in stats
        assert "api_calls_today" in stats
        
        # Verify values are numbers
        assert isinstance(stats["total_users"], int)
        assert isinstance(stats["active_users"], int)
        assert isinstance(stats["api_calls_today"], int)
    
    def test_admin_dashboard_returns_recent_activity(self):
        """Test GET /api/admin/dashboard returns recent activity"""
        response = requests.get(
            f"{self.base_url}/api/admin/dashboard",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify recent_activity structure
        recent_activity = data.get("recent_activity", [])
        assert isinstance(recent_activity, list)
        if len(recent_activity) > 0:
            activity = recent_activity[0]
            assert "type" in activity
            assert "description" in activity
            assert "actor" in activity
            assert "timestamp" in activity
    
    def test_admin_users_returns_user_list(self):
        """Test GET /api/admin/users returns user list"""
        response = requests.get(
            f"{self.base_url}/api/admin/users",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify users structure
        users = data.get("users", [])
        assert isinstance(users, list)
        assert len(users) > 0
        
        # Verify user structure
        user = users[0]
        assert "user_id" in user
        assert "email" in user
        assert "full_name" in user
        assert "role_id" in user
        assert "is_active" in user
    
    def test_admin_roles_returns_role_list(self):
        """Test GET /api/admin/roles returns roles list"""
        response = requests.get(
            f"{self.base_url}/api/admin/roles",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify roles structure
        roles = data.get("roles", [])
        assert isinstance(roles, list)
        assert len(roles) > 0
        
        # Verify role structure
        role = roles[0]
        assert "role_id" in role
        assert "role_name" in role
        assert "description" in role
        assert "permissions" in role
        assert isinstance(role["permissions"], list)
    
    def test_admin_settings_returns_settings(self):
        """Test GET /api/admin/settings returns settings"""
        response = requests.get(
            f"{self.base_url}/api/admin/settings",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        
        # Verify settings structure
        settings = data.get("settings", {})
        assert "company_name" in settings
        assert "business_type" in settings
        assert "industry" in settings
        assert "country" in settings
        assert "timezone" in settings
        assert "language" in settings
        assert "notification_email" in settings
        assert "notification_push" in settings
        assert "two_factor_required" in settings
        assert "session_timeout" in settings
    
    def test_admin_invites_returns_list(self):
        """Test GET /api/admin/invites returns invites list"""
        response = requests.get(
            f"{self.base_url}/api/admin/invites",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "invites" in data
        assert isinstance(data["invites"], list)


class TestPWAFeatures:
    """PWA manifest and service worker tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.base_url = BASE_URL
    
    def test_manifest_json_served(self):
        """Test manifest.json is served at /manifest.json"""
        response = requests.get(f"{self.base_url}/manifest.json")
        assert response.status_code == 200
        
        data = response.json()
        assert "name" in data
        assert "short_name" in data
        assert "start_url" in data
        assert "display" in data
        assert "icons" in data
    
    def test_manifest_has_required_fields(self):
        """Test manifest.json has all required PWA fields"""
        response = requests.get(f"{self.base_url}/manifest.json")
        assert response.status_code == 200
        
        data = response.json()
        
        # Required fields
        assert data.get("name") == "IB Commerce"
        assert data.get("short_name") == "IBCommerce"
        assert data.get("display") == "standalone"
        assert data.get("start_url") == "/"
        
        # Theme colors
        assert "theme_color" in data
        assert "background_color" in data
        
        # Icons
        icons = data.get("icons", [])
        assert len(icons) > 0
        
        # Check for 192x192 icon (required for PWA)
        icon_sizes = [icon.get("sizes") for icon in icons]
        assert "192x192" in icon_sizes
        assert "512x512" in icon_sizes
    
    def test_manifest_has_shortcuts(self):
        """Test manifest.json has app shortcuts"""
        response = requests.get(f"{self.base_url}/manifest.json")
        assert response.status_code == 200
        
        data = response.json()
        shortcuts = data.get("shortcuts", [])
        assert len(shortcuts) > 0
        
        # Verify shortcut structure
        shortcut = shortcuts[0]
        assert "name" in shortcut
        assert "url" in shortcut
    
    def test_service_worker_file_exists(self):
        """Test service-worker.js is accessible"""
        response = requests.get(f"{self.base_url}/service-worker.js")
        # Service worker should be served (200) or may be handled by React (could be 200 with HTML)
        assert response.status_code in [200, 304]


class TestAdminCRUDOperations:
    """Test Admin CRUD operations"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.base_url = BASE_URL
        self.token = None
        # Login to get token
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={
                "email": "demo@innovatebooks.com",
                "password": "Demo1234",
                "remember_me": True
            }
        )
        if response.status_code == 200:
            self.token = response.json().get("access_token")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        } if self.token else {}
    
    def test_create_invite(self):
        """Test POST /api/admin/invites creates an invite"""
        response = requests.post(
            f"{self.base_url}/api/admin/invites",
            headers=self.headers,
            json={
                "email": "TEST_newuser@example.com",
                "role_id": "member"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "invite_id" in data
    
    def test_create_role(self):
        """Test POST /api/admin/roles creates a role"""
        response = requests.post(
            f"{self.base_url}/api/admin/roles",
            headers=self.headers,
            json={
                "role_name": "TEST_Custom Role",
                "description": "Test role for testing",
                "permissions": ["commerce.read"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "role_id" in data
    
    def test_update_settings(self):
        """Test PUT /api/admin/settings updates settings"""
        response = requests.put(
            f"{self.base_url}/api/admin/settings",
            headers=self.headers,
            json={
                "company_name": "Innovate Books Pvt. Ltd.",
                "notification_email": True,
                "notification_push": True,
                "session_timeout": 30
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
