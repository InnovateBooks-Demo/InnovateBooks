"""
Test Suite for GST Reporting (GSTR-1, GSTR-3B) and Finance Notifications APIs
Tests the new P1 features for IB Finance module
"""

import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestAuth:
    """Authentication tests to get token for subsequent tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data or "token" in data, "No token in response"


class TestGSTDashboard:
    """Tests for GST Dashboard API - /api/ib-finance/gst/dashboard"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_gst_dashboard_returns_200(self, auth_token):
        """Test GST dashboard returns 200 with valid period"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/dashboard?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"GST Dashboard failed: {response.text}"
    
    def test_gst_dashboard_response_structure(self, auth_token):
        """Test GST dashboard returns correct data structure"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/dashboard?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify success flag
        assert data.get("success") == True, "Response should have success=True"
        
        # Verify data structure
        assert "data" in data, "Response should have 'data' field"
        dashboard_data = data["data"]
        
        # Verify required fields
        assert "period" in dashboard_data, "Dashboard should have 'period'"
        assert "output_tax" in dashboard_data, "Dashboard should have 'output_tax'"
        assert "input_tax_credit" in dashboard_data, "Dashboard should have 'input_tax_credit'"
        assert "net_liability" in dashboard_data, "Dashboard should have 'net_liability'"
        assert "transaction_count" in dashboard_data, "Dashboard should have 'transaction_count'"
        assert "filing_status" in dashboard_data, "Dashboard should have 'filing_status'"
        
        # Verify filing_status structure
        filing_status = dashboard_data["filing_status"]
        assert "gstr1" in filing_status, "Filing status should have 'gstr1'"
        assert "gstr3b" in filing_status, "Filing status should have 'gstr3b'"
    
    def test_gst_dashboard_unauthorized(self):
        """Test GST dashboard returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/gst/dashboard?period=2025-01")
        assert response.status_code == 401, "Should return 401 without auth"


class TestGSTR1:
    """Tests for GSTR-1 API - /api/ib-finance/gst/gstr1"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_gstr1_returns_200(self, auth_token):
        """Test GSTR-1 returns 200 with valid period"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr1?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"GSTR-1 failed: {response.text}"
    
    def test_gstr1_response_structure(self, auth_token):
        """Test GSTR-1 returns correct data structure with all sections"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr1?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify success flag
        assert data.get("success") == True, "Response should have success=True"
        
        # Verify data structure
        assert "data" in data, "Response should have 'data' field"
        gstr1_data = data["data"]
        
        # Verify required fields
        assert "period" in gstr1_data, "GSTR-1 should have 'period'"
        assert "report_type" in gstr1_data, "GSTR-1 should have 'report_type'"
        assert gstr1_data["report_type"] == "GSTR-1", "Report type should be GSTR-1"
        assert "generated_at" in gstr1_data, "GSTR-1 should have 'generated_at'"
        assert "sections" in gstr1_data, "GSTR-1 should have 'sections'"
        assert "grand_total" in gstr1_data, "GSTR-1 should have 'grand_total'"
    
    def test_gstr1_sections_structure(self, auth_token):
        """Test GSTR-1 has all required sections (B2B, B2C, Exports, etc.)"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr1?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        sections = data["data"]["sections"]
        
        # Verify all required sections exist
        required_sections = ["b2b", "b2c_large", "b2c_small", "credit_debit_notes", "exports", "nil_rated"]
        for section in required_sections:
            assert section in sections, f"GSTR-1 should have '{section}' section"
            
            # Verify each section has required fields
            section_data = sections[section]
            assert "title" in section_data, f"Section {section} should have 'title'"
            assert "description" in section_data, f"Section {section} should have 'description'"
            assert "invoices" in section_data, f"Section {section} should have 'invoices'"
            assert "summary" in section_data, f"Section {section} should have 'summary'"
    
    def test_gstr1_tax_breakdown(self, auth_token):
        """Test GSTR-1 grand total has CGST/SGST/IGST breakdown"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr1?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        grand_total = data["data"]["grand_total"]
        
        # Verify tax breakdown fields
        assert "total_invoices" in grand_total, "Grand total should have 'total_invoices'"
        assert "total_taxable_value" in grand_total, "Grand total should have 'total_taxable_value'"
        assert "total_cgst" in grand_total, "Grand total should have 'total_cgst'"
        assert "total_sgst" in grand_total, "Grand total should have 'total_sgst'"
        assert "total_igst" in grand_total, "Grand total should have 'total_igst'"
        assert "total_cess" in grand_total, "Grand total should have 'total_cess'"
        assert "total_tax" in grand_total, "Grand total should have 'total_tax'"


class TestGSTR3B:
    """Tests for GSTR-3B API - /api/ib-finance/gst/gstr3b"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_gstr3b_returns_200(self, auth_token):
        """Test GSTR-3B returns 200 with valid period"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr3b?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"GSTR-3B failed: {response.text}"
    
    def test_gstr3b_response_structure(self, auth_token):
        """Test GSTR-3B returns correct data structure"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr3b?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify success flag
        assert data.get("success") == True, "Response should have success=True"
        
        # Verify data structure
        assert "data" in data, "Response should have 'data' field"
        gstr3b_data = data["data"]
        
        # Verify required fields
        assert "period" in gstr3b_data, "GSTR-3B should have 'period'"
        assert "report_type" in gstr3b_data, "GSTR-3B should have 'report_type'"
        assert gstr3b_data["report_type"] == "GSTR-3B", "Report type should be GSTR-3B"
        assert "generated_at" in gstr3b_data, "GSTR-3B should have 'generated_at'"
        assert "sections" in gstr3b_data, "GSTR-3B should have 'sections'"
        assert "summary" in gstr3b_data, "GSTR-3B should have 'summary'"
    
    def test_gstr3b_sections_structure(self, auth_token):
        """Test GSTR-3B has all required sections"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr3b?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        sections = data["data"]["sections"]
        
        # Verify required sections
        required_sections = ["section_3_1", "section_3_2", "section_4", "section_5", "section_6"]
        for section in required_sections:
            assert section in sections, f"GSTR-3B should have '{section}'"
    
    def test_gstr3b_summary_structure(self, auth_token):
        """Test GSTR-3B summary has tax payable, ITC, and cash payable"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr3b?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        summary = data["data"]["summary"]
        
        # Verify summary fields
        assert "total_output_tax" in summary, "Summary should have 'total_output_tax'"
        assert "total_input_tax_credit" in summary, "Summary should have 'total_input_tax_credit'"
        assert "net_tax_payable" in summary, "Summary should have 'net_tax_payable'"
        assert "breakdown" in summary, "Summary should have 'breakdown'"
        
        # Verify breakdown structure
        breakdown = summary["breakdown"]
        assert "cgst_payable" in breakdown, "Breakdown should have 'cgst_payable'"
        assert "sgst_payable" in breakdown, "Breakdown should have 'sgst_payable'"
        assert "igst_payable" in breakdown, "Breakdown should have 'igst_payable'"
        assert "cess_payable" in breakdown, "Breakdown should have 'cess_payable'"
    
    def test_gstr3b_section_6_payment(self, auth_token):
        """Test GSTR-3B Section 6 has tax payable, ITC utilized, and cash payable"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/gstr3b?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        section_6 = data["data"]["sections"]["section_6"]
        
        # Verify Section 6 structure
        assert "title" in section_6, "Section 6 should have 'title'"
        assert "summary" in section_6, "Section 6 should have 'summary' (tax payable)"
        assert "itc_utilized" in section_6, "Section 6 should have 'itc_utilized'"
        assert "cash_payable" in section_6, "Section 6 should have 'cash_payable'"


class TestFinanceNotifications:
    """Tests for Finance Notifications API - /api/finance-events/notifications"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_notifications_returns_200(self, auth_token):
        """Test notifications endpoint returns 200"""
        response = requests.get(
            f"{BASE_URL}/api/finance-events/notifications",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Notifications failed: {response.text}"
    
    def test_notifications_response_structure(self, auth_token):
        """Test notifications returns correct data structure"""
        response = requests.get(
            f"{BASE_URL}/api/finance-events/notifications",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify success flag
        assert data.get("success") == True, "Response should have success=True"
        
        # Verify data structure
        assert "data" in data, "Response should have 'data' field"
        assert "count" in data, "Response should have 'count' field"
        
        # Data should be a list
        assert isinstance(data["data"], list), "Data should be a list of notifications"
    
    def test_notifications_item_structure(self, auth_token):
        """Test notification items have correct structure (if any exist)"""
        response = requests.get(
            f"{BASE_URL}/api/finance-events/notifications",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # If there are notifications, verify their structure
        if data["data"] and len(data["data"]) > 0:
            notification = data["data"][0]
            
            # Verify notification fields
            assert "type" in notification, "Notification should have 'type'"
            assert "severity" in notification, "Notification should have 'severity'"
            assert "title" in notification, "Notification should have 'title'"
            assert "message" in notification, "Notification should have 'message'"
            
            # Verify severity is valid
            valid_severities = ["critical", "warning", "info"]
            assert notification["severity"] in valid_severities, f"Severity should be one of {valid_severities}"
    
    def test_notifications_unauthorized(self):
        """Test notifications returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/finance-events/notifications")
        assert response.status_code == 401, "Should return 401 without auth"


class TestCheckAlerts:
    """Tests for Check Alerts API - /api/finance-events/check-alerts"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_check_alerts_returns_200(self, auth_token):
        """Test check-alerts endpoint returns 200"""
        response = requests.post(
            f"{BASE_URL}/api/finance-events/check-alerts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Check alerts failed: {response.text}"
    
    def test_check_alerts_response_structure(self, auth_token):
        """Test check-alerts returns correct data structure"""
        response = requests.post(
            f"{BASE_URL}/api/finance-events/check-alerts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data.get("success") == True, "Response should have success=True"
        assert "alerts_sent" in data, "Response should have 'alerts_sent'"
        assert "message" in data, "Response should have 'message'"
        
        # alerts_sent should be a number
        assert isinstance(data["alerts_sent"], int), "alerts_sent should be an integer"


class TestTaxDashboardGSTLink:
    """Tests to verify Tax Dashboard has GST Reports link"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token") or data.get("token")
        pytest.skip("Authentication failed")
    
    def test_tax_transactions_endpoint_exists(self, auth_token):
        """Test tax transactions endpoint exists (used by Tax Dashboard)"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/tax/transactions",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        # Should return 200 (list of transactions)
        assert response.status_code == 200, f"Tax transactions endpoint failed: {response.text}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
