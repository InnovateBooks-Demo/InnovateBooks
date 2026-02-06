"""
IB Finance Module - P0 & P1 Features API Tests
Tests for:
- P0: Financial Statements API (GET profit-loss, balance-sheet, cash-flow)
- P1: PUT endpoints for editing (Billing, Assets, Journals, Receivables, Payables, Tax, Ledger Accounts)
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


# ==================== P0: FINANCIAL STATEMENTS API ====================

class TestFinancialStatementsAPI(TestIBFinanceAuth):
    """P0: Financial Statements API - GET endpoints for P&L, Balance Sheet, Cash Flow"""
    
    def test_get_profit_loss_statement(self, headers):
        """Test GET /api/ib-finance/statements/profit-loss - P&L statement"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/statements/profit-loss?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Get P&L failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        pnl = data.get("data", {})
        
        # Verify P&L structure
        assert "period" in pnl, "P&L missing period"
        assert "revenue" in pnl, "P&L missing revenue"
        assert "expenses" in pnl, "P&L missing expenses"
        assert "total_revenue" in pnl, "P&L missing total_revenue"
        assert "total_expenses" in pnl, "P&L missing total_expenses"
        assert "net_income" in pnl, "P&L missing net_income"
        
        # Verify data types
        assert isinstance(pnl["revenue"], list), "Revenue should be a list"
        assert isinstance(pnl["expenses"], list), "Expenses should be a list"
        assert isinstance(pnl["total_revenue"], (int, float)), "total_revenue should be numeric"
        assert isinstance(pnl["total_expenses"], (int, float)), "total_expenses should be numeric"
        assert isinstance(pnl["net_income"], (int, float)), "net_income should be numeric"
        
        print(f"P&L Statement: Revenue={pnl['total_revenue']}, Expenses={pnl['total_expenses']}, Net Income={pnl['net_income']}")
    
    def test_get_balance_sheet(self, headers):
        """Test GET /api/ib-finance/statements/balance-sheet - Balance Sheet"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/statements/balance-sheet?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Get Balance Sheet failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        bs = data.get("data", {})
        
        # Verify Balance Sheet structure
        assert "period" in bs, "Balance Sheet missing period"
        assert "assets" in bs, "Balance Sheet missing assets"
        assert "liabilities" in bs, "Balance Sheet missing liabilities"
        assert "equity" in bs or "total_equity" in bs, "Balance Sheet missing equity"
        
        # Verify assets structure
        assets = bs.get("assets", {})
        assert "current" in assets or "total" in assets, "Assets missing current/total"
        
        # Verify liabilities structure
        liabilities = bs.get("liabilities", {})
        assert "current" in liabilities or "total" in liabilities, "Liabilities missing current/total"
        
        print(f"Balance Sheet: Assets={bs.get('assets', {}).get('total', 0)}, Liabilities={bs.get('liabilities', {}).get('total', 0)}")
    
    def test_get_cash_flow_statement(self, headers):
        """Test GET /api/ib-finance/statements/cash-flow - Cash Flow statement"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/statements/cash-flow?period=2025-01", headers=headers)
        assert response.status_code == 200, f"Get Cash Flow failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        cf = data.get("data", {})
        
        # Verify Cash Flow structure
        assert "period" in cf, "Cash Flow missing period"
        assert "operating" in cf, "Cash Flow missing operating activities"
        assert "investing" in cf, "Cash Flow missing investing activities"
        assert "financing" in cf, "Cash Flow missing financing activities"
        assert "net_change" in cf, "Cash Flow missing net_change"
        
        # Verify operating activities structure
        operating = cf.get("operating", {})
        assert "total" in operating, "Operating activities missing total"
        
        print(f"Cash Flow: Operating={cf.get('operating', {}).get('total', 0)}, Investing={cf.get('investing', {}).get('total', 0)}, Net Change={cf.get('net_change', 0)}")


# ==================== P1: BILLING CRUD (PUT) ====================

class TestBillingCRUD(TestIBFinanceAuth):
    """P1: Billing CRUD - GET, POST, PUT endpoints"""
    
    def test_get_billing_list(self, headers):
        """Test GET /api/ib-finance/billing - List billing records"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/billing", headers=headers)
        assert response.status_code == 200, f"Get billing list failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "data" in data
        print(f"Billing records count: {len(data.get('data', []))}")
    
    def test_create_billing_record(self, headers):
        """Test POST /api/ib-finance/billing - Create billing record"""
        payload = {
            "billing_type": "milestone",
            "party_id": "TEST-EDIT-001",
            "party_name": "Test Edit Customer",
            "contract_id": "CTR-EDIT-001",
            "billing_period": "2025-01",
            "currency": "INR",
            "gross_amount": 100000,
            "tax_code": "GST-18",
            "tax_amount": 18000,
            "net_amount": 118000,
            "description": "TEST billing for edit testing",
            "line_items": [
                {"description": "Service Item", "quantity": 1, "rate": 100000, "amount": 100000}
            ]
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/billing", json=payload, headers=headers)
        assert response.status_code == 200, f"Create billing failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        billing = data.get("data", {})
        assert billing.get("billing_id") is not None
        assert billing.get("status") == "draft"
        TestBillingCRUD.test_billing_id = billing.get("billing_id")
        print(f"Created billing: {billing.get('billing_id')}")
    
    def test_update_billing_record(self, headers):
        """Test PUT /api/ib-finance/billing/{id} - Update billing record (draft only)"""
        billing_id = getattr(TestBillingCRUD, 'test_billing_id', None)
        if not billing_id:
            pytest.skip("No billing_id available for update test")
        
        update_payload = {
            "party_name": "Updated Test Customer",
            "description": "Updated description for testing",
            "gross_amount": 150000,
            "tax_amount": 27000,
            "net_amount": 177000,
            "line_items": [
                {"description": "Updated Service Item", "quantity": 2, "rate": 75000, "amount": 150000}
            ]
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/billing/{billing_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update billing failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        updated = data.get("data", {})
        assert updated.get("party_name") == "Updated Test Customer"
        assert updated.get("gross_amount") == 150000
        print(f"Updated billing: {billing_id}, new amount={updated.get('gross_amount')}")
    
    def test_update_non_draft_billing_fails(self, headers):
        """Test that updating non-draft billing fails"""
        # First create and approve a billing
        payload = {
            "billing_type": "milestone",
            "party_id": "TEST-NONDRAFT-001",
            "party_name": "Non-Draft Test",
            "gross_amount": 50000,
            "tax_amount": 9000,
            "net_amount": 59000
        }
        create_response = requests.post(f"{BASE_URL}/api/ib-finance/billing", json=payload, headers=headers)
        billing_id = create_response.json().get("data", {}).get("billing_id")
        
        # Approve it
        requests.put(f"{BASE_URL}/api/ib-finance/billing/{billing_id}/approve", headers=headers)
        
        # Try to update - should fail
        update_response = requests.put(f"{BASE_URL}/api/ib-finance/billing/{billing_id}", 
                                       json={"party_name": "Should Fail"}, headers=headers)
        assert update_response.status_code == 400, f"Expected 400 for non-draft update, got {update_response.status_code}"
        print(f"Correctly rejected update for non-draft billing: {billing_id}")


# ==================== P1: ASSETS CRUD (PUT) ====================

class TestAssetsCRUD(TestIBFinanceAuth):
    """P1: Assets CRUD - GET, POST, PUT endpoints"""
    
    def test_get_assets_list(self, headers):
        """Test GET /api/ib-finance/assets - List assets"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/assets", headers=headers)
        assert response.status_code == 200, f"Get assets list failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Assets count: {len(data.get('data', []))}")
    
    def test_create_asset(self, headers):
        """Test POST /api/ib-finance/assets - Create asset"""
        payload = {
            "asset_name": "TEST Edit Asset",
            "asset_type": "tangible",
            "asset_category": "IT Equipment",
            "acquisition_date": "2025-01-01",
            "capitalization_value": 500000,
            "useful_life_months": 48,
            "depreciation_method": "straight_line",
            "residual_value": 50000,
            "location": "Test Location",
            "serial_number": "TEST-EDIT-SN-001"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/assets", json=payload, headers=headers)
        assert response.status_code == 200, f"Create asset failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        asset = data.get("data", {})
        assert asset.get("asset_id") is not None
        assert asset.get("status") == "active"
        TestAssetsCRUD.test_asset_id = asset.get("asset_id")
        print(f"Created asset: {asset.get('asset_id')}")
    
    def test_update_asset(self, headers):
        """Test PUT /api/ib-finance/assets/{id} - Update asset"""
        asset_id = getattr(TestAssetsCRUD, 'test_asset_id', None)
        if not asset_id:
            pytest.skip("No asset_id available for update test")
        
        update_payload = {
            "asset_name": "Updated Test Asset",
            "asset_category": "Office Equipment",
            "location": "Updated Location",
            "serial_number": "TEST-EDIT-SN-002",
            "useful_life_months": 60,
            "residual_value": 40000
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/assets/{asset_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update asset failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        updated = data.get("data", {})
        assert updated.get("asset_name") == "Updated Test Asset"
        assert updated.get("location") == "Updated Location"
        print(f"Updated asset: {asset_id}, new name={updated.get('asset_name')}")
    
    def test_update_disposed_asset_fails(self, headers):
        """Test that updating disposed asset fails"""
        # Create and dispose an asset
        payload = {
            "asset_name": "TEST Dispose Asset",
            "asset_type": "tangible",
            "capitalization_value": 100000,
            "useful_life_months": 24,
            "residual_value": 10000
        }
        create_response = requests.post(f"{BASE_URL}/api/ib-finance/assets", json=payload, headers=headers)
        asset_id = create_response.json().get("data", {}).get("asset_id")
        
        # Dispose it
        requests.put(f"{BASE_URL}/api/ib-finance/assets/{asset_id}/dispose", 
                    json={"proceeds_amount": 50000, "reason": "Test disposal"}, headers=headers)
        
        # Try to update - should fail
        update_response = requests.put(f"{BASE_URL}/api/ib-finance/assets/{asset_id}", 
                                       json={"asset_name": "Should Fail"}, headers=headers)
        assert update_response.status_code == 400, f"Expected 400 for disposed asset update, got {update_response.status_code}"
        print(f"Correctly rejected update for disposed asset: {asset_id}")


# ==================== P1: JOURNAL CRUD (PUT) ====================

class TestJournalCRUD(TestIBFinanceAuth):
    """P1: Journal CRUD - POST, PUT endpoints"""
    
    def test_create_journal_entry(self, headers):
        """Test POST /api/ib-finance/ledger/journals - Create journal entry"""
        payload = {
            "source_module": "manual",
            "description": "TEST journal for edit testing",
            "period": "2025-01",
            "lines": [
                {"account_code": "1000", "account_name": "Cash & Bank", "debit_amount": 75000, "credit_amount": 0},
                {"account_code": "4000", "account_name": "Revenue - Services", "debit_amount": 0, "credit_amount": 75000}
            ]
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/ledger/journals", json=payload, headers=headers)
        assert response.status_code == 200, f"Create journal failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        journal = data.get("data", {})
        assert journal.get("journal_id") is not None
        assert journal.get("status") == "draft"
        TestJournalCRUD.test_journal_id = journal.get("journal_id")
        print(f"Created journal: {journal.get('journal_id')}")
    
    def test_update_journal_entry(self, headers):
        """Test PUT /api/ib-finance/ledger/journals/{id} - Update journal entry"""
        journal_id = getattr(TestJournalCRUD, 'test_journal_id', None)
        if not journal_id:
            pytest.skip("No journal_id available for update test")
        
        update_payload = {
            "description": "Updated journal description",
            "lines": [
                {"account_code": "1000", "account_name": "Cash & Bank", "debit_amount": 100000, "credit_amount": 0},
                {"account_code": "4000", "account_name": "Revenue - Services", "debit_amount": 0, "credit_amount": 100000}
            ]
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/ledger/journals/{journal_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update journal failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        updated = data.get("data", {})
        assert updated.get("description") == "Updated journal description"
        print(f"Updated journal: {journal_id}")


# ==================== P1: RECEIVABLES CRUD (PUT) ====================

class TestReceivablesCRUD(TestIBFinanceAuth):
    """P1: Receivables CRUD - GET, PUT endpoints"""
    
    def test_get_receivables_list(self, headers):
        """Test GET /api/ib-finance/receivables - List receivables"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/receivables", headers=headers)
        assert response.status_code == 200, f"Get receivables list failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        receivables = data.get("data", [])
        print(f"Receivables count: {len(receivables)}")
        if receivables:
            TestReceivablesCRUD.test_receivable_id = receivables[0].get("receivable_id")
    
    def test_update_receivable(self, headers):
        """Test PUT /api/ib-finance/receivables/{id} - Update receivable"""
        receivable_id = getattr(TestReceivablesCRUD, 'test_receivable_id', None)
        if not receivable_id:
            pytest.skip("No receivable_id available for update test")
        
        update_payload = {
            "customer_name": "Updated Customer Name",
            "due_date": "2025-02-28",
            "aging_bucket": "31-60"
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/receivables/{receivable_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update receivable failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Updated receivable: {receivable_id}")


# ==================== P1: PAYABLES CRUD (PUT) ====================

class TestPayablesCRUD(TestIBFinanceAuth):
    """P1: Payables CRUD - GET, POST, PUT endpoints"""
    
    def test_get_payables_list(self, headers):
        """Test GET /api/ib-finance/payables - List payables"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/payables", headers=headers)
        assert response.status_code == 200, f"Get payables list failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        payables = data.get("data", [])
        print(f"Payables count: {len(payables)}")
        if payables:
            # Find a non-paid payable for update test
            for p in payables:
                if p.get("status") != "paid":
                    TestPayablesCRUD.test_payable_id = p.get("payable_id")
                    break
    
    def test_update_payable(self, headers):
        """Test PUT /api/ib-finance/payables/{id} - Update payable"""
        payable_id = getattr(TestPayablesCRUD, 'test_payable_id', None)
        if not payable_id:
            pytest.skip("No payable_id available for update test")
        
        update_payload = {
            "vendor_name": "Updated Vendor Name",
            "due_date": "2025-02-28"
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/payables/{payable_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update payable failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Updated payable: {payable_id}")


# ==================== P1: TAX CRUD (PUT) ====================

class TestTaxCRUD(TestIBFinanceAuth):
    """P1: Tax CRUD - GET, POST, PUT endpoints"""
    
    def test_get_tax_transactions(self, headers):
        """Test GET /api/ib-finance/tax/transactions - List tax transactions"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/tax/transactions", headers=headers)
        assert response.status_code == 200, f"Get tax transactions failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        transactions = data.get("data", [])
        print(f"Tax transactions count: {len(transactions)}")
        if transactions:
            TestTaxCRUD.test_tax_txn_id = transactions[0].get("tax_txn_id")
    
    def test_create_tax_transaction(self, headers):
        """Test POST /api/ib-finance/tax/transactions - Create tax transaction"""
        payload = {
            "source_module": "billing",
            "source_reference_id": "TEST-TAX-001",
            "tax_type": "GST",
            "taxable_amount": 100000,
            "tax_rate": 18,
            "tax_amount": 18000,
            "jurisdiction": "IN",
            "direction": "output",
            "period": "2025-01"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/tax/transactions", json=payload, headers=headers)
        assert response.status_code == 200, f"Create tax transaction failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Created tax transaction: {data.get('data', {}).get('tax_txn_id')}")


# ==================== P1: LEDGER ACCOUNTS CRUD (PUT) ====================

class TestLedgerAccountsCRUD(TestIBFinanceAuth):
    """P1: Ledger Accounts CRUD - GET, POST, PUT endpoints"""
    
    def test_get_ledger_accounts(self, headers):
        """Test GET /api/ib-finance/ledger/accounts - List accounts"""
        response = requests.get(f"{BASE_URL}/api/ib-finance/ledger/accounts", headers=headers)
        assert response.status_code == 200, f"Get ledger accounts failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        accounts = data.get("data", [])
        print(f"Ledger accounts count: {len(accounts)}")
        if accounts:
            TestLedgerAccountsCRUD.test_account_id = accounts[0].get("account_id")
    
    def test_create_ledger_account(self, headers):
        """Test POST /api/ib-finance/ledger/accounts - Create account"""
        payload = {
            "account_code": "9999",
            "account_name": "TEST Edit Account",
            "account_type": "expense"
        }
        response = requests.post(f"{BASE_URL}/api/ib-finance/ledger/accounts", json=payload, headers=headers)
        assert response.status_code == 200, f"Create ledger account failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        account = data.get("data", {})
        TestLedgerAccountsCRUD.created_account_id = account.get("account_id")
        print(f"Created ledger account: {account.get('account_id')}")
    
    def test_update_ledger_account(self, headers):
        """Test PUT /api/ib-finance/ledger/accounts/{id} - Update account"""
        account_id = getattr(TestLedgerAccountsCRUD, 'created_account_id', None)
        if not account_id:
            pytest.skip("No account_id available for update test")
        
        update_payload = {
            "account_name": "Updated TEST Account",
            "account_type": "income"
        }
        response = requests.put(f"{BASE_URL}/api/ib-finance/ledger/accounts/{account_id}", json=update_payload, headers=headers)
        assert response.status_code == 200, f"Update ledger account failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        updated = data.get("data", {})
        assert updated.get("account_name") == "Updated TEST Account"
        print(f"Updated ledger account: {account_id}")


# ==================== VERIFY DATA PERSISTENCE ====================

class TestDataPersistence(TestIBFinanceAuth):
    """Verify that updates are persisted correctly"""
    
    def test_billing_update_persists(self, headers):
        """Verify billing update is persisted"""
        # Create
        payload = {
            "billing_type": "milestone",
            "party_id": "PERSIST-TEST-001",
            "party_name": "Persistence Test",
            "gross_amount": 50000,
            "tax_amount": 9000,
            "net_amount": 59000
        }
        create_response = requests.post(f"{BASE_URL}/api/ib-finance/billing", json=payload, headers=headers)
        billing_id = create_response.json().get("data", {}).get("billing_id")
        
        # Update
        update_payload = {"party_name": "Updated Persistence Test", "gross_amount": 75000}
        requests.put(f"{BASE_URL}/api/ib-finance/billing/{billing_id}", json=update_payload, headers=headers)
        
        # Verify GET returns updated data
        get_response = requests.get(f"{BASE_URL}/api/ib-finance/billing/{billing_id}", headers=headers)
        assert get_response.status_code == 200
        data = get_response.json().get("data", {})
        assert data.get("party_name") == "Updated Persistence Test"
        assert data.get("gross_amount") == 75000
        print(f"Billing update persisted correctly: {billing_id}")
    
    def test_asset_update_persists(self, headers):
        """Verify asset update is persisted"""
        # Create
        payload = {
            "asset_name": "Persistence Test Asset",
            "asset_type": "tangible",
            "capitalization_value": 200000,
            "useful_life_months": 36,
            "residual_value": 20000
        }
        create_response = requests.post(f"{BASE_URL}/api/ib-finance/assets", json=payload, headers=headers)
        asset_id = create_response.json().get("data", {}).get("asset_id")
        
        # Update
        update_payload = {"asset_name": "Updated Persistence Asset", "location": "New Location"}
        requests.put(f"{BASE_URL}/api/ib-finance/assets/{asset_id}", json=update_payload, headers=headers)
        
        # Verify GET returns updated data
        get_response = requests.get(f"{BASE_URL}/api/ib-finance/assets/{asset_id}", headers=headers)
        assert get_response.status_code == 200
        data = get_response.json().get("data", {})
        assert data.get("asset_name") == "Updated Persistence Asset"
        assert data.get("location") == "New Location"
        print(f"Asset update persisted correctly: {asset_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
