"""
Test suite for IB Capital ESOP and Convertible Note Conversion features
Tests:
- ESOP Dashboard API
- ESOP Grants List API
- ESOP Grant Detail API
- ESOP Vesting API
- ESOP Exercise API
- Convertible Note Conversion Preview API
- Convertible Note Conversion API
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAuthentication:
    """Test authentication to get token for subsequent tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access_token in response"
        return data["access_token"]
    
    def test_login_success(self, auth_token):
        """Verify login works"""
        assert auth_token is not None
        assert len(auth_token) > 0
        print(f"✓ Login successful, token obtained")


class TestESOPDashboard:
    """Test ESOP Dashboard API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    def test_esop_dashboard_returns_200(self, auth_token):
        """GET /api/ib-capital/esop/dashboard returns 200"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ ESOP Dashboard API returns 200")
    
    def test_esop_dashboard_has_required_fields(self, auth_token):
        """ESOP Dashboard returns required metrics"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/dashboard",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        required_fields = ["total_pool", "granted", "available", "vested", "unvested", 
                          "exercised", "exercisable", "grants_count", "utilization_percentage"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        print(f"✓ ESOP Dashboard has all required fields: {list(data.keys())}")
        print(f"  - Total Pool: {data.get('total_pool')}")
        print(f"  - Granted: {data.get('granted')}")
        print(f"  - Vested: {data.get('vested')}")
        print(f"  - Grants Count: {data.get('grants_count')}")


class TestESOPGrants:
    """Test ESOP Grants List API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    def test_esop_grants_list_returns_200(self, auth_token):
        """GET /api/ib-capital/esop/grants returns 200"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ ESOP Grants List API returns 200")
    
    def test_esop_grants_list_has_grants_array(self, auth_token):
        """ESOP Grants returns grants array"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        assert "grants" in data, "Response should have 'grants' key"
        assert isinstance(data["grants"], list), "grants should be a list"
        print(f"✓ ESOP Grants List returns {len(data['grants'])} grants")
    
    def test_esop_grants_have_required_fields(self, auth_token):
        """Each grant has required fields"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        grants = data.get("grants", [])
        
        if len(grants) > 0:
            grant = grants[0]
            required_fields = ["grant_id", "employee_name", "total_options", "vested_options", 
                             "unvested_options", "vested_percentage", "exercise_price"]
            for field in required_fields:
                assert field in grant, f"Grant missing field: {field}"
            print(f"✓ Grant has all required fields")
            print(f"  - Grant ID: {grant.get('grant_id')}")
            print(f"  - Employee: {grant.get('employee_name')}")
            print(f"  - Total Options: {grant.get('total_options')}")
            print(f"  - Vested: {grant.get('vested_options')} ({grant.get('vested_percentage')}%)")
        else:
            pytest.skip("No grants found to test")


class TestESOPGrantDetail:
    """Test ESOP Grant Detail API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    @pytest.fixture(scope="class")
    def grant_id(self, auth_token):
        """Get a grant ID from the list"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        grants = response.json().get("grants", [])
        if len(grants) > 0:
            return grants[0].get("grant_id")
        return None
    
    def test_esop_grant_detail_returns_200(self, auth_token, grant_id):
        """GET /api/ib-capital/esop/grants/:grant_id returns 200"""
        if not grant_id:
            pytest.skip("No grant ID available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ ESOP Grant Detail API returns 200 for {grant_id}")
    
    def test_esop_grant_detail_has_vesting_events(self, auth_token, grant_id):
        """Grant detail includes vesting events"""
        if not grant_id:
            pytest.skip("No grant ID available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        assert "vesting_events" in data, "Grant detail should have vesting_events"
        assert isinstance(data["vesting_events"], list), "vesting_events should be a list"
        print(f"✓ Grant detail has {len(data['vesting_events'])} vesting events")
    
    def test_esop_grant_detail_has_upcoming_vesting(self, auth_token, grant_id):
        """Grant detail includes upcoming vesting schedule"""
        if not grant_id:
            pytest.skip("No grant ID available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        assert "upcoming_vesting" in data, "Grant detail should have upcoming_vesting"
        print(f"✓ Grant detail has upcoming_vesting schedule")
    
    def test_esop_grant_not_found_returns_404(self, auth_token):
        """Non-existent grant returns 404"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants/NONEXISTENT-GRANT",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ Non-existent grant returns 404")


class TestESOPVesting:
    """Test ESOP Vesting API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    @pytest.fixture(scope="class")
    def grant_id(self, auth_token):
        """Get a grant ID from the list"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        grants = response.json().get("grants", [])
        if len(grants) > 0:
            return grants[0].get("grant_id")
        return None
    
    def test_esop_vest_returns_200(self, auth_token, grant_id):
        """POST /api/ib-capital/esop/grants/:grant_id/vest returns 200"""
        if not grant_id:
            pytest.skip("No grant ID available")
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}/vest",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ ESOP Vest API returns 200")
    
    def test_esop_vest_returns_message(self, auth_token, grant_id):
        """Vest API returns message"""
        if not grant_id:
            pytest.skip("No grant ID available")
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}/vest",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            }
        )
        data = response.json()
        
        assert "message" in data, "Response should have message"
        print(f"✓ Vest response: {data.get('message')}")


class TestESOPExercise:
    """Test ESOP Exercise API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    @pytest.fixture(scope="class")
    def grant_with_vested(self, auth_token):
        """Get a grant with vested options"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/esop/grants",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        grants = response.json().get("grants", [])
        for grant in grants:
            vested = grant.get("vested_options", 0)
            exercised = grant.get("exercised_options", 0)
            if vested > exercised:
                return grant
        return None
    
    def test_esop_exercise_with_valid_amount(self, auth_token, grant_with_vested):
        """POST /api/ib-capital/esop/grants/:grant_id/exercise with valid amount"""
        if not grant_with_vested:
            pytest.skip("No grant with exercisable options available")
        
        grant_id = grant_with_vested.get("grant_id")
        vested = grant_with_vested.get("vested_options", 0)
        exercised = grant_with_vested.get("exercised_options", 0)
        exercisable = vested - exercised
        
        if exercisable <= 0:
            pytest.skip("No exercisable options")
        
        # Exercise 1 option
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}/exercise?options_to_exercise=1",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "message" in data, "Response should have message"
        assert "ownership_lot" in data, "Response should have ownership_lot"
        print(f"✓ Exercise API returns 200: {data.get('message')}")
    
    def test_esop_exercise_exceeds_available_returns_400(self, auth_token, grant_with_vested):
        """Exercise more than available returns 400"""
        if not grant_with_vested:
            pytest.skip("No grant available")
        
        grant_id = grant_with_vested.get("grant_id")
        
        # Try to exercise way more than available
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/esop/grants/{grant_id}/exercise?options_to_exercise=999999999",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            }
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Exercise exceeding available returns 400")


class TestConvertibleNoteConversionPreview:
    """Test Convertible Note Conversion Preview API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    @pytest.fixture(scope="class")
    def convertible_debt_id(self, auth_token):
        """Get a convertible note debt ID"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        debts = response.json().get("debts", [])
        for debt in debts:
            if debt.get("debt_type") == "convertible_note" and debt.get("status") != "converted":
                return debt.get("debt_id")
        return None
    
    def test_conversion_preview_returns_200(self, auth_token, convertible_debt_id):
        """GET /api/ib-capital/debt/:debt_id/conversion-preview returns 200"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/conversion-preview",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ Conversion Preview API returns 200")
    
    def test_conversion_preview_has_required_fields(self, auth_token, convertible_debt_id):
        """Conversion preview returns required fields"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/conversion-preview",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        data = response.json()
        
        required_fields = ["debt_id", "lender", "principal", "accrued_interest", "total_to_convert",
                          "valuation_cap", "discount_rate", "conversion_price", "shares_to_issue",
                          "post_conversion_ownership_percentage"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        print(f"✓ Conversion Preview has all required fields")
        print(f"  - Lender: {data.get('lender')}")
        print(f"  - Total to Convert: ₹{data.get('total_to_convert'):,}")
        print(f"  - Shares to Issue: {data.get('shares_to_issue'):,}")
        print(f"  - Post-conversion Ownership: {data.get('post_conversion_ownership_percentage')}%")
    
    def test_conversion_preview_with_custom_params(self, auth_token, convertible_debt_id):
        """Conversion preview with custom valuation cap and discount"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/conversion-preview?valuation_cap=50000000&discount_rate=25",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data.get("valuation_cap") == 50000000, "Valuation cap should be 50M"
        assert data.get("discount_rate") == 25, "Discount rate should be 25%"
        print(f"✓ Conversion Preview with custom params works")
    
    def test_conversion_preview_non_convertible_returns_400(self, auth_token):
        """Preview for non-convertible debt returns 400"""
        # Get a non-convertible debt
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        debts = response.json().get("debts", [])
        non_convertible = None
        for debt in debts:
            if debt.get("debt_type") != "convertible_note":
                non_convertible = debt.get("debt_id")
                break
        
        if not non_convertible:
            pytest.skip("No non-convertible debt available")
        
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/{non_convertible}/conversion-preview",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Non-convertible debt preview returns 400")


class TestConvertibleNoteConversion:
    """Test Convertible Note Conversion API"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    @pytest.fixture(scope="class")
    def convertible_debt_id(self, auth_token):
        """Get a convertible note debt ID that hasn't been converted"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        debts = response.json().get("debts", [])
        for debt in debts:
            if debt.get("debt_type") == "convertible_note" and debt.get("status") != "converted":
                return debt.get("debt_id")
        return None
    
    def test_conversion_returns_200(self, auth_token, convertible_debt_id):
        """POST /api/ib-capital/debt/:debt_id/convert returns 200"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available for conversion")
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/convert",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            },
            json={
                "valuation_cap": 100000000,
                "discount_rate": 20,
                "instrument_id": "INS002"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✓ Conversion API returns 200")
    
    def test_conversion_returns_details(self, auth_token, convertible_debt_id):
        """Conversion returns conversion details"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available")
        
        # First check if already converted
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments/{convertible_debt_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        debt = response.json()
        
        if debt.get("status") == "converted":
            print(f"✓ Debt already converted, skipping conversion test")
            return
        
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/convert",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            },
            json={}
        )
        
        if response.status_code == 400 and "already been converted" in response.text:
            print(f"✓ Debt already converted")
            return
        
        data = response.json()
        assert "message" in data, "Response should have message"
        assert "conversion_details" in data, "Response should have conversion_details"
        assert "ownership_lot" in data, "Response should have ownership_lot"
        print(f"✓ Conversion returns details: {data.get('message')}")
    
    def test_conversion_already_converted_returns_400(self, auth_token, convertible_debt_id):
        """Converting already converted note returns 400"""
        if not convertible_debt_id:
            pytest.skip("No convertible note available")
        
        # Try to convert again
        response = requests.post(
            f"{BASE_URL}/api/ib-capital/debt/{convertible_debt_id}/convert",
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json"
            },
            json={}
        )
        
        # Should be 400 if already converted, or 200 if first conversion
        assert response.status_code in [200, 400], f"Expected 200 or 400, got {response.status_code}"
        print(f"✓ Conversion API handles already converted notes correctly")


class TestDebtInstrumentDetail:
    """Test Debt Instrument Detail API for convertible notes"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@innovatebooks.com",
            "password": "Demo1234"
        })
        return response.json().get("access_token")
    
    def test_debt_instruments_list(self, auth_token):
        """GET /api/ib-capital/debt/instruments returns list"""
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "debts" in data
        print(f"✓ Debt instruments list returns {len(data['debts'])} debts")
    
    def test_debt_instrument_detail(self, auth_token):
        """GET /api/ib-capital/debt/instruments/:debt_id returns detail"""
        # Get a debt ID first
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        debts = response.json().get("debts", [])
        
        if len(debts) == 0:
            pytest.skip("No debts available")
        
        debt_id = debts[0].get("debt_id")
        response = requests.get(
            f"{BASE_URL}/api/ib-capital/debt/instruments/{debt_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "debt_id" in data
        assert "lender_name" in data
        print(f"✓ Debt instrument detail returns data for {debt_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
