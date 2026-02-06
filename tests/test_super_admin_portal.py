"""
Super Admin Portal - Backend API Tests
Tests: Authentication, Dashboard, Organizations CRUD, Users CRUD
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com').rstrip('/')

# Super Admin Credentials
SUPER_ADMIN_EMAIL = "revanth@innovatebooks.in"
SUPER_ADMIN_PASSWORD = "Pandu@1605"


class TestSuperAdminAuth:
    """Test Super Admin Authentication via Enterprise Auth"""
    
    def test_login_success(self):
        """Test successful super admin login"""
        response = requests.post(
            f"{BASE_URL}/api/enterprise/auth/login",
            json={"email": SUPER_ADMIN_EMAIL, "password": SUPER_ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "access_token" in data
        assert "refresh_token" in data
        assert data.get("user", {}).get("is_super_admin") == True
        print(f"✅ Super Admin login successful - user_id: {data['user']['user_id']}")
    
    def test_login_invalid_password(self):
        """Test login with invalid password"""
        response = requests.post(
            f"{BASE_URL}/api/enterprise/auth/login",
            json={"email": SUPER_ADMIN_EMAIL, "password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Invalid password correctly rejected")
    
    def test_login_invalid_email(self):
        """Test login with non-existent email"""
        response = requests.post(
            f"{BASE_URL}/api/enterprise/auth/login",
            json={"email": "nonexistent@test.com", "password": "anypassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Non-existent email correctly rejected")


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for super admin"""
    response = requests.post(
        f"{BASE_URL}/api/enterprise/auth/login",
        json={"email": SUPER_ADMIN_EMAIL, "password": SUPER_ADMIN_PASSWORD}
    )
    if response.status_code != 200:
        pytest.skip(f"Authentication failed: {response.text}")
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get headers with auth token"""
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


class TestSuperAdminDashboard:
    """Test Super Admin Dashboard API"""
    
    def test_dashboard_without_auth(self):
        """Test dashboard access without authentication"""
        response = requests.get(f"{BASE_URL}/api/super-admin/dashboard")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✅ Dashboard correctly requires authentication")
    
    def test_dashboard_with_auth(self, auth_headers):
        """Test dashboard access with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/dashboard",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Dashboard failed: {response.text}"
        data = response.json()
        
        # Verify stats structure
        assert "stats" in data, "Missing stats in response"
        stats = data["stats"]
        assert "total_organizations" in stats
        assert "active_organizations" in stats
        assert "total_users" in stats
        assert "active_users" in stats
        
        # Verify subscription breakdown
        assert "subscription_breakdown" in data
        
        # Verify recent data
        assert "recent_organizations" in data
        assert "recent_users" in data
        
        print(f"✅ Dashboard loaded - Orgs: {stats['total_organizations']}, Users: {stats['total_users']}")


class TestOrganizationsCRUD:
    """Test Organizations CRUD operations"""
    
    def test_list_organizations_without_auth(self):
        """Test listing organizations without authentication"""
        response = requests.get(f"{BASE_URL}/api/super-admin/organizations")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✅ Organizations list correctly requires authentication")
    
    def test_list_organizations(self, auth_headers):
        """Test listing all organizations"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers
        )
        assert response.status_code == 200, f"List orgs failed: {response.text}"
        data = response.json()
        assert "organizations" in data
        assert isinstance(data["organizations"], list)
        print(f"✅ Listed {len(data['organizations'])} organizations")
    
    def test_create_organization(self, auth_headers):
        """Test creating a new organization"""
        unique_id = uuid.uuid4().hex[:6]
        org_data = {
            "name": f"TEST_org_{unique_id}",
            "display_name": f"Test Organization {unique_id}",
            "industry": "technology",
            "size": "medium",
            "subscription_plan": "professional",
            "max_users": 10,
            "features": ["finance", "commerce"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json=org_data
        )
        assert response.status_code == 200, f"Create org failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "organization" in data
        org = data["organization"]
        assert org["name"] == org_data["name"]
        assert org["display_name"] == org_data["display_name"]
        assert "org_id" in org
        print(f"✅ Created organization: {org['org_id']}")
        return org["org_id"]
    
    def test_create_duplicate_organization(self, auth_headers):
        """Test creating organization with duplicate name"""
        # First create an org
        unique_id = uuid.uuid4().hex[:6]
        org_data = {
            "name": f"TEST_dup_{unique_id}",
            "display_name": f"Duplicate Test {unique_id}"
        }
        
        response1 = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json=org_data
        )
        assert response1.status_code == 200
        
        # Try to create with same name
        response2 = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json=org_data
        )
        assert response2.status_code == 400, f"Expected 400 for duplicate, got {response2.status_code}"
        print("✅ Duplicate organization name correctly rejected")
    
    def test_get_organization_detail(self, auth_headers):
        """Test getting organization details"""
        # First create an org
        unique_id = uuid.uuid4().hex[:6]
        create_response = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json={"name": f"TEST_detail_{unique_id}", "display_name": f"Detail Test {unique_id}"}
        )
        assert create_response.status_code == 200
        org_id = create_response.json()["organization"]["org_id"]
        
        # Get details
        response = requests.get(
            f"{BASE_URL}/api/super-admin/organizations/{org_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Get org detail failed: {response.text}"
        data = response.json()
        assert data["org_id"] == org_id
        assert "stats" in data
        print(f"✅ Got organization detail for: {org_id}")
    
    def test_update_organization(self, auth_headers):
        """Test updating an organization"""
        # First create an org
        unique_id = uuid.uuid4().hex[:6]
        create_response = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json={"name": f"TEST_update_{unique_id}", "display_name": f"Update Test {unique_id}"}
        )
        assert create_response.status_code == 200
        org_id = create_response.json()["organization"]["org_id"]
        
        # Update
        update_data = {
            "display_name": f"Updated Display Name {unique_id}",
            "subscription_plan": "enterprise",
            "max_users": 50
        }
        response = requests.put(
            f"{BASE_URL}/api/super-admin/organizations/{org_id}",
            headers=auth_headers,
            json=update_data
        )
        assert response.status_code == 200, f"Update org failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert data["organization"]["display_name"] == update_data["display_name"]
        assert data["organization"]["subscription_plan"] == "enterprise"
        print(f"✅ Updated organization: {org_id}")
    
    def test_deactivate_organization(self, auth_headers):
        """Test deactivating an organization"""
        # First create an org
        unique_id = uuid.uuid4().hex[:6]
        create_response = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json={"name": f"TEST_deactivate_{unique_id}", "display_name": f"Deactivate Test {unique_id}"}
        )
        assert create_response.status_code == 200
        org_id = create_response.json()["organization"]["org_id"]
        
        # Deactivate
        response = requests.delete(
            f"{BASE_URL}/api/super-admin/organizations/{org_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Deactivate org failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✅ Deactivated organization: {org_id}")
    
    def test_get_nonexistent_organization(self, auth_headers):
        """Test getting non-existent organization"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/organizations/NONEXISTENT-ORG-ID",
            headers=auth_headers
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ Non-existent organization correctly returns 404")


class TestUsersCRUD:
    """Test Users CRUD operations"""
    
    @pytest.fixture(scope="class")
    def test_org_id(self, auth_headers):
        """Create a test organization for user tests"""
        unique_id = uuid.uuid4().hex[:6]
        response = requests.post(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers,
            json={
                "name": f"TEST_user_org_{unique_id}",
                "display_name": f"User Test Org {unique_id}",
                "max_users": 20
            }
        )
        assert response.status_code == 200
        return response.json()["organization"]["org_id"]
    
    def test_list_users_without_auth(self):
        """Test listing users without authentication"""
        response = requests.get(f"{BASE_URL}/api/super-admin/users")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✅ Users list correctly requires authentication")
    
    def test_list_users(self, auth_headers):
        """Test listing all users"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers
        )
        assert response.status_code == 200, f"List users failed: {response.text}"
        data = response.json()
        assert "users" in data
        assert isinstance(data["users"], list)
        print(f"✅ Listed {len(data['users'])} users")
    
    def test_list_users_by_org(self, auth_headers, test_org_id):
        """Test listing users filtered by organization"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/users?org_id={test_org_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"List users by org failed: {response.text}"
        data = response.json()
        assert "users" in data
        print(f"✅ Listed users for org {test_org_id}")
    
    def test_create_user(self, auth_headers, test_org_id):
        """Test creating a new user"""
        unique_id = uuid.uuid4().hex[:6]
        user_data = {
            "email": f"TEST_user_{unique_id}@test.com",
            "password": "TestPass123!",
            "first_name": "Test",
            "last_name": f"User {unique_id}",
            "role": "user",
            "org_id": test_org_id
        }
        
        response = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json=user_data
        )
        assert response.status_code == 200, f"Create user failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "user" in data
        user = data["user"]
        assert user["email"] == user_data["email"]
        assert user["first_name"] == user_data["first_name"]
        assert "user_id" in user
        assert "password_hash" not in user  # Password should not be returned
        print(f"✅ Created user: {user['user_id']}")
        return user["user_id"]
    
    def test_create_duplicate_user(self, auth_headers, test_org_id):
        """Test creating user with duplicate email"""
        unique_id = uuid.uuid4().hex[:6]
        user_data = {
            "email": f"TEST_dup_{unique_id}@test.com",
            "password": "TestPass123!",
            "first_name": "Duplicate",
            "last_name": "Test",
            "role": "user",
            "org_id": test_org_id
        }
        
        # Create first user
        response1 = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json=user_data
        )
        assert response1.status_code == 200
        
        # Try to create with same email
        response2 = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json=user_data
        )
        assert response2.status_code == 400, f"Expected 400 for duplicate, got {response2.status_code}"
        print("✅ Duplicate user email correctly rejected")
    
    def test_create_user_invalid_org(self, auth_headers):
        """Test creating user with non-existent organization"""
        unique_id = uuid.uuid4().hex[:6]
        user_data = {
            "email": f"TEST_invalid_org_{unique_id}@test.com",
            "password": "TestPass123!",
            "first_name": "Invalid",
            "last_name": "Org",
            "role": "user",
            "org_id": "NONEXISTENT-ORG"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json=user_data
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ User creation with invalid org correctly rejected")
    
    def test_update_user(self, auth_headers, test_org_id):
        """Test updating a user"""
        # First create a user
        unique_id = uuid.uuid4().hex[:6]
        create_response = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json={
                "email": f"TEST_update_{unique_id}@test.com",
                "password": "TestPass123!",
                "first_name": "Update",
                "last_name": "Test",
                "role": "user",
                "org_id": test_org_id
            }
        )
        assert create_response.status_code == 200
        user_id = create_response.json()["user"]["user_id"]
        
        # Update
        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "role": "manager"
        }
        response = requests.put(
            f"{BASE_URL}/api/super-admin/users/{user_id}",
            headers=auth_headers,
            json=update_data
        )
        assert response.status_code == 200, f"Update user failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert data["user"]["first_name"] == "Updated"
        assert data["user"]["role"] == "manager"
        print(f"✅ Updated user: {user_id}")
    
    def test_deactivate_user(self, auth_headers, test_org_id):
        """Test deactivating a user"""
        # First create a user
        unique_id = uuid.uuid4().hex[:6]
        create_response = requests.post(
            f"{BASE_URL}/api/super-admin/users",
            headers=auth_headers,
            json={
                "email": f"TEST_deactivate_{unique_id}@test.com",
                "password": "TestPass123!",
                "first_name": "Deactivate",
                "last_name": "Test",
                "role": "user",
                "org_id": test_org_id
            }
        )
        assert create_response.status_code == 200
        user_id = create_response.json()["user"]["user_id"]
        
        # Deactivate
        response = requests.delete(
            f"{BASE_URL}/api/super-admin/users/{user_id}",
            headers=auth_headers
        )
        assert response.status_code == 200, f"Deactivate user failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✅ Deactivated user: {user_id}")
    
    def test_update_nonexistent_user(self, auth_headers):
        """Test updating non-existent user"""
        response = requests.put(
            f"{BASE_URL}/api/super-admin/users/NONEXISTENT-USER-ID",
            headers=auth_headers,
            json={"first_name": "Test"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✅ Non-existent user update correctly returns 404")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_organizations(self, auth_headers):
        """List and report test organizations for cleanup"""
        response = requests.get(
            f"{BASE_URL}/api/super-admin/organizations",
            headers=auth_headers
        )
        if response.status_code == 200:
            orgs = response.json().get("organizations", [])
            test_orgs = [o for o in orgs if o.get("name", "").startswith("TEST_")]
            print(f"ℹ️ Found {len(test_orgs)} test organizations (TEST_ prefix)")
            for org in test_orgs[:5]:  # Show first 5
                print(f"   - {org.get('name')} ({org.get('org_id')})")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
