"""
Test Visual Workflow Editor and Email Template Editor APIs
Tests for the new UI enhancement features
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com').rstrip('/')


class TestAuthentication:
    """Get authentication token for subsequent tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access_token in response"
        return data["access_token"]
    
    @pytest.fixture(scope="class")
    def auth_headers(self, auth_token):
        """Return headers with auth token"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }


class TestWorkflowBuilderAPIs(TestAuthentication):
    """Test Workflow Builder CRUD operations"""
    
    def test_list_workflows(self, auth_headers):
        """Test GET /api/workflows/list"""
        response = requests.get(f"{BASE_URL}/api/workflows/list", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "workflows" in data
        print(f"Found {len(data['workflows'])} workflows")
    
    def test_list_workflow_templates(self, auth_headers):
        """Test GET /api/workflows/templates/list"""
        response = requests.get(f"{BASE_URL}/api/workflows/templates/list", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "templates" in data
        assert len(data["templates"]) == 4, "Expected 4 workflow templates"
        
        template_ids = [t["id"] for t in data["templates"]]
        expected_templates = ["invoice_overdue_reminder", "payment_received_notification", 
                            "new_lead_assignment", "contract_expiry_alert"]
        for expected in expected_templates:
            assert expected in template_ids, f"Missing template: {expected}"
        print(f"Found {len(data['templates'])} workflow templates: {template_ids}")
    
    def test_create_workflow(self, auth_headers):
        """Test POST /api/workflows/create"""
        workflow_data = {
            "name": "TEST_Visual_Editor_Workflow",
            "description": "Testing visual workflow editor",
            "trigger": {
                "type": "manual",
                "event_type": "",
                "conditions": []
            },
            "steps": []
        }
        response = requests.post(f"{BASE_URL}/api/workflows/create", 
                                headers=auth_headers, json=workflow_data)
        assert response.status_code == 200
        data = response.json()
        assert "workflow_id" in data
        assert data["name"] == "TEST_Visual_Editor_Workflow"
        print(f"Created workflow: {data['workflow_id']}")
        return data["workflow_id"]
    
    def test_update_workflow_steps(self, auth_headers):
        """Test PUT /api/workflows/{workflow_id} - Update steps via Visual Editor"""
        # First create a workflow
        workflow_data = {
            "name": "TEST_Update_Steps_Workflow",
            "description": "Testing step updates",
            "trigger": {"type": "manual", "event_type": "", "conditions": []},
            "steps": []
        }
        create_response = requests.post(f"{BASE_URL}/api/workflows/create", 
                                       headers=auth_headers, json=workflow_data)
        assert create_response.status_code == 200
        workflow_id = create_response.json()["workflow_id"]
        
        # Update with steps (simulating Visual Editor save)
        update_data = {
            "steps": [
                {
                    "step_id": "step-test-001",
                    "name": "New Action",
                    "step_type": "action",
                    "config": {"type": "create_task", "title": "Test Task"},
                    "next_steps": ["step-test-002"],
                    "position": {"x": 100, "y": 100}
                },
                {
                    "step_id": "step-test-002",
                    "name": "New Delay",
                    "step_type": "delay",
                    "config": {"delay_seconds": 60},
                    "next_steps": [],
                    "position": {"x": 100, "y": 200}
                }
            ]
        }
        update_response = requests.put(f"{BASE_URL}/api/workflows/{workflow_id}", 
                                      headers=auth_headers, json=update_data)
        assert update_response.status_code == 200
        updated_data = update_response.json()
        assert len(updated_data["steps"]) == 2
        assert updated_data["version"] == 2  # Version should increment
        print(f"Updated workflow {workflow_id} with 2 steps, version: {updated_data['version']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/workflows/{workflow_id}", headers=auth_headers)
    
    def test_get_workflow_details(self, auth_headers):
        """Test GET /api/workflows/{workflow_id}"""
        # First create a workflow
        workflow_data = {
            "name": "TEST_Get_Details_Workflow",
            "description": "Testing get details",
            "trigger": {"type": "manual", "event_type": "", "conditions": []},
            "steps": []
        }
        create_response = requests.post(f"{BASE_URL}/api/workflows/create", 
                                       headers=auth_headers, json=workflow_data)
        workflow_id = create_response.json()["workflow_id"]
        
        # Get details
        response = requests.get(f"{BASE_URL}/api/workflows/{workflow_id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["workflow_id"] == workflow_id
        assert data["name"] == "TEST_Get_Details_Workflow"
        assert "recent_runs" in data
        print(f"Got workflow details: {data['name']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/workflows/{workflow_id}", headers=auth_headers)
    
    def test_delete_workflow(self, auth_headers):
        """Test DELETE /api/workflows/{workflow_id}"""
        # Create a workflow to delete
        workflow_data = {
            "name": "TEST_Delete_Workflow",
            "description": "To be deleted",
            "trigger": {"type": "manual", "event_type": "", "conditions": []},
            "steps": []
        }
        create_response = requests.post(f"{BASE_URL}/api/workflows/create", 
                                       headers=auth_headers, json=workflow_data)
        workflow_id = create_response.json()["workflow_id"]
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/workflows/{workflow_id}", 
                                         headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
        print(f"Deleted workflow: {workflow_id}")


class TestEmailCampaignAPIs(TestAuthentication):
    """Test Email Campaign Template CRUD operations"""
    
    def test_list_templates(self, auth_headers):
        """Test GET /api/email-campaigns/templates"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/templates", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "templates" in data
        print(f"Found {len(data['templates'])} email templates")
    
    def test_seed_default_templates(self, auth_headers):
        """Test POST /api/email-campaigns/templates/seed"""
        response = requests.post(f"{BASE_URL}/api/email-campaigns/templates/seed", 
                                headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"Seed templates result: {data['message']}")
    
    def test_create_template(self, auth_headers):
        """Test POST /api/email-campaigns/templates"""
        template_data = {
            "name": "TEST_Visual_Editor_Template",
            "subject": "Test Subject {{first_name}}",
            "body_html": "<div><h1>Hello {{first_name}}</h1><p>Test content</p></div>",
            "category": "general",
            "variables": ["first_name"]
        }
        response = requests.post(f"{BASE_URL}/api/email-campaigns/templates", 
                                headers=auth_headers, json=template_data)
        assert response.status_code == 200
        data = response.json()
        assert "template_id" in data
        assert data["name"] == "TEST_Visual_Editor_Template"
        print(f"Created template: {data['template_id']}")
        return data["template_id"]
    
    def test_update_template(self, auth_headers):
        """Test PUT /api/email-campaigns/templates/{template_id}"""
        # First create a template
        template_data = {
            "name": "TEST_Update_Template",
            "subject": "Original Subject",
            "body_html": "<div>Original content</div>",
            "category": "general",
            "variables": []
        }
        create_response = requests.post(f"{BASE_URL}/api/email-campaigns/templates", 
                                       headers=auth_headers, json=template_data)
        template_id = create_response.json()["template_id"]
        
        # Update template (simulating Visual Editor save)
        update_data = {
            "name": "TEST_Update_Template_Modified",
            "subject": "Updated Subject {{first_name}}",
            "body_html": "<div><h1>Updated Title</h1><p>Hello {{first_name}}</p></div>",
            "variables": ["first_name"]
        }
        update_response = requests.put(f"{BASE_URL}/api/email-campaigns/templates/{template_id}", 
                                      headers=auth_headers, json=update_data)
        assert update_response.status_code == 200
        updated_data = update_response.json()
        assert updated_data["name"] == "TEST_Update_Template_Modified"
        assert "first_name" in updated_data["variables"]
        print(f"Updated template: {template_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/email-campaigns/templates/{template_id}", 
                       headers=auth_headers)
    
    def test_get_template(self, auth_headers):
        """Test GET /api/email-campaigns/templates/{template_id}"""
        # First create a template
        template_data = {
            "name": "TEST_Get_Template",
            "subject": "Test Subject",
            "body_html": "<div>Test content</div>",
            "category": "general",
            "variables": []
        }
        create_response = requests.post(f"{BASE_URL}/api/email-campaigns/templates", 
                                       headers=auth_headers, json=template_data)
        template_id = create_response.json()["template_id"]
        
        # Get template
        response = requests.get(f"{BASE_URL}/api/email-campaigns/templates/{template_id}", 
                               headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["template_id"] == template_id
        assert data["name"] == "TEST_Get_Template"
        print(f"Got template: {data['name']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/email-campaigns/templates/{template_id}", 
                       headers=auth_headers)
    
    def test_delete_template(self, auth_headers):
        """Test DELETE /api/email-campaigns/templates/{template_id}"""
        # Create a template to delete
        template_data = {
            "name": "TEST_Delete_Template",
            "subject": "To be deleted",
            "body_html": "<div>Delete me</div>",
            "category": "general",
            "variables": []
        }
        create_response = requests.post(f"{BASE_URL}/api/email-campaigns/templates", 
                                       headers=auth_headers, json=template_data)
        template_id = create_response.json()["template_id"]
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/email-campaigns/templates/{template_id}", 
                                         headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
        print(f"Deleted template: {template_id}")


class TestCampaignAPIs(TestAuthentication):
    """Test Email Campaign CRUD operations"""
    
    def test_list_campaigns(self, auth_headers):
        """Test GET /api/email-campaigns/campaigns"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/campaigns", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "campaigns" in data
        print(f"Found {len(data['campaigns'])} campaigns")
    
    def test_create_campaign(self, auth_headers):
        """Test POST /api/email-campaigns/campaigns"""
        # First ensure we have a template
        templates_response = requests.get(f"{BASE_URL}/api/email-campaigns/templates", 
                                         headers=auth_headers)
        templates = templates_response.json().get("templates", [])
        
        if not templates:
            # Seed templates first
            requests.post(f"{BASE_URL}/api/email-campaigns/templates/seed", headers=auth_headers)
            templates_response = requests.get(f"{BASE_URL}/api/email-campaigns/templates", 
                                             headers=auth_headers)
            templates = templates_response.json().get("templates", [])
        
        assert len(templates) > 0, "No templates available"
        template_id = templates[0]["template_id"]
        
        # Create campaign
        campaign_data = {
            "name": "TEST_Visual_Editor_Campaign",
            "template_id": template_id,
            "subject_override": "",
            "recipient_type": "manual"
        }
        response = requests.post(f"{BASE_URL}/api/email-campaigns/campaigns", 
                                headers=auth_headers, json=campaign_data)
        assert response.status_code == 200
        data = response.json()
        assert "campaign_id" in data
        assert data["status"] == "draft"
        print(f"Created campaign: {data['campaign_id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/email-campaigns/campaigns/{data['campaign_id']}", 
                       headers=auth_headers)


class TestAuthenticationRequired:
    """Test that endpoints require authentication"""
    
    def test_workflows_requires_auth(self):
        """Test that workflow endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/workflows/list")
        assert response.status_code == 401
        print("Workflows list correctly requires authentication")
    
    def test_templates_requires_auth(self):
        """Test that template endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/templates")
        assert response.status_code == 401
        print("Templates list correctly requires authentication")
    
    def test_campaigns_requires_auth(self):
        """Test that campaign endpoints require authentication"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/campaigns")
        assert response.status_code == 401
        print("Campaigns list correctly requires authentication")


# Cleanup test data
class TestCleanup(TestAuthentication):
    """Cleanup TEST_ prefixed data"""
    
    def test_cleanup_test_workflows(self, auth_headers):
        """Delete all TEST_ prefixed workflows"""
        response = requests.get(f"{BASE_URL}/api/workflows/list", headers=auth_headers)
        if response.status_code == 200:
            workflows = response.json().get("workflows", [])
            deleted = 0
            for wf in workflows:
                if wf.get("name", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/workflows/{wf['workflow_id']}", 
                                   headers=auth_headers)
                    deleted += 1
            print(f"Cleaned up {deleted} test workflows")
    
    def test_cleanup_test_templates(self, auth_headers):
        """Delete all TEST_ prefixed templates"""
        response = requests.get(f"{BASE_URL}/api/email-campaigns/templates", headers=auth_headers)
        if response.status_code == 200:
            templates = response.json().get("templates", [])
            deleted = 0
            for tpl in templates:
                if tpl.get("name", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/email-campaigns/templates/{tpl['template_id']}", 
                                   headers=auth_headers)
                    deleted += 1
            print(f"Cleaned up {deleted} test templates")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
