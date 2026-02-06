#!/bin/bash

# Fix all API endpoints to match backend routes (plural form)
# Backend uses: /leads, /evaluate, /commit, /execute, /bills, /collect, /procure, /pay, /spend, /tax, /reconcile, /govern

echo "Fixing API endpoints..."

# Evaluate (already correct - singular)
# Commit (already correct - singular)  
# Execute (already correct - singular)

# Bill -> bills
find bill -name "*New.jsx" -exec sed -i 's|/api/commerce/bill/|/api/commerce/bills/|g' {} \;
find bill -name "*New.jsx" -exec sed -i 's|/api/commerce/bill"|/api/commerce/bills"|g' {} \;
find bill -name "*New.jsx" -exec sed -i 's|/api/commerce/bill?|/api/commerce/bills?|g' {} \;

# Collect (already correct - singular)
# Procure (already correct - singular)
# Pay (already correct - singular)
# Spend (already correct - singular)
# Tax (already correct - singular)
# Reconcile (already correct - singular)
# Govern (already correct - singular)

echo "Done!"
