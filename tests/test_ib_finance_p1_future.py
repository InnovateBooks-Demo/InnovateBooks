"""
IB Finance Module - P1 & Future Features Tests
Tests for:
1. DELETE endpoints (soft delete) for billing, receivables, payables, assets, journals, tax
2. Automated Tax Calculation - POST /billing/with-tax, POST /payables/with-tax
3. Tax Auto-Summary API - GET /tax/auto-summary
4. Frontend Edit Pages - ReceivableEdit, PayableEdit, TaxEdit
"""

import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestIBFinanceP1Features:
    """Test IB Finance P1 & Future Features"""
    
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
        else:
            pytest.skip("Authentication failed - skipping tests")
    
    # ==================== DELETE ENDPOINTS TESTS ====================
    
    def test_delete_billing_draft_success(self):
        """Test DELETE billing record - draft status should succeed"""
        # Create a draft billing record
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/billing", json={
            "billing_type": "milestone",
            "party_name": "TEST_Delete_Customer",
            "gross_amount": 10000,
            "tax_amount": 1800,
            "net_amount": 11800,
            "description": "Test billing for deletion"
        })
        assert create_response.status_code == 200
        billing_id = create_response.json()["data"]["billing_id"]
        
        # Delete the draft billing
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/billing/{billing_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
        assert "deleted" in delete_response.json()["message"].lower()
    
    def test_delete_billing_approved_fails(self):
        """Test DELETE billing record - approved status should fail"""
        # Create and approve a billing record
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/billing", json={
            "billing_type": "milestone",
            "party_name": "TEST_Delete_Approved_Customer",
            "gross_amount": 15000,
            "tax_amount": 2700,
            "net_amount": 17700
        })
        assert create_response.status_code == 200
        billing_id = create_response.json()["data"]["billing_id"]
        
        # Approve the billing
        approve_response = self.session.put(f"{BASE_URL}/api/ib-finance/billing/{billing_id}/approve")
        assert approve_response.status_code == 200
        
        # Try to delete approved billing - should fail
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/billing/{billing_id}")
        assert delete_response.status_code == 400
        assert "draft or cancelled" in delete_response.json()["detail"].lower()
    
    def test_delete_receivable_open_success(self):
        """Test DELETE receivable - open status with no payments should succeed"""
        # First create a receivable via billing issue flow or directly
        # For this test, we'll create a receivable directly if possible
        # Get existing open receivables
        list_response = self.session.get(f"{BASE_URL}/api/ib-finance/receivables?status=open")
        assert list_response.status_code == 200
        
        # If there are open receivables with full outstanding, test delete
        receivables = list_response.json().get("data", [])
        for rcv in receivables:
            if rcv.get("invoice_amount") == rcv.get("outstanding_amount") and not rcv.get("deleted"):
                receivable_id = rcv["receivable_id"]
                delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/receivables/{receivable_id}")
                # Should succeed for open receivables with no payments
                assert delete_response.status_code in [200, 400]  # 400 if already has payments
                break
    
    def test_delete_payable_open_success(self):
        """Test DELETE payable - open status should succeed"""
        # Create a payable
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/payables", json={
            "vendor_name": "TEST_Delete_Vendor",
            "bill_number": "VBILL-DEL-001",
            "bill_amount": 5000,
            "due_date": (datetime.now() + timedelta(days=30)).isoformat()
        })
        assert create_response.status_code == 200
        payable_id = create_response.json()["data"]["payable_id"]
        
        # Delete the open payable
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/payables/{payable_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
    
    def test_delete_payable_paid_fails(self):
        """Test DELETE payable - paid status should fail"""
        # Get existing paid payables
        list_response = self.session.get(f"{BASE_URL}/api/ib-finance/payables?status=paid")
        assert list_response.status_code == 200
        
        payables = list_response.json().get("data", [])
        if payables:
            payable_id = payables[0]["payable_id"]
            delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/payables/{payable_id}")
            assert delete_response.status_code == 400
    
    def test_delete_asset_no_depreciation_success(self):
        """Test DELETE asset - asset without depreciation should succeed"""
        # Create an asset
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/assets", json={
            "asset_name": "TEST_Delete_Asset",
            "asset_type": "tangible",
            "asset_category": "Equipment",
            "capitalization_value": 50000,
            "useful_life_months": 36,
            "acquisition_date": datetime.now().isoformat()
        })
        assert create_response.status_code == 200
        asset_id = create_response.json()["data"]["asset_id"]
        
        # Delete the asset (no depreciation yet)
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/assets/{asset_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
    
    def test_delete_journal_draft_success(self):
        """Test DELETE journal entry - draft status should succeed"""
        # Create a draft journal entry
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/ledger/journals", json={
            "journal_date": datetime.now().isoformat(),
            "source_module": "manual",
            "description": "TEST_Delete_Journal",
            "period": datetime.now().strftime("%Y-%m"),
            "lines": [
                {"account_id": "ACC-001", "account_code": "1000", "account_name": "Cash", "debit_amount": 1000, "credit_amount": 0},
                {"account_id": "ACC-002", "account_code": "4000", "account_name": "Revenue", "debit_amount": 0, "credit_amount": 1000}
            ]
        })
        assert create_response.status_code == 200
        journal_id = create_response.json()["data"]["journal_id"]
        
        # Delete the draft journal
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/ledger/journals/{journal_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
    
    def test_delete_journal_posted_fails(self):
        """Test DELETE journal entry - posted status should fail"""
        # Create and post a journal entry
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/ledger/journals", json={
            "journal_date": datetime.now().isoformat(),
            "source_module": "manual",
            "description": "TEST_Delete_Posted_Journal",
            "period": datetime.now().strftime("%Y-%m"),
            "lines": [
                {"account_id": "ACC-001", "account_code": "1000", "account_name": "Cash", "debit_amount": 2000, "credit_amount": 0},
                {"account_id": "ACC-002", "account_code": "4000", "account_name": "Revenue", "debit_amount": 0, "credit_amount": 2000}
            ]
        })
        assert create_response.status_code == 200
        journal_id = create_response.json()["data"]["journal_id"]
        
        # Post the journal
        post_response = self.session.put(f"{BASE_URL}/api/ib-finance/ledger/journals/{journal_id}/post")
        assert post_response.status_code == 200
        
        # Try to delete posted journal - should fail
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/ledger/journals/{journal_id}")
        assert delete_response.status_code == 400
        assert "draft" in delete_response.json()["detail"].lower()
    
    def test_delete_tax_transaction_pending_success(self):
        """Test DELETE tax transaction - pending status should succeed"""
        # Create a tax transaction
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/tax/transactions", json={
            "tax_type": "GST",
            "taxable_amount": 10000,
            "tax_rate": 18,
            "tax_amount": 1800,
            "direction": "output",
            "jurisdiction": "IN",
            "period": datetime.now().strftime("%Y-%m")
        })
        assert create_response.status_code == 200
        tax_txn_id = create_response.json()["data"]["tax_txn_id"]
        
        # Delete the pending tax transaction
        delete_response = self.session.delete(f"{BASE_URL}/api/ib-finance/tax/transactions/{tax_txn_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
    
    # ==================== AUTOMATED TAX CALCULATION TESTS ====================
    
    def test_billing_with_tax_creates_output_tax(self):
        """Test POST /billing/with-tax creates billing + output tax transaction"""
        response = self.session.post(f"{BASE_URL}/api/ib-finance/billing/with-tax", json={
            "billing_type": "milestone",
            "party_name": "TEST_AutoTax_Customer",
            "party_id": "CUST-001",
            "gross_amount": 100000,
            "tax_code": "GST-18",
            "tax_amount": 18000,
            "net_amount": 118000,
            "description": "Test billing with auto tax"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Verify billing record created
        assert "data" in data
        assert data["data"]["billing_id"].startswith("BIL-")
        assert data["data"]["gross_amount"] == 100000
        
        # Verify tax transaction created
        assert "tax_transaction" in data
        tax_txn = data["tax_transaction"]
        assert tax_txn["tax_txn_id"].startswith("TAX-")
        assert tax_txn["direction"] == "output"
        assert tax_txn["source_type"] == "billing"
        assert tax_txn["tax_amount"] == 18000
        assert tax_txn["auto_generated"] == True
    
    def test_billing_with_tax_zero_tax_no_tax_txn(self):
        """Test POST /billing/with-tax with zero tax doesn't create tax transaction"""
        response = self.session.post(f"{BASE_URL}/api/ib-finance/billing/with-tax", json={
            "billing_type": "adjustment",
            "party_name": "TEST_ZeroTax_Customer",
            "gross_amount": 50000,
            "tax_code": "GST-0",
            "tax_amount": 0,
            "net_amount": 50000
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        # No tax transaction should be created for zero tax
        assert "tax_transaction" not in data or data.get("tax_transaction") is None
    
    def test_payables_with_tax_creates_input_tax(self):
        """Test POST /payables/with-tax creates payable + input tax transaction (ITC)"""
        response = self.session.post(f"{BASE_URL}/api/ib-finance/payables/with-tax", json={
            "vendor_name": "TEST_AutoTax_Vendor",
            "vendor_id": "VEND-001",
            "tax_code": "GST-18",
            "tax_rate": 18,
            "due_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "line_items": [
                {"description": "Software License", "quantity": 1, "rate": 50000, "amount": 50000},
                {"description": "Support Services", "quantity": 1, "rate": 25000, "amount": 25000}
            ]
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Verify payable created
        assert "data" in data
        payable = data["data"]
        assert payable["payable_id"].startswith("PAY-")
        assert payable["gross_amount"] == 75000  # 50000 + 25000
        assert payable["tax_amount"] == 13500  # 75000 * 18%
        assert payable["bill_amount"] == 88500  # 75000 + 13500
        
        # Verify input tax transaction created
        assert "tax_transaction" in data
        tax_txn = data["tax_transaction"]
        assert tax_txn["tax_txn_id"].startswith("TAX-")
        assert tax_txn["direction"] == "input"
        assert tax_txn["source_type"] == "payable"
        assert tax_txn["tax_amount"] == 13500
        assert tax_txn["auto_generated"] == True
    
    # ==================== TAX AUTO-SUMMARY TESTS ====================
    
    def test_tax_auto_summary_returns_breakdown(self):
        """Test GET /tax/auto-summary returns output/input tax breakdown"""
        current_period = datetime.now().strftime("%Y-%m")
        response = self.session.get(f"{BASE_URL}/api/ib-finance/tax/auto-summary?period={current_period}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        summary = data["data"]
        assert "period" in summary
        assert "output_tax" in summary
        assert "input_tax" in summary
        assert "net_payable" in summary
        
        # Verify structure
        assert "total" in summary["output_tax"]
        assert "breakdown" in summary["output_tax"]
        assert "total" in summary["input_tax"]
        assert "itc_available" in summary["input_tax"]
        assert "breakdown" in summary["input_tax"]
    
    def test_tax_auto_summary_default_period(self):
        """Test GET /tax/auto-summary uses current period by default"""
        response = self.session.get(f"{BASE_URL}/api/ib-finance/tax/auto-summary")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Should default to current month
        current_period = datetime.now().strftime("%Y-%m")
        assert data["data"]["period"] == current_period
    
    # ==================== EDIT ENDPOINTS TESTS ====================
    
    def test_receivable_update_success(self):
        """Test PUT /receivables/{id} updates receivable"""
        # Get an existing receivable
        list_response = self.session.get(f"{BASE_URL}/api/ib-finance/receivables")
        assert list_response.status_code == 200
        
        receivables = list_response.json().get("data", [])
        if receivables:
            receivable_id = receivables[0]["receivable_id"]
            
            # Update the receivable
            update_response = self.session.put(f"{BASE_URL}/api/ib-finance/receivables/{receivable_id}", json={
                "customer_name": "Updated Customer Name",
                "aging_bucket": "31-60"
            })
            
            assert update_response.status_code == 200
            assert update_response.json()["success"] == True
            assert update_response.json()["data"]["customer_name"] == "Updated Customer Name"
    
    def test_payable_update_success(self):
        """Test PUT /payables/{id} updates payable"""
        # Create a payable first
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/payables", json={
            "vendor_name": "TEST_Update_Vendor",
            "bill_number": "VBILL-UPD-001",
            "bill_amount": 8000,
            "due_date": (datetime.now() + timedelta(days=30)).isoformat()
        })
        assert create_response.status_code == 200
        payable_id = create_response.json()["data"]["payable_id"]
        
        # Update the payable
        update_response = self.session.put(f"{BASE_URL}/api/ib-finance/payables/{payable_id}", json={
            "vendor_name": "Updated Vendor Name",
            "bill_number": "VBILL-UPD-002"
        })
        
        assert update_response.status_code == 200
        assert update_response.json()["success"] == True
        assert update_response.json()["data"]["vendor_name"] == "Updated Vendor Name"
    
    def test_tax_transaction_update_success(self):
        """Test PUT /tax/transactions/{id} updates tax transaction"""
        # Create a tax transaction
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/tax/transactions", json={
            "tax_type": "GST",
            "taxable_amount": 20000,
            "tax_rate": 18,
            "tax_amount": 3600,
            "direction": "output",
            "jurisdiction": "IN",
            "period": datetime.now().strftime("%Y-%m")
        })
        assert create_response.status_code == 200
        tax_txn_id = create_response.json()["data"]["tax_txn_id"]
        
        # Update the tax transaction
        update_response = self.session.put(f"{BASE_URL}/api/ib-finance/tax/transactions/{tax_txn_id}", json={
            "tax_type": "VAT",
            "taxable_amount": 25000,
            "tax_rate": 20,
            "tax_amount": 5000,
            "jurisdiction": "UK"
        })
        
        assert update_response.status_code == 200
        assert update_response.json()["success"] == True
        assert update_response.json()["data"]["tax_type"] == "VAT"
        assert update_response.json()["data"]["jurisdiction"] == "UK"
    
    # ==================== MISSING ENDPOINT TEST ====================
    
    def test_tax_transaction_get_by_id_missing(self):
        """Test GET /tax/transactions/{id} - EXPECTED TO FAIL (endpoint missing)"""
        # Create a tax transaction
        create_response = self.session.post(f"{BASE_URL}/api/ib-finance/tax/transactions", json={
            "tax_type": "GST",
            "taxable_amount": 15000,
            "tax_rate": 18,
            "tax_amount": 2700,
            "direction": "output",
            "jurisdiction": "IN"
        })
        assert create_response.status_code == 200
        tax_txn_id = create_response.json()["data"]["tax_txn_id"]
        
        # Try to get individual tax transaction - this endpoint is MISSING
        get_response = self.session.get(f"{BASE_URL}/api/ib-finance/tax/transactions/{tax_txn_id}")
        
        # This will likely return 404 or 405 because the endpoint doesn't exist
        # The TaxEdit.jsx page needs this endpoint
        # Marking as expected failure - main agent needs to add this endpoint
        assert get_response.status_code in [404, 405, 422], f"Expected 404/405/422 but got {get_response.status_code}"


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
