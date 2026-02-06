#!/usr/bin/env python3
"""
Debug script to check org_ids and customer data
"""

import asyncio
import aiohttp
import json
import base64

BASE_URL = "https://saas-finint.preview.emergentagent.com/api"
SUPER_ADMIN_EMAIL = "revanth@innovatebooks.in"
SUPER_ADMIN_PASSWORD = "Pandu@1605"
DEMO_EMAIL = "demo@innovatebooks.com"
DEMO_PASSWORD = "Demo1234"

def decode_token(token):
    """Decode JWT token payload"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        payload_part = parts[1]
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += '=' * padding
            
        payload_bytes = base64.urlsafe_b64decode(payload_part)
        return json.loads(payload_bytes.decode('utf-8'))
    except Exception as e:
        print(f"Token decode error: {e}")
        return None

async def debug_org_data():
    async with aiohttp.ClientSession() as session:
        
        # 1. Login as super admin
        print("🔐 Logging in as Super Admin...")
        login_data = {
            "email": SUPER_ADMIN_EMAIL,
            "password": SUPER_ADMIN_PASSWORD
        }
        
        async with session.post(f"{BASE_URL}/enterprise/auth/login", json=login_data) as response:
            if response.status == 200:
                login_result = await response.json()
                super_admin_token = login_result["access_token"]
                print("✅ Super Admin login successful")
            else:
                print(f"❌ Super Admin login failed: {response.status}")
                return
        
        # 2. Login as demo user
        print("\n🔐 Logging in as Demo User...")
        login_data = {
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD,
            "remember_me": False
        }
        
        async with session.post(f"{BASE_URL}/auth/login", json=login_data) as response:
            if response.status == 200:
                login_result = await response.json()
                demo_token = login_result["access_token"]
                demo_payload = decode_token(demo_token)
                print("✅ Demo User login successful")
                print(f"   Demo org_id: {demo_payload.get('org_id') if demo_payload else 'N/A'}")
            else:
                print(f"❌ Demo User login failed: {response.status}")
                return
        
        # 3. Create a test organization
        print("\n🏢 Creating test organization...")
        org_data = {
            "org_name": "Debug Test Org",
            "admin_email": "debug@testorg.com",
            "admin_password": "SecurePass123",
            "admin_full_name": "Debug Admin",
            "subscription_plan": "trial",
            "is_demo": False
        }
        
        headers = {"Authorization": f"Bearer {super_admin_token}"}
        async with session.post(f"{BASE_URL}/enterprise/super-admin/organizations/create", 
                               json=org_data, headers=headers) as response:
            if response.status == 200:
                org_result = await response.json()
                print("✅ Test organization created")
                print(f"   Response: {org_result}")
            else:
                error_text = await response.text()
                print(f"❌ Failed to create organization: {response.status} - {error_text}")
                return
        
        # 4. Login as new org admin
        print("\n🔐 Logging in as new org admin...")
        login_data = {
            "email": "debug@testorg.com",
            "password": "SecurePass123",
            "remember_me": False
        }
        
        async with session.post(f"{BASE_URL}/auth/login", json=login_data) as response:
            if response.status == 200:
                login_result = await response.json()
                new_org_token = login_result["access_token"]
                new_org_payload = decode_token(new_org_token)
                print("✅ New org admin login successful")
                print(f"   New org_id: {new_org_payload.get('org_id') if new_org_payload else 'N/A'}")
            else:
                error_text = await response.text()
                print(f"❌ New org admin login failed: {response.status} - {error_text}")
                return
        
        # 5. Check customers for both users
        print("\n👥 Checking customers for demo user...")
        headers = {"Authorization": f"Bearer {demo_token}"}
        async with session.get(f"{BASE_URL}/finance/customers", headers=headers) as response:
            if response.status == 200:
                data = await response.json()
                customers = data.get("customers", [])
                print(f"   Demo user sees {len(customers)} customers")
                for i, customer in enumerate(customers[:3]):  # Show first 3
                    print(f"     {i+1}. {customer.get('name')} (org_id: {customer.get('org_id')})")
            else:
                print(f"   Error getting demo customers: {response.status}")
        
        print("\n👥 Checking customers for new org admin...")
        headers = {"Authorization": f"Bearer {new_org_token}"}
        async with session.get(f"{BASE_URL}/finance/customers", headers=headers) as response:
            if response.status == 200:
                data = await response.json()
                customers = data.get("customers", [])
                print(f"   New org admin sees {len(customers)} customers")
                for i, customer in enumerate(customers[:3]):  # Show first 3
                    print(f"     {i+1}. {customer.get('name')} (org_id: {customer.get('org_id')})")
            else:
                print(f"   Error getting new org customers: {response.status}")

if __name__ == "__main__":
    asyncio.run(debug_org_data())