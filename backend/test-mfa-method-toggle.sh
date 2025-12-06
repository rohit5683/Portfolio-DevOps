#!/bin/bash

echo "=========================================="
echo "MFA Method Toggle - Integration Test"
echo "=========================================="
echo ""

# Test 1: Check current user configuration
echo "Test 1: Checking current user MFA configuration..."
mongosh portfolio-devops --quiet --eval "db.users.find({}, {email: 1, mfaEnabled: 1, mfaMethod: 1}).pretty()"
echo ""

# Test 2: Test login with email MFA
echo "Test 2: Testing login flow (should trigger MFA)..."
RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rohit.vishwakarma5683@gmail.com","password":"admin123"}')

echo "$RESPONSE" | jq .
echo ""

# Check if mfaRequired and mfaMethod are in response
if echo "$RESPONSE" | jq -e '.mfaRequired' > /dev/null; then
  echo "✅ MFA is required"
  MFA_METHOD=$(echo "$RESPONSE" | jq -r '.mfaMethod')
  echo "✅ MFA Method: $MFA_METHOD"
else
  echo "❌ MFA not required or login failed"
fi

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173/admin/login in your browser"
echo "2. Navigate to User Management after login"
echo "3. Try changing the MFA method using the dropdown"
echo "4. Logout and login again to verify the correct method is shown"
