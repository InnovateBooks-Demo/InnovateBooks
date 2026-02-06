#!/usr/bin/env python3
"""
Debug script to check which customer routes are available
"""

import asyncio
import aiohttp
import json

BASE_URL = "https://saas-finint.preview.emergentagent.com/api"
DEMO_EMAIL = "demo@innovatebooks.com"
DEMO_PASSWORD = "Demo1234"

async def test_routes():
    async with aiohttp.ClientSession() as session:
        # Login first
        login_data = {
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD,
            "remember_me": False
        }
        
        async with session.post(f"{BASE_URL}/auth/login", json=login_data) as response:
            if response.status == 200:
                login_result = await response.json()
                token = login_result["access_token"]
                print(f"✅ Login successful, token: {token[:50]}...")
            else:
                print(f"❌ Login failed: {response.status}")
                return
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test different customer endpoints
        endpoints = [
            "/customers",
            "/finance/customers"
        ]
        
        for endpoint in endpoints:
            try:
                async with session.get(f"{BASE_URL}{endpoint}", headers=headers) as response:
                    print(f"\n{endpoint}:")
                    print(f"  Status: {response.status}")
                    if response.status == 200:
                        data = await response.json()
                        if isinstance(data, list):
                            print(f"  Count: {len(data)}")
                            if data:
                                print(f"  First item keys: {list(data[0].keys())}")
                        elif isinstance(data, dict):
                            if "customers" in data:
                                print(f"  Count: {len(data['customers'])}")
                                if data["customers"]:
                                    print(f"  First item keys: {list(data['customers'][0].keys())}")
                            else:
                                print(f"  Response keys: {list(data.keys())}")
                    else:
                        error_text = await response.text()
                        print(f"  Error: {error_text[:200]}")
            except Exception as e:
                print(f"  Exception: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_routes())