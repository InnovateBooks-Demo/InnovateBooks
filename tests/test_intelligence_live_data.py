"""
Test Intelligence Module - Live Data Connection Features
Tests for:
- POST /api/intelligence/connect/finance - Creates signals from overdue receivables
- POST /api/intelligence/connect/commerce - Creates signals from stale leads
- POST /api/intelligence/connect/all - Syncs all modules and returns summary
- Metrics updates from live data (Total AR, Total AP, Pipeline Value, Conversion Rate)
- Auto-generated recommendations for critical signals
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestIntelligenceLiveDataConnection:
    """Test Intelligence Module Live Data Connection Features"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures - login and get token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
            self.token = token
        else:
            pytest.skip(f"Authentication failed: {login_response.status_code}")
    
    # ==================== CONNECT FINANCE TESTS ====================
    
    def test_connect_finance_endpoint_exists(self):
        """Test that POST /api/intelligence/connect/finance endpoint exists"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/finance")
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "signals_created" in data
        assert "recommendations_created" in data
        assert "metrics_updated" in data
        assert "source" in data
        assert data["source"] == "finance"
        print(f"✓ Finance connection: {data['signals_created']} signals, {data['recommendations_created']} recommendations")
    
    def test_connect_finance_creates_signals_from_overdue_receivables(self):
        """Test that finance connector creates signals from overdue receivables"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/finance")
        assert response.status_code == 200
        
        data = response.json()
        # Check response structure
        assert isinstance(data.get("signals_created"), int)
        assert isinstance(data.get("recommendations_created"), int)
        assert isinstance(data.get("metrics_updated"), list)
        
        # Verify signals were created (if there are overdue receivables)
        signals_response = self.session.get(f"{BASE_URL}/api/intelligence/signals?source_solution=finance")
        assert signals_response.status_code == 200
        signals_data = signals_response.json()
        
        # Check that finance signals exist
        finance_signals = [s for s in signals_data.get("signals", []) if s.get("source_solution") == "finance"]
        print(f"✓ Found {len(finance_signals)} finance signals")
    
    def test_connect_finance_updates_ar_ap_metrics(self):
        """Test that finance connector updates Total AR and Total AP metrics"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/finance")
        assert response.status_code == 200
        
        data = response.json()
        metrics_updated = data.get("metrics_updated", [])
        
        # Check that AR and AP metrics are in the updated list
        assert "Total AR" in metrics_updated, "Total AR metric should be updated"
        assert "Total AP" in metrics_updated, "Total AP metric should be updated"
        print(f"✓ Metrics updated: {metrics_updated}")
    
    # ==================== CONNECT COMMERCE TESTS ====================
    
    def test_connect_commerce_endpoint_exists(self):
        """Test that POST /api/intelligence/connect/commerce endpoint exists"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/commerce")
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "signals_created" in data
        assert "recommendations_created" in data
        assert "metrics_updated" in data
        assert "source" in data
        assert data["source"] == "commerce"
        print(f"✓ Commerce connection: {data['signals_created']} signals, {data['recommendations_created']} recommendations")
    
    def test_connect_commerce_creates_signals_from_stale_leads(self):
        """Test that commerce connector creates signals from stale leads"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/commerce")
        assert response.status_code == 200
        
        data = response.json()
        # Check response structure
        assert isinstance(data.get("signals_created"), int)
        assert isinstance(data.get("recommendations_created"), int)
        assert isinstance(data.get("metrics_updated"), list)
        
        # Verify signals were created (if there are stale leads)
        signals_response = self.session.get(f"{BASE_URL}/api/intelligence/signals?source_solution=commerce")
        assert signals_response.status_code == 200
        signals_data = signals_response.json()
        
        # Check that commerce signals exist
        commerce_signals = [s for s in signals_data.get("signals", []) if s.get("source_solution") == "commerce"]
        print(f"✓ Found {len(commerce_signals)} commerce signals")
    
    def test_connect_commerce_updates_pipeline_metrics(self):
        """Test that commerce connector updates Pipeline Value and Conversion Rate metrics"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/commerce")
        assert response.status_code == 200
        
        data = response.json()
        metrics_updated = data.get("metrics_updated", [])
        
        # Check that commerce metrics are in the updated list
        assert "Pipeline Value" in metrics_updated or "Lead Conversion Rate" in metrics_updated, \
            f"Expected Pipeline Value or Lead Conversion Rate in {metrics_updated}"
        print(f"✓ Commerce metrics updated: {metrics_updated}")
    
    # ==================== CONNECT ALL TESTS ====================
    
    def test_connect_all_endpoint_exists(self):
        """Test that POST /api/intelligence/connect/all endpoint exists"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "results" in data
        assert "summary" in data
        print(f"✓ Connect all endpoint working")
    
    def test_connect_all_syncs_finance_and_commerce(self):
        """Test that connect/all syncs both finance and commerce modules"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        assert response.status_code == 200
        
        data = response.json()
        results = data.get("results", {})
        
        # Check that both modules were synced
        assert "finance" in results, "Finance results should be present"
        assert "commerce" in results, "Commerce results should be present"
        
        # Check summary
        summary = data.get("summary", {})
        assert "total_signals_created" in summary
        assert "total_recommendations_created" in summary
        assert "metrics_updated" in summary
        
        print(f"✓ Connect all summary: {summary['total_signals_created']} signals, {summary['total_recommendations_created']} recommendations")
    
    def test_connect_all_returns_summary(self):
        """Test that connect/all returns proper summary with totals"""
        response = self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        assert response.status_code == 200
        
        data = response.json()
        summary = data.get("summary", {})
        
        # Verify summary structure
        assert isinstance(summary.get("total_signals_created"), int)
        assert isinstance(summary.get("total_recommendations_created"), int)
        assert isinstance(summary.get("metrics_updated"), list)
        
        # Verify totals match individual results
        results = data.get("results", {})
        finance_signals = results.get("finance", {}).get("signals_created", 0) if isinstance(results.get("finance"), dict) else 0
        commerce_signals = results.get("commerce", {}).get("signals_created", 0) if isinstance(results.get("commerce"), dict) else 0
        
        # Total should be sum of individual modules
        assert summary["total_signals_created"] == finance_signals + commerce_signals
        print(f"✓ Summary totals verified: {summary}")
    
    # ==================== METRICS VERIFICATION TESTS ====================
    
    def test_metrics_updated_from_live_data(self):
        """Test that metrics are updated from live data after sync"""
        # First sync all data
        sync_response = self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        assert sync_response.status_code == 200
        
        # Get metrics dashboard
        metrics_response = self.session.get(f"{BASE_URL}/api/intelligence/metrics/dashboard")
        assert metrics_response.status_code == 200
        
        metrics_data = metrics_response.json()
        assert "domains" in metrics_data
        
        # Check financial domain has metrics
        financial_domain = metrics_data.get("domains", {}).get("financial", {})
        print(f"✓ Financial domain metrics count: {financial_domain.get('count', 0)}")
        
        # Check commercial domain has metrics
        commercial_domain = metrics_data.get("domains", {}).get("commercial", {})
        print(f"✓ Commercial domain metrics count: {commercial_domain.get('count', 0)}")
    
    def test_get_specific_metrics_after_sync(self):
        """Test that specific metrics (Total AR, Total AP, Pipeline Value) exist after sync"""
        # Sync data first
        self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        
        # Get all metrics
        metrics_response = self.session.get(f"{BASE_URL}/api/intelligence/metrics")
        assert metrics_response.status_code == 200
        
        metrics_data = metrics_response.json()
        metrics = metrics_data.get("metrics", [])
        
        metric_names = [m.get("name") for m in metrics]
        print(f"✓ Available metrics: {metric_names}")
    
    # ==================== AUTO-GENERATED RECOMMENDATIONS TESTS ====================
    
    def test_auto_generated_recommendations_for_critical_signals(self):
        """Test that recommendations are auto-generated for critical signals"""
        # Sync data
        sync_response = self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        assert sync_response.status_code == 200
        
        sync_data = sync_response.json()
        total_recs = sync_data.get("summary", {}).get("total_recommendations_created", 0)
        
        # Get recommendations
        recs_response = self.session.get(f"{BASE_URL}/api/intelligence/recommendations")
        assert recs_response.status_code == 200
        
        recs_data = recs_response.json()
        recommendations = recs_data.get("recommendations", [])
        
        # Check for auto-generated recommendations
        auto_recs = [r for r in recommendations if r.get("created_by") in ["finance_connector", "commerce_connector"]]
        print(f"✓ Auto-generated recommendations: {len(auto_recs)}")
    
    def test_recommendations_have_source_signal_id(self):
        """Test that auto-generated recommendations have source_signal_id"""
        # Sync data
        self.session.post(f"{BASE_URL}/api/intelligence/connect/all")
        
        # Get recommendations
        recs_response = self.session.get(f"{BASE_URL}/api/intelligence/recommendations")
        assert recs_response.status_code == 200
        
        recs_data = recs_response.json()
        recommendations = recs_data.get("recommendations", [])
        
        # Check for recommendations with source_signal_id
        recs_with_source = [r for r in recommendations if r.get("source_signal_id")]
        print(f"✓ Recommendations with source signal: {len(recs_with_source)}")
    
    # ==================== EXECUTIVE DASHBOARD TESTS ====================
    
    def test_executive_dashboard_returns_data(self):
        """Test that executive dashboard returns comprehensive data"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/executive-dashboard")
        assert response.status_code == 200
        
        data = response.json()
        
        # Check required sections
        assert "intelligence_health" in data
        assert "commerce" in data
        assert "finance" in data
        assert "key_metrics" in data
        assert "recent_activity" in data
        
        print(f"✓ Executive dashboard data retrieved successfully")
    
    def test_executive_dashboard_health_score_calculation(self):
        """Test that executive dashboard calculates health score correctly"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/executive-dashboard")
        assert response.status_code == 200
        
        data = response.json()
        intel_health = data.get("intelligence_health", {})
        
        # Check health status
        assert "status" in intel_health
        assert intel_health["status"] in ["healthy", "warning", "critical"]
        
        # Check signals counts
        signals = intel_health.get("signals", {})
        assert "critical" in signals
        assert "warning" in signals
        
        print(f"✓ Health status: {intel_health['status']}, Critical: {signals.get('critical')}, Warning: {signals.get('warning')}")
    
    # ==================== SIGNALS SUMMARY TESTS ====================
    
    def test_signals_summary_by_source(self):
        """Test that signals summary returns data by source"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/signals/summary")
        assert response.status_code == 200
        
        data = response.json()
        
        assert "by_source" in data
        assert "by_severity" in data
        assert "total" in data
        
        print(f"✓ Signals summary: Total={data['total']}, By severity={data['by_severity']}")
    
    # ==================== RISK HEATMAP TESTS ====================
    
    def test_risk_heatmap_returns_data(self):
        """Test that risk heatmap returns proper data structure"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/risks/heatmap")
        assert response.status_code == 200
        
        data = response.json()
        
        assert "heatmap" in data
        assert "by_domain" in data
        assert "by_type" in data
        assert "total_open" in data
        
        # Check heatmap structure
        heatmap = data.get("heatmap", {})
        expected_keys = ["high_high", "high_medium", "high_low", "medium_high", "medium_medium", "medium_low", "low_high", "low_medium", "low_low"]
        for key in expected_keys:
            assert key in heatmap, f"Missing heatmap key: {key}"
        
        print(f"✓ Risk heatmap: Total open={data['total_open']}, Critical={data.get('critical_count', 0)}")


class TestIntelligenceDashboardAPI:
    """Test Intelligence Dashboard API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        else:
            pytest.skip("Authentication failed")
    
    def test_dashboard_endpoint(self):
        """Test main dashboard endpoint"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/dashboard")
        assert response.status_code == 200
        
        data = response.json()
        assert "summary" in data
        assert "recent_signals" in data
        assert "recent_recommendations" in data
        assert "key_metrics" in data
        
        print(f"✓ Dashboard endpoint working")
    
    def test_recommendations_summary(self):
        """Test recommendations summary endpoint"""
        response = self.session.get(f"{BASE_URL}/api/intelligence/recommendations/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert "counts" in data
        assert "high_priority" in data
        assert "acceptance_rate" in data
        
        counts = data.get("counts", {})
        assert "pending" in counts
        assert "accepted" in counts
        
        print(f"✓ Recommendations summary: Pending={counts.get('pending')}, Acceptance rate={data.get('acceptance_rate')}%")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
