"""
Intelligence Module API Tests
Tests for: Signals, Metrics, Risk, Forecast, Recommendations, Learning
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com').rstrip('/')

class TestIntelligenceModule:
    """Intelligence Module API Tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup - login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        self.token = response.json().get("access_token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    # ==================== DASHBOARD TESTS ====================
    
    def test_intelligence_dashboard(self):
        """Test GET /api/intelligence/dashboard"""
        response = requests.get(f"{BASE_URL}/api/intelligence/dashboard", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "summary" in data
        assert "signals" in data["summary"]
        assert "risks" in data["summary"]
        assert "recommendations" in data["summary"]
        assert "recent_signals" in data
        assert "recent_recommendations" in data
        assert "key_metrics" in data
        assert "last_updated" in data
        
        # Verify signal summary structure
        assert "critical" in data["summary"]["signals"]
        assert "warning" in data["summary"]["signals"]
        assert "status" in data["summary"]["signals"]
    
    # ==================== SIGNALS TESTS ====================
    
    def test_get_signals(self):
        """Test GET /api/intelligence/signals"""
        response = requests.get(f"{BASE_URL}/api/intelligence/signals", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "signals" in data
        assert "total" in data
        assert "severity_counts" in data
        assert isinstance(data["signals"], list)
    
    def test_get_signals_with_filter(self):
        """Test GET /api/intelligence/signals with severity filter"""
        response = requests.get(f"{BASE_URL}/api/intelligence/signals?severity=critical", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # All returned signals should be critical
        for signal in data.get("signals", []):
            assert signal.get("severity") == "critical"
    
    def test_get_signals_summary(self):
        """Test GET /api/intelligence/signals/summary"""
        response = requests.get(f"{BASE_URL}/api/intelligence/signals/summary", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "by_source" in data
        assert "by_severity" in data
        assert "total" in data
    
    def test_acknowledge_signal(self):
        """Test POST /api/intelligence/signals/{id}/acknowledge"""
        # First get a signal
        signals_response = requests.get(f"{BASE_URL}/api/intelligence/signals", headers=self.headers)
        signals = signals_response.json().get("signals", [])
        
        if signals:
            signal_id = signals[0].get("signal_id")
            response = requests.post(f"{BASE_URL}/api/intelligence/signals/{signal_id}/acknowledge", headers=self.headers)
            assert response.status_code == 200
            data = response.json()
            assert data.get("success") == True
    
    # ==================== METRICS TESTS ====================
    
    def test_get_metrics(self):
        """Test GET /api/intelligence/metrics"""
        response = requests.get(f"{BASE_URL}/api/intelligence/metrics", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "metrics" in data
        assert "total" in data
        assert isinstance(data["metrics"], list)
    
    def test_get_metrics_dashboard(self):
        """Test GET /api/intelligence/metrics/dashboard"""
        response = requests.get(f"{BASE_URL}/api/intelligence/metrics/dashboard", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "domains" in data
        assert "total_metrics" in data
        assert "last_updated" in data
        
        # Verify domains structure
        expected_domains = ["commercial", "operational", "financial", "workforce", "capital"]
        for domain in expected_domains:
            assert domain in data["domains"]
            assert "metrics" in data["domains"][domain]
            assert "count" in data["domains"][domain]
    
    def test_get_metrics_with_domain_filter(self):
        """Test GET /api/intelligence/metrics with domain filter"""
        response = requests.get(f"{BASE_URL}/api/intelligence/metrics?domain=financial", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # All returned metrics should be financial domain
        for metric in data.get("metrics", []):
            assert metric.get("domain") == "financial"
    
    # ==================== RISK TESTS ====================
    
    def test_get_risks(self):
        """Test GET /api/intelligence/risks"""
        response = requests.get(f"{BASE_URL}/api/intelligence/risks", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "risks" in data
        assert "total" in data
        assert isinstance(data["risks"], list)
    
    def test_get_risk_heatmap(self):
        """Test GET /api/intelligence/risks/heatmap"""
        response = requests.get(f"{BASE_URL}/api/intelligence/risks/heatmap", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "heatmap" in data
        assert "by_domain" in data
        assert "by_type" in data
        assert "total_open" in data
        assert "critical_count" in data
        
        # Verify heatmap structure
        expected_keys = ["high_high", "high_medium", "high_low", "medium_high", "medium_medium", "medium_low", "low_high", "low_medium", "low_low"]
        for key in expected_keys:
            assert key in data["heatmap"]
    
    def test_get_risks_with_status_filter(self):
        """Test GET /api/intelligence/risks with status filter"""
        response = requests.get(f"{BASE_URL}/api/intelligence/risks?status=open", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # All returned risks should be open
        for risk in data.get("risks", []):
            assert risk.get("status") == "open"
    
    # ==================== FORECAST TESTS ====================
    
    def test_get_forecasts(self):
        """Test GET /api/intelligence/forecasts"""
        response = requests.get(f"{BASE_URL}/api/intelligence/forecasts", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "forecasts" in data
        assert "total" in data
        assert isinstance(data["forecasts"], list)
    
    def test_get_forecast_scenarios(self):
        """Test GET /api/intelligence/forecasts/scenarios"""
        response = requests.get(f"{BASE_URL}/api/intelligence/forecasts/scenarios", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "scenarios" in data
        assert isinstance(data["scenarios"], list)
        assert len(data["scenarios"]) > 0
        
        # Verify scenario structure
        scenario = data["scenarios"][0]
        assert "id" in scenario
        assert "name" in scenario
        assert "description" in scenario
        assert "parameters" in scenario
        assert "affected_metrics" in scenario
    
    def test_run_forecast_simulation(self):
        """Test POST /api/intelligence/forecasts/simulate"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/forecasts/simulate?scenario_id=hiring_change",
            headers=self.headers,
            json={"headcount_delta": 5, "avg_salary": 1200000}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "scenario_id" in data
        assert "parameters" in data
        assert "results" in data
        assert "impact_summary" in data
        assert "simulated_at" in data
        
        # Verify results structure
        assert "base" in data["results"]
        assert "simulated" in data["results"]
        
        # Verify impact summary
        assert "positive" in data["impact_summary"]
        assert "negative" in data["impact_summary"]
        assert "neutral" in data["impact_summary"]
    
    def test_run_pricing_simulation(self):
        """Test POST /api/intelligence/forecasts/simulate with pricing scenario"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/forecasts/simulate?scenario_id=pricing_change",
            headers=self.headers,
            json={"price_change_percent": 10, "expected_volume_impact": -5}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["scenario_id"] == "pricing_change"
    
    # ==================== RECOMMENDATIONS TESTS ====================
    
    def test_get_recommendations(self):
        """Test GET /api/intelligence/recommendations"""
        response = requests.get(f"{BASE_URL}/api/intelligence/recommendations", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "recommendations" in data
        assert "total" in data
        assert isinstance(data["recommendations"], list)
    
    def test_get_recommendations_summary(self):
        """Test GET /api/intelligence/recommendations/summary"""
        response = requests.get(f"{BASE_URL}/api/intelligence/recommendations/summary", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "counts" in data
        assert "high_priority" in data
        assert "by_action_type" in data
        assert "acceptance_rate" in data
        
        # Verify counts structure
        assert "pending" in data["counts"]
        assert "accepted" in data["counts"]
        assert "dismissed" in data["counts"]
        assert "deferred" in data["counts"]
    
    def test_act_on_recommendation(self):
        """Test POST /api/intelligence/recommendations/{id}/act"""
        # First get a recommendation
        recs_response = requests.get(f"{BASE_URL}/api/intelligence/recommendations", headers=self.headers)
        recs = recs_response.json().get("recommendations", [])
        
        # Find a pending recommendation
        pending_rec = next((r for r in recs if r.get("status") == "pending"), None)
        
        if pending_rec:
            rec_id = pending_rec.get("recommendation_id")
            response = requests.post(
                f"{BASE_URL}/api/intelligence/recommendations/{rec_id}/act?action=deferred",
                headers=self.headers
            )
            assert response.status_code == 200
            data = response.json()
            assert data.get("success") == True
    
    # ==================== LEARNING TESTS ====================
    
    def test_get_learning_accuracy(self):
        """Test GET /api/intelligence/learning/accuracy"""
        response = requests.get(f"{BASE_URL}/api/intelligence/learning/accuracy", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "forecast_accuracy" in data
        assert "recommendation_feedback" in data
        assert "overall_metrics" in data
        
        # Verify overall metrics structure
        assert "forecast_samples" in data["overall_metrics"]
        assert "recommendation_samples" in data["overall_metrics"]
    
    def test_get_learning_records(self):
        """Test GET /api/intelligence/learning/records"""
        response = requests.get(f"{BASE_URL}/api/intelligence/learning/records", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "records" in data
        assert "total" in data
        assert isinstance(data["records"], list)
    
    # ==================== SEED DATA TEST ====================
    
    def test_seed_intelligence_data(self):
        """Test POST /api/intelligence/seed"""
        response = requests.post(f"{BASE_URL}/api/intelligence/seed", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("success") == True
        assert "seeded" in data
        assert "signals" in data["seeded"]
        assert "metrics" in data["seeded"]
        assert "risks" in data["seeded"]
        assert "forecasts" in data["seeded"]
        assert "recommendations" in data["seeded"]
    
    # ==================== ERROR HANDLING TESTS ====================
    
    def test_acknowledge_nonexistent_signal(self):
        """Test acknowledging a non-existent signal returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/signals/NONEXISTENT-ID/acknowledge",
            headers=self.headers
        )
        assert response.status_code == 404
    
    def test_act_on_nonexistent_recommendation(self):
        """Test acting on a non-existent recommendation returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/intelligence/recommendations/NONEXISTENT-ID/act?action=accepted",
            headers=self.headers
        )
        assert response.status_code == 404
    
    # ==================== AUTHENTICATION TESTS ====================
    
    def test_unauthorized_access(self):
        """Test that endpoints require authentication"""
        endpoints = [
            "/api/intelligence/dashboard",
            "/api/intelligence/signals",
            "/api/intelligence/metrics",
            "/api/intelligence/risks",
            "/api/intelligence/forecasts",
            "/api/intelligence/recommendations",
            "/api/intelligence/learning/accuracy"
        ]
        
        for endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}")
            assert response.status_code in [401, 403], f"Endpoint {endpoint} should require auth"
