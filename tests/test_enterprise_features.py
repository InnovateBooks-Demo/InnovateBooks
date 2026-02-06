"""
INNOVATE BOOKS - Enterprise Features API Tests
Tests for: Global Search, Activity Feed, Dashboard Widgets, Bulk Actions
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for tests"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    if response.status_code == 200:
        data = response.json()
        return data.get("access_token") or data.get("token")
    pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get headers with auth token"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


class TestGlobalSearchAPI:
    """Tests for Global Search API - /api/search/*"""
    
    def test_global_search_basic(self, auth_headers):
        """Test basic global search functionality"""
        response = requests.get(
            f"{BASE_URL}/api/search/global",
            params={"q": "test"},
            headers=auth_headers
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "query" in data
        assert "results" in data
        assert "total" in data
        assert "modules_searched" in data
        assert data["query"] == "test"
        print(f"Global search returned {data['total']} results")
    
    def test_global_search_with_module_filter(self, auth_headers):
        """Test global search with module filter"""
        response = requests.get(
            f"{BASE_URL}/api/search/global",
            params={"q": "test", "modules": "leads,customers"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "modules_searched" in data
        assert "leads" in data["modules_searched"]
        assert "customers" in data["modules_searched"]
        print(f"Filtered search returned {data['total']} results from leads,customers")
    
    def test_global_search_min_query_length(self, auth_headers):
        """Test that search requires minimum query length"""
        response = requests.get(
            f"{BASE_URL}/api/search/global",
            params={"q": "a"},  # Single character - should fail
            headers=auth_headers
        )
        # Should return 422 for validation error
        assert response.status_code == 422, f"Expected 422 for short query, got {response.status_code}"
    
    def test_search_suggestions(self, auth_headers):
        """Test search suggestions endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/search/suggestions",
            params={"q": "te"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        print(f"Got {len(data['suggestions'])} suggestions")
    
    def test_recent_searches(self, auth_headers):
        """Test recent searches endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/search/recent",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "recent" in data
        print(f"Got {len(data['recent'])} recent searches")
    
    def test_log_search(self, auth_headers):
        """Test logging a search"""
        response = requests.post(
            f"{BASE_URL}/api/search/log",
            params={"query": "test search", "result_type": "lead", "result_id": "LEAD-001"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True


class TestActivityFeedAPI:
    """Tests for Activity Feed API - /api/activity/*"""
    
    def test_seed_activity_data(self, auth_headers):
        """Seed activity data for testing"""
        response = requests.post(
            f"{BASE_URL}/api/activity/seed",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "seeded" in data
        print(f"Seeded {data['seeded']} activities")
    
    def test_get_activity_feed(self, auth_headers):
        """Test getting activity feed"""
        response = requests.get(
            f"{BASE_URL}/api/activity/feed",
            params={"days": 7, "limit": 50},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "activities" in data
        assert "total" in data
        assert "filters" in data
        print(f"Activity feed returned {data['total']} activities")
    
    def test_get_activity_feed_with_module_filter(self, auth_headers):
        """Test activity feed with module filter"""
        response = requests.get(
            f"{BASE_URL}/api/activity/feed",
            params={"module": "Commerce", "days": 7},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "activities" in data
        # All activities should be from Commerce module
        for activity in data["activities"]:
            assert activity.get("module") == "Commerce", f"Expected Commerce, got {activity.get('module')}"
        print(f"Filtered activity feed returned {data['total']} Commerce activities")
    
    def test_get_activity_stats(self, auth_headers):
        """Test activity statistics endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/activity/stats",
            params={"days": 7},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "by_module" in data
        assert "by_action" in data
        assert "top_users" in data
        assert "daily" in data
        print(f"Activity stats: {data['total']} total, {len(data['by_module'])} modules")
    
    def test_log_activity(self, auth_headers):
        """Test logging an activity"""
        response = requests.post(
            f"{BASE_URL}/api/activity/log",
            params={
                "module": "Commerce",
                "action": "created",
                "entity_type": "lead",
                "entity_id": "TEST-LEAD-001",
                "entity_name": "Test Lead",
                "description": "Created test lead for testing"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "activity_id" in data
        print(f"Logged activity: {data['activity_id']}")
    
    def test_get_entity_activity(self, auth_headers):
        """Test getting activity for a specific entity"""
        response = requests.get(
            f"{BASE_URL}/api/activity/entity/lead/TEST-LEAD-001",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "entity_type" in data
        assert "entity_id" in data
        assert "activities" in data
        print(f"Entity activity returned {data['total']} activities")


class TestDashboardWidgetsAPI:
    """Tests for Dashboard Widgets API - /api/dashboard/*"""
    
    def test_get_available_widgets(self, auth_headers):
        """Test getting available widget types"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widgets/available",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "widgets" in data
        widgets = data["widgets"]
        # Check expected widget types exist
        expected_widgets = ["kpi_card", "recent_activity", "tasks_list", "signals_list", "pipeline_funnel"]
        for widget_type in expected_widgets:
            assert widget_type in widgets, f"Missing widget type: {widget_type}"
        print(f"Available widgets: {list(widgets.keys())}")
    
    def test_get_dashboard_layout(self, auth_headers):
        """Test getting dashboard layout"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/layout",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "widgets" in data
        # Should have default widgets
        assert len(data["widgets"]) > 0, "Dashboard should have default widgets"
        print(f"Dashboard has {len(data['widgets'])} widgets")
    
    def test_get_widget_data_kpi_revenue(self, auth_headers):
        """Test getting KPI widget data for revenue"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/kpi_card/data",
            params={"config": "revenue"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert "label" in data
        assert "format" in data
        print(f"Revenue KPI: {data['value']} ({data['format']})")
    
    def test_get_widget_data_kpi_leads(self, auth_headers):
        """Test getting KPI widget data for leads"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/kpi_card/data",
            params={"config": "leads"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        assert "label" in data
        print(f"Leads KPI: {data['value']}")
    
    def test_get_widget_data_recent_activity(self, auth_headers):
        """Test getting recent activity widget data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/recent_activity/data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "activities" in data
        print(f"Recent activity widget: {len(data['activities'])} activities")
    
    def test_get_widget_data_tasks_list(self, auth_headers):
        """Test getting tasks list widget data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/tasks_list/data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "tasks" in data
        print(f"Tasks widget: {len(data['tasks'])} tasks")
    
    def test_get_widget_data_signals_list(self, auth_headers):
        """Test getting signals list widget data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/signals_list/data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "signals" in data
        print(f"Signals widget: {len(data['signals'])} signals")
    
    def test_get_widget_data_pipeline_funnel(self, auth_headers):
        """Test getting pipeline funnel widget data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/pipeline_funnel/data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "stages" in data
        print(f"Pipeline funnel: {len(data['stages'])} stages")
    
    def test_get_widget_data_quick_actions(self, auth_headers):
        """Test getting quick actions widget data"""
        response = requests.get(
            f"{BASE_URL}/api/dashboard/widget/quick_actions/data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "actions" in data
        assert len(data["actions"]) > 0
        print(f"Quick actions: {len(data['actions'])} actions")
    
    def test_add_widget(self, auth_headers):
        """Test adding a widget to dashboard"""
        response = requests.post(
            f"{BASE_URL}/api/dashboard/widget/add",
            params={"widget_type": "kpi_card", "title": "Test Widget"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "widget" in data
        widget_id = data["widget"]["widget_id"]
        print(f"Added widget: {widget_id}")
        return widget_id
    
    def test_remove_widget(self, auth_headers):
        """Test removing a widget from dashboard"""
        # First add a widget
        add_response = requests.post(
            f"{BASE_URL}/api/dashboard/widget/add",
            params={"widget_type": "kpi_card", "title": "Widget to Remove"},
            headers=auth_headers
        )
        assert add_response.status_code == 200
        widget_id = add_response.json()["widget"]["widget_id"]
        
        # Then remove it
        response = requests.delete(
            f"{BASE_URL}/api/dashboard/widget/{widget_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"Removed widget: {widget_id}")
    
    def test_save_dashboard_layout(self, auth_headers):
        """Test saving dashboard layout"""
        # Get current layout
        get_response = requests.get(
            f"{BASE_URL}/api/dashboard/layout",
            headers=auth_headers
        )
        current_widgets = get_response.json().get("widgets", [])
        
        # Save layout
        response = requests.put(
            f"{BASE_URL}/api/dashboard/layout",
            json={"widgets": current_widgets},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Dashboard layout saved successfully")


class TestBulkActionsAPI:
    """Tests for Bulk Actions API - /api/bulk/*"""
    
    def test_get_bulk_count_leads(self, auth_headers):
        """Test getting count of leads for bulk operations"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/count/lead",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "entity_type" in data
        assert "count" in data
        assert data["entity_type"] == "lead"
        print(f"Lead count: {data['count']}")
    
    def test_get_bulk_count_customers(self, auth_headers):
        """Test getting count of customers for bulk operations"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/count/customer",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["entity_type"] == "customer"
        print(f"Customer count: {data['count']}")
    
    def test_get_bulk_count_invoices(self, auth_headers):
        """Test getting count of invoices for bulk operations"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/count/invoice",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["entity_type"] == "invoice"
        print(f"Invoice count: {data['count']}")
    
    def test_get_bulk_count_with_status_filter(self, auth_headers):
        """Test getting count with status filter"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/count/lead",
            params={"filter_status": "New"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["filter"] == "New"
        print(f"New leads count: {data['count']}")
    
    def test_get_bulk_count_invalid_entity(self, auth_headers):
        """Test getting count for invalid entity type"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/count/invalid_entity",
            headers=auth_headers
        )
        assert response.status_code == 400
        print("Invalid entity type correctly rejected")
    
    def test_bulk_export_json(self, auth_headers):
        """Test bulk export as JSON"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/export/lead",
            params={"format": "json"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "format" in data
        assert "data" in data
        assert "count" in data
        assert data["format"] == "json"
        print(f"Exported {data['count']} leads as JSON")
    
    def test_bulk_export_csv(self, auth_headers):
        """Test bulk export as CSV"""
        response = requests.get(
            f"{BASE_URL}/api/bulk/export/lead",
            params={"format": "csv"},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["format"] == "csv"
        print(f"Exported {data['count']} leads as CSV")


class TestNotificationCenter:
    """Tests for Notification Center - checking if notification routes exist"""
    
    def test_notification_endpoint_exists(self, auth_headers):
        """Check if notification endpoints exist"""
        # Try to get notifications - may return 404 if not implemented
        response = requests.get(
            f"{BASE_URL}/api/notifications",
            headers=auth_headers
        )
        # Either 200 (exists) or 404 (not implemented yet)
        print(f"Notifications endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Notifications: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
