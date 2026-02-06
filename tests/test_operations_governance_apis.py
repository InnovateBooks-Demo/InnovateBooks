"""
Test suite for IB Operations and Commerce Governance Engine APIs
Tests the P0 fix for data loading and new Governance Engine pages
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

class TestAuth:
    """Authentication tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234",
            "remember_me": False
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        return data["access_token"]
    
    def test_login_success(self):
        """Test successful login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234",
            "remember_me": False
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "access_token" in data
        assert data["user"]["email"] == "demo@innovatebooks.com"


class TestOperationsAPIs:
    """Operations module API tests - verifies P0 fix for data loading"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234",
            "remember_me": False
        })
        return response.json()["access_token"]
    
    def test_operations_governance_dashboard(self, auth_token):
        """Test Operations Governance Dashboard API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/governance/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "open_alerts" in data["data"]
        assert "active_projects" in data["data"]
    
    def test_operations_work_intake(self, auth_token):
        """Test Operations Work Intake API - P0 fix verification"""
        response = requests.get(
            f"{BASE_URL}/api/operations/work-intake",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert isinstance(data["data"], list)
        # Verify data structure
        if len(data["data"]) > 0:
            work_order = data["data"][0]
            assert "work_order_id" in work_order
            assert "party_name" in work_order
            assert "status" in work_order
    
    def test_operations_projects(self, auth_token):
        """Test Operations Projects API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/projects",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        # Verify project data structure
        if len(data["data"]) > 0:
            project = data["data"][0]
            assert "project_id" in project
            assert "name" in project
            assert "progress_percent" in project
    
    def test_operations_tasks(self, auth_token):
        """Test Operations Tasks API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/tasks",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        # Verify task data structure
        if len(data["data"]) > 0:
            task = data["data"][0]
            assert "task_id" in task
            assert "title" in task
            assert "status" in task
    
    def test_operations_resources(self, auth_token):
        """Test Operations Resources API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/resources",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_operations_services(self, auth_token):
        """Test Operations Services API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/services",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
    
    def test_operations_governance_alerts(self, auth_token):
        """Test Operations Governance Alerts API"""
        response = requests.get(
            f"{BASE_URL}/api/operations/governance/alerts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data


class TestCommerceGovernanceEngineAPIs:
    """Commerce Governance Engine API tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234",
            "remember_me": False
        })
        return response.json()["access_token"]
    
    def test_governance_policies(self, auth_token):
        """Test Governance Policies API"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/governance-engine/policies",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "policies" in data
        assert isinstance(data["policies"], list)
    
    def test_governance_limits(self, auth_token):
        """Test Governance Limits API"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/governance-engine/limits",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "limits" in data
        assert isinstance(data["limits"], list)
    
    def test_governance_authority(self, auth_token):
        """Test Governance Authority API"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/governance-engine/authority",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "authority_rules" in data
        assert isinstance(data["authority_rules"], list)
    
    def test_governance_risk_rules(self, auth_token):
        """Test Governance Risk Rules API"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/governance-engine/risk-rules",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "risk_rules" in data
        assert isinstance(data["risk_rules"], list)


class TestPartiesEngineAPIs:
    """Parties Engine API tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234",
            "remember_me": False
        })
        return response.json()["access_token"]
    
    def test_parties_list(self, auth_token):
        """Test Parties List API"""
        response = requests.get(
            f"{BASE_URL}/api/commerce/parties-engine/parties",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "parties" in data
    
    def test_party_detail(self, auth_token):
        """Test Party Detail API with all profiles"""
        # First get a party ID
        list_response = requests.get(
            f"{BASE_URL}/api/commerce/parties-engine/parties",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        parties = list_response.json()["parties"]
        if len(parties) > 0:
            party_id = parties[0]["party_id"]
            
            # Get party detail
            response = requests.get(
                f"{BASE_URL}/api/commerce/parties-engine/parties/{party_id}",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert "party" in data
            assert "profiles" in data
            assert "readiness" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
