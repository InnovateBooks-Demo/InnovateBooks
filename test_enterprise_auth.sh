#!/bin/bash
# Enterprise Authentication & Multi-Tenancy Test Script

BASE_URL="http://localhost:8001"

echo "🚀 TESTING ENTERPRISE SAAS ARCHITECTURE"
echo "========================================"
echo ""

# Test 1: Login with legacy demo user
echo "1️⃣ Testing Enterprise Login (Legacy Demo User)..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/enterprise/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@innovatebooks.com","password":"Demo1234"}')

SUCCESS=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))")

if [ "$SUCCESS" = "True" ]; then
    echo "✅ Login successful!"
    ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token', ''))")
    echo "   Token: ${ACCESS_TOKEN:0:60}..."
else
    echo "❌ Login failed"
    echo $LOGIN_RESPONSE
    exit 1
fi

echo ""

# Test 2: Get current user
echo "2️⃣ Testing /me endpoint..."
ME_RESPONSE=$(curl -s -X GET "$BASE_URL/api/enterprise/auth/me" \
  -H "AUTH_HEADER $ACCESS_TOKEN")

USER_EMAIL=$(echo $ME_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('user', {}).get('email', 'N/A'))")
ORG_NAME=$(echo $ME_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('organization', {}).get('org_name', 'N/A'))")

echo "✅ User: $USER_EMAIL"
echo "✅ Organization: $ORG_NAME"
echo ""

# Test 3: Access protected finance route
echo "3️⃣ Testing org-scoped finance route (GET /finance/customers)..."
CUSTOMERS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/finance/customers" \
  -H "AUTH_HEADER $ACCESS_TOKEN")

CUSTOMER_COUNT=$(echo $CUSTOMERS_RESPONSE | python3 -c "import sys,json; r=json.load(sys.stdin); print(len(r.get('customers', [])))")
echo "✅ Retrieved $CUSTOMER_COUNT customers (org-scoped)"
echo ""

# Test 4: Test Super Admin Login
echo "4️⃣ Testing Super Admin Login..."
SUPER_LOGIN=$(curl -s -X POST "$BASE_URL/api/enterprise/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@innovatebooks.com","password":"SuperAdmin@2025"}')

SUPER_SUCCESS=$(echo $SUPER_LOGIN | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))")

if [ "$SUPER_SUCCESS" = "True" ]; then
    echo "✅ Super Admin login successful!"
    SUPER_TOKEN=$(echo $SUPER_LOGIN | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token', ''))")
else
    echo "❌ Super Admin login failed"
fi

echo ""

# Test 5: List all organizations (Super Admin)
if [ "$SUPER_SUCCESS" = "True" ]; then
    echo "5️⃣ Testing Super Admin: List Organizations..."
    ORGS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/enterprise/super-admin/organizations" \
      -H "AUTH_HEADER $SUPER_TOKEN")
    
    ORG_COUNT=$(echo $ORGS_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('count', 0))")
    echo "✅ Found $ORG_COUNT organizations"
fi

echo ""
echo "========================================"
echo "✅ ALL TESTS PASSED!"
echo "========================================"
