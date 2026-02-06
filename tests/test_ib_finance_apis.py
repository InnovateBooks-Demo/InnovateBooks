"""
IB Finance Module - Backend API Tests
Tests for all 7 sub-modules: Billing, Receivables, Payables, Ledger, Assets, Tax, Close
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestIBFinanceAuth:
    """Authentication for IB Finance tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        return data.get("access_token") or data.get("token")
    
    @pytest.fixture(scope="class")
    def headers(self, auth_token):
        """Get headers with auth token"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }


class TestIBFinanceDashboard(TestIBFinanceAuth):
    """IB Finance Dashboard API tests"""
    
    def test_get_finance_dashboard(self, headers):
        """Test GET /api/ib-finance/dashboard - Main dashboard metrics"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/dashboard", headers=headers)
        assert response.status_code == 200, f"Dashboard failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        dashboard = data["data"]
        # Verify dashboard structure
        assert "billing" in dashboard
        assert "receivables" in dashboard
        assert "payables" in dashboard
        assert "assets" in dashboard
        print(f"Dashboard data: billing={dashboard['billing']}, receivables={dashboard['receivables']}")


class TestBillingModule(TestIBFinanceAuth):
    """Module 1: Billing Queue API tests"""
    
    def test_get_billing_records(self, headers):
        """Test GET /api/ib-finance/billing - List all billing records"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/billing", headers=headers)
        assert response.status_code == 200, f"Get billing failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        assert "count" in data
        print(f"Billing records count: {data['count']}")
    
    def test_get_billing_records_by_status(self, headers):
        """Test GET /api/ib-finance/billing?status=draft - Filter by status"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/billing?status=draft", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        # All records should have draft status
        for record in data.get("data", []):
            assert record.get("status") == "draft"
    
    def test_create_billing_record(self, headers):
        """Test POST /api/ib-finance/billing - Create new billing record"""
        payload = {
            "billing_type": "milestone",
            "party_id": "TEST-PARTY-001",
            "party_name": "Test Customer",
            "gross_amount": 100000,
            "tax_amount": 18000,
            "net_amount": 118000,
            "currency": "INR",
            "description": "TEST billing record"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/billing", json=payload, headers=headers)
        assert response.status_code == 200, f"Create billing failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        billing = data.get("data", {})
        assert billing.get("billing_id") is not None
        assert billing.get("status") == "draft"
        assert billing.get("net_amount") == 118000
        print(f"Created billing: {billing.get('billing_id')}")
        return billing.get("billing_id")


class TestReceivablesModule(TestIBFinanceAuth):
    """Module 2: Receivables API tests"""
    
    def test_get_receivables(self, headers):
        """Test GET /api/ib-finance/receivables - List all receivables"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/receivables", headers=headers)
        assert response.status_code == 200, f"Get receivables failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Receivables count: {data.get('count', len(data.get('data', [])))}")
    
    def test_get_receivables_dashboard(self, headers):
        """Test GET /api/ib-finance/receivables/dashboard - Receivables dashboard with aging"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/receivables/dashboard", headers=headers)
        assert response.status_code == 200, f"Receivables dashboard failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        dashboard = data.get("data", {})
        assert "total_outstanding" in dashboard
        assert "total_overdue" in dashboard
        assert "by_status" in dashboard
        assert "aging" in dashboard
        print(f"Receivables: outstanding={dashboard['total_outstanding']}, overdue={dashboard['total_overdue']}")
    
    def test_record_payment_receipt(self, headers):
        """Test POST /api/ib-finance/receivables/payment - Record payment"""
        payload = {
            "customer_id": "TEST-CUST-001",
            "customer_name": "Test Customer",
            "amount_received": 50000,
            "currency": "INR",
            "payment_mode": "bank",
            "reference_number": "TEST-REF-001"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/receivables/payment", json=payload, headers=headers)
        assert response.status_code == 200, f"Record payment failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        receipt = data.get("data", {})
        assert receipt.get("receipt_id") is not None
        assert receipt.get("status") == "unapplied"
        print(f"Created receipt: {receipt.get('receipt_id')}")


class TestPayablesModule(TestIBFinanceAuth):
    """Module 3: Payables API tests"""
    
    def test_get_payables(self, headers):
        """Test GET /api/ib-finance/payables - List all payables"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/payables", headers=headers)
        assert response.status_code == 200, f"Get payables failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Payables count: {data.get('count', len(data.get('data', [])))}")
    
    def test_get_payables_dashboard(self, headers):
        """Test GET /api/ib-finance/payables/dashboard - Payables dashboard with aging"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/payables/dashboard", headers=headers)
        assert response.status_code == 200, f"Payables dashboard failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        dashboard = data.get("data", {})
        assert "total_outstanding" in dashboard
        assert "total_overdue" in dashboard
        assert "by_status" in dashboard
        print(f"Payables: outstanding={dashboard['total_outstanding']}, overdue={dashboard['total_overdue']}")
    
    def test_create_payable(self, headers):
        """Test POST /api/ib-finance/payables - Create vendor payable"""
        payload = {
            "vendor_id": "TEST-VENDOR-001",
            "vendor_name": "Test Vendor",
            "bill_number": "TEST-BILL-001",
            "bill_date": "2025-01-01",
            "due_date": "2025-01-31",
            "bill_amount": 75000,
            "currency": "INR"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/payables", json=payload, headers=headers)
        assert response.status_code == 200, f"Create payable failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        payable = data.get("data", {})
        assert payable.get("payable_id") is not None
        assert payable.get("status") == "open"
        print(f"Created payable: {payable.get('payable_id')}")


class TestLedgerModule(TestIBFinanceAuth):
    """Module 4: Ledger API tests"""
    
    def test_get_chart_of_accounts(self, headers):
        """Test GET /api/ib-finance/ledger/accounts - Chart of accounts"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/ledger/accounts", headers=headers)
        assert response.status_code == 200, f"Get accounts failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Accounts count: {data.get('count', len(data.get('data', [])))}")
    
    def test_get_journal_entries(self, headers):
        """Test GET /api/ib-finance/ledger/journals - Journal entries"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/ledger/journals", headers=headers)
        assert response.status_code == 200, f"Get journals failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Journal entries count: {data.get('count', len(data.get('data', [])))}")
    
    def test_create_account(self, headers):
        """Test POST /api/ib-finance/ledger/accounts - Create account"""
        payload = {
            "account_code": "TEST-1001",
            "account_name": "Test Account",
            "account_type": "asset"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/ledger/accounts", json=payload, headers=headers)
        assert response.status_code == 200, f"Create account failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        account = data.get("data", {})
        assert account.get("account_id") is not None
        print(f"Created account: {account.get('account_id')}")
    
    def test_create_journal_entry(self, headers):
        """Test POST /api/ib-finance/ledger/journals - Create journal entry"""
        payload = {
            "source_module": "manual",
            "description": "TEST journal entry",
            "period": "2025-01",
            "lines": [
                {"account_code": "1001", "account_name": "Cash", "debit_amount": 10000, "credit_amount": 0},
                {"account_code": "4001", "account_name": "Revenue", "debit_amount": 0, "credit_amount": 10000}
            ]
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/ledger/journals", json=payload, headers=headers)
        assert response.status_code == 200, f"Create journal failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        journal = data.get("data", {})
        assert journal.get("journal_id") is not None
        assert journal.get("status") == "draft"
        print(f"Created journal: {journal.get('journal_id')}")
    
    def test_get_trial_balance(self, headers):
        """Test GET /api/ib-finance/ledger/trial-balance - Trial balance"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/ledger/trial-balance?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Get trial balance failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        tb = data.get("data", {})
        assert "accounts" in tb
        assert "total_debit" in tb
        assert "total_credit" in tb
        print(f"Trial balance: debit={tb['total_debit']}, credit={tb['total_credit']}, balanced={tb.get('is_balanced')}")


class TestAssetsModule(TestIBFinanceAuth):
    """Module 5: Assets API tests"""
    
    def test_get_assets(self, headers):
        """Test GET /api/ib-finance/assets - List all assets"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/assets", headers=headers)
        assert response.status_code == 200, f"Get assets failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Assets count: {data.get('count', len(data.get('data', [])))}")
    
    def test_get_assets_by_type(self, headers):
        """Test GET /api/ib-finance/assets?asset_type=tangible - Filter by type"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/assets?asset_type=tangible", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
    
    def test_create_asset(self, headers):
        """Test POST /api/ib-finance/assets - Capitalize asset"""
        payload = {
            "asset_name": "TEST Server Equipment",
            "asset_type": "tangible",
            "asset_category": "IT Equipment",
            "acquisition_date": "2025-01-01",
            "capitalization_value": 500000,
            "useful_life_months": 36,
            "depreciation_method": "straight_line",
            "residual_value": 50000
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/assets", json=payload, headers=headers)
        assert response.status_code == 200, f"Create asset failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        asset = data.get("data", {})
        assert asset.get("asset_id") is not None
        assert asset.get("status") == "active"
        assert asset.get("net_book_value") == 500000
        print(f"Created asset: {asset.get('asset_id')}")
        return asset.get("asset_id")


class TestTaxModule(TestIBFinanceAuth):
    """Module 6: Tax API tests"""
    
    def test_get_tax_dashboard(self, headers):
        """Test GET /api/ib-finance/tax/dashboard - Tax dashboard"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/tax/dashboard?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Tax dashboard failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        dashboard = data.get("data", {})
        assert "output_tax" in dashboard
        assert "input_tax" in dashboard
        assert "net_payable" in dashboard
        print(f"Tax: output={dashboard['output_tax']}, input={dashboard['input_tax']}, net={dashboard['net_payable']}")
    
    def test_get_tax_transactions(self, headers):
        """Test GET /api/ib-finance/tax/transactions - Tax transactions"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/tax/transactions", headers=headers)
        assert response.status_code == 200, f"Get tax transactions failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Tax transactions count: {data.get('count', len(data.get('data', [])))}")
    
    def test_get_tax_registrations(self, headers):
        """Test GET /api/ib-finance/tax/registrations - Tax registrations"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/tax/registrations", headers=headers)
        assert response.status_code == 200, f"Get tax registrations failed: {response.text}"
        data = response.json()
        assert data.get("success") == True


class TestCloseModule(TestIBFinanceAuth):
    """Module 7: Period Close API tests"""
    
    def test_get_accounting_periods(self, headers):
        """Test GET /api/ib-finance/close/periods - Accounting periods"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/close/periods", headers=headers)
        assert response.status_code == 200, f"Get periods failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        periods = data.get("data", [])
        print(f"Accounting periods count: {len(periods)}")
        # Check period structure
        if periods:
            period = periods[0]
            assert "period_id" in period
            assert "period" in period
            assert "status" in period
    
    def test_get_close_checklist(self, headers):
        """Test GET /api/ib-finance/close/checklist - Close checklist"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/close/checklist?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Get checklist failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        checklist = data.get("data", {})
        assert "checklist" in checklist
        assert "ready_to_close" in checklist
        print(f"Close checklist ready: {checklist.get('ready_to_close')}")


class TestSeedData(TestIBFinanceAuth):
    """Test seed data endpoint"""
    
    def test_seed_finance_data(self, headers):
        """Test POST /api/ib-finance/seed - Seed sample data"""
        response = requests.post(f"{BASE_URL}/api/ib-finance/seed", headers=headers)
        # May return 200 or 400 if already seeded
        assert response.status_code in [200, 400], f"Seed failed: {response.text}"
        data = response.json()
        print(f"Seed response: {data.get('message', data)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
