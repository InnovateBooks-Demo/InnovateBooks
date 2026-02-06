"""
IB Workforce Module - Backend API Tests
Tests for People, Roles, Capacity, Time, Payroll, and Compliance modules
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Authentication failed - skipping authenticated tests")


@pytest.fixture(scope="module")
def api_client(auth_token):
    """Shared requests session with auth"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    })
    return session


class TestWorkforceDashboard:
    """IB Workforce Dashboard API tests"""
    
    def test_get_dashboard(self, api_client):
        """Test dashboard endpoint returns all module metrics"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/dashboard")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        
        # Verify all module stats are present
        dashboard = data["data"]
        assert "people" in dashboard
        assert "roles" in dashboard
        assert "capacity" in dashboard
        assert "time" in dashboard
        assert "payroll" in dashboard
        assert "compliance" in dashboard
        
        # Verify people stats structure
        assert "total" in dashboard["people"]
        assert "active" in dashboard["people"]
        assert "draft" in dashboard["people"]


class TestPeopleModule:
    """People module CRUD tests"""
    
    def test_list_people(self, api_client):
        """Test listing all people"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/people")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "count" in data
        assert isinstance(data["data"], list)
    
    def test_list_people_with_status_filter(self, api_client):
        """Test filtering people by status"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/people?status=active")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        # All returned people should be active
        for person in data["data"]:
            assert person["status"] == "active"
    
    def test_create_person(self, api_client):
        """Test creating a new person"""
        unique_id = uuid.uuid4().hex[:8]
        person_data = {
            "first_name": "TEST_John",
            "last_name": f"Doe_{unique_id}",
            "email": f"test_john_{unique_id}@example.com",
            "phone": "9876543210",
            "person_type": "employee",
            "employment_type": "full_time",
            "department_name": "Engineering",
            "location": "Mumbai"
        }
        
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/people", json=person_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "person_id" in data
        assert data["data"]["first_name"] == "TEST_John"
        assert data["data"]["status"] == "draft"  # New persons start as draft
        
        return data["person_id"]
    
    def test_get_person_detail(self, api_client):
        """Test getting person details"""
        # First get list to find a person
        list_response = api_client.get(f"{BASE_URL}/api/ib-workforce/people")
        people = list_response.json()["data"]
        
        if len(people) == 0:
            pytest.skip("No people to test")
        
        person_id = people[0]["person_id"]
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/people/{person_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["data"]["person_id"] == person_id
        # Verify profile fields are present
        assert "employment_profile" in data["data"]
        assert "legal_profile" in data["data"]
        assert "role_assignments" in data["data"]
    
    def test_update_person(self, api_client):
        """Test updating a person"""
        # Create a test person first
        unique_id = uuid.uuid4().hex[:8]
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/people", json={
            "first_name": "TEST_Update",
            "last_name": f"Person_{unique_id}",
            "email": f"test_update_{unique_id}@example.com"
        })
        person_id = create_response.json()["person_id"]
        
        # Update the person
        update_data = {
            "first_name": "TEST_Updated",
            "department_name": "Sales",
            "location": "Delhi"
        }
        response = api_client.put(f"{BASE_URL}/api/ib-workforce/people/{person_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["data"]["first_name"] == "TEST_Updated"
        assert data["data"]["department_name"] == "Sales"
    
    def test_person_not_found(self, api_client):
        """Test 404 for non-existent person"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/people/PER_nonexistent123")
        assert response.status_code == 404
    
    def test_duplicate_email_rejected(self, api_client):
        """Test that duplicate email is rejected"""
        # Get existing person email
        list_response = api_client.get(f"{BASE_URL}/api/ib-workforce/people")
        people = list_response.json()["data"]
        
        if len(people) == 0:
            pytest.skip("No people to test duplicate email")
        
        existing_email = people[0]["email"]
        
        # Try to create with same email
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/people", json={
            "first_name": "TEST_Duplicate",
            "last_name": "Email",
            "email": existing_email
        })
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()


class TestRolesModule:
    """Roles module CRUD tests"""
    
    def test_list_roles(self, api_client):
        """Test listing all roles"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/roles")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert isinstance(data["data"], list)
        
        # Verify role structure
        if len(data["data"]) > 0:
            role = data["data"][0]
            assert "role_id" in role
            assert "role_name" in role
            assert "role_category" in role
            assert "is_active" in role
    
    def test_list_roles_with_category_filter(self, api_client):
        """Test filtering roles by category"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/roles?category=operational")
        assert response.status_code == 200
        
        data = response.json()
        for role in data["data"]:
            assert role["role_category"] == "operational"
    
    def test_create_role(self, api_client):
        """Test creating a new role"""
        unique_id = uuid.uuid4().hex[:8]
        role_data = {
            "role_name": f"TEST_Role_{unique_id}",
            "role_category": "operational",
            "description": "Test role for automated testing"
        }
        
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/roles", json=role_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "role_id" in data
        assert data["data"]["role_name"] == f"TEST_Role_{unique_id}"
        assert data["data"]["is_active"] == True
    
    def test_get_role_detail(self, api_client):
        """Test getting role details with permissions and assignments"""
        # Get list first
        list_response = api_client.get(f"{BASE_URL}/api/ib-workforce/roles")
        roles = list_response.json()["data"]
        
        if len(roles) == 0:
            pytest.skip("No roles to test")
        
        role_id = roles[0]["role_id"]
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/roles/{role_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "permissions" in data["data"]
        assert "assignments" in data["data"]
    
    def test_update_role(self, api_client):
        """Test updating a role"""
        # Create a test role first
        unique_id = uuid.uuid4().hex[:8]
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/roles", json={
            "role_name": f"TEST_UpdateRole_{unique_id}",
            "role_category": "operational"
        })
        role_id = create_response.json()["role_id"]
        
        # Update the role
        update_data = {
            "role_name": f"TEST_UpdatedRole_{unique_id}",
            "description": "Updated description"
        }
        response = api_client.put(f"{BASE_URL}/api/ib-workforce/roles/{role_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "Updated" in data["data"]["role_name"]


class TestCapacityModule:
    """Capacity module tests"""
    
    def test_list_capacity_profiles(self, api_client):
        """Test listing capacity profiles"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/capacity")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_allocations(self, api_client):
        """Test listing allocations"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/allocations")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_allocations_with_status_filter(self, api_client):
        """Test filtering allocations by status"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/allocations?status=active")
        assert response.status_code == 200
        
        data = response.json()
        for alloc in data["data"]:
            assert alloc["status"] == "active"


class TestTimeModule:
    """Time module tests - attendance, time entries, timesheets"""
    
    def test_list_attendance(self, api_client):
        """Test listing attendance records"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/attendance")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_time_entries(self, api_client):
        """Test listing time entries"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/time-entries")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_timesheets(self, api_client):
        """Test listing timesheets"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/timesheets")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_create_time_entry(self, api_client):
        """Test creating a time entry"""
        today = datetime.now().strftime("%Y-%m-%d")
        entry_data = {
            "date": today,
            "hours": 4,
            "work_type": "project",
            "reference_name": "TEST_Project Alpha",
            "description": "Test time entry"
        }
        
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/time-entries", json=entry_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "time_entry_id" in data
        assert data["data"]["hours"] == 4
        assert data["data"]["status"] == "draft"


class TestPayrollModule:
    """Payroll module tests - compensation, pay runs, payslips"""
    
    def test_list_compensation_profiles(self, api_client):
        """Test listing compensation profiles"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/compensation")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_payruns(self, api_client):
        """Test listing pay runs"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/payruns")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_payslips(self, api_client):
        """Test listing payslips"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/payslips")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_create_payrun(self, api_client):
        """Test creating a pay run"""
        period = datetime.now().strftime("%Y-%m")
        payrun_data = {
            "period": period,
            "payroll_group": "test_group"
        }
        
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns", json=payrun_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "payrun_id" in data
        assert data["data"]["status"] == "draft"
        
        return data["payrun_id"]
    
    def test_calculate_payrun(self, api_client):
        """Test calculating payroll for a pay run"""
        # Create a pay run first
        period = datetime.now().strftime("%Y-%m")
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns", json={
            "period": period,
            "payroll_group": "test_calc"
        })
        payrun_id = create_response.json()["payrun_id"]
        
        # Calculate payroll
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns/{payrun_id}/calculate")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "employees_processed" in data["data"]
    
    def test_payrun_workflow(self, api_client):
        """Test full pay run workflow: create -> calculate -> approve"""
        # Create
        period = datetime.now().strftime("%Y-%m")
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns", json={
            "period": period,
            "payroll_group": "test_workflow"
        })
        assert create_response.status_code == 200
        payrun_id = create_response.json()["payrun_id"]
        
        # Calculate
        calc_response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns/{payrun_id}/calculate")
        assert calc_response.status_code == 200
        
        # Approve
        approve_response = api_client.post(f"{BASE_URL}/api/ib-workforce/payruns/{payrun_id}/approve")
        assert approve_response.status_code == 200
        
        # Verify status
        get_response = api_client.get(f"{BASE_URL}/api/ib-workforce/payruns/{payrun_id}")
        assert get_response.status_code == 200
        assert get_response.json()["data"]["status"] == "approved"


class TestComplianceModule:
    """Compliance module tests - documents, violations"""
    
    def test_get_compliance_dashboard(self, api_client):
        """Test compliance dashboard endpoint"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/compliance/dashboard")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "documents" in data["data"]
        assert "violations" in data["data"]
        assert "people" in data["data"]
    
    def test_list_compliance_documents(self, api_client):
        """Test listing compliance documents"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/compliance/documents")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_violations(self, api_client):
        """Test listing compliance violations"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/compliance/violations")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_list_violations_with_status_filter(self, api_client):
        """Test filtering violations by status"""
        response = api_client.get(f"{BASE_URL}/api/ib-workforce/compliance/violations?status=open")
        assert response.status_code == 200
        
        data = response.json()
        for violation in data["data"]:
            assert violation["status"] == "open"


class TestSeedData:
    """Test seed data endpoint"""
    
    def test_seed_data_endpoint(self, api_client):
        """Test that seed data endpoint works"""
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/seed-data")
        # Should return 200 even if data already exists
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True


class TestPersonLifecycle:
    """Test person lifecycle operations: activate, suspend, exit"""
    
    def test_activate_person_without_legal_profile(self, api_client):
        """Test that activation fails without legal profile"""
        # Create a draft person
        unique_id = uuid.uuid4().hex[:8]
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/people", json={
            "first_name": "TEST_Activate",
            "last_name": f"NoLegal_{unique_id}",
            "email": f"test_activate_{unique_id}@example.com"
        })
        person_id = create_response.json()["person_id"]
        
        # Try to activate without legal profile
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/people/{person_id}/activate")
        assert response.status_code == 400
        assert "legal profile" in response.json()["detail"].lower()
    
    def test_suspend_inactive_person_fails(self, api_client):
        """Test that suspending a non-active person fails"""
        # Create a draft person
        unique_id = uuid.uuid4().hex[:8]
        create_response = api_client.post(f"{BASE_URL}/api/ib-workforce/people", json={
            "first_name": "TEST_Suspend",
            "last_name": f"Draft_{unique_id}",
            "email": f"test_suspend_{unique_id}@example.com"
        })
        person_id = create_response.json()["person_id"]
        
        # Try to suspend a draft person
        response = api_client.post(f"{BASE_URL}/api/ib-workforce/people/{person_id}/suspend", json={
            "reason": "Test suspension"
        })
        assert response.status_code == 400


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
