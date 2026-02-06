"""
Test Suite for P2 Features:
- Bank Reconciliation (bank accounts, statements, auto-match, manual-match, complete reconciliation)
- Period Close (auto-close workflow with 7-point checklist)
- Multi-Currency APIs
"""

import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://saas-finint.preview.emergentagent.com').rstrip('/')

# Test credentials
TEST_EMAIL = "demo@innovatebooks.com"
TEST_PASSWORD = "Demo1234"


class TestAuth:
    """Authentication tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        return data["access_token"]
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "access_token" in data
        assert data["user"]["email"] == TEST_EMAIL


class TestMultiCurrency:
    """Multi-Currency API tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_currencies(self, auth_token):
        """Test GET /api/ib-finance/currencies - Get supported currencies"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/currencies",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert len(data["data"]) > 0
        # Check INR is base currency
        assert data["base_currency"] == "INR"
        # Check currency structure
        inr = next((c for c in data["data"] if c["code"] == "INR"), None)
        assert inr is not None
        assert inr["is_base"] == True
        assert inr["rate_to_base"] == 1.0
    
    def test_convert_currency(self, auth_token):
        """Test POST /api/ib-finance/convert - Currency conversion"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/convert",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "amount": 100,
                "from_currency": "USD",
                "to_currency": "INR"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert data["data"]["original"] == 100
        assert data["data"]["from_currency"] == "USD"
        assert data["data"]["to_currency"] == "INR"
        assert data["data"]["converted"] > 0  # Should be ~8350 INR
        assert data["data"]["effective_rate"] > 0
    
    def test_convert_same_currency(self, auth_token):
        """Test currency conversion with same currency"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/convert",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "amount": 100,
                "from_currency": "INR",
                "to_currency": "INR"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["converted"] == 100
        assert data["data"]["rate"] == 1.0


class TestBankAccounts:
    """Bank Account CRUD tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_bank_accounts(self, auth_token):
        """Test GET /api/ib-finance/bank/accounts - List bank accounts"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/accounts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "count" in data
    
    def test_create_bank_account(self, auth_token):
        """Test POST /api/ib-finance/bank/accounts - Create bank account"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/accounts",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "account_name": "TEST_Primary Current Account",
                "bank_name": "HDFC Bank",
                "account_number": "50100123456789",
                "ifsc_code": "HDFC0001234",
                "account_type": "current",
                "currency": "INR",
                "opening_balance": 500000
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert data["data"]["account_name"] == "TEST_Primary Current Account"
        assert data["data"]["bank_name"] == "HDFC Bank"
        assert data["data"]["current_balance"] == 500000
        assert "account_id" in data["data"]
        return data["data"]["account_id"]


class TestBankStatements:
    """Bank Statement Import and Management tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def test_account_id(self, auth_token):
        """Get or create a test bank account"""
        # First check existing accounts
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/accounts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        if data["data"]:
            return data["data"][0]["account_id"]
        
        # Create new account if none exists
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/accounts",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "account_name": "TEST_Statement Account",
                "bank_name": "ICICI Bank",
                "account_number": "123456789012",
                "ifsc_code": "ICIC0001234",
                "account_type": "current",
                "currency": "INR",
                "opening_balance": 100000
            }
        )
        return response.json()["data"]["account_id"]
    
    def test_get_bank_statements(self, auth_token, test_account_id):
        """Test GET /api/ib-finance/bank/statements - List statements"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/statements?account_id={test_account_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "count" in data
    
    def test_import_bank_statement(self, auth_token, test_account_id):
        """Test POST /api/ib-finance/bank/statements/import - Import statement entries"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/statements/import",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "account_id": test_account_id,
                "entries": [
                    {
                        "date": "2025-01-05",
                        "description": "TEST_Customer Payment - INV001",
                        "reference": "NEFT/REF123",
                        "credit": 50000,
                        "debit": 0,
                        "balance": 550000
                    },
                    {
                        "date": "2025-01-06",
                        "description": "TEST_Vendor Payment - BILL001",
                        "reference": "RTGS/REF456",
                        "credit": 0,
                        "debit": 25000,
                        "balance": 525000
                    },
                    {
                        "date": "2025-01-07",
                        "description": "TEST_Salary Payment",
                        "reference": "BATCH/SAL001",
                        "credit": 0,
                        "debit": 100000,
                        "balance": 425000
                    }
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert data["count"] == 3
        # Verify entry structure
        entry = data["data"][0]
        assert "entry_id" in entry
        assert entry["status"] == "unmatched"
        assert entry["account_id"] == test_account_id
    
    def test_import_statement_missing_account(self, auth_token):
        """Test import without account_id returns error"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/statements/import",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "entries": [{"date": "2025-01-01", "description": "Test", "credit": 100}]
            }
        )
        assert response.status_code == 400


class TestBankReconciliation:
    """Bank Reconciliation workflow tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def test_account_id(self, auth_token):
        """Get or create a test bank account"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/accounts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        if data["data"]:
            return data["data"][0]["account_id"]
        return None
    
    def test_auto_match_transactions(self, auth_token, test_account_id):
        """Test POST /api/ib-finance/bank/reconcile/auto-match - Auto-match transactions"""
        if not test_account_id:
            pytest.skip("No bank account available")
        
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/reconcile/auto-match",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={"account_id": test_account_id}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "matched_count" in data
        assert "unmatched_remaining" in data
    
    def test_manual_match_transaction(self, auth_token, test_account_id):
        """Test POST /api/ib-finance/bank/reconcile/manual-match - Manual match"""
        if not test_account_id:
            pytest.skip("No bank account available")
        
        # Get an unmatched entry
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/statements?account_id={test_account_id}&status=unmatched",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        if not data["data"]:
            pytest.skip("No unmatched entries available")
        
        entry_id = data["data"][0]["entry_id"]
        
        # Manual match
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/reconcile/manual-match",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "entry_id": entry_id,
                "transaction_type": "journal",
                "transaction_id": "JE-TEST001"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "Transaction matched"
    
    def test_complete_reconciliation(self, auth_token, test_account_id):
        """Test POST /api/ib-finance/bank/reconcile/complete - Complete reconciliation"""
        if not test_account_id:
            pytest.skip("No bank account available")
        
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/bank/reconcile/complete",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={
                "account_id": test_account_id,
                "period": "2025-01",
                "closing_balance": 425000
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "recon_id" in data["data"]
        assert data["data"]["status"] == "completed"
    
    def test_get_reconciliations(self, auth_token, test_account_id):
        """Test GET /api/ib-finance/bank/reconciliations - Get reconciliation history"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/bank/reconciliations",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "count" in data


class TestPeriodClose:
    """Period Close Workflow tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_auto_close_period(self, auth_token):
        """Test POST /api/ib-finance/close/auto-close - Automated period close"""
        response = requests.post(
            f"{BASE_URL}/api/ib-finance/close/auto-close",
            headers={"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"},
            json={"period": "2024-12"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        
        # Verify 7-point checklist structure
        checklist = data["data"]["checklist"]
        assert "receivables_reviewed" in checklist
        assert "payables_reviewed" in checklist
        assert "depreciation_run" in checklist
        assert "tax_calculated" in checklist
        assert "bank_reconciled" in checklist
        assert "journals_posted" in checklist
        assert "trial_balance_reviewed" in checklist
        
        # Verify response structure
        assert "errors" in data["data"]
        assert "can_close" in data["data"]
        assert "status" in data["data"]
    
    def test_get_close_periods(self, auth_token):
        """Test GET /api/ib-finance/close/periods - Get accounting periods"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/close/periods",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        # Verify period structure
        if len(data["data"]) > 0:
            period = data["data"][0]
            assert "period_id" in period
            assert "period" in period
            assert "status" in period


class TestServiceWorkerEndpoints:
    """Test endpoints that service worker caches for offline"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_finance_dashboard_cacheable(self, auth_token):
        """Test /api/ib-finance/dashboard is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
    
    def test_billing_cacheable(self, auth_token):
        """Test /api/ib-finance/billing is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/billing",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_receivables_cacheable(self, auth_token):
        """Test /api/ib-finance/receivables is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/receivables",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_payables_cacheable(self, auth_token):
        """Test /api/ib-finance/payables is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/payables",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_ledger_cacheable(self, auth_token):
        """Test /api/ib-finance/ledger/accounts is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/ledger/accounts",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_assets_cacheable(self, auth_token):
        """Test /api/ib-finance/assets is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/assets",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_tax_cacheable(self, auth_token):
        """Test /api/ib-finance/tax/dashboard is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/tax/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
    
    def test_gst_cacheable(self, auth_token):
        """Test /api/ib-finance/gst/dashboard is accessible for caching"""
        response = requests.get(
            f"{BASE_URL}/api/ib-finance/gst/dashboard?period=2025-01",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
