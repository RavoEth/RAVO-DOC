# 🔧 Troubleshooting Guide

<div align="center">

![RAVO Logo](https://red-additional-perch-964.mypinata.cloud/ipfs/bafybeigmejwloxoakapcstxqrbntziwznwsukirhydym5bet2vjloaa5ym)

**Complete Troubleshooting Guide for RAVO Protocol**

*Solutions to common issues and technical problems*

</div>

---

## 📋 Table of Contents

- [Getting Started Issues](#getting-started-issues)
- [Wallet Connection Problems](#wallet-connection-problems)
- [Token Creation Issues](#token-creation-issues)
- [Trading Problems](#trading-problems)
- [Migration Issues](#migration-issues)
- [Transaction Failures](#transaction-failures)
- [Gas & Network Issues](#gas--network-issues)
- [Smart Contract Errors](#smart-contract-errors)
- [Frontend Issues](#frontend-issues)
- [API & Integration Problems](#api--integration-problems)

---

## 🚀 Getting Started Issues

### **"MetaMask not connecting"**

#### **Symptoms**
- Connect button not working
- "Connection failed" error
- MetaMask popup doesn't appear

#### **Solutions**

**1. Check MetaMask Installation**
```bash
# Verify MetaMask is installed and updated
# Visit: https://metamask.io/download/
```

**2. Clear Browser Cache**
```javascript
// Chrome: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
// Select "Cached images and files" and "Cookies"
// Clear for last hour
```

**3. Network Configuration**
```javascript
// Ensure correct network is selected
const requiredNetwork = {
  chainId: '0xaa36a7', // Sepolia
  chainName: 'Sepolia Testnet',
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};
```

**4. Browser Extensions**
- Disable other wallet extensions
- Enable MetaMask extension
- Restart browser

**5. Incognito/Private Mode**
```javascript
// Try in incognito window to avoid extension conflicts
// If works, clear extension data in regular mode
```

### **"Insufficient ETH balance"**

#### **Symptoms**
- "Insufficient funds" error
- Transaction fails with balance error
- Cannot complete token creation

#### **Solutions**

**1. Check Balance Requirements**
```javascript
// Minimum requirements for different actions
const REQUIREMENTS = {
  tokenCreation: '0.0011 ETH',    // 0.0001 + gas
  initialBuy: 'variable',         // User defined
  trading: '0.002 ETH',           // Gas + slippage
  migration: '0.015 ETH'          // Gas + Uniswap fees
};
```

**2. Get Test ETH (Sepolia)**
```javascript
// Official Sepolia faucets
const FAUCETS = [
  'https://sepoliafaucet.com/',
  'https://faucet.sepolia.dev/',
  'https://faucets.chain.link/sepolia'
];
```

**3. Calculate Total Cost**
```javascript
function calculateTotalCost(creationFee, initialBuy, gasEstimate) {
  const total = creationFee + initialBuy + gasEstimate;
  return ethers.utils.formatEther(total) + ' ETH';
}
```

---

## 🏭 Token Creation Issues

### **"Transaction reverted" during creation**

#### **Symptoms**
- Token creation fails
- "Transaction reverted" error
- Funds deducted but no token created

#### **Common Causes & Solutions**

**1. Insufficient Fee Payment**
```javascript
// Check if enough ETH sent
const creationFee = await factory.creationFee();
const initialBuy = parseEther('0.1');
const totalRequired = creationFee.add(initialBuy);

// Ensure msg.value >= totalRequired
```

**2. Invalid Parameters**
```javascript
// Validate input parameters
const validationErrors = [];

if (name.length < 3 || name.length > 50) {
  validationErrors.push('Name must be 3-50 characters');
}

if (symbol.length < 1 || symbol.length > 10) {
  validationErrors.push('Symbol must be 1-10 characters');
}

if (migrationThreshold < parseEther('0.00019')) {
  validationErrors.push('Migration threshold too low');
}

if (description.length > 3000) {
  validationErrors.push('Description too long');
}
```

**3. Network Congestion**
```javascript
// Increase gas price during high network activity
const gasPrice = await provider.getGasPrice();
const adjustedGasPrice = gasPrice.mul(150).div(100); // 50% increase
```

**4. Contract Pause State**
```javascript
// Check if factory is operational
const isFactoryActive = await factory.isActive();
if (!isFactoryActive) {
  console.log('Factory is currently paused');
}
```

### **"Migration threshold too low"**

#### **Symptoms**
- Creation fails with threshold error
- Minimum threshold not met

#### **Solution**
```javascript
// Set appropriate migration threshold
const RECOMMENDED_THRESHOLDS = {
  small: parseEther('0.005'),    // For testing/small projects
  medium: parseEther('0.01'),    // For established projects
  large: parseEther('0.1'),      // For major launches
  enterprise: parseEther('1.0')  // For large-scale projects
};

// Minimum allowed threshold
const MIN_THRESHOLD = parseEther('0.00019'); // ~$0.50 at $3000/ETH
```

### **"Description too long"**

#### **Symptoms**
- Creation fails with description error
- Character limit exceeded

#### **Solution**
```javascript
// Truncate or summarize description
function optimizeDescription(description) {
  const MAX_LENGTH = 3000;
  if (description.length <= MAX_LENGTH) {
    return description;
  }

  // Truncate with ellipsis
  return description.substring(0, MAX_LENGTH - 3) + '...';
}
```

---

## 💱 Trading Problems

### **"Slippage too high"**

#### **Symptoms**
- Transaction fails with slippage error
- "Slippage exceeded" message
- Trade not executed

#### **Solutions**

**1. Adjust Slippage Tolerance**
```javascript
// Recommended slippage settings
const SLIPPAGE_SETTINGS = {
  conservative: 0.5,  // For stable markets
  balanced: 2,        // For normal conditions
  aggressive: 5       // For volatile markets
};
```

**2. Check Market Conditions**
```javascript
// Monitor price impact before trading
const priceImpact = await bondingCurve.calculatePriceImpact(
  tokenAmount,
  isBuy
);

if (priceImpact > 5) {
  console.warn('High price impact detected');
}
```

**3. Use Limit Orders for Large Trades**
```javascript
// Split large trades into smaller chunks
async function executeLargeTrade(totalAmount, chunkSize) {
  const chunks = Math.ceil(totalAmount / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const amount = Math.min(chunkSize, totalAmount - (i * chunkSize));
    await executeTrade(amount, slippage);
    await delay(1000); // Wait between trades
  }
}
```

### **"Insufficient token balance"**

#### **Symptoms**
- Sell transaction fails
- "Balance too low" error

#### **Solutions**

**1. Check Token Balance**
```javascript
const tokenBalance = await token.balanceOf(userAddress);
const allowance = await token.allowance(userAddress, bondingCurveAddress);

console.log('Token Balance:', ethers.utils.formatEther(tokenBalance));
console.log('Allowance:', ethers.utils.formatEther(allowance));
```

**2. Approve Token Spending**
```javascript
// Approve bonding curve to spend tokens
const approveTx = await token.approve(
  bondingCurveAddress,
  ethers.constants.MaxUint256 // Unlimited approval
);
await approveTx.wait();
```

**3. Use Convenience Function**
```javascript
// One-click approval for bonding curve
await token.approveBondingCurve();
```

### **"Trading not open"**

#### **Symptoms**
- Buy/sell transactions fail
- "Trading not open" error

#### **Solutions**

**1. Check Trading Status**
```javascript
const isTradingOpen = await token.isTradingOpen();
const launchTime = await token.launchTime();
const currentTime = Math.floor(Date.now() / 1000);

console.log('Trading Open:', isTradingOpen);
console.log('Launch Time:', new Date(launchTime * 1000));
console.log('Current Time:', new Date(currentTime * 1000));
```

**2. For Scheduled Launches**
```javascript
if (!isTradingOpen && currentTime < launchTime) {
  const timeUntilLaunch = launchTime - currentTime;
  console.log(`Trading opens in ${Math.ceil(timeUntilLaunch / 60)} minutes`);
}
```

**3. Force Open Trading (Owner Only)**
```javascript
// Only token owner can do this
await token.openTradingNow();
```

---

## 🔄 Migration Issues

### **"Migration not triggering"**

#### **Symptoms**
- ETH balance exceeds threshold
- Migration doesn't start automatically

#### **Solutions**

**1. Check Migration Threshold**
```javascript
const currentBalance = await provider.getBalance(bondingCurveAddress);
const migrationThreshold = await bondingCurve.migrationThreshold();
const isMigrated = await bondingCurve.migrated();
const isMigrating = await bondingCurve.isMigrating();

console.log('Current Balance:', ethers.utils.formatEther(currentBalance));
console.log('Migration Threshold:', ethers.utils.formatEther(migrationThreshold));
console.log('Already Migrated:', isMigrated);
console.log('Currently Migrating:', isMigrating);
```

**2. Manual Migration Trigger**
```javascript
// If conditions are met but migration didn't trigger
if (currentBalance >= migrationThreshold && !isMigrated && !isMigrating) {
  await bondingCurve.retryMigration();
}
```

**3. Check Migration Status**
```javascript
const [migrated, isMigrating, canRetry] = await bondingCurve.getMigrationStatus();

if (canRetry) {
  console.log('Migration can be retried');
  await bondingCurve.retryMigration();
}
```

### **"Migration failed"**

#### **Symptoms**
- Migration process starts but fails
- Trading paused but not resumed
- Funds stuck in contract

#### **Solutions**

**1. Check Failure Reason**
```javascript
// Common migration failure causes
const failureReasons = [
  'Insufficient ETH balance',
  'Insufficient token balance',
  'Uniswap pair creation failed',
  'Liquidity addition failed',
  'Network congestion',
  'Gas price too low'
];
```

**2. Retry Migration**
```javascript
// Wait for migration to reset, then retry
await bondingCurve.retryMigration();
```

**3. Check Contract Balances**
```javascript
const ethBalance = await provider.getBalance(bondingCurveAddress);
const tokenBalance = await token.balanceOf(bondingCurveAddress);

console.log('ETH Balance:', ethers.utils.formatEther(ethBalance));
console.log('Token Balance:', ethers.utils.formatEther(tokenBalance));
```

---

## ⛽ Gas & Network Issues

### **"Transaction stuck pending"**

#### **Symptoms**
- Transaction submitted but not confirmed
- Stuck in pending state for long time
- Cannot submit new transactions

#### **Solutions**

**1. Check Transaction Status**
```javascript
const txHash = '0x...'; // Your transaction hash
const tx = await provider.getTransaction(txHash);

if (tx) {
  console.log('Nonce:', tx.nonce);
  console.log('Gas Price:', ethers.utils.formatUnits(tx.gasPrice, 'gwei'));
  console.log('Gas Limit:', tx.gasLimit.toString());
}
```

**2. Speed Up Transaction**
```javascript
// Send transaction with same nonce but higher gas price
const speedUpTx = await signer.sendTransaction({
  to: tx.to,
  value: tx.value,
  data: tx.data,
  nonce: tx.nonce,
  gasPrice: tx.gasPrice.mul(150).div(100) // 50% higher gas price
});
```

**3. Cancel Transaction**
```javascript
// Send 0 ETH to yourself with same nonce
const cancelTx = await signer.sendTransaction({
  to: signer.address,
  value: 0,
  nonce: tx.nonce,
  gasPrice: tx.gasPrice.mul(120).div(100) // Slightly higher gas price
});
```

### **"Gas estimation failed"**

#### **Symptoms**
- Transaction fails during gas estimation
- "Gas estimation failed" error

#### **Solutions**

**1. Manual Gas Estimation**
```javascript
try {
  const gasEstimate = await contract.estimateGas.functionName(args);
  const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer
} catch (error) {
  // Use manual gas limit
  const gasLimit = 300000; // Conservative estimate
}
```

**2. Check Contract State**
```javascript
// Ensure contract is in correct state for function call
const contractState = await contract.getState();
console.log('Contract State:', contractState);
```

**3. Network-Specific Gas Limits**
```javascript
const GAS_LIMITS = {
  sepolia: {
    tokenCreation: 500000,
    trading: 200000,
    migration: 800000
  },
  mainnet: {
    tokenCreation: 600000,
    trading: 250000,
    migration: 1000000
  }
};
```

### **"Network congestion"**

#### **Symptoms**
- High gas prices
- Slow transaction confirmations
- Failed transactions due to timeout

#### **Solutions**

**1. Optimal Gas Price Strategy**
```javascript
async function getOptimalGasPrice() {
  const gasPrice = await provider.getGasPrice();

  // During congestion, increase by 50-100%
  const multiplier = networkCongested ? 1.5 : 1.2;

  return gasPrice.mul(Math.floor(multiplier * 100)).div(100);
}
```

**2. Time-Based Execution**
```javascript
// Execute during optimal times
const OPTIMAL_HOURS = [2, 3, 4, 14, 15, 16]; // UTC hours
const currentHour = new Date().getUTCHours();

if (OPTIMAL_HOURS.includes(currentHour)) {
  console.log('Optimal time for transactions');
}
```

---

## 🛠️ Smart Contract Errors

### **"ReentrancyGuard: reentrant call"**

#### **Symptoms**
- Transaction fails with reentrancy error
- Function calls blocked

#### **Solutions**

**1. Sequential Execution**
```javascript
// Don't call multiple contract functions in same transaction
// Use separate transactions for different operations

// ❌ Wrong - multiple calls in one transaction
await Promise.all([
  contract.function1(),
  contract.function2()
]);

// ✅ Correct - sequential execution
await contract.function1();
await contract.function2();
```

**2. Check Contract State**
```javascript
const isLocked = await contract.isLocked();
if (isLocked) {
  console.log('Contract is currently locked');
}
```

### **"Insufficient tokens in contract"**

#### **Symptoms**
- Buy transactions fail
- "Insufficient balance" error

#### **Solutions**

**1. Check Token Balance**
```javascript
const contractBalance = await token.balanceOf(bondingCurveAddress);
const totalSupplyForSale = await bondingCurve.TOTAL_SUPPLY_FOR_SALE();

console.log('Contract Balance:', ethers.utils.formatEther(contractBalance));
console.log('Total Supply for Sale:', ethers.utils.formatEther(totalSupplyForSale));
```

**2. Verify Token Transfer**
```javascript
// Ensure tokens were properly transferred during initialization
const tokenOwner = await token.owner();
const bondingCurveAddress = await token.bondingCurveAddress();

console.log('Token Owner:', tokenOwner);
console.log('Bonding Curve:', bondingCurveAddress);
```

### **"Invalid opcode"**

#### **Symptoms**
- Transaction fails with invalid opcode
- Contract execution stops

#### **Solutions**

**1. Check Contract Deployment**
```javascript
// Verify contract is deployed at expected address
const code = await provider.getCode(contractAddress);
if (code === '0x') {
  console.error('Contract not deployed at address');
}
```

**2. Verify Function Signature**
```javascript
// Ensure function name and parameters are correct
const functionSignature = 'functionName(types...)';
const functionSelector = ethers.utils.id(functionSignature).substring(0, 10);
```

---

## 🌐 Frontend Issues

### **"Page not loading"**

#### **Symptoms**
- White screen on load
- JavaScript errors in console
- Components not rendering

#### **Solutions**

**1. Clear Browser Cache**
```javascript
// Hard refresh
location.reload(true);

// Or clear specific cache
caches.delete('ravo-cache-v1');
```

**2. Check Network Requests**
```javascript
// Monitor network tab in developer tools
// Look for failed API calls or missing resources
```

**3. Browser Compatibility**
```javascript
// Supported browsers
const supportedBrowsers = [
  'Chrome 90+',
  'Firefox 88+',
  'Safari 14+',
  'Edge 90+'
];
```

### **"Wallet not detected"**

#### **Symptoms**
- "No wallet detected" error
- Cannot connect to wallet

#### **Solutions**

**1. Install Wallet Extension**
```javascript
// Check for wallet extensions
const hasMetaMask = typeof window.ethereum !== 'undefined';
const hasCoinbase = typeof window.coinbaseWallet !== 'undefined';

if (!hasMetaMask && !hasCoinbase) {
  console.log('No wallet extension detected');
}
```

**2. Enable Wallet**
```javascript
// Ensure wallet is unlocked and on correct network
if (window.ethereum) {
  const accounts = await window.ethereum.request({
    method: 'eth_accounts'
  });

  if (accounts.length === 0) {
    console.log('Wallet locked or no accounts');
  }
}
```

---

## 🔗 API & Integration Problems

### **"API rate limit exceeded"**

#### **Symptoms**
- API calls failing with 429 error
- "Rate limit exceeded" message

#### **Solutions**

**1. Implement Rate Limiting**
```javascript
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.requests = [];
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }
}
```

**2. Exponential Backoff**
```javascript
async function apiCallWithRetry(endpoint, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, options);

      if (response.status === 429) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

### **"WebSocket connection failed"**

#### **Symptoms**
- Real-time updates not working
- WebSocket connection errors

#### **Solutions**

**1. Check WebSocket URL**
```javascript
const WS_URLS = {
  production: 'wss://api.ravo.app/ws',
  staging: 'wss://staging-api.ravo.app/ws',
  development: 'ws://localhost:3001/ws'
};
```

**2. Implement Reconnection Logic**
```javascript
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }
}
```

---

## 📊 Monitoring & Debugging

### **Transaction Debugging**

#### **Check Transaction Details**
```javascript
async function debugTransaction(txHash) {
  const tx = await provider.getTransaction(txHash);
  const receipt = await provider.getTransactionReceipt(txHash);

  console.log('Transaction:', {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: ethers.utils.formatEther(tx.value),
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status,
    blockNumber: receipt.blockNumber
  });

  // Check for events
  if (receipt.logs) {
    receipt.logs.forEach((log, index) => {
      console.log(`Event ${index}:`, log);
    });
  }
}
```

#### **Contract State Inspection**
```javascript
async function inspectContractState(contractAddress) {
  const code = await provider.getCode(contractAddress);
  const balance = await provider.getBalance(contractAddress);

  console.log('Contract State:', {
    address: contractAddress,
    hasCode: code !== '0x',
    balance: ethers.utils.formatEther(balance),
    codeSize: (code.length - 2) / 2 // Remove 0x prefix
  });
}
```

---

## 🚨 Emergency Procedures

### **Lost Private Key**
```javascript
// If you lose access to your wallet:
1. DO NOT panic
2. Contact wallet support (MetaMask, etc.)
3. Check if you have seed phrase backup
4. Consider professional recovery services
5. Accept that funds may be lost if no backup
```

### **Funds Stuck in Contract**
```javascript
// If funds are stuck:
1. Verify contract addresses
2. Check transaction status
3. Contact technical support
4. Provide transaction hashes
5. Wait for investigation
```

### **Security Breach Suspected**
```javascript
// If you suspect a security issue:
1. Stop all transactions immediately
2. Change all passwords and API keys
3. Contact security team
4. Report to relevant authorities if criminal activity
5. Monitor accounts for unauthorized activity
```

---

## 📞 Getting Help

### **Support Channels**

#### **Community Support**
- **Telegram**: [@ravodapp](https://t.me/Ravoeth) - Community discussions
- **Telegram**: [RAVO Community](https://t.me/Ravoeth) - Technical discussions
- **GitHub Issues**: [Report bugs](https://github.com/ravo-dapp/ravo-platform/issues)

#### **Professional Support**
- **Email**: support@ravodapp.com
- **Priority Support**: For verified projects and partners
- **Technical Consulting**: Advanced integration assistance

### **Information to Provide**

When reporting issues, please include:
```javascript
const debugInfo = {
  transactionHash: '0x...',
  contractAddress: '0x...',
  walletAddress: '0x...',
  errorMessage: '...',
  browser: 'Chrome 120',
  wallet: 'MetaMask',
  network: 'Sepolia',
  timestamp: new Date().toISOString()
};
```

---

<div align="center">

## 🔍 Still Having Issues?

**Can't find a solution to your problem?**

**📧 Contact Support**: support@ravodapp.com  
**💬 Live Chat**: Available on our website  
**📚 Documentation**: [docs.ravodapp.com](https://docs.ravodapp.com)

---

**Built with ❤️ by the RAVO Team**

*Comprehensive support for seamless DeFi experience*

</div>
