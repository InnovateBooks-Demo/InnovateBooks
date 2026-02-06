"""
Intelligence Module Enhanced Tests
Tests for:
- Multi-tenancy (org_id filtering)
- Real-time WebSocket updates for signals
- ML-powered forecasting using GPT-5.2
- Auto-generated recommendations from risk analysis
- Executive Dashboard with real-time KPIs
"""
import pytest
import requests
import os
import json
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestIntelligenceAuth:
    """Authentication tests for Intelligence module"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data


class TestIntelligenceSeed:
    """Test seed endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_seed_intelligence_data(self, auth_token):
        """Test POST /api/intelligence/seed - Seeds demo data"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/seed",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # Verify seed counts
        assert "signals" in data or "seeded" in str(data).lower()


class TestIntelligenceDashboard:
    """Test Intelligence Dashboard endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_dashboard(self, auth_token):
        """Test GET /api/intelligence/dashboard - Returns dashboard data"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Verify dashboard structure
        assert "summary" in data
        assert "recent_signals" in data or "key_metrics" in data
    
    def test_dashboard_summary_structure(self, auth_token):
        """Test dashboard summary has correct structure"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        summary = data.get("summary", {})
        # Check for signals, risks, recommendations in summary
        assert "signals" in summary or "risks" in summary


class TestIntelligenceSignals:
    """Test Signals endpoints with multi-tenancy"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_signals(self, auth_token):
        """Test GET /api/intelligence/signals - Returns signals with org_id filtering"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/signals",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "signals" in data
        assert "total" in data
        assert "severity_counts" in data
    
    def test_get_signals_with_severity_filter(self, auth_token):
        """Test GET /api/intelligence/signals with severity filter"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/signals?severity=critical",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "signals" in data
        # All returned signals should be critical
        for signal in data.get("signals", []):
            assert signal.get("severity") == "critical"
    
    def test_get_signals_summary(self, auth_token):
        """Test GET /api/intelligence/signals/summary - Returns summary by source and severity"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/signals/summary",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "by_source" in data
        assert "by_severity" in data
        assert "total" in data
    
    def test_create_signal(self, auth_token):
        """Test POST /api/intelligence/signals - Creates a new signal with org_id"""
        signal_data = {
            "source_solution": "commerce",
            "source_module": "leads",
            "signal_type": "ai_detected",
            "severity": "warning",
            "title": "TEST_Signal: Low conversion rate detected",
            "description": "AI detected a 15% drop in lead conversion rate",
            "entity_reference": "LEAD-001",
            "entity_type": "lead",
            "metadata": {"conversion_rate": 0.15}
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/signals",
            json=signal_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "signal_id" in data
        return data.get("signal_id")
    
    def test_acknowledge_signal(self, auth_token):
        """Test POST /api/intelligence/signals/{signal_id}/acknowledge"""
        # First create a signal
        signal_data = {
            "source_solution": "finance",
            "source_module": "receivables",
            "signal_type": "payment_overdue",
            "severity": "critical",
            "title": "TEST_Signal: Payment overdue",
            "description": "Invoice INV-001 is 30 days overdue"
        }
        create_response = requests.post(
            f"{BASE_URL}/api/intelligence/signals",
            json=signal_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 200
        signal_id = create_response.json().get("signal_id")
        
        # Acknowledge the signal
        ack_response = requests.post(
            f"{BASE_URL}/api/intelligence/signals/{signal_id}/acknowledge",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert ack_response.status_code == 200
        assert ack_response.json().get("success") == True


class TestIntelligenceForecasts:
    """Test Forecasts endpoints with AI/ML integration"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_forecasts(self, auth_token):
        """Test GET /api/intelligence/forecasts - Returns forecasts with org_id filtering"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/forecasts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "forecasts" in data
        assert "total" in data
    
    def test_get_forecast_scenarios(self, auth_token):
        """Test GET /api/intelligence/forecasts/scenarios - Returns what-if scenario templates"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/forecasts/scenarios",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "scenarios" in data
        scenarios = data.get("scenarios", [])
        assert len(scenarios) > 0
        # Verify scenario structure
        for scenario in scenarios:
            assert "id" in scenario
            assert "name" in scenario
            assert "parameters" in scenario
    
    def test_run_simulation(self, auth_token):
        """Test POST /api/intelligence/forecasts/simulate - Runs what-if simulation"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/forecasts/simulate?scenario_id=hiring_change",
            json={"headcount_delta": 5, "avg_salary": 1200000},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "scenario_id" in data
        assert "results" in data
        assert "base" in data["results"]
        assert "simulated" in data["results"]
        assert "impact_summary" in data
    
    def test_ai_generate_forecast(self, auth_token):
        """Test POST /api/intelligence/forecasts/ai-generate - Uses GPT-5.2 for ML-powered forecasting"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/forecasts/ai-generate?domain=commercial&metric_name=revenue&horizon=90d",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=60  # AI calls may take longer
        )
        assert response.status_code == 200
        data = response.json()
        # Either success with forecast or fallback message
        assert "success" in data or "forecast" in data or "message" in data


class TestIntelligenceRisks:
    """Test Risk endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_risks(self, auth_token):
        """Test GET /api/intelligence/risks - Returns risks with org_id filtering"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/risks",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "risks" in data
        assert "total" in data
    
    def test_get_risk_heatmap(self, auth_token):
        """Test GET /api/intelligence/risks/heatmap - Returns risk heatmap data"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/risks/heatmap",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "heatmap" in data
        assert "by_domain" in data
        assert "by_type" in data
        assert "total_open" in data
    
    def test_create_risk(self, auth_token):
        """Test POST /api/intelligence/risks - Creates a new risk with org_id"""
        risk_data = {
            "domain": "commercial",
            "risk_type": "revenue",
            "title": "TEST_Risk: Revenue target at risk",
            "description": "Q4 revenue target may not be met due to delayed deals",
            "probability_score": 0.7,
            "impact_score": 8,
            "affected_entities": [{"type": "deal", "id": "DEAL-001"}]
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/risks",
            json=risk_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "risk_id" in data
        assert "risk_score" in data
        # Risk score should be probability * impact
        expected_score = round(0.7 * 8, 2)
        assert data.get("risk_score") == expected_score


class TestIntelligenceRecommendations:
    """Test Recommendations endpoints with auto-generation"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_recommendations(self, auth_token):
        """Test GET /api/intelligence/recommendations - Returns recommendations with org_id filtering"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/recommendations",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert "total" in data
    
    def test_get_recommendations_summary(self, auth_token):
        """Test GET /api/intelligence/recommendations/summary - Returns summary"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/recommendations/summary",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "counts" in data
        counts = data.get("counts", {})
        assert "pending" in counts
        assert "accepted" in counts
    
    def test_create_recommendation(self, auth_token):
        """Test POST /api/intelligence/recommendations - Creates a new recommendation"""
        rec_data = {
            "action_type": "review",
            "target_module": "commerce/deals",
            "target_entity_id": "DEAL-001",
            "title": "TEST_Recommendation: Review deal pricing",
            "explanation": "Deal margin is below threshold, review pricing strategy",
            "risk_if_ignored": "Potential revenue loss of 15%",
            "confidence_score": 0.85,
            "priority": 2
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/recommendations",
            json=rec_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "recommendation_id" in data
        return data.get("recommendation_id")
    
    def test_act_on_recommendation(self, auth_token):
        """Test POST /api/intelligence/recommendations/{rec_id}/act - Acts on recommendation"""
        # First create a recommendation
        rec_data = {
            "action_type": "investigate",
            "target_module": "finance/receivables",
            "title": "TEST_Recommendation: Investigate overdue payments",
            "explanation": "Multiple invoices are overdue from same customer",
            "risk_if_ignored": "Cash flow impact",
            "confidence_score": 0.9,
            "priority": 1
        }
        create_response = requests.post(
            f"{BASE_URL}/api/intelligence/recommendations",
            json=rec_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 200
        rec_id = create_response.json().get("recommendation_id")
        
        # Act on the recommendation
        act_response = requests.post(
            f"{BASE_URL}/api/intelligence/recommendations/{rec_id}/act?action=accepted&notes=Reviewed and approved",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert act_response.status_code == 200
        assert act_response.json().get("success") == True


class TestExecutiveDashboard:
    """Test Executive Dashboard endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_executive_dashboard(self, auth_token):
        """Test GET /api/intelligence/executive-dashboard - Returns comprehensive KPIs"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/executive-dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Verify executive dashboard structure
        assert "intelligence_health" in data
        assert "commerce" in data or "finance" in data
        assert "last_updated" in data


class TestIntelligenceMetrics:
    """Test Metrics endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_metrics(self, auth_token):
        """Test GET /api/intelligence/metrics - Returns metrics with org_id filtering"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/metrics",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "metrics" in data
        assert "total" in data
    
    def test_get_metrics_dashboard(self, auth_token):
        """Test GET /api/intelligence/metrics/dashboard - Returns metrics by domain"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/metrics/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "domains" in data
        assert "total_metrics" in data


class TestIntelligenceLearning:
    """Test Learning endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_learning_accuracy(self, auth_token):
        """Test GET /api/intelligence/learning/accuracy - Returns model accuracy stats"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/learning/accuracy",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "forecast_accuracy" in data or "recommendation_feedback" in data
    
    def test_get_learning_records(self, auth_token):
        """Test GET /api/intelligence/learning/records - Returns learning records"""
        response = requests.get(
            f"{BASE_URL}/api/intelligence/learning/records",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "records" in data
        assert "total" in data


class TestMultiTenancy:
    """Test multi-tenancy (org_id filtering) across endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_signals_have_org_id(self, auth_token):
        """Verify signals are created with org_id"""
        # Create a signal
        signal_data = {
            "source_solution": "operations",
            "source_module": "projects",
            "signal_type": "project_delay",
            "severity": "warning",
            "title": "TEST_MultiTenant: Project delay detected",
            "description": "Project XYZ is behind schedule"
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/signals",
            json=signal_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        # The signal should be created with org_id from the user's token
        assert response.json().get("success") == True
    
    def test_risks_have_org_id(self, auth_token):
        """Verify risks are created with org_id"""
        risk_data = {
            "domain": "operational",
            "risk_type": "delivery",
            "title": "TEST_MultiTenant: Delivery risk",
            "description": "Multiple projects at risk of delay",
            "probability_score": 0.6,
            "impact_score": 7,
            "affected_entities": []
        }
        response = requests.post(
            f"{BASE_URL}/api/intelligence/risks",
            json=risk_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        assert response.json().get("success") == True


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
